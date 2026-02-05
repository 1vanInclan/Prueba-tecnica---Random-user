import { useEffect, useState } from 'react'
import './App.css'
import { type User } from './types.d'
import { UsersList } from './components/UsersList'

function App() {

  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=100')
      .then(async res => await res.json())
      .then(res => {
        setUsers(res.results)
      })
      .catch(err => {
        console.error(err);
      })
  }, [])

  return (
    <div className='App'>
        <h1>Prueba tecnica</h1>
        <UsersList users={users}/>
    </div>
  )
}

export default App
