import { Container, Typography } from '@mui/material'

import React from 'react'
import UsersTable from "../components/UsersTable"
import useUserList from "../hooks/useUsersList"

// import { API_URL } from "../index"

const Home = () => {
  const { totalEntries } = useUserList()

  return (
    <div>
      <Container sx={{ padding: "1em", minHeight: "25vh", display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
        <Typography variant="h4">
          The one and only CRUD app on the market
        </Typography>
        <Typography variant="h5">
          Hello World! We are now hosting {totalEntries || 0} users!
        </Typography>
      </Container>
      <Container sx={{ padding: "1em", display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
        <UsersTable />
      </Container>
    </div>
  )
}

export default Home
