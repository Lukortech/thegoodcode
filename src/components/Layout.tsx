// Code from : https://mui.com/material-ui/react-snackbar/
import React from "react";
import ConsecutiveSnackbars from "./ConsecutiveSnackbars";
import styles from "../styles/Layout.module.scss";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.layoutWrapper}>
      <ConsecutiveSnackbars />
      {children}
    </div>
  );
};

export default Layout;
