export interface AppContextI {
  isLoading: boolean
}

export interface ParamsI {
  page: number
  limit: number
}

export interface SnackbarMessage {
  message: string;
  key: number;
}

export interface State {
  open: boolean;
  snackPack: readonly SnackbarMessage[];
  messageInfo?: SnackbarMessage;
}

export interface NavigationPropsI {
  handlePreviousPage: any
  handleNextPage: any
}

export type FooterPropsT = NavigationPropsI & ParamsI & { totalEntries: number }

export interface UserI {
  firstName: string
  lastName: string
  dateOfBirth: Date
  isAdmin: boolean
  id: string
}