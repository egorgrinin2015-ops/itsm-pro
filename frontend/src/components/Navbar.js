import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Chip
} from '@mui/material';
import {
  AccountCircle,
  Assignment,
  Category,
  Dashboard,
  ExitToApp,
  Stars
} from '@mui/icons-material';

const Navbar = () => {
  const { user, logout, isManager } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Определяем цвет роли
  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
      case 'manager':
        return '#f59e0b';
      case 'engineer':
        return '#10b981';
      case 'user':
        return '#6366f1';
      default:
        return '#64748b';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <AppBar 
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          {/* Логотип */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 4 }}>
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(139, 92, 246, 0.8) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <Stars sx={{ fontSize: 20, color: 'white' }} />
                </Box>
              </motion.div>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(59, 130, 246, 0.9) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                ITSM Pro
              </Typography>
            </Box>
          </motion.div>

          {/* Навигационные кнопки */}
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                color="inherit"
                startIcon={<Assignment />}
                component={Link}
                to="/tickets"
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  color: '#ffffff',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(59, 130, 246, 0.2)',
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Заявки
              </Button>
            </motion.div>

            {isManager && (
              <>
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    color="inherit"
                    startIcon={<Category />}
                    component={Link}
                    to="/categories"
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      color: '#ffffff',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(34, 197, 94, 0.2)',
                        boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Категории
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    color="inherit"
                    startIcon={<Dashboard />}
                    component={Link}
                    to="/dashboard"
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      color: '#ffffff',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(139, 92, 246, 0.2)',
                        boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Статистика
                  </Button>
                </motion.div>
              </>
            )}
          </Box>

          {/* Информация о пользователе */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#ffffff',
                      fontWeight: 600,
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      fontSize: '0.95rem'
                    }}
                  >
                    {user?.fullName}
                  </Typography>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                  >
                    <Chip
                      label={user?.role}
                      size="small"
                      sx={{
                        background: `linear-gradient(135deg, ${getRoleColor(user?.role)} 0%, ${getRoleColor(user?.role)}80 100%)`,
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        boxShadow: `0 4px 12px ${getRoleColor(user?.role)}40`,
                        border: `1px solid ${getRoleColor(user?.role)}60`
                      }}
                    />
                  </motion.div>
                </Box>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    size="large"
                    onClick={handleMenu}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 36, 
                        height: 36,
                        background: `linear-gradient(135deg, ${getRoleColor(user?.role)} 0%, ${getRoleColor(user?.role)}80 100%)`,
                        fontWeight: 700,
                        boxShadow: `0 4px 15px ${getRoleColor(user?.role)}40`
                      }}
                    >
                      {user?.fullName?.charAt(0)}
                    </Avatar>
                  </IconButton>
                </motion.div>
              </Box>
            </motion.div>

            {/* Меню пользователя */}
            <AnimatePresence>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                    mt: 1
                  }
                }}
              >
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  transition={{ duration: 0.2 }}
                >
                  <MenuItem 
                    onClick={() => { handleClose(); navigate('/profile'); }}
                    sx={{
                      color: '#ffffff',
                      fontWeight: 500,
                      py: 1.5,
                      px: 3,
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      '&:hover': {
                        background: 'rgba(59, 130, 246, 0.2)',
                      }
                    }}
                  >
                    <AccountCircle sx={{ mr: 2, color: '#3b82f6' }} />
                    Профиль
                  </MenuItem>
                </motion.div>

                <motion.div
                  whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                  transition={{ duration: 0.2 }}
                >
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{
                      color: '#ffffff',
                      fontWeight: 500,
                      py: 1.5,
                      px: 3,
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      '&:hover': {
                        background: 'rgba(239, 68, 68, 0.2)',
                      }
                    }}
                  >
                    <ExitToApp sx={{ mr: 2, color: '#ef4444' }} />
                    Выйти
                  </MenuItem>
                </motion.div>
              </Menu>
            </AnimatePresence>
          </Box>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

export default Navbar;