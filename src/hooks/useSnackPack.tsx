import React, { useState, useEffect, SyntheticEvent } from "react";
import { SnackbarMessage } from "../types";

const useSnackPack = () => {
  const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] =
    useState<SnackbarMessage | undefined>(undefined);

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const handleAddSnackbarMessage = (message: string) => () => {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  };

  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  return {
    handleAddSnackbarMessage,
    handleClose,
    handleExited,
    open,
    messageInfo,
  };
};

export default useSnackPack;
