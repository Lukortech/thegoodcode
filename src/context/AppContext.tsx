import React, { Dispatch, createContext, ReactNode, useReducer } from "react";
import { AppContextI } from "../types";

const initialState: AppContextI = {
  isLoading: false,
  totalUsers: 0,
};

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_TOTAL_USERS"; payload: number };

export const AppStateContext = createContext<AppContextI>(initialState);
export const AppDispatchContext =
  createContext<Dispatch<Action> | undefined>(undefined);

function appReducer(state: AppContextI, action: Action) {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_TOTAL_USERS":
      return {
        ...state,
        totalUsers: action.payload,
      };
    default:
      return state;
  }
}

type AppProviderProps = { children?: ReactNode };

export const AppProvider = ({ children }: AppProviderProps) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = React.useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useDataState must be used within the DataProvider");
  }
  return context;
};

export const useAppDispatch = () => {
  const context = React.useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error("useDataDispatch must be used within the DataProvider");
  }
  return context;
};
