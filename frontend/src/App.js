import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import TicketList from './pages/TicketList';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';
import Categories from './pages/Categories';
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import theme, { gradients } from './theme/theme';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Красивый градиентный фон для всего приложения */}
      <Box
        sx={{
          minHeight: '100vh',
          background: gradients.background,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
            `,
            zIndex: -1,
            pointerEvents: 'none',
          },
        }}
      >
        <AuthProvider>
          <Router>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Публичные маршруты */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Защищенные маршруты */}
                
                {/* Список заявок */}
                <Route
                  path="/tickets"
                  element={
                    <ProtectedRoute>
                      <>
                        <Navbar />
                        <TicketList />
                      </>
                    </ProtectedRoute>
                  }
                />

                {/* Создание заявки */}
                <Route
                  path="/tickets/create"
                  element={
                    <ProtectedRoute>
                      <>
                        <Navbar />
                        <CreateTicket />
                      </>
                    </ProtectedRoute>
                  }
                />

                {/* Просмотр заявки */}
                <Route
                  path="/tickets/:id"
                  element={
                    <ProtectedRoute>
                      <>
                        <Navbar />
                        <TicketDetail />
                      </>
                    </ProtectedRoute>
                  }
                />

                {/* Управление категориями */}
                <Route
                  path="/categories"
                  element={
                    <ProtectedRoute roles={['manager']}>
                      <>
                        <Navbar />
                        <Categories />
                      </>
                    </ProtectedRoute>
                  }
                />

                {/* Дашборд статистики (только для менеджеров) */}
<Route
  path="/dashboard"
  element={
    <ProtectedRoute roles={['manager']}>
      <>
        <Navbar />
        <Dashboard />
      </>
    </ProtectedRoute>
  }
/>

                {/* Редирект с главной на заявки */}
                <Route path="/" element={<Navigate to="/tickets" replace />} />

                {/* 404 */}
                <Route path="*" element={<Navigate to="/tickets" replace />} />
              </Routes>
            </AnimatePresence>
          </Router>
        </AuthProvider>
      </Box>
    </ThemeProvider>
  );
}

export default App;