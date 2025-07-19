import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AnalysisPage } from './pages/AnalysisPage';
import { Navbar } from './components/Navbar';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();

  const muiTheme = createTheme({
    palette: {
      mode: theme,
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Navbar onThemeToggle={toggleTheme} />
      <AnalysisPage />
    </ThemeProvider>
  );
}

export default App;
