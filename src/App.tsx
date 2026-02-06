import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { UsersList } from './components/UsersList'
import { SortBy, type User } from './types.d'

function App() {

  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  const originalUsers = useRef<User[]>([])
  
  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const toogleSortByCountry = () => { 
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user) => user.email !== email)
    setUsers(filteredUsers)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=100')
      .then(async res => await res.json())
      .then(res => {
        setUsers(res.results)
        originalUsers.current = res.results
      })
      .catch(err => {
        console.error(err);
      })
  }, [])


  const filteredUsers = useMemo(() => {
    console.log('calculate filter users');
    return filterCountry !== null && filterCountry.length > 0
      ? users.filter((user) => {
        return user.location.country.toLowerCase().includes(filterCountry.toLocaleLowerCase())
      })
      : users
  },[users, filterCountry])

  const sortedUsers = useMemo(() => {

    console.log('calculate sorted users');

    // if(sorting === SortBy.NONE) return filteredUsers

    // const compareProperties: Record<string, (user: User) => any> = {
    //   [SortBy.COUNTRY]: user => user.location.country,
    //   [SortBy.NAME]: user => user.name.first,
    //   [SortBy.LAST]: user => user.name.last,
    // }

    // return filteredUsers.toSorted((a,b) => {
    //   const extractProperty = compareProperties[sorting]
    //   return extractProperty(a).localeCompare(extractProperty(b))
    // })

    if (sorting === SortBy.COUNTRY){
      return filteredUsers.toSorted(
        (a,b) => a.location.country.localeCompare(b.location.country)
      )
    }

    if (sorting === SortBy.NAME){
      return filteredUsers.toSorted(
        (a,b) => a.name.first.localeCompare(b.name.first)
      )
    }

    if (sorting === SortBy.LAST){
      return filteredUsers.toSorted(
        (a,b) => a.name.last.localeCompare(b.name.last)
      )
    }

    return filteredUsers

  }, [filteredUsers, sorting])

  

  return (
    <div className='App'>
        <h1>Prueba tecnica</h1>
        <header>
          <button onClick={toggleColors}>
            Colorear files
          </button>
          <button onClick={toogleSortByCountry}>
            {sorting === SortBy.COUNTRY ? 'No ordenar por pais' : 'Ordenar por pais'} 
          </button>
          <button onClick={handleReset}>
            Resetear usuarios
          </button>
          <input
            placeholder='Filtra por pais'
            onChange={(e) => {
              setFilterCountry(e.target.value)
            }}
          />
        </header>
        <main>
          <UsersList changeSorting={handleChangeSort} deleteUser={handleDelete} showColors = {showColors} users={sortedUsers}/>
        </main>
    </div>
  )
}

export default App
