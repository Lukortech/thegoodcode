import { ParamsI, SortI, UserI } from '../types'
import { useAppDispatch, useAppState } from '../context/AppContext'
import { useEffect, useState } from 'react'

import axios from "axios"

const useUsersList = () => {
  const dispatch = useAppDispatch()
  const { totalUsers } = useAppState()

  const initialParams: ParamsI = {
    page: 0,
    limit: 10,
  }
  const initialSort: SortI = {
    sortDirection: undefined,
    sortKey: undefined
  }

  // eslint-disable-next-line no-lone-blocks
  {/*
    NOTE: I've moved parts of the state away from the hook, as I know it's "state" is being only used across the component it's used in
    I wanted to show off too much and it kinda broke the way display select works now. Sorry!
  */}

  const [users, setUsers] = useState<UserI[]>([])
  const [params, setParams] = useState<ParamsI>(initialParams)
  const [sort, setSort] = useState(initialSort)

  const handlePreviousPage = () => {
    setParams((prevState) =>
      prevState.page > 0 ?
        ({ ...prevState, page: prevState.page - 1 }) :
        prevState
    )
  }

  const handleNextPage = () => {
    setParams((prevState) => prevState.page < Math.ceil(totalUsers / prevState.limit) ?
      ({ ...prevState, page: prevState.page + 1 }) :
      prevState
    )
  }

  const handleLimitChange = (e: { target: { value: string } }) => {
    const newValueNumber = Number(e.target.value)
    setParams({
      limit: newValueNumber,
      page: 0,
    })
    dispatch({ type: "SET_TOTAL_USERS", payload: Math.ceil(totalUsers / newValueNumber) })
  }

  const postUser = async (user: Omit<UserI, "id">) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const res = await axios.post(`api/user`, user)
      // Update the sate if response was 200
      if (res.status !== 200 && res.status !== 201) return
      setUsers(res.data.users.models)
      dispatch({ type: "SET_TOTAL_USERS", payload: res.data.totalEntries })
    } catch (e) {
      // TODO: Toast?
      console.error(e)
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  useEffect(() => {
    console.log({newSortValues: sort})
    const getUsers = async (params: ParamsI, sort: SortI) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true })

        const newParams = params ? "/" + params?.page + "/" + params?.limit : ""
        const newSorting = (sort.sortKey && sort.sortDirection) ? "/" + sort?.sortKey + "/" + sort?.sortDirection : ""

        const res = await axios.get(`api/users${newParams}${newSorting}`)
        setUsers(res.data.users.models)
        dispatch({ type: "SET_TOTAL_USERS", payload: res.data.totalEntries })
        // setTotalEntries(res.data.totalEntries)
      } catch (e) {
        // TODO: Toast?
        console.error(e)
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    getUsers(params, sort)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, sort])

  return { users, params, sort, setSort, handleLimitChange, handleNextPage, handlePreviousPage, postUser }
}

export default useUsersList