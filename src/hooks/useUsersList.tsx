import { useEffect, useState } from 'react'

// import { API_URL } from "../index"
import { ParamsI, UserI, SortI } from '../types'
import axios from "axios"

const useUsersList = (id?: string) => {
  const initialParams:ParamsI = {
    page: 0,
    limit: 10,
  }
  const initialSort: SortI = {
    sortDirection: "asc",
    sortKey: "firstName"
  }

  const [users, setUsers] = useState<UserI[]>([])
  const [totalEntries, setTotalEntries] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [params, setParams] = useState<ParamsI>(initialParams)
  const [sort, setSort] = useState(initialSort)

  const handlePreviousPage = () => {
    if (params.page > 0) {
      setParams((prevState) => ({ ...prevState, page: prevState.page - 1 }))
    }
  }

  const handleNextPage = () => {
    if (params.page < Math.ceil(totalEntries / params.limit - 1)) {
      setParams((prevState) => ({ ...prevState, page: prevState.page + 1 }))
    }
  }

  const handleLimitChange = (e: { target: { value: string } }) => {
    setParams((prevState) => ({
      ...prevState,
      limit: Number(e.target.value),
      page: 0,
    }))
  }

  useEffect(() => {
    const getUsers = async (params: ParamsI, sort: SortI) => {
      try {
        // dispatch({ type: "SET_LOADING", payload: true })
        setIsLoading(true)

        const newParams = params ? "/" + params?.page + "/" + params?.limit : ""
        const newSorting = (sort.sortKey && sort.sortDirection) ? "/" + sort?.sortKey + "/" + sort?.sortDirection : ""

        const res = await axios.get(`api/users${newParams}${newSorting}`)
        setUsers(res.data.users.models)
        setTotalEntries(res.data.totalEntries)
      } catch (e) {
        // TODO: Toast?
        console.error(e)
      } finally {
        setIsLoading(false)
        // dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    getUsers(params, sort)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, sort])

  return { users, params, isLoading, sort, setSort, handleLimitChange, handleNextPage, handlePreviousPage, totalEntries }
}

export default useUsersList