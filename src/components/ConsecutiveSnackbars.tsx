import { Snackbar, Button, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { SnackbarMessage } from "../types";
import { SyntheticEvent } from "react";
import useSnackPack from "../hooks/useSnackPack";

const ConsecutiveSnackbars: React.FC<{
  // messageInfo?: SnackbarMessage;
  // handleClose: (event: SyntheticEvent | Event, reason?: string) => void;
  // handleExited: () => void;
  // open: boolean;
}> = () => {
  const {messageInfo, handleClose, handleExited, open} = useSnackPack()

  return (
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        message={messageInfo ? messageInfo.message : undefined}
        action={
          <>
            <Button color="secondary" size="small" onClick={handleClose}>
              Close
            </Button>
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleClose}
            >
              <Close />
            </IconButton>
          </>
        }
      />
  );
};

export default ConsecutiveSnackbars;
