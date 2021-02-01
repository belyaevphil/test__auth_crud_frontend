import { Switch, Route, Redirect } from 'react-router-dom'
import { useEffect, createContext, useState, FC } from 'react'

import { Auth } from './pages/Auth'
import { Contacts } from './pages/Contacts'
import { AddContact } from './pages/AddContact'
import { EditContact } from './pages/EditContact'

import './App.css'

interface AuthData {
  isAuth: boolean
  id: number | null
}

export const AuthContext = createContext<{
  authData: AuthData
  setAuthData: (authDTO: AuthData) => void
}>({
  authData: {
    isAuth: false,
    id: null
  },
  setAuthData: () => ({})
})

export const App: FC = () => {
  const [authData, setAuth] = useState<AuthData>({
    isAuth: false,
    id: null
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const setAuthData = (authDTO: AuthData) => {
    setAuth(prevState => ({
      ...prevState,
      isAuth: authDTO.isAuth,
      id: authDTO.id
    }))
  }

  useEffect(() => {
    setIsLoading(true)
    const doesAuthExist = localStorage.getItem('auth')
    if (doesAuthExist) {
      const { id } = JSON.parse(doesAuthExist)
      setAuthData({ isAuth: true, id })
    }
    setIsLoading(false)
  }, [])

  if (isLoading) return <div>Загрузка...</div>

  return (
    <AuthContext.Provider value={{ authData, setAuthData }}>
      {authData.isAuth ? (
        <Switch>
          <Route path={'/contacts/add'} exact component={AddContact} />
          <Route path={'/contacts/edit'} exact component={EditContact} />
          <Route path={'/contacts'} exact component={Contacts} />
          <Redirect to={'/contacts'} />
        </Switch>
      ) : (
        <Switch>
          <Route path={'/auth'} exact component={Auth} />
          <Redirect to={'/auth'} />
        </Switch>
      )}
    </AuthContext.Provider>
  )
}
