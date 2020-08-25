import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: 'Comic Neue',
  },
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Navbar />
    </MuiThemeProvider>
  );
}

export default App;