import { ChangeEvent, FC, FormEvent, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'

import style from './AddContact.module.scss'

export const AddContact: FC = () => {
  const {
    state: { userId }
  } = useLocation<{ userId: number }>()
  const history = useHistory()
  const [form, setForm] = useState<{
    firstName: string
    lastName: string
    phone: string
    error: string
  }>({
    firstName: '',
    lastName: '',
    phone: '',
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

    await fetch(`/contacts`, {
      method: 'POST',
      body: JSON.stringify({
        userId,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    history.push('/contacts')
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className={style.wrapper}>
      <form className={style.form} onSubmit={handleFormSubmit}>
        <Link className={style.link} to={{ pathname: '/contacts' }}>
          Вернуться
        </Link>
        {form.error && <div className={style.error}>{form.error}</div>}
        <input
          className={style.input}
          name={'firstName'}
          value={form.firstName}
          placeholder={'Имя'}
          onChange={handleInputChange}
        />
        <input
          className={style.input}
          name={'lastName'}
          value={form.lastName}
          placeholder={'Фамилия'}
          onChange={handleInputChange}
        />
        <input
          className={style.input}
          name={'phone'}
          value={form.phone}
          placeholder={'Номер телефона'}
          onChange={handleInputChange}
        />
        <button className={style.button}>Добавить</button>
      </form>
    </div>
  )
}
