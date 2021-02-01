import { ChangeEvent, FC, FormEvent, useContext, useState } from 'react'

import { AuthContext } from '../../App'

import style from './Auth.module.scss'

export const Auth: FC = () => {
  const [form, setForm] = useState<{ email: string; password: string; error: string }>({
    email: '',
    password: '',
    error: ''
  })
  const { setAuthData } = useContext(AuthContext)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (form.email.length === 0 || form.password.length === 0) {
      setForm(prevState => ({
        ...prevState,
        error: 'Введите данные'
      }))
      return
    }

    try {
      const response = await fetch(`/users?email=${form.email}&password=${form.password}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      if (data.length === 0) {
        setForm(prevState => ({
          ...prevState,
          error: 'Такого пользователя не существует'
        }))
        return
      }
      const id = data[0].id
      localStorage.setItem('auth', JSON.stringify({ id }))
      setAuthData({ isAuth: true, id })
    } catch (e) {
      setForm(prevState => ({
        ...prevState,
        error: 'Произошла ошибка'
      }))
    }
  }

  return (
    <div className={style.wrapper}>
      <form className={style.form} onSubmit={handleFormSubmit}>
        {form.error && <div className={style.error}>{form.error}</div>}
        <input
          className={style.input}
          name={'email'}
          value={form.email}
          placeholder={'E-mail'}
          onChange={handleInputChange}
        />
        <input
          className={style.input}
          name={'password'}
          type={'password'}
          value={form.password}
          placeholder={'Пароль'}
          onChange={handleInputChange}
        />
        <button className={style.button}>Войти</button>
      </form>
    </div>
  )
}
