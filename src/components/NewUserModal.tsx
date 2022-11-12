import { Box, Button, Dialog, DialogTitle, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, TextField } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close"
import { NewUserFormT } from '../types';
import React from 'react'
import CustomDatePicker from "./CustomDatePicker";

const NewUserModal: React.FC<{
  newUserForm: NewUserFormT;
  setNewUserForm: React.Dispatch<React.SetStateAction<NewUserFormT>>;
  handleClose: () => void;
  handleSubmit: () => void;
  isOpen: boolean;
}> = ({
  newUserForm,
  setNewUserForm,
  handleClose,
  handleSubmit,
  isOpen
}) => {
    const handleDateChange = (date:Date)=>{
      setNewUserForm(prev=>({...prev, dateOfBirth: date}))
    }

    return (
      <Dialog open={isOpen} onClose={handleClose}>
        <Box sx={{margin: 3}}>
          <DialogTitle sx={{marginY: 2, marginX: 0, display: "flex", justifyContent: "space-between"}}>
            Add new user 
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          {/* Basic info */}
          <FormControl fullWidth sx={{padding: 1}}>
            <FormLabel>First name:</FormLabel>
            <TextField 
              value={newUserForm?.firstName || ""} 
              onChange={e => setNewUserForm(prev => ({...prev, firstName: e.target.value}))}
            />
          </FormControl>
          <FormControl fullWidth sx={{padding: 1}}>
            <FormLabel>Last name:</FormLabel>
          <TextField 
              value={newUserForm?.lastName || ""} 
              onChange={e => setNewUserForm(prev => ({...prev, lastName: e.target.value}))}
            />
          </FormControl>
          {/* Is admin? */}
          <FormControl fullWidth sx={{padding: 1}}>
            <FormLabel>Occupies the admin role?</FormLabel>
            <RadioGroup
              value={newUserForm?.isAdmin || "false"}
              name="radio-for-admin-role"
              onChange={e => setNewUserForm(prev => ({...prev, isAdmin: e.target.value as any}))}
            >
              <FormControlLabel value={"true"} control={<Radio />} label="Yes" />
              <FormControlLabel value={"false"} control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
          {/* DoB */}
          <FormControl fullWidth sx={{padding: 1}}>
            <FormLabel>Date of birth (must be at least 18 years old!):</FormLabel>
            <CustomDatePicker date={newUserForm?.dateOfBirth} setDate={handleDateChange}/>
          </FormControl>
          <FormControl fullWidth sx={{padding: 1}}>
            <Button sx={{justifySelf: "end"}} variant="outlined" onClick={handleSubmit}>Submit</Button>
          </FormControl>
        </Box>
      </Dialog >
    )
  }

export default NewUserModal