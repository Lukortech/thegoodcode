export interface AppContextI {
  isLoading: boolean;
  totalUsers: number;
}

export interface ParamsI {
  page: number;
  limit: number;
}

export interface SortI {
  sortKey?: keyof UserI;
  sortDirection?: Order;
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
  handlePreviousPage: any;
  handleNextPage: any;
  handleLimitChange: any;
}

export type FooterPropsT = { navigation: NavigationPropsI } & {
  params: ParamsI;
} & { totalEntries: number };

export interface UserI {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  dateOfBirth: Date;
  isAdmin: boolean;
  id: string;
}

export type CredentialsT = Pick<UserI, "userName" | "password">;

export type Order = "asc" | "desc";
export interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof UserI
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

export interface useUserListI {
  users: UserI[];
  params: ParamsI;
  isLoading: boolean;
  sort: SortI;
  setSort: React.Dispatch<React.SetStateAction<SortI>>;
  handleLimitChange: (e: {
    target: {
      value: string;
    };
  }) => void;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
  totalEntries: number;
}

export type SelectedListT = Array<UserI["id"] | never>;
export type NewUserFormT = Pick<
  UserI,
  "firstName" | "lastName" | "dateOfBirth" | "isAdmin"
>;
