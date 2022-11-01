import { Button, Container, FormControl, Input, InputLabel, Typography } from "@mui/material"

import useAuth from "../hooks/useAuth"

const Login = () => {
  const { isAuth, handleUserChange } = useAuth()

  return (
    <>
      <Container>
        <Typography variant="h4">Hello!</Typography>
        <Typography variant="h5">Please do log in to make any futher changes in the data</Typography>
      </Container>
      <Container>
        {isAuth ? "Welcome, user!" : "You're not authed."}
      </Container>

      <Container>
        <form onSubmit={(e)=>{
          console.log(handleUserChange)
        }}>
        <FormControl>
          <InputLabel id="demo-simple-select-label">Username</InputLabel>
          <Input type="text" name="userName" onChange={handleUserChange} />
          
        </FormControl>
        <FormControl>
        <InputLabel id="demo-simple-select-label">Password</InputLabel>
          <Input type="password" name="password" onChange={handleUserChange} />
        </FormControl>
        <Button type="submit">
          Submit!
        </Button>
        </form>
      </Container>
    </>
  )
}

export default Login