import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import {
  CheckBox,
  CheckBoxOutlineBlank,
  Delete,
  Edit,
  NavigateBefore,
  NavigateNext,
} from "@mui/icons-material";
import {
  NewUserFormT,
  SelectedListT,
  SortI,
  UserI,
  useUserListI,
} from "../types";
import React, { useState } from "react";

import NewUserModal from "./NewUserModal";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import faker from "faker/locale/en";
import styled from "@emotion/styled";
import { useAppState } from "../context/AppContext";
import useUsersList from "../hooks/useUsersList";

const FooterActions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TABLE_HEADERS: { label: string; key?: keyof UserI }[] = [
  { label: "Selected" },
  { label: "First Name", key: "firstName" },
  { label: "Last Name", key: "lastName" },
  { label: "DoB", key: "dateOfBirth" },
  { label: "Has admin rights?", key: "isAdmin" },
  { label: "Actions" },
];

const UserTableHeader: React.FC<{
  align?: TableCellProps["align"];
  sort: SortI;
  setSort: React.Dispatch<React.SetStateAction<SortI>>;
}> = ({ align = "left", sort, setSort }) => {
  return (
    <TableHead>
      <TableRow>
        {TABLE_HEADERS.map((cell) => {
          return (
            <TableCell key={cell.label} align={align}>
              {cell.key ? (
                <TableSortLabel
                  active={sort.sortKey === cell.key}
                  direction={sort.sortDirection}
                  onClick={() => {
                    setSort((prev) => ({
                      ...prev,
                      sortKey: cell.key,
                      sortDirection: prev.sortDirection ? "desc" : "asc",
                    }));
                  }}
                >
                  {cell.label}
                </TableSortLabel>
              ) : (
                cell.label
              )}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

const options = { year: "numeric", month: "long", day: "numeric" };

const UserRow: React.FC<{
  user: UserI;
  selectUser: (id: UserI["id"]) => void;
  selected: SelectedListT;
}> = ({ user, selectUser, selected }) => {
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell
        // Could have had it assigned to checkbox only but I felt like whole cell should provide "interactive exp."
        onClick={() => selectUser(user.id)}
        align="left"
        sx={{
          transition: "all 0.1s",
          cursor: "pointer",
          ":hover": { transition: "all 0.1s", color: "rgb(228 228 228)" },
        }}
      >
        {selected.includes(user.id as UserI["id"]) ? (
          <CheckBox />
        ) : (
          <CheckBoxOutlineBlank />
        )}
      </TableCell>
      <TableCell align="left">{user.firstName}</TableCell>
      <TableCell align="left">{user.lastName}</TableCell>
      <TableCell align="left">
        {/* @ts-ignore */}
        {new Date(user.dateOfBirth).toLocaleDateString(undefined, options)}
      </TableCell>
      <TableCell align="left">
        {user.isAdmin ? (
          <RadioButtonCheckedIcon />
        ) : (
          <RadioButtonUncheckedIcon />
        )}
      </TableCell>
      <TableCell align="left">
        <IconButton>
          <Delete />
        </IconButton>
        <IconButton>
          <Edit />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const UserTableFooter: React.FC<
  Pick<
    useUserListI,
    "params" | "handleNextPage" | "handlePreviousPage" | "totalEntries"
  > & { selected: SelectedListT }
> = ({
  params,
  handleNextPage,
  handlePreviousPage,
  totalEntries,
  selected,
}) => {
  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={TABLE_HEADERS.length}>
          Selected fields: {selected.length}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={TABLE_HEADERS.length} sx={{ alignItems: "center" }}>
          <FooterActions>
            <IconButton
              aria-label="previous"
              color="inherit"
              sx={{ p: 0.5, mx: 1 }}
              onClick={handlePreviousPage}
            >
              <NavigateBefore />
            </IconButton>
            <Typography>
              Page {params.page + 1} out of{" "}
              {Math.ceil(totalEntries / params.limit)}
            </Typography>
            <IconButton
              aria-label="next"
              color="inherit"
              sx={{ p: 0.5, mx: 1 }}
              onClick={handleNextPage}
            >
              <NavigateNext />
            </IconButton>
          </FooterActions>
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};

const UsersTable: React.FC = () => {
  const {
    users,
    params,
    sort,
    setSort,
    handleNextPage,
    handlePreviousPage,
    handleLimitChange,
    postUser,
  } = useUsersList();
  const { totalUsers, isLoading } = useAppState();
  const selectMenuItems: { value: number; label: string }[] = [
    { value: 10, label: "Ten" },
    { value: 20, label: "Twenty" },
    { value: 30, label: "Thirty" },
  ];

  const initialNewUserFormData: NewUserFormT = {
    firstName: "",
    lastName: "",
    dateOfBirth: new Date(),
    isAdmin: false,
  };

  const [selected, setSelected] = useState<SelectedListT>([]);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState<NewUserFormT>(
    initialNewUserFormData
  );

  const selectUser = (id: UserI["id"]) => {
    // TODO: Get some information on why do we want to select users.
    // Maybe the selection should be reset after page change?
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((prevId) => prevId !== id);
      return [...prev, id];
    });
  };

  const handleModalCloseAction = () => {
    setIsNewUserModalOpen(false);
    setNewUserForm(initialNewUserFormData);
  };

  const submitNewUserData = () => {
    const sanitizeNewUser = (
      partialUserData: NewUserFormT
    ): Omit<UserI, "id"> => {
      return {
        ...partialUserData,
        userName: `${partialUserData?.firstName?.substring(0, 1)}${
          partialUserData?.lastName
        }${faker.random.number({ min: 10000, max: 99999 })}`,
        // Generate initial password that the user will be able to reset after first login
        password: faker.internet.password(16),
      };
    };

    // TODO: Leverage the endpoint availavle in mock-server
    postUser(sanitizeNewUser(newUserForm));
  };

  return (
    <>
      <NewUserModal
        newUserForm={newUserForm}
        setNewUserForm={setNewUserForm}
        handleClose={handleModalCloseAction}
        handleSubmit={submitNewUserData}
        isOpen={isNewUserModalOpen}
      />
      <Grid justifyContent="space-between" alignItems="baseline" display="flex">
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setIsNewUserModalOpen(true);
          }}
        >
          Add new User
        </Button>
        <FormControl
          sx={{ marginBottom: "1em", display: "flex", grow: ".5" }}
          variant="outlined"
        >
          <InputLabel id="display-select-label">Display</InputLabel>
          <Select
            labelId="display-select-label"
            value={String(params.limit)}
            label="Display"
            variant="outlined"
            color="primary"
            onChange={handleLimitChange}
          >
            {selectMenuItems.map((item) => {
              return (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <UserTableHeader sort={sort} setSort={setSort} />
          {!isLoading ? (
            <TableBody>
              {users.map((user) => (
                <UserRow
                  user={user}
                  key={user.id}
                  selectUser={selectUser}
                  selected={selected}
                />
              ))}
            </TableBody>
          ) : (
            <tbody>
              <tr>
                <Skeleton height="100vh" width="100vw" component="td" />
              </tr>
            </tbody>
          )}
          <UserTableFooter
            params={params}
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
            totalEntries={totalUsers}
            selected={selected}
          />
        </Table>
      </TableContainer>
    </>
  );
};

export default UsersTable;
