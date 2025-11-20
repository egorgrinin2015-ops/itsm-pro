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
  GlobalStyles
} from '@mui/material';
import {
  Plus,
  Grid3x3,
  List,
  TrendingUp,
  Clock,
  Users,
  Target,
  Sparkles
} from 'lucide-react';

// Принудительные глобальные стили для темного фона
const darkBackgroundStyles = (
  <GlobalStyles
    styles={{
      body: {
        background: 'linear-gradient(135deg, #000000 0%, #1a1a2e 20%, #16213e 40%, #0f172a 60%, #020617 80%, #000000 100%) !important',
        minHeight: '100vh !important',
      },
      '#root': {
        background: 'linear-gradient(135deg, #000000 0%, #1a1a2e 20%, #16213e 40%, #0f172a 60%, #020617 80%, #000000 100%) !important',
        minHeight: '100vh !important',
      },
      html: {
        background: '#000000 !important',
      }
    }}
  />
);

// Усиленный IT-фон
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

      {/* ЦВЕТНЫЕ АКЦЕНТЫ */}
      <Box
        sx={{
          position: 'absolute !important',
          top: '0 !important',
          left: '0 !important',
          right: '0 !important',
          bottom: '0 !important',
          background: `
            radial-gradient(ellipse at 15% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 40%),
            radial-gradient(ellipse at 85% 75%, rgba(139, 92, 246, 0.25) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 10%, rgba(34, 197, 94, 0.2) 0%, transparent 30%),
            radial-gradient(ellipse at 20% 90%, rgba(251, 191, 36, 0.15) 0%, transparent 25%)
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
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
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
  
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    status: [],
    priority: [],
    categoryId: [],
    dateRange: [0, 30]
  });

  useEffect(() => {
    fetchData();
  }, [filters, currentPage]);

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const getQuickStats = () => {
    const total = tickets.length;
    const newTickets = tickets.filter(t => t.status === 'new').length;
    const inProgress = tickets.filter(t => t.status === 'in_progress').length;
    const highPriority = tickets.filter(t => t.priority === 'high' || t.priority === 'critical').length;

    return { total, newTickets, inProgress, highPriority };
  };

  const quickStats = getQuickStats();

  // Компонент скелетона для загрузки
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
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              mb: 2 
            }}
          />
          <Skeleton
            variant="text"
            width="40%"
            height={24}
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              mb: 3
            }}
          />
          <Skeleton
            variant="rectangular"
            height={100}
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2
            }}
          />
        </Box>
      </GlassCard>
    </motion.div>
  );

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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                      width: 60,
                      height: 60,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(139, 92, 246, 0.8) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 15px 35px rgba(59, 130, 246, 0.4)'
                    }}
                  >
                    <Sparkles size={28} color="white" />
                  </Box>
                </motion.div>
                
                <Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 900,
                      color: '#ffffff !important',
                      textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 30px rgba(59, 130, 246, 0.5)',
                      mb: 1,
                      background: 'linear-gradient(135deg, #ffffff 0%, rgba(59, 130, 246, 0.9) 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    🎫 Система заявок
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                    }}
                  >
                    Управление и отслеживание обращений пользователей
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {/* Переключатель вида */}
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, newMode) => newMode && setViewMode(newMode)}
                  size="small"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    backdropFilter: 'blur(10px)',
                    '& .MuiToggleButton-root': {
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        color: 'white',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                      }
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

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<Plus />}
                    onClick={() => navigate('/tickets/create')}
                    sx={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 700,
                      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                        boxShadow: '0 15px 40px rgba(59, 130, 246, 0.6)',
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

        {/* Быстрая статистика */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { 
                title: 'Всего заявок', 
                value: quickStats.total, 
                color: '#3b82f6', 
                icon: Target,
                delay: 0 
              },
              { 
                title: 'Новые', 
                value: quickStats.newTickets, 
                color: '#10b981', 
                icon: Clock,
                delay: 0.1 
              },
              { 
                title: 'В работе', 
                value: quickStats.inProgress, 
                color: '#f59e0b', 
                icon: TrendingUp,
                delay: 0.2 
              },
              { 
                title: 'Приоритетные', 
                value: quickStats.highPriority, 
                color: '#ef4444', 
                icon: Users,
                delay: 0.3 
              }
            ].map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: stat.delay }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <GlassCard 
                    variant="colored" 
                    color={stat.color.includes('#3b82f6') ? 'blue' : 
                          stat.color.includes('#10b981') ? 'green' :
                          stat.color.includes('#f59e0b') ? 'yellow' : 'red'}
                    sx={{ p: 3, textAlign: 'center' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
                      <stat.icon size={24} color={stat.color} />
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 800, 
                          color: stat.color,
                          textShadow: `0 2px 8px ${stat.color}40`
                        }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: 600 
                      }}
                    >
                      {stat.title}
                    </Typography>
                  </GlassCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Фильтры */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <GlassCard variant="dark" sx={{ mb: 4 }}>
            <SearchFilters
              onFiltersChange={handleFiltersChange}
              categories={categories}
              initialFilters={filters}
            />
          </GlassCard>
        </motion.div>

        {/* Ошибки */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard variant="colored" color="red" sx={{ mb: 3, p: 2 }}>
              <Alert 
                severity="error" 
                sx={{ 
                  background: 'transparent',
                  color: 'white',
                  '& .MuiAlert-icon': {
                    color: '#ef4444'
                  }
                }}
              >
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
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <TicketSkeleton delay={index * 0.05} />
                </Grid>
              ))}
            </Grid>
          ) : tickets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard variant="dark" sx={{ p: 8, textAlign: 'center' }}>
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      mb: 3, 
                      fontSize: '4rem',
                      filter: 'grayscale(0.3)'
                    }}
                  >
                    🔍
                  </Typography>
                </motion.div>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 2, 
                    color: '#ffffff',
                    fontWeight: 700,
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                  }}
                >
                  Заявки не найдены
                </Typography>
                
                <Typography 
                  sx={{ 
                    mb: 4, 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '1.1rem'
                  }}
                >
                  Попробуйте изменить параметры поиска или создайте новую заявку
                </Typography>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<Plus />}
                    onClick={() => navigate('/tickets/create')}
                    sx={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      borderRadius: 3,
                      px: 4,
                      py: 2,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                        boxShadow: '0 15px 40px rgba(59, 130, 246, 0.6)',
                      }
                    }}
                  >
                    Создать заявку
                  </Button>
                </motion.div>
              </GlassCard>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Grid container spacing={3}>
                  {tickets.map((ticket, index) => (
                    <Grid 
                      item 
                      xs={12} 
                      sm={viewMode === 'grid' ? 6 : 12} 
                      md={viewMode === 'grid' ? 4 : 12}
                      lg={viewMode === 'grid' ? 3 : 12}
                      key={ticket.id}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 100 
                        }}
                      >
                        <TicketCard 
                          ticket={ticket} 
                          delay={index * 0.05}
                        />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </AnimatePresence>
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
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 2,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderColor: 'rgba(59, 130, 246, 0.5)',
                      },
                      '&.Mui-selected': {
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        color: 'white',
                        borderColor: 'transparent',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                        }
                      }
                    }
                  }}
                />
              </GlassCard>
            </Box>
          </motion.div>
        )}

        {/* Плавающая кнопка создания */}
        <Zoom in={!loading}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Fab
              sx={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  boxShadow: '0 15px 40px rgba(59, 130, 246, 0.6)',
                }
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
};

export default TicketList;