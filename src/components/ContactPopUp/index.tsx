import { ChangeEvent, FC, FormEvent, useState } from 'react'

import { Contact } from '../../pages/Contacts'

import style from './ContactPopUp.module.scss'

interface ContactPopUpProps {
  isOpened: boolean
  setPopUp: (status: boolean) => () => void
  type: 'add' | 'edit'
  contact: Contact
  contactsCount: number
  onAddContact?: (contactData: Contact) => () => Promise<void>
  onEditContact?: (contactData: Contact) => () => Promise<void>
}

export const ContactPopUp: FC<ContactPopUpProps> = ({
  isOpened,
  setPopUp,
  type,
  contact,
  contactsCount
}) => {
  const [form, setForm] = useState<{
    firstName: string
    lastName: string
    phone: string
    error: string
  }>({
    firstName: type === 'edit' ? contact.firstName : '',
    lastName: type === 'edit' ? contact.lastName : '',
    phone: type === 'edit' ? contact.phone : '',
    error: ''
  })

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (form.firstName.length === 0 || form.lastName.length === 0 || form.phone.length === 0) {
      setForm(prevState => ({
        ...prevState,
        error: 'Введите данные'
      }))
      return
    }
    if (
      type === 'edit' &&
      form.firstName === contact.firstName &&
      form.lastName === contact.lastName &&
      form.phone === contact.phone
    ) {
      setForm(prevState => ({
        ...prevState,
        error: 'Введите новые данные'
      }))
      return
    }

    try {
      if (type === 'edit') {
      } else if (type === 'add') {
      }
    } catch (e) {
      setForm(prevState => ({
        ...prevState,
        error: 'Произошла ошибка'
      }))
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  if (!isOpened) {
    return null
  }

  return (
    <div className={style.wrapper}>
      <form className={style.form} onSubmit={handleFormSubmit}>
        {form.error && <div className={style.error}>{form.error}</div>}
        <div onClick={setPopUp(false)}>X</div>
        <input
          className={style.input}
          name={'firstName'}
          value={form.firstName}
          onChange={handleInputChange}
        />
        <input
          className={style.input}
          name={'lastName'}
          value={form.lastName}
          onChange={handleInputChange}
        />
        <input
          className={style.input}
          name={'phone'}
          value={form.phone}
          onChange={handleInputChange}
        />
        <button className={style.button}>{type === 'edit' ? 'Редактировать' : 'Добавить'}</button>
      </form>
    </div>
  )
}
