import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import AnalysisPage from './pages/AnalysisPage';
import AnalysisDetailPage from './pages/AnalysisDetailPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import GitHubCallbackPage from './pages/GitHubCallbackPage';
import RepositoriesPage from './pages/RepositoriesPage';
import { useTheme } from './hooks/useTheme';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/oauth/callback" element={<GitHubCallbackPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
              <Layout onThemeToggle={toggleTheme}>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/analysis" element={<AnalysisPage />} />
                  <Route path="/analysis/:id" element={<AnalysisDetailPage />} />
                  <Route path="/repositories" element={<RepositoriesPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;