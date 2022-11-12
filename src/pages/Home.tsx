import { Container, Typography } from '@mui/material'

import React from 'react'
import UsersTable from "../components/UsersTable"
import { useAppState } from '../context/AppContext'

// import { API_URL } from "../index"

const Home = () => {
  const {totalUsers} = useAppState()

  return (
    <div>
      <Container sx={{ padding: "1em", minHeight: "25vh", display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
        <Typography variant="h4">
          The one and only CRUD app on the market
        </Typography>
        <Typography variant="h5">
          We are now hosting {totalUsers} users!
        </Typography>
      </Container>
      <Container sx={{ padding: "1em", display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
        <UsersTable />
      </Container>
    </div>
  )
}

export default Home
