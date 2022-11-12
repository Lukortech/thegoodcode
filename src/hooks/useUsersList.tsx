import { ParamsI, SortI, UserI } from "../types";
import { useAppDispatch, useAppState } from "../context/AppContext";
import { useEffect, useState } from "react";

import axios from "axios";

const initialParams: ParamsI = {
  page: 0,
  limit: 10,
};
const initialSort: SortI = {
  sortDirection: undefined,
  sortKey: undefined,
};

const useUsersList = () => {
  const dispatch = useAppDispatch();
  const { totalUsers } = useAppState();

  // NOTE: I've moved parts of the state away from the hook, as I know it's "state" is being only used across the component it's used in.

  const [users, setUsers] = useState<UserI[]>([]);
  const [params, setParams] = useState<ParamsI>(initialParams);
  const [sort, setSort] = useState(initialSort);

  const handlePreviousPage = () => {
    setParams((prevState) =>
      prevState.page > 0
        ? { ...prevState, page: prevState.page - 1 }
        : prevState
    );
  };

  const handleNextPage = () => {
    setParams((prevState) =>
      prevState.page < Math.ceil(totalUsers / prevState.limit)
        ? { ...prevState, page: prevState.page + 1 }
        : prevState
    );
  };

  const handleLimitChange = (e: { target: { value: string } }) => {
    const newValueNumber = Number(e.target.value);
    setParams({
      limit: newValueNumber,
      page: 0,
    });
    dispatch({
      type: "SET_TOTAL_USERS",
      payload: Math.ceil(totalUsers / newValueNumber),
    });
  };

  const refresh = () => {
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  };

  // HELPERS

  const generateParams = (params: ParamsI) =>
    params ? "/" + params?.page + "/" + params?.limit : "";
  const generateSorting = (sort: SortI) =>
    sort.sortKey && sort.sortDirection
      ? "/" + sort?.sortKey + "/" + sort?.sortDirection
      : "";

  // API REQUESTS

  const postUser = async (
    user: Omit<UserI, "id">,
    params: ParamsI,
    sort: SortI
  ) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await axios.post(
        `api/user${generateParams(params)}${generateSorting(sort)}`,
        user
      );
      if (res.status !== 200 && res.status !== 201) return;
      setUsers(res.data.users);
      dispatch({ type: "SET_TOTAL_USERS", payload: res.data.totalEntries });
    } catch (e) {
      // TODO: Toast?
      console.error(e);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const deleteUser = async (id: UserI["id"], params: ParamsI, sort: SortI) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await axios.delete(
        `api/user/${id}${generateParams(params)}${generateSorting(sort)}`
      );
      setUsers(res.data.users);
      dispatch({ type: "SET_TOTAL_USERS", payload: res.data.totalEntries });
    } catch (e) {
      // TODO: Toast?
      console.error(e);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const getUsers = async (params: ParamsI, sort: SortI, isMounted: boolean) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await axios.get(
        `api/users${generateParams(params)}${generateSorting(sort)}`
      );
      if (isMounted) {
        setUsers(res.data.users);
        dispatch({ type: "SET_TOTAL_USERS", payload: res.data.totalEntries });
      }
    } catch (e) {
      // TODO: Toast?
      console.error(e);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    let isMounted = true;
    getUsers(params, sort, isMounted);

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, sort]);

  return {
    users,
    params,
    sort,
    setSort,
    handleLimitChange,
    handleNextPage,
    handlePreviousPage,
    postUser,
    deleteUser,
    refresh,
  };
};

export default useUsersList;
