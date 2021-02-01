import { ChangeEvent, FC, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { AuthContext } from '../../App'

import style from './Contacts.module.scss'

export type Contact = {
  id: number
  userId: number
  firstName: string
  lastName: string
  phone: string
}

type FilterKey = 'firstName' | 'lastName' | 'phone'

export const Contacts: FC = () => {
  const { authData, setAuthData } = useContext(AuthContext)
  const [contacts, setContacts] = useState<{ contacts: Contact[]; error: string }>({
    contacts: [],
    error: ''
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [filter, setFilter] = useState<{ key: FilterKey; value: string }>({
    key: 'firstName',
    value: ''
  })

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/contacts?userId=${authData.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        if (data.length === 0) {
          return
        }

        setContacts(prevState => ({
          ...prevState,
          contacts: data
        }))
        setFilteredContacts(prevState => data)
      } catch (e) {
        setContacts(prevState => ({
          ...prevState,
          error: 'Произошла ошибка'
        }))
      } finally {
        setIsLoading(false)
      }
    }
    fetchContacts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let filteredItems = contacts.contacts

    if (filter.key === 'firstName' && filter.value) {
      filteredItems = filteredItems.filter(contact =>
        contact.firstName.match(new RegExp(`${filter.value}`, 'gi'))
      )
    } else if (filter.key === 'lastName' && filter.value) {
      filteredItems = filteredItems.filter(contact =>
        contact.lastName.match(new RegExp(`${filter.value}`, 'gi'))
      )
    } else if (filter.key === 'phone' && filter.value) {
      filteredItems = filteredItems.filter(contact =>
        contact.phone.match(new RegExp(`${filter.value}`, 'gi'))
      )
    }

    setFilteredContacts(prevState => filteredItems)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const signOut = () => {
    localStorage.removeItem('auth')
    setAuthData({ isAuth: false, id: null })
  }

  const deleteContact = (contactId: number) => async () => {
    setContacts(prevState => ({
      ...prevState,
      contacts: contacts.contacts.filter(contact => contact.id !== contactId)
    }))

    await fetch(`/contacts/${contactId}`, {
      method: 'DELETE'
    })
  }

  const handleFilterKeyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilter(prevState => ({
      ...prevState,
      key: e.target.value as FilterKey
    }))
  }

  const handleFilterValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(prevState => ({
      ...prevState,
      value: e.target.value
    }))
  }

  if (isLoading) return <div>Загрузка...</div>

  return (
    <div className={style.wrapper}>
      <div className={style.header}>
        <button className={style.button} onClick={signOut}>
          Выйти
        </button>
        <Link
          className={style.input}
          to={{
            pathname: '/contacts/add',
            state: { userId: authData.id }
          }}
        >
          Добавить
        </Link>
        <div className={style.filter}>
          Искать по
          <select onChange={handleFilterKeyChange} value={filter.key}>
            <option value={'firstName'}>имени</option>
            <option value={'lastName'}>фамилии</option>
            <option value={'phone'}>номеру телефона</option>
          </select>
        </div>
        <input className={style.input} value={filter.value} onChange={handleFilterValueChange} />
      </div>
      <div className={style.table}>
        <div className={style.table__header}>
          <span className={style.table__column}>№</span>
          <span className={style.table__column}>Имя</span>
          <span className={style.table__column}>Фамилия</span>
          <span className={style.table__column}>Номер телефона</span>
          <span className={style.table__column}>Редактирование</span>
          <span className={style.table__column}>Удаление</span>
        </div>
        <ul>
          {filteredContacts.length
            ? filteredContacts.map((contact, index) => {
                return (
                  <li
                    className={style.contact}
                    key={contact.firstName + contact.lastName + contact.phone}
                  >
                    <div className={style.input}>{index + 1}</div>
                    <div className={style.input}>{contact.firstName}</div>
                    <div className={style.input}>{contact.lastName}</div>
                    <div className={style.input}>{contact.phone}</div>
                    <Link
                      className={style.input}
                      to={{ pathname: '/contacts/edit', state: { contact } }}
                    >
                      Редактировать
                    </Link>
                    <button className={style.input} onClick={deleteContact(contact.id)}>
                      Удалить
                    </button>
                  </li>
                )
              })
            : 'Нет контактов'}
        </ul>
      </div>
    </div>
  )
}
