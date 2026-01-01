import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ticketService from '../services/ticketService';
import categoryService from '../services/categoryService';
import AnimatedPage from '../components/AnimatedPage';
import TicketCard from '../components/TicketCard';
import SearchFilters from '../components/SearchFilters';
import GlassCard from '../components/GlassCard';
import SlaBadge from '../components/SlaBadge';
import theme from '../theme/theme';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
  Skeleton,
  Fab,
  Zoom,
  GlobalStyles,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Plus,
  Grid3x3,
  List,
  TrendingUp,
  Clock,
  Users,
  Target,
  Sparkles,
  Send
} from 'lucide-react';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

// Глобальные стили с Space Indigo темой
const darkBackgroundStyles = (
  <GlobalStyles
    styles={{
      body: {
        background: `${theme.gradients.background} !important`,
        minHeight: '100vh !important',
      },
      '#root': {
        background: `${theme.gradients.background} !important`,
        minHeight: '100vh !important',
      },
      html: {
        background: `${theme.background.primary} !important`,
      }
    }}
  />
);

// IT-фон с новой палитрой
const ITBackground = () => {
  return (
    <Box
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
            radial-gradient(ellipse at 15% 25%, ${theme.primary.main}4D 0%, transparent 40%),
            radial-gradient(ellipse at 85% 75%, ${theme.primary.light}40 0%, transparent 40%),
            radial-gradient(ellipse at 50% 10%, ${theme.functional.success.main}33 0%, transparent 30%),
            radial-gradient(ellipse at 20% 90%, ${theme.functional.warning.main}26 0%, transparent 25%)
          `,
        }}
      />

      {/* ДВИЖУЩАЯСЯ СЕТКА */}
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
            linear-gradient(${theme.border.main} 1px, transparent 1px),
            linear-gradient(90deg, ${theme.border.main} 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none'
        }}
      />
    </Box>
  );
};

const TicketList = () => {
  const { user, isEngineer } = useAuth();
  const navigate = useNavigate();
  
  // Проверка роли - обычный пользователь
  const isRegularUser = user?.role === 'user';
  
  // Проверка роли инженера
  const isEngineerRole = user && ['engineer', 'engineer2', 'engineer3', 'engineer4', 'engineer5'].includes(user.role);
  
  // Функция для безопасного форматирования даты
  const formatDate = (dateString) => {
    if (!dateString) return 'Нет даты';
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  };
  
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('ticketsViewMode') || 'grid';
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [myTicketsOnly, setMyTicketsOnly] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: [],
    priority: [],
    categoryId: [],
    dateRange: [0, 30]
  });

  useEffect(() => {
    fetchData();
  }, [filters, currentPage, myTicketsOnly]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    localStorage.setItem('ticketsViewMode', viewMode);
  }, [viewMode]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data.categories);
    } catch (err) {
      console.error('Ошибка загрузки категорий');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        ...filters,
        status: filters.status.join(','),
        priority: filters.priority.join(','),
        categoryId: filters.categoryId.join(','),
        myTickets: myTicketsOnly,
        showClosed: 'false'
      };

      Object.keys(params).forEach(key => {
        if (!params[key] || params[key] === '') {
          delete params[key];
        }
      });

      const data = await ticketService.getTickets(params);
      setTickets(data.tickets || []);
      setTotalPages(data.pagination?.pages || 1);
      setError('');
    } catch (err) {
      setError('Ошибка загрузки заявок');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const getQuickStats = () => {
    const total = tickets.length;
    const newTickets = tickets.filter(t => t.status === 'new').length;
    const inProgress = tickets.filter(t => t.status === 'in_progress').length;
    const highPriority = tickets.filter(t => t.priority === 'high' || t.priority === 'critical').length;

    return { total, newTickets, inProgress, highPriority };
  };

  const quickStats = getQuickStats();

  // Компонент скелетона
  const TicketSkeleton = ({ delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <GlassCard variant="dark" delay={delay}>
        <Box sx={{ p: 3 }}>
          <Skeleton
            variant="text"
            width="70%"
            height={32}
            sx={{ 
              bgcolor: theme.background.elevated,
              mb: 2 
            }}
          />
          <Skeleton
            variant="text"
            width="40%"
            height={24}
            sx={{ 
              bgcolor: theme.background.elevated,
              mb: 3
            }}
          />
          <Skeleton
            variant="rectangular"
            height={100}
            sx={{ 
              bgcolor: theme.background.elevated,
              borderRadius: 2
            }}
          />
        </Box>
      </GlassCard>
    </motion.div>
  );

  // ========================================
  // УПРОЩЁННЫЙ ИНТЕРФЕЙС ДЛЯ ПОЛЬЗОВАТЕЛЯ
  // ========================================
  if (isRegularUser) {
    return (
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        {darkBackgroundStyles}
        <ITBackground />
        
        <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 10 }}>
          {/* Заголовок для пользователя */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <GlassCard variant="dark" sx={{ mb: 4, p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
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
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 20px 60px rgba(99, 102, 241, 0.4)'
                      }}
                    >
                      <Send size={32} color="white" />
                    </Box>
                  </motion.div>
                  
                  <Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 900,
                        color: '#ffffff',
                        textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 30px rgba(99, 102, 241, 0.5)',
                        mb: 1,
                        background: 'linear-gradient(135deg, #ffffff 0%, #6366f1 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      Мои заявки
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
                      Отслеживайте статус ваших обращений
                    </Typography>
                  </Box>
                </Box>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<Plus />}
                    onClick={() => navigate('/tickets/create')}
                    sx={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1rem',
                      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        boxShadow: '0 15px 40px rgba(99, 102, 241, 0.6)',
                      }
                    }}
                  >
                    Создать заявку
                  </Button>
                </motion.div>
              </Box>
            </GlassCard>
          </motion.div>

          {/* Краткая статистика для пользователя */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Grid container spacing={3} sx={{ maxWidth: '600px' }}>
                {[
                  { 
                    title: 'Всего заявок', 
                    value: quickStats.total, 
                    color: theme.functional.info.main, 
                    icon: Target
                  },
                  { 
                    title: 'В обработке', 
                    value: quickStats.newTickets + quickStats.inProgress, 
                    color: theme.functional.warning.main, 
                    icon: Clock
                  }
                ].map((stat, index) => (
                  <Grid size={{ xs: 6 }} key={index}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Box
                        sx={{
                          p: 3,
                          textAlign: 'center',
                          borderRadius: 3,
                          background: theme.background.secondary,
                          backdropFilter: 'blur(20px)',
                          border: `1px solid ${stat.color}40`,
                          boxShadow: `${theme.glass.dark.shadow}, 0 0 20px ${stat.color}33`,
                        }}
                      >
                        <Box sx={{ mb: 1.5 }}>
                          <stat.icon size={28} color={stat.color} />
                        </Box>
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            fontWeight: 800, 
                            color: theme.text.primary,
                            mb: 1
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ color: theme.text.secondary, fontWeight: 600 }}
                        >
                          {stat.title}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>

          {/* Ошибки */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <GlassCard variant="colored" color="red" sx={{ mb: 3, p: 2 }}>
                <Alert severity="error" sx={{ background: 'transparent', color: theme.text.primary }}>
                  {error}
                </Alert>
              </GlassCard>
            </motion.div>
          )}

          {/* Список заявок пользователя */}
          <Box sx={{ minHeight: 400 }}>
            {loading ? (
              <Grid container spacing={3}>
                {[...Array(6)].map((_, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <TicketSkeleton delay={index * 0.05} />
                  </Grid>
                ))}
              </Grid>
            ) : tickets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <GlassCard variant="dark" sx={{ p: 8, textAlign: 'center' }}>
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Typography variant="h1" sx={{ mb: 3, fontSize: '4rem' }}>
                      📭
                    </Typography>
                  </motion.div>
                  
                  <Typography 
                    variant="h5" 
                    sx={{ mb: 2, color: theme.text.primary, fontWeight: 700 }}
                  >
                    У вас пока нет заявок
                  </Typography>
                  
                  <Typography sx={{ mb: 4, color: theme.text.secondary, fontSize: '1.1rem' }}>
                    Создайте первую заявку, чтобы получить помощь от технической поддержки
                  </Typography>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="contained"
                      startIcon={<Plus />}
                      onClick={() => navigate('/tickets/create')}
                      sx={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        borderRadius: 3,
                        px: 4,
                        py: 2,
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                      }}
                    >
                      Создать заявку
                    </Button>
                  </motion.div>
                </GlassCard>
              </motion.div>
            ) : (
              <Grid container spacing={3}>
                {tickets.map((ticket, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={ticket.id}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <TicketCard ticket={ticket} delay={index * 0.05} />
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          {/* Пагинация */}
          {!loading && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <GlassCard variant="dark" sx={{ p: 2 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: theme.text.secondary,
                        '&.Mui-selected': {
                          background: theme.gradients.primary,
                          color: theme.text.primary,
                        }
                      }
                    }}
                  />
                </GlassCard>
              </Box>
            </motion.div>
          )}

          {/* Плавающая кнопка */}
          <Zoom in={!loading}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Fab
                sx={{
                  position: 'fixed',
                  bottom: 32,
                  right: 32,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                }}
                onClick={() => navigate('/tickets/create')}
              >
                <Plus size={28} color="white" />
              </Fab>
            </motion.div>
          </Zoom>
        </Container>
      </Box>
    );
  }

  // ========================================
  // ПОЛНЫЙ ИНТЕРФЕЙС ДЛЯ ИНЖЕНЕРОВ/МЕНЕДЖЕРОВ
  // ========================================
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {darkBackgroundStyles}
      <ITBackground />
      
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 10 }}>
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <GlassCard variant="dark" sx={{ mb: 4, p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
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
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 20px 60px rgba(6, 182, 212, 0.4)'
                    }}
                  >
                    <Sparkles size={32} color="white" />
                  </Box>
                </motion.div>
                
                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      color: '#ffffff',
                      textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 30px rgba(6, 182, 212, 0.5)',
                      mb: 1,
                      background: 'linear-gradient(135deg, #ffffff 0%, #06b6d4 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Система заявок
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
                    Управление и отслеживание обращений пользователей
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {/* Переключатель вида */}
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={handleViewModeChange}
                  size="small"
                  sx={{
                    background: theme.background.elevated,
                    borderRadius: 3,
                    '& .MuiToggleButton-root': {
                      border: 'none',
                      color: theme.text.secondary,
                      px: 2,
                      '&.Mui-selected': {
                        backgroundColor: theme.primary.main,
                        color: theme.text.primary,
                      },
                    }
                  }}
                >
                  <ToggleButton value="grid">
                    <Grid3x3 size={20} />
                  </ToggleButton>
                  <ToggleButton value="list">
                    <List size={20} />
                  </ToggleButton>
                </ToggleButtonGroup>

                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    startIcon={<Plus />}
                    onClick={() => navigate('/tickets/create')}
                    sx={{
                      background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1rem',
                      boxShadow: '0 8px 25px rgba(6, 182, 212, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
                      }
                    }}
                  >
                    Создать заявку
                  </Button>
                </motion.div>
              </Box>
            </Box>
          </GlassCard>
        </motion.div>

        {/* ПЕРЕКЛЮЧАТЕЛЬ "МОИ ЗАЯВКИ" - ТОЛЬКО ДЛЯ ИНЖЕНЕРОВ */}
        {isEngineerRole && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <GlassCard variant="dark" sx={{ mb: 3, p: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={myTicketsOnly}
                    onChange={(e) => {
                      setMyTicketsOnly(e.target.checked);
                      setCurrentPage(1);
                    }}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: theme.primary.main,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: theme.primary.main,
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <AssignmentIndIcon sx={{ color: theme.primary.main, fontSize: 28 }} />
                    <Box>
                      <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem' }}>
                        Только мои заявки
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.text.secondary, fontSize: '0.85rem' }}>
                        Показать заявки, назначенные на меня
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </GlassCard>
          </motion.div>
        )}

        {/* Быстрая статистика */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Grid container spacing={3} sx={{ maxWidth: '1000px' }}>
              {[
                { title: 'Всего заявок', value: quickStats.total, color: theme.functional.info.main, icon: Target, delay: 0 },
                { title: 'Новые', value: quickStats.newTickets, color: theme.functional.success.main, icon: Clock, delay: 0.1 },
                { title: 'В работе', value: quickStats.inProgress, color: theme.functional.warning.main, icon: TrendingUp, delay: 0.2 },
                { title: 'Приоритет', value: quickStats.highPriority, color: theme.functional.error.main, icon: Users, delay: 0.3 }
              ].map((stat, index) => (
                <Grid size={{ xs: 6, sm: 3 }} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: stat.delay }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Box
                      sx={{
                        p: 2.5,
                        textAlign: 'center',
                        borderRadius: 3,
                        background: theme.background.secondary,
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${stat.color}40`,
                        boxShadow: `${theme.glass.dark.shadow}, 0 0 20px ${stat.color}33`,
                        minHeight: '140px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box sx={{ mb: 1.5 }}>
                        <stat.icon size={28} color={stat.color} />
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: theme.text.primary, mb: 1 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.text.secondary, fontWeight: 600 }}>
                        {stat.title}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        {/* Фильтры */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <SearchFilters
            onFiltersChange={handleFiltersChange}
            categories={categories}
            initialFilters={filters}
          />
        </motion.div>

        {/* Ошибки */}
        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <GlassCard variant="colored" color="red" sx={{ mb: 3, p: 2 }}>
              <Alert severity="error" sx={{ background: 'transparent', color: theme.text.primary }}>
                {error}
              </Alert>
            </GlassCard>
          </motion.div>
        )}

        {/* Заявки */}
        <Box sx={{ minHeight: 400 }}>
          {loading ? (
            <Grid container spacing={3}>
              {[...Array(12)].map((_, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                  <TicketSkeleton delay={index * 0.05} />
                </Grid>
              ))}
            </Grid>
          ) : tickets.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <GlassCard variant="dark" sx={{ p: 8, textAlign: 'center' }}>
                <Typography variant="h1" sx={{ mb: 3, fontSize: '4rem' }}>🔍</Typography>
                <Typography variant="h5" sx={{ mb: 2, color: theme.text.primary, fontWeight: 700 }}>
                  {myTicketsOnly ? 'У вас нет назначенных заявок' : 'Заявки не найдены'}
                </Typography>
                <Typography sx={{ mb: 4, color: theme.text.secondary }}>
                  {myTicketsOnly 
                    ? 'Попробуйте отключить фильтр "Только мои заявки".'
                    : 'Попробуйте изменить параметры поиска'
                  }
                </Typography>
              </GlassCard>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {viewMode === 'grid' ? (
                  <Grid container spacing={3}>
                    {tickets.map((ticket, index) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={ticket.id}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                          <TicketCard ticket={ticket} delay={index * 0.05} />
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {tickets.map((ticket, index) => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.03 }}
                      >
                        <GlassCard 
                          variant="dark"
                          sx={{ 
                            cursor: 'pointer',
                            '&:hover': { transform: 'translateX(8px)' }
                          }}
                          onClick={() => navigate(`/tickets/${ticket.id}`)}
                        >
                          <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                            <Box sx={{ minWidth: 80, px: 2, py: 1, borderRadius: 2, background: theme.functional.info.bg, textAlign: 'center' }}>
                              <Typography variant="h6" sx={{ fontWeight: 800, color: theme.functional.info.main, fontSize: '0.9rem' }}>
                                #{ticket.id}
                              </Typography>
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 250 }}>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.text.primary, mb: 0.5, fontSize: '1rem' }}>
                                {ticket.title}
                              </Typography>
                              <Typography variant="body2" sx={{ color: theme.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '500px' }}>
                                {ticket.description}
                              </Typography>
                            </Box>
                            <SlaBadge slaStatus={ticket.slaStatus} slaDeadline={ticket.slaDeadline} />
                            <Box sx={{ minWidth: 150 }}>
                              <Typography variant="caption" sx={{ color: theme.text.disabled }}>
                                {formatDate(ticket.createdAt)}
                              </Typography>
                            </Box>
                          </Box>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </Box>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </Box>

        {/* Пагинация */}
        {!loading && totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <GlassCard variant="dark" sx={{ p: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: theme.text.secondary,
                    '&.Mui-selected': {
                      background: theme.gradients.primary,
                      color: theme.text.primary,
                    }
                  }
                }}
              />
            </GlassCard>
          </Box>
        )}

        {/* Плавающая кнопка */}
        <Zoom in={!loading}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Fab
              sx={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                background: theme.gradients.primary,
                boxShadow: `0 8px 25px ${theme.primary.main}66`,
              }}
              onClick={() => navigate('/tickets/create')}
            >
              <Plus size={28} color={theme.text.primary} />
            </Fab>
          </motion.div>
        </Zoom>
      </Container>
    </Box>
  );
};

export default TicketList;