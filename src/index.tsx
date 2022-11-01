import { CssBaseline } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import makeServer from "./api/server"
import {AppProvider} from "./context/AppContext"
import AppRoutes from "./router/Routes"
import Layout from "./components/Layout"

export const API_URL = 'http://myapimock.com'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

makeServer()

root.render(
  // <React.StrictMode>
  <>
  <CssBaseline />
    <AppProvider>
      <Layout>
        <AppRoutes />
      </Layout>
    </AppProvider>
  </>
  // </React.StrictMode>
);