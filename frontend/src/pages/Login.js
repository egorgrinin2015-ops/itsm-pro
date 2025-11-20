import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Shield,
  Users,
  BarChart3
} from 'lucide-react';

// Фон с красивыми изображениями
const ImageBackground = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: -1,
      }}
    >
      {/* Основное изображение */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.4) saturate(1.3)',
          transform: 'scale(1.1)',
          animation: 'slowZoom 20s ease-in-out infinite alternate',
        }}
      />

      {/* Дополнительные слои для глубины */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(ellipse at top left, rgba(102, 126, 234, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at top right, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at bottom left, rgba(34, 197, 94, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse at bottom right, rgba(251, 191, 36, 0.3) 0%, transparent 50%),
            linear-gradient(135deg, 
              rgba(15, 23, 42, 0.8) 0%,
              rgba(30, 41, 59, 0.6) 25%,
              rgba(51, 65, 85, 0.8) 50%,
              rgba(30, 41, 59, 0.6) 75%,
              rgba(15, 23, 42, 0.8) 100%
            )
          `,
        }}
      />

      {/* Анимированные частицы света */}
      <motion.div
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: '20%',
          right: '20%',
          width: 300,
          height: 300,
          background: 'conic-gradient(from 0deg, rgba(102, 126, 234, 0.4), rgba(168, 85, 247, 0.3), rgba(102, 126, 234, 0.4))',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      <motion.div
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 0.8, 1.2, 1],
          x: [0, 50, -30, 0],
          y: [0, -30, 20, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          bottom: '25%',
          left: '15%',
          width: 250,
          height: 250,
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, rgba(16, 185, 129, 0.3) 50%, transparent 100%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }}
      />

      <motion.div
        animate={{
          opacity: [0.1, 0.4, 0.1],
          scale: [1, 1.5, 0.8, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70%',
          height: '60%',
          background: `
            conic-gradient(from 45deg,
              transparent,
              rgba(251, 191, 36, 0.2),
              transparent,
              rgba(236, 72, 153, 0.2),
              transparent,
              rgba(14, 165, 233, 0.2),
              transparent
            )
          `,
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />

      {/* Дополнительные декоративные элементы */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.03) 50%, transparent 52%)
          `,
          backgroundSize: '150px 150px, 200px 200px, 80px 80px',
          animation: 'patternShift 15s linear infinite',
        }}
      />

      {/* CSS анимации */}
      <style jsx>{`
        @keyframes slowZoom {
          0% { transform: scale(1.1) rotate(0deg); }
          50% { transform: scale(1.15) rotate(1deg); }
          100% { transform: scale(1.1) rotate(-1deg); }
        }

        @keyframes patternShift {
          0% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(-20px) translateY(-10px); }
          50% { transform: translateX(-10px) translateY(-20px); }
          75% { transform: translateX(-30px) translateY(-5px); }
          100% { transform: translateX(0) translateY(0); }
        }
      `}</style>
    </Box>
  );
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/tickets');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Shield size={24} />,
      title: 'Корпоративная безопасность',
      description: 'Многоуровневая защита конфиденциальных данных'
    },
    {
      icon: <Users size={24} />,
      title: 'Командная работа',
      description: 'Синхронизация задач и эффективная коммуникация'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Бизнес-аналитика',
      description: 'Глубинные инсайты и прогнозирование трендов'
    }
  ];

  const testAccounts = [
    { email: 'admin@itsm.com', password: 'admin123', role: 'Менеджер', color: '#f59e0b' },
    { email: 'engineer@itsm.com', password: 'engineer123', role: 'Инженер', color: '#10b981' },
    { email: 'user@itsm.com', password: 'user123', role: 'Пользователь', color: '#6366f1' }
  ];

  const fillTestAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* КРАСИВЫЙ ФОНОВЫЙ ОБРАЗ */}
      <ImageBackground />
      
      <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
        <Box sx={{ width: '100%', display: 'flex', gap: 4, alignItems: 'center' }}>
          
          {/* Левая панель */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ flex: 1, display: { xs: 'none', md: 'block' } }}
          >
            <Box sx={{ maxWidth: 500 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: 4,
                      background: `
                        linear-gradient(135deg, 
                          rgba(102, 126, 234, 0.9) 0%, 
                          rgba(168, 85, 247, 0.8) 100%
                        )
                      `,
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 20px 50px rgba(102, 126, 234, 0.4)',
                    }}
                  >
                    <Sparkles size={36} color="white" />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                        fontSize: '3.5rem',
                        lineHeight: 1,
                        mb: 0.5
                      }}
                    >
                      ITSM
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.9)',
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                      }}
                    >
                      Professional
                    </Typography>
                  </Box>
                </Box>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Typography 
                  variant="h4" 
                  sx={{ 
                    mb: 3,
                    fontWeight: 800,
                    color: 'rgba(255,255,255,0.95)',
                    textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    lineHeight: 1.3
                  }}
                >
                  Революционная платформа для управления IT-инфраструктурой
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 4,
                    color: 'rgba(255,255,255,0.85)',
                    lineHeight: 1.6,
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    fontWeight: 500
                  }}
                >
                  Объедините команды, автоматизируйте процессы и достигните максимальной эффективности с помощью передовых технологий искусственного интеллекта
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
                      whileHover={{ x: 15, transition: { duration: 0.3 } }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                        <Box
                          sx={{
                            width: 65,
                            height: 65,
                            borderRadius: 3,
                            background: `
                              linear-gradient(135deg, 
                                rgba(255,255,255,0.15) 0%, 
                                rgba(255,255,255,0.08) 100%
                              )
                            `,
                            backdropFilter: 'blur(40px)',
                            border: '2px solid rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              background: `
                                linear-gradient(135deg, 
                                  rgba(255,255,255,0.25) 0%, 
                                  rgba(255,255,255,0.15) 100%
                                )
                              `,
                              transform: 'translateY(-8px) scale(1.05)',
                              boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
                            }
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: 'white', 
                              fontWeight: 800, 
                              mb: 1,
                              textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: 'rgba(255,255,255,0.8)',
                              lineHeight: 1.6,
                              textShadow: '0 1px 4px rgba(0,0,0,0.2)'
                            }}
                          >
                            {feature.description}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Box>
          </motion.div>

          {/* Правая панель - Форма */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ flex: 1, maxWidth: { xs: '100%', md: 480 } }}
          >
            <GlassCard 
              sx={{ 
                p: 5, 
                backdropFilter: 'blur(50px)', 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))',
                border: '2px solid rgba(255,255,255,0.15)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                  }}
                >
                  Вход в систему
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '1.1rem' }}>
                  Добро пожаловать в будущее
                </Typography>
              </Box>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontWeight: 500 }}>
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  type="email"
                  label="Электронная почта"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={20} color={focusedField === 'email' ? '#667eea' : '#64748b'} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backdropFilter: 'blur(30px)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '1.1rem',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        boxShadow: '0 12px 35px rgba(102, 126, 234, 0.2)',
                      },
                      '&.Mui-focused': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 50px rgba(102, 126, 234, 0.3)',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderColor: '#667eea',
                      }
                    }
                  }}
                />

                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={20} color={focusedField === 'password' ? '#667eea' : '#64748b'} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ 
                            color: '#64748b',
                            '&:hover': { 
                              color: '#667eea',
                              transform: 'scale(1.2)' 
                            } 
                          }}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backdropFilter: 'blur(30px)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '1.1rem',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        boxShadow: '0 12px 35px rgba(102, 126, 234, 0.2)',
                      },
                      '&.Mui-focused': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 50px rgba(102, 126, 234, 0.3)',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderColor: '#667eea',
                      }
                    }
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={20} /> : <ArrowRight size={20} />}
                  sx={{
                    mt: 4,
                    mb: 3,
                    py: 3,
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 20px 50px rgba(102, 126, 234, 0.5)',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 30px 70px rgba(102, 126, 234, 0.7)',
                    },
                    '&:active': {
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background: 'rgba(0,0,0,0.12)',
                    }
                  }}
                >
                  {loading ? 'Авторизация...' : 'Войти в систему'}
                </Button>
              </Box>

              <Divider sx={{ my: 3, '&::before, &::after': { borderColor: 'rgba(255,255,255,0.2)' } }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.9rem' }}>
                  Демо-доступ
                </Typography>
              </Divider>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {testAccounts.map((account, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => fillTestAccount(account)}
                      sx={{
                        py: 2.5,
                        borderRadius: 3,
                        borderColor: 'rgba(255,255,255,0.2)',
                        color: 'text.primary',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(40px)',
                        fontWeight: 700,
                        fontSize: '1rem',
                        '&:hover': {
                          borderColor: account.color,
                          backgroundColor: `${account.color}20`,
                          transform: 'translateY(-4px)',
                          boxShadow: `0 15px 40px ${account.color}40`,
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%' }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: account.color,
                            boxShadow: `0 0 20px ${account.color}70`
                          }}
                        />
                        <Typography variant="body1" sx={{ fontWeight: 800, fontSize: '1rem' }}>
                          {account.role}
                        </Typography>
                        <Typography variant="caption" sx={{ marginLeft: 'auto', opacity: 0.8, fontWeight: 600 }}>
                          @{account.email.split('@')[0]}
                        </Typography>
                      </Box>
                    </Button>
                  </motion.div>
                ))}
              </Box>
            </GlassCard>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;