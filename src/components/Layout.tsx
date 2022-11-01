// Code from : https://mui.com/material-ui/react-snackbar/
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { SnackbarMessage } from '../types';
import ConsecutiveSnackbars from './ConsecutiveSnackbars';
import styles from "../styles/Layout.module.scss"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(
    undefined,
  );

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
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };


  return (
    <div className={styles.layoutWrapper}>
      <ConsecutiveSnackbars 
        messageInfo={messageInfo}
        handleClose={handleClose}
        handleExited={handleExited}
        open={open}
      />
      {children}
    </div>
  )
}

export default Layout