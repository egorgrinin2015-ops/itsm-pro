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
  CircularProgress,
  GlobalStyles
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

// Принудительные глобальные стили
const forceBackgroundStyles = (
  <GlobalStyles
    styles={{
      '#root': {
        background: 'linear-gradient(135deg, #000000 0%, #1a1a2e 20%, #16213e 40%, #0f172a 60%, #020617 80%, #000000 100%) !important',
        minHeight: '100vh !important',
      },
      body: {
        background: 'linear-gradient(135deg, #000000 0%, #1a1a2e 20%, #16213e 40%, #0f172a 60%, #020617 80%, #000000 100%) !important',
        minHeight: '100vh !important',
      },
      html: {
        background: '#000000 !important',
      }
    }}
  />
);

// Усиленный IT-фон с яркими элементами
const ITBackground = () => {
  return (
    <>
      {forceBackgroundStyles}
      <Box
        id="it-background"
        sx={{
          position: 'fixed !important',
          top: '0 !important',
          left: '0 !important',
          right: '0 !important',
          bottom: '0 !important',
          width: '100vw !important',
          height: '100vh !important',
          overflow: 'hidden !important',
          zIndex: '-999 !important',
        }}
      >
        {/* ТЕМНЫЙ ФОН */}
        <Box
          sx={{
            position: 'absolute !important',
            top: '0 !important',
            left: '0 !important',
            right: '0 !important',
            bottom: '0 !important',
            width: '100% !important',
            height: '100% !important',
            background: `
              linear-gradient(135deg, 
                #000000 0%,
                #1a1a2e 20%,
                #16213e 40%,
                #0f172a 60%,
                #020617 80%,
                #000000 100%
              ) !important
            `,
          }}
        />

        {/* ЯРКИЕ ЦВЕТНЫЕ АКЦЕНТЫ */}
        <Box
          sx={{
            position: 'absolute !important',
            top: '0 !important',
            left: '0 !important',
            right: '0 !important',
            bottom: '0 !important',
            background: `
              radial-gradient(ellipse at 15% 25%, rgba(59, 130, 246, 0.5) 0%, transparent 40%),
              radial-gradient(ellipse at 85% 75%, rgba(139, 92, 246, 0.45) 0%, transparent 40%),
              radial-gradient(ellipse at 50% 10%, rgba(34, 197, 94, 0.4) 0%, transparent 30%),
              radial-gradient(ellipse at 20% 90%, rgba(251, 191, 36, 0.35) 0%, transparent 25%)
            `,
          }}
        />

        {/* ДВИЖУЩАЯСЯ СЕТКА - БОЛЕЕ ЯРКАЯ */}
        <Box
          sx={{
            position: 'absolute !important',
            top: '0 !important',
            left: '0 !important',
            right: '0 !important',
            bottom: '0 !important',
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* ДОПОЛНИТЕЛЬНАЯ СЕТКА С АНИМАЦИЕЙ */}
        <motion.div
          animate={{
            x: [0, 40],
            y: [0, 40]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            pointerEvents: 'none'
          }}
        />

        {/* БОЛЬШИЕ ЯРКИЕ СВЕТЯЩИЕСЯ ЭЛЕМЕНТЫ */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.5, 0.8],
            opacity: [0.4, 0.9, 0.4]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            top: '5%',
            right: '5%',
            width: '500px',
            height: '500px',
            background: 'conic-gradient(from 0deg, rgba(59, 130, 246, 0.9), rgba(139, 92, 246, 0.7), rgba(34, 197, 94, 0.8), rgba(251, 191, 36, 0.6), rgba(59, 130, 246, 0.9))',
            borderRadius: '50%',
            filter: 'blur(80px)',
            pointerEvents: 'none'
          }}
        />

        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 0.5, 2, 1],
            opacity: [0.5, 1, 0.5],
            x: [0, 100, -100, 0],
            y: [0, -50, 50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '0%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.8) 0%, rgba(251, 191, 36, 0.6) 50%, rgba(139, 92, 246, 0.5) 100%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            pointerEvents: 'none'
          }}
        />

        <motion.div
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.3, 0.8, 0.3],
            x: [0, -80, 80, 0],
            y: [0, 60, -60, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '300px',
            background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.7), rgba(139, 92, 246, 0.6), rgba(34, 197, 94, 0.5))',
            borderRadius: '50%',
            filter: 'blur(100px)',
            pointerEvents: 'none'
          }}
        />

        <motion.div
          animate={{
            rotate: [0, -360],
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            top: '20%',
            left: '15%',
            width: '300px',
            height: '300px',
            background: 'conic-gradient(from 180deg, rgba(251, 191, 36, 0.7), rgba(239, 68, 68, 0.5), rgba(251, 191, 36, 0.7))',
            borderRadius: '50%',
            filter: 'blur(70px)',
            pointerEvents: 'none'
          }}
        />

        <motion.div
          animate={{
            scale: [1, 2, 1],
            opacity: [0.15, 0.5, 0.15],
            x: [0, 50, -50, 0],
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            bottom: '30%',
            right: '20%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(ellipse, rgba(168, 85, 247, 0.6) 0%, rgba(59, 130, 246, 0.4) 70%, transparent 100%)',
            borderRadius: '50%',
            filter: 'blur(90px)',
            pointerEvents: 'none'
          }}
        />

        {/* АНИМИРОВАННЫЕ ДИАГОНАЛЬНЫЕ ЛИНИИ - БОЛЕЕ ЯРКИЕ */}
        <svg
          width="100%"
          height="100%"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: -1
          }}
        >
          <defs>
            <linearGradient id="brightLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgba(59, 130, 246, 1)', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: 'rgba(139, 92, 246, 0.9)', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: 'rgba(34, 197, 94, 0.8)', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          
          <motion.line
            x1="0%" y1="15%" x2="100%" y2="25%"
            stroke="url(#brightLineGradient)"
            strokeWidth="6"
            strokeDasharray="20 40"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0], 
              opacity: [0, 1, 0],
              strokeDashoffset: [0, -150]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <motion.line
            x1="0%" y1="75%" x2="100%" y2="85%"
            stroke="rgba(251, 191, 36, 1)"
            strokeWidth="4"
            strokeDasharray="12 30"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0], 
              opacity: [0, 0.9, 0],
              strokeDashoffset: [0, -90]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              delay: 2,
              ease: "easeInOut"
            }}
          />

          <motion.line
            x1="0%" y1="45%" x2="100%" y2="55%"
            stroke="rgba(139, 92, 246, 0.9)"
            strokeWidth="3"
            strokeDasharray="8 20"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0], 
              opacity: [0, 0.8, 0],
              strokeDashoffset: [0, -60]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              delay: 4,
              ease: "easeInOut"
            }}
          />
        </svg>
      </Box>
    </>
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
      setError(err.message || err.response?.data?.message || 'Ошибка входа');
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
    <Box 
      sx={{ 
        minHeight: '100vh !important', 
        position: 'relative !important', 
        overflow: 'hidden !important',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a2e 20%, #16213e 40%, #0f172a 60%, #020617 80%, #000000 100%) !important'
      }}
    >
      {/* ЯРКИЙ IT-ФОН */}
      <ITBackground />
      
      <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4, position: 'relative', zIndex: 10 }}>
        <Box sx={{ width: '100%', display: 'flex', gap: 4, alignItems: 'center' }}>
          
          {/* Левая панель - УЛУЧШЕННАЯ ВИДИМОСТЬ ТЕКСТА */}
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
                        width: 70,
                        height: 70,
                        borderRadius: 4,
                        background: `
                          linear-gradient(135deg, 
                            rgba(59, 130, 246, 0.9) 0%, 
                            rgba(139, 92, 246, 0.8) 100%
                          )
                        `,
                        backdropFilter: 'blur(20px)',
                        border: '2px solid rgba(255,255,255,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 20px 50px rgba(59, 130, 246, 0.6)',
                      }}
                    >
                      <Sparkles size={36} color="white" />
                    </Box>
                  </motion.div>
                  <Box>
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        fontWeight: '900 !important',
                        color: '#ffffff !important',
                        textShadow: '0 4px 20px rgba(0,0,0,1), 0 0 40px rgba(59, 130, 246, 0.8) !important',
                        fontSize: '3.5rem !important',
                        lineHeight: '1 !important',
                        mb: '0.5rem !important'
                      }}
                    >
                      ITSM
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: '700 !important',
                        color: '#ffffff !important',
                        textShadow: '0 2px 10px rgba(0,0,0,1) !important',
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
                    mb: '3rem !important',
                    fontWeight: '800 !important',
                    color: '#ffffff !important',
                    textShadow: '0 4px 20px rgba(0,0,0,1), 0 0 30px rgba(59, 130, 246, 0.8) !important',
                    lineHeight: '1.3 !important'
                  }}
                >
                  🚀 Интеллектуальная платформа управления IT-сервисами
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: '4rem !important',
                    color: '#ffffff !important',
                    lineHeight: '1.6 !important',
                    textShadow: '0 2px 10px rgba(0,0,0,1) !important',
                    fontWeight: '500 !important'
                  }}
                >
                  💻 Автоматизируйте процессы, повышайте эффективность команды и обеспечивайте непрерывность бизнеса с помощью современных инструментов мониторинга и аналитики
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
                                rgba(255,255,255,0.2) 0%, 
                                rgba(255,255,255,0.1) 100%
                              )
                            `,
                            backdropFilter: 'blur(40px)',
                            border: '2px solid rgba(255,255,255,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              background: `
                                linear-gradient(135deg, 
                                  rgba(255,255,255,0.3) 0%, 
                                  rgba(255,255,255,0.2) 100%
                                )
                              `,
                              transform: 'translateY(-8px) scale(1.05)',
                              boxShadow: '0 25px 60px rgba(0,0,0,0.4)'
                            }
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#ffffff', 
                              fontWeight: 800, 
                              mb: 1,
                              textShadow: '0 2px 8px rgba(0,0,0,0.6)'
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: 'rgba(255,255,255,0.85)',
                              lineHeight: 1.6,
                              textShadow: '0 1px 4px rgba(0,0,0,0.4)'
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
                border: '2px solid rgba(255,255,255,0.2)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <motion.div
                    animate={{
                      textShadow: [
                        '0 2px 4px rgba(59, 130, 246, 0.3)',
                        '0 4px 8px rgba(139, 92, 246, 0.4)',
                        '0 2px 4px rgba(59, 130, 246, 0.3)'
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: '900 !important',
                        color: '#ffffff !important',
                        textShadow: '0 2px 4px rgba(59, 130, 246, 0.3), 0 0 20px rgba(255,255,255,0.1) !important',
                        mb: 1,
                        background: 'linear-gradient(135deg, #ffffff 0%, rgba(59, 130, 246, 0.9) 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                      }}
                    >
                      Вход в систему
                    </Typography>
                  </motion.div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.02, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#ffffff !important', 
                        fontWeight: 500, 
                        fontSize: '1.1rem',
                        textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                      }}
                    >
                      🌟 Добро пожаловать в цифровое будущее
                    </Typography>
                  </motion.div>
                </motion.div>
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
                        <Mail size={20} color={focusedField === 'email' ? '#3b82f6' : '#ffffff'} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: { color: '#ffffff' }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backdropFilter: 'blur(30px)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '1.1rem',
                      color: '#ffffff !important',
                      '& input': {
                        color: '#ffffff !important',
                      },
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        boxShadow: '0 12px 35px rgba(59, 130, 246, 0.2)',
                      },
                      '&.Mui-focused': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 50px rgba(59, 130, 246, 0.3)',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderColor: '#3b82f6',
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: '#ffffff !important',
                      '&.Mui-focused': {
                        color: '#3b82f6 !important'
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
                        <Lock size={20} color={focusedField === 'password' ? '#3b82f6' : '#ffffff'} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ 
                            color: '#ffffff',
                            '&:hover': { 
                              color: '#3b82f6',
                              transform: 'scale(1.2)' 
                            } 
                          }}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: { color: '#ffffff' }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backdropFilter: 'blur(30px)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '1.1rem',
                      color: '#ffffff !important',
                      '& input': {
                        color: '#ffffff !important',
                      },
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        boxShadow: '0 12px 35px rgba(59, 130, 246, 0.2)',
                      },
                      '&.Mui-focused': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 50px rgba(59, 130, 246, 0.3)',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderColor: '#3b82f6',
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: '#ffffff !important',
                      '&.Mui-focused': {
                        color: '#3b82f6 !important'
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
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    boxShadow: '0 20px 50px rgba(59, 130, 246, 0.5)',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 30px 70px rgba(59, 130, 246, 0.7)',
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