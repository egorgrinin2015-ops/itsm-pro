import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import theme from '../theme/theme';
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
  Ticket,
  Clock,
  CheckCircle
} from 'lucide-react';

// Глобальные стили с Space Indigo палитрой
const forceBackgroundStyles = (
  <GlobalStyles
    styles={{
      '#root': {
        background: `${theme.gradients.background} !important`,
        minHeight: '100vh !important',
      },
      body: {
        background: `${theme.gradients.background} !important`,
        minHeight: '100vh !important',
      },
      html: {
        background: `${theme.background.primary} !important`,
      }
    }}
  />
);

// IT-фон с Space Indigo элементами
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
        {/* ОСНОВНОЙ ФОН */}
        <Box
          sx={{
            position: 'absolute !important',
            top: '0 !important',
            left: '0 !important',
            right: '0 !important',
            bottom: '0 !important',
            width: '100% !important',
            height: '100% !important',
            background: theme.gradients.background,
          }}
        />

        {/* ЦВЕТНЫЕ АКЦЕНТЫ */}
        <Box
          sx={{
            position: 'absolute !important',
            top: '0 !important',
            left: '0 !important',
            right: '0 !important',
            bottom: '0 !important',
            background: `
              radial-gradient(ellipse at 15% 25%, ${theme.primary.main}80 0%, transparent 40%),
              radial-gradient(ellipse at 85% 75%, ${theme.primary.light}70 0%, transparent 40%),
              radial-gradient(ellipse at 50% 10%, ${theme.functional.success.main}66 0%, transparent 30%),
              radial-gradient(ellipse at 20% 90%, ${theme.functional.warning.main}59 0%, transparent 25%)
            `,
          }}
        />

        {/* ДВИЖУЩАЯСЯ СЕТКА */}
        <Box
          sx={{
            position: 'absolute !important',
            top: '0 !important',
            left: '0 !important',
            right: '0 !important',
            bottom: '0 !important',
            backgroundImage: `
              linear-gradient(${theme.border.main} 1px, transparent 1px),
              linear-gradient(90deg, ${theme.border.main} 1px, transparent 1px)
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
              linear-gradient(${theme.border.light} 1px, transparent 1px),
              linear-gradient(90deg, ${theme.border.light} 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            pointerEvents: 'none'
          }}
        />

        {/* БОЛЬШИЕ СВЕТЯЩИЕСЯ ЭЛЕМЕНТЫ */}
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
            background: `conic-gradient(from 0deg, ${theme.primary.main}E6, ${theme.primary.light}B3, ${theme.functional.success.main}CC, ${theme.functional.warning.main}99, ${theme.primary.main}E6)`,
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
            background: `radial-gradient(circle, ${theme.functional.success.main}CC 0%, ${theme.functional.warning.main}99 50%, ${theme.primary.main}80 100%)`,
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
            background: `linear-gradient(45deg, ${theme.primary.main}B3, ${theme.primary.light}99, ${theme.functional.success.main}80)`,
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
            background: `conic-gradient(from 180deg, ${theme.functional.warning.main}B3, ${theme.functional.error.main}80, ${theme.functional.warning.main}B3)`,
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
            background: `radial-gradient(ellipse, ${theme.primary.main}99 0%, ${theme.functional.info.main}66 70%, transparent 100%)`,
            borderRadius: '50%',
            filter: 'blur(90px)',
            pointerEvents: 'none'
          }}
        />

        {/* АНИМИРОВАННЫЕ ЛИНИИ */}
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
              <stop offset="0%" style={{ stopColor: theme.primary.main, stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: theme.primary.light, stopOpacity: 0.9 }} />
              <stop offset="100%" style={{ stopColor: theme.functional.success.main, stopOpacity: 0.8 }} />
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
            stroke={theme.functional.warning.main}
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
            stroke={`${theme.primary.main}E6`}
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

  // ОБНОВЛЁННЫЕ FEATURES - соответствуют ITSM системе
  const features = [
    {
      icon: <Ticket size={24} />,
      title: 'Управление заявками',
      description: 'Создание, отслеживание и обработка обращений пользователей'
    },
    {
      icon: <Clock size={24} />,
      title: 'Контроль SLA',
      description: 'Мониторинг сроков выполнения и соблюдение регламентов'
    },
    {
      icon: <CheckCircle size={24} />,
      title: 'Аналитика и отчёты',
      description: 'Статистика по заявкам, исполнителям и категориям услуг'
    }
  ];

  // ОБНОВЛЁННЫЕ ТЕСТОВЫЕ АККАУНТЫ - добавлены все инженеры
  const testAccounts = [
    { email: 'admin@itsm.com', password: 'admin123', role: 'Менеджер', color: theme.functional.warning.main },
    { email: 'engineer@itsm.com', password: 'engineer123', role: 'Инженер 1', color: theme.functional.success.main },
    { email: 'engineer2@itsm.com', password: 'engineer123', role: 'Инженер 2', color: theme.functional.success.main },
    { email: 'engineer3@itsm.com', password: 'engineer123', role: 'Инженер 3', color: theme.functional.success.main },
    { email: 'engineer4@itsm.com', password: 'engineer123', role: 'Инженер 4', color: theme.functional.success.main },
    { email: 'engineer5@itsm.com', password: 'engineer123', role: 'Инженер 5', color: theme.functional.success.main },
    { email: 'user@itsm.com', password: 'user123', role: 'Пользователь', color: theme.functional.info.main }
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
        background: `${theme.gradients.background} !important`
      }}
    >
      {/* IT-ФОН */}
      <ITBackground />
      
      <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4, position: 'relative', zIndex: 10 }}>
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
                        background: theme.gradients.primary,
                        backdropFilter: 'blur(20px)',
                        border: `2px solid ${theme.border.main}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 20px 50px ${theme.primary.main}99`,
                      }}
                    >
                      <Sparkles size={36} color={theme.text.primary} />
                    </Box>
                  </motion.div>
                  <Box>
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        fontWeight: '900 !important',
                        color: `${theme.text.primary} !important`,
                        textShadow: `0 4px 20px rgba(0,0,0,1), 0 0 40px ${theme.primary.main}CC !important`,
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
                        color: `${theme.text.primary} !important`,
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
                {/* ОБНОВЛЁННЫЙ ЗАГОЛОВОК */}
                <Typography 
                  variant="h4" 
                  sx={{ 
                    mb: '3rem !important',
                    fontWeight: '800 !important',
                    color: `${theme.text.primary} !important`,
                    textShadow: `0 4px 20px rgba(0,0,0,1), 0 0 30px ${theme.primary.main}CC !important`,
                    lineHeight: '1.3 !important'
                  }}
                >
                  Автоматизированная система управления ИТ-услугами
                </Typography>
                
                {/* ОБНОВЛЁННЫЙ ПОДЗАГОЛОВОК - без эмодзи солнца */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: '4rem !important',
                    color: `${theme.text.primary} !important`,
                    lineHeight: '1.6 !important',
                    textShadow: '0 2px 10px rgba(0,0,0,1) !important',
                    fontWeight: '500 !important'
                  }}
                >
                  Централизованная обработка заявок, контроль сроков выполнения и прозрачная отчётность для эффективной работы службы технической поддержки
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
                            background: `linear-gradient(135deg, ${theme.background.elevated}CC 0%, ${theme.background.secondary}99 100%)`,
                            backdropFilter: 'blur(40px)',
                            border: `2px solid ${theme.border.main}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: theme.text.primary,
                            boxShadow: theme.glass.dark.shadow,
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              background: `linear-gradient(135deg, ${theme.primary.main}4D 0%, ${theme.background.elevated}CC 100%)`,
                              transform: 'translateY(-8px) scale(1.05)',
                              boxShadow: `0 25px 60px ${theme.primary.main}66`
                            }
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: theme.text.primary, 
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
                              color: theme.text.secondary,
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
                background: `linear-gradient(135deg, ${theme.background.elevated}99, ${theme.background.secondary}CC)`,
                border: `2px solid ${theme.border.main}`,
                boxShadow: theme.glass.dark.shadow
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  {/* ОБНОВЛЁННЫЙ ЗАГОЛОВОК - более контрастный */}
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: '900 !important',
                      color: '#ffffff !important',
                      textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 0 30px rgba(139, 92, 246, 0.5) !important',
                      mb: 1,
                      fontSize: '2rem'
                    }}
                  >
                    Вход в систему
                  </Typography>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  {/* ОБНОВЛЁННЫЙ ТЕКСТ - без эмодзи солнца */}
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: `${theme.text.primary} !important`, 
                      fontWeight: 500, 
                      fontSize: '1.1rem',
                      textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                    }}
                  >
                    Добро пожаловать в ITSM Pro
                  </Typography>
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
                        <Mail size={20} color={focusedField === 'email' ? theme.functional.info.main : theme.text.primary} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: { color: theme.text.primary }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backdropFilter: 'blur(30px)',
                      backgroundColor: `${theme.background.elevated}33`,
                      border: `1px solid ${theme.border.main}`,
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '1.1rem',
                      color: `${theme.text.primary} !important`,
                      '& input': {
                        color: `${theme.text.primary} !important`,
                      },
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        backgroundColor: `${theme.background.elevated}4D`,
                        boxShadow: `0 12px 35px ${theme.functional.info.main}33`,
                      },
                      '&.Mui-focused': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 20px 50px ${theme.functional.info.main}4D`,
                        backgroundColor: `${theme.background.elevated}66`,
                        borderColor: theme.functional.info.main,
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: `${theme.text.primary} !important`,
                      '&.Mui-focused': {
                        color: `${theme.functional.info.main} !important`
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
                        <Lock size={20} color={focusedField === 'password' ? theme.functional.info.main : theme.text.primary} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ 
                            color: theme.text.primary,
                            '&:hover': { 
                              color: theme.functional.info.main,
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
                    style: { color: theme.text.primary }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backdropFilter: 'blur(30px)',
                      backgroundColor: `${theme.background.elevated}33`,
                      border: `1px solid ${theme.border.main}`,
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '1.1rem',
                      color: `${theme.text.primary} !important`,
                      '& input': {
                        color: `${theme.text.primary} !important`,
                      },
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        backgroundColor: `${theme.background.elevated}4D`,
                        boxShadow: `0 12px 35px ${theme.functional.info.main}33`,
                      },
                      '&.Mui-focused': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 20px 50px ${theme.functional.info.main}4D`,
                        backgroundColor: `${theme.background.elevated}66`,
                        borderColor: theme.functional.info.main,
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: `${theme.text.primary} !important`,
                      '&.Mui-focused': {
                        color: `${theme.functional.info.main} !important`
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
                    background: theme.gradients.primary,
                    boxShadow: `0 20px 50px ${theme.primary.main}80`,
                    textTransform: 'none',
                    '&:hover': {
  background: `linear-gradient(135deg, ${theme.primary.dark} 0%, ${theme.primary.main} 100%)`,
  transform: 'translateY(-4px)',
  boxShadow: `0 30px 70px ${theme.primary.main}B3`,
  border: `2px solid ${theme.text.primary}`,
},
                    '&:active': {
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background: `${theme.background.secondary}80`,
                    }
                  }}
                >
                  {loading ? 'Авторизация...' : 'Войти в систему'}
                </Button>
              </Box>

              <Divider sx={{ my: 3, '&::before, &::after': { borderColor: theme.border.main } }}>
                <Typography variant="body2" sx={{ color: theme.text.secondary, fontWeight: 700, fontSize: '0.9rem' }}>
                  Демо-доступ
                </Typography>
              </Divider>

              {/* ОБНОВЛЁННЫЙ СПИСОК АККАУНТОВ - добавлены все инженеры */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: 280, overflowY: 'auto' }}>
                {testAccounts.map((account, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => fillTestAccount(account)}
                      sx={{
                        py: 1.5,
                        borderRadius: 3,
                        borderColor: theme.border.main,
                        color: theme.text.primary,
                        backgroundColor: `${theme.background.elevated}33`,
                        backdropFilter: 'blur(40px)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        '&:hover': {
                          borderColor: account.color,
                          backgroundColor: `${account.color}33`,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 10px 30px ${account.color}50`,
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: account.color,
                            boxShadow: `0 0 15px ${account.color}B3`
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                          {account.role}
                        </Typography>
                        <Typography variant="caption" sx={{ marginLeft: 'auto', opacity: 0.8, fontWeight: 600, fontSize: '0.75rem' }}>
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