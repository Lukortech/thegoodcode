import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { NewUserFormT } from "../types";
import React from "react";
import CustomDatePicker from "./CustomDatePicker";
import { validateAge } from "../helpers";

const NewUserModal: React.FC<{
  newUserForm: NewUserFormT;
  setNewUserForm: React.Dispatch<React.SetStateAction<NewUserFormT>>;
  handleClose: () => void;
  handleSubmit: () => void;
  isOpen: boolean;
}> = ({ newUserForm, setNewUserForm, handleClose, handleSubmit, isOpen }) => {
  const handleDateChange = (date: Date) => {
    setNewUserForm((prev) => ({ ...prev, dateOfBirth: date }));
  };

  const isFormValid = () => {
    debugger
    return Boolean(newUserForm?.firstName && newUserForm?.lastName && newUserForm?.dateOfBirth && validateAge(newUserForm.dateOfBirth))
  }

  return (
    <Dialog data-test-id="new-user-modal" open={isOpen} onClose={handleClose}>
      <Box sx={{ margin: 3 }}>
        <DialogTitle
          sx={{
            marginY: 2,
            marginX: 0,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          Add new user
          <IconButton
            onClick={handleClose}
            data-test-id="new-user-modal-close-button"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {/* Basic info */}
        <FormControl error={!newUserForm?.firstName} required fullWidth sx={{ padding: 1 }}>
          <FormLabel>First name:</FormLabel>
          <TextField
            value={newUserForm?.firstName || ""}
            onChange={(e) =>
              setNewUserForm((prev) => ({ ...prev, firstName: e.target.value }))
            }
          />
          {!newUserForm?.firstName && <FormHelperText>First name not specified</FormHelperText>}
        </FormControl>
        <FormControl error={!newUserForm?.lastName} required fullWidth sx={{ padding: 1 }} >
          <FormLabel>Last name:</FormLabel>
          <TextField
            value={newUserForm?.lastName || ""}
            onChange={(e) =>
              setNewUserForm((prev) => ({ ...prev, lastName: e.target.value }))
            }
          />
          {!newUserForm?.lastName && <FormHelperText>Last name not specified</FormHelperText>}
        </FormControl>
        {/* Is admin? */}
        <FormControl fullWidth sx={{ padding: 1 }}>
          <FormLabel>Occupies the admin role?</FormLabel>
          <RadioGroup
            value={newUserForm?.isAdmin || "false"}
            name="radio-for-admin-role"
            onChange={(e) =>
              setNewUserForm((prev) => ({
                ...prev,
                isAdmin: e.target.value as any,
              }))
            }
          >
            <FormControlLabel value={"true"} control={<Radio />} label="Yes" />
            <FormControlLabel value={"false"} control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
        {/* DoB */}
        <FormControl error={!newUserForm?.dateOfBirth || !validateAge(newUserForm.dateOfBirth)} required fullWidth sx={{ padding: 1 }}>
          <FormLabel>Date of birth (must be at least 18 years old!):</FormLabel>
          <CustomDatePicker
            date={newUserForm?.dateOfBirth}
            setDate={handleDateChange}
          />
          {!newUserForm?.dateOfBirth && <FormHelperText>Date of birth missing or below 18</FormHelperText>}
          {newUserForm?.dateOfBirth && !validateAge(newUserForm.dateOfBirth) && <FormHelperText error>This user is not over 18 yrs old</FormHelperText>}
        </FormControl>
        <FormControl fullWidth sx={{ padding: 1 }}>
          <Button
            sx={{ justifySelf: "end" }}
            variant="outlined"
            onClick={handleSubmit}
            disabled={!isFormValid()}
          >
            Submit
          </Button>
        </FormControl>
      </Box>
    </Dialog>
  );
};

export default NewUserModal;
