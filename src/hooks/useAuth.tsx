import {useEffect, useState} from 'react'
import {CredentialsT} from "../types"

const useAuth = () => {
  const initialUserState:CredentialsT  = {userName:"", password: ""}

  const [isAuth, setIsAuth] = useState(false)
  const [user, setUser] = useState<CredentialsT>(initialUserState)

  const handleUserChange = (e: { target: { value: string, name: string } }) => {
    setUser(prev=>({...prev, [e.target.name]: e.target.value}))
  }

  useEffect(() => {
    if(user.userName === "admin1" && user.password === "admin1") setIsAuth(true)
    else {setIsAuth(false)}
  }, [user])

  return {isAuth, handleUserChange}
}

export default useAuth