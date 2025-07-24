import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Navbar } from './components/Navbar';
import { AnalysisPage } from './pages/AnalysisPage';
import { AnalysisDetailPage } from './pages/AnalysisDetailPage';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar onThemeToggle={toggleTheme} />
        <Routes>
          <Route path="/" element={<AnalysisPage />} />
          <Route path="/analysis/:repoId" element={<AnalysisDetailPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
