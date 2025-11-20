import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ticketService from '../services/ticketService';
import categoryService from '../services/categoryService';
import AnimatedPage from '../components/AnimatedPage';
import TicketCard from '../components/TicketCard';
import SearchFilters from '../components/SearchFilters';
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
  Zoom
} from '@mui/material';
import {
  Plus,
  Grid3x3,
  List,
  TrendingUp,
  Clock,
  Users,
  Target
} from 'lucide-react';

const TicketList = () => {
  const { user, isEngineer } = useAuth();
  const navigate = useNavigate();
  
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' или 'list'
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
        // Преобразуем массивы в строки для API
        status: filters.status.join(','),
        priority: filters.priority.join(','),
        categoryId: filters.categoryId.join(','),
      };

      // Удаляем пустые параметры
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
    setCurrentPage(1); // Сбросить на первую страницу при изменении фильтров
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <Skeleton
        variant="rectangular"
        height={200}
        sx={{
          borderRadius: 3,
          transform: 'none',
          '&::after': {
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
          }
        }}
      />
    </motion.div>
  );

  return (
    <AnimatedPage>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                🎫 Система заявок
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Управление и отслеживание обращений пользователей
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {/* Переключатель вида */}
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    border: '1px solid rgba(0,0,0,0.12)',
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
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

              <Button
                variant="contained"
                startIcon={<Plus />}
                onClick={() => navigate('/tickets/create')}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                Создать заявку
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Быстрая статистика */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ 
                p: 2, 
                textAlign: 'center', 
                borderRadius: 2, 
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(102, 126, 234, 0.05))',
                border: '1px solid rgba(102, 126, 234, 0.2)'
              }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                  {quickStats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Всего заявок
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ 
                p: 2, 
                textAlign: 'center', 
                borderRadius: 2, 
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                  {quickStats.newTickets}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Новые
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ 
                p: 2, 
                textAlign: 'center', 
                borderRadius: 2, 
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                  {quickStats.inProgress}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  В работе
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ 
                p: 2, 
                textAlign: 'center', 
                borderRadius: 2, 
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>
                  {quickStats.highPriority}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Приоритетные
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </motion.div>

        {/* Фильтры */}
        <SearchFilters
          onFiltersChange={handleFiltersChange}
          categories={categories}
          initialFilters={filters}
        />

        {/* Ошибки */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          </motion.div>
        )}

        {/* Заявки */}
        <Box sx={{ minHeight: 400 }}>
          {loading ? (
            // Скелетоны во время загрузки
            <Grid container spacing={3}>
              {[...Array(12)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <TicketSkeleton delay={index * 0.1} />
                </Grid>
              ))}
            </Grid>
          ) : tickets.length === 0 ? (
            // Пустое состояние
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ 
                textAlign: 'center', 
                py: 8,
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                borderRadius: 3,
                border: '2px dashed rgba(0,0,0,0.1)'
              }}>
                <Typography variant="h4" sx={{ mb: 2, opacity: 0.7 }}>
                  🔍
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Заявки не найдены
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Попробуйте изменить параметры поиска или создайте новую заявку
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Plus />}
                  onClick={() => navigate('/tickets/create')}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  Создать заявку
                </Button>
              </Box>
            </motion.div>
          ) : (
            // Сетка заявок
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
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
                      <TicketCard 
                        ticket={ticket} 
                        delay={index * 0.05}
                      />
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
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }
                  }
                }}
              />
            </Box>
          </motion.div>
        )}

        {/* Плавающая кнопка создания */}
        <Zoom in={!loading}>
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                transform: 'scale(1.1)',
              }
            }}
            onClick={() => navigate('/tickets/create')}
          >
            <Plus size={24} />
          </Fab>
        </Zoom>
      </Container>
    </AnimatedPage>
  );
};

export default TicketList;