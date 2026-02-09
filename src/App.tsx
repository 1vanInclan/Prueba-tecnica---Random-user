import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { UsersList } from './components/UsersList'
import { SortBy, type User } from './types.d'

function App() {

  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

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
    setLoading(true)
    setError(false)

    fetch(`https://randomuser.me/api/?results=10&seed=ivan&page=${currentPage}`)
      .then(async res => {
        if (!res.ok) throw new Error('Error en la peticion')
        return await res.json()
      })
      .then(res => {
        setUsers(prevUsers => {
          const newUsers = prevUsers.concat(res.results)
          originalUsers.current = res.results
          return newUsers
        })
      })
      .catch(err => {
        setError(err)
        console.error(err);
      })
      .finally(() => {
        setLoading(false)
      })
  }, [currentPage])


  const filteredUsers = useMemo(() => {
    console.log('calculate filter users');
    return filterCountry !== null && filterCountry.length > 0
      ? users.filter((user) => {
        return user.location.country.toLowerCase().includes(filterCountry.toLocaleLowerCase())
      })
      : users
  },[users, filterCountry])

  const sortedUsers = useMemo(() => {

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

          {users.length > 0 && <UsersList changeSorting={handleChangeSort} deleteUser={handleDelete} showColors = {showColors} users={sortedUsers}/>}

          {loading && <strong>Cargando...</strong>}

          {!loading && error && <p>Ha habido un error</p>}

          {!loading && !error && users.length === 0 && <p>No hay usuarios</p>}

          {!loading && !error && <button onClick={() => setCurrentPage(currentPage+1)}>Cargar mas resultados</button>}
          
        </main>
    </div>
  )
}

export default App
