import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import theme from './theme/index';
import { App } from './App';
import { PopupProvider } from './components/popup/PopupProvider';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <PopupProvider>
        <CssBaseline />
        <App />
      </PopupProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
