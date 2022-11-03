import { CheckBox, CheckBoxOutlineBlank, Delete, Edit, NavigateBefore, NavigateNext } from "@mui/icons-material"
import { Container, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Skeleton, Table, TableBody, TableCell, TableCellProps, TableContainer, TableFooter, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material'
import { UserI, useUserListI } from "../types"

import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import React from "react"
import styled from "@emotion/styled"
import useUsersList from "../hooks/useUsersList"

const FooterActions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const UserTableHeader: React.FC<{ align?: TableCellProps["align"] }> = ({ align = "left" }) => {
  const tableCells = [
    "First Name",
    "Last Name",
    "DoB",
    "Has admin rights?",
    "Actions",
  ]

  return (<TableHead>
    <TableRow>
      {tableCells.map(cell => {
        return (
          <TableCell key={cell} align={align}>
            {/* <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            > */}
            {cell}
            {/* {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null} */}
            {/* </TableSortLabel> */}
          </TableCell>
        )
      })
      }
    </TableRow>
  </TableHead>)
}

const options = { year: 'numeric', month: 'long', day: 'numeric' };

const UserRow: React.FC<{ user: UserI }> = ({ user }) => {
  return (<TableRow
    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
  >
    <TableCell align="left">
      {user.firstName}
    </TableCell>
    <TableCell align="left">
      {user.lastName}
    </TableCell>
    <TableCell align="left">
      {/* @ts-ignore */}
      {new Date(user.dateOfBirth).toLocaleDateString(undefined, options)}
    </TableCell>
    <TableCell align="left">
      {user.isAdmin ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />}
    </TableCell>
    <TableCell align="left">
      <IconButton>
        <Delete />
      </IconButton>
      <IconButton>
        <Edit />
      </IconButton>
    </TableCell>
  </TableRow>)
}

const UserTableFooter: React.FC<Pick<useUserListI,
  "params" | "handleNextPage" | "handlePreviousPage" | "totalEntries">> = ({ params, handleNextPage, handlePreviousPage, totalEntries }) => {
    return <TableFooter>
      <TableRow>
        <TableCell colSpan={5} sx={{ alignItems: "center" }}>
          <FooterActions>
            <IconButton
              aria-label="previous"
              color="inherit"
              sx={{ p: 0.5, mx: 1 }}
              onClick={handlePreviousPage}
            >
              <NavigateBefore />
            </IconButton>
            <Typography>Page {params.page + 1} out of {Math.ceil(totalEntries / params.limit)}</Typography>
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
  }

const UsersTable: React.FC = () => {
  const { users, params, handleNextPage, handlePreviousPage, totalEntries, handleLimitChange, isLoading } = useUsersList()
  const selectMenuItems: { value: number, label: string }[] = [
    { value: 10, label: "Ten" },
    { value: 20, label: "Twenty" },
    { value: 30, label: "Thirty" }
  ]
  return (<>
    <Grid justifyContent="flex-end" display="flex" >
      <FormControl sx={{ marginBottom: "1em", display: "flex", grow: ".5" }} variant="standard" >
        <InputLabel id="demo-simple-select-label">Display</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          value={String(params.limit)}
          label="Display"
          onChange={handleLimitChange}
        >
          {selectMenuItems.map(item => {
            return (
              <MenuItem
                key={item.value}
                value={item.value}
              >
                {item.label}
              </MenuItem>)
          })}
        </Select>
      </FormControl>
    </Grid>
    <TableContainer component={Paper}>
      <Table>
        <UserTableHeader />
        {!isLoading ?
          <TableBody>
            {users.map(user => <UserRow user={user} key={user.id} />)}
          </TableBody>
          : <tbody><tr><Skeleton height="100vh" width="100vw" component="td" /></tr></tbody>
        }
        <UserTableFooter
          params={params}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
          totalEntries={totalEntries}
        />
      </Table>
    </TableContainer>
  </>)
}

export default UsersTable