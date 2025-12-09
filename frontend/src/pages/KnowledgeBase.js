import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import kbService from '../services/kbService';
import GlassCard from '../components/GlassCard';
import theme from '../theme/theme';
import {
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  Grid,
  Chip,
  CardContent,
  CardActions,
  Alert,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  Skeleton,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import {
  Search,
  Add,
  Visibility,
  ThumbUp,
  Book,
  Category,
  TrendingUp,
  Edit,
  Delete,
  Public,
  Lock,
  Schedule,
  Star,
  FiberNew,
  KeyboardArrowRight
} from '@mui/icons-material';

const KnowledgeBase = () => {
  const [articles, setArticles] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('true');
  const [sortBy, setSortBy] = useState('date');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { isManager } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await loadArticles();
      await loadPopularArticles();
      await loadCategories();
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryFilter, publishedFilter, sortBy, page]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        search: search || undefined,
        categoryId: categoryFilter || undefined,
        published: publishedFilter,
        sortBy
      };
      const data = await kbService.getArticles(params);
      setArticles(data.articles);
      setTotalPages(data.pagination.pages);
      setError('');
    } catch (err) {
      setError('Ошибка загрузки статей');
    } finally {
      setLoading(false);
    }
  };

  const loadPopularArticles = async () => {
    try {
      const data = await kbService.getPopularArticles(5);
      setPopularArticles(data.articles);
    } catch (err) {
      console.error('Ошибка загрузки популярных статей:', err);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await kbService.getCategories();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту статью?')) {
      try {
        await kbService.deleteArticle(id);
        loadArticles();
      } catch (err) {
        setError('Ошибка удаления статьи');
      }
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const totalArticles = articles.length;
  const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);
  const publishedCount = articles.filter(a => a.isPublished).length;
  const draftsCount = articles.filter(a => !a.isPublished).length;

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', pb: 4 }}>
      <Box sx={{ py: 4, position: 'relative', zIndex: 10 }}>
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <GlassCard variant="dark" sx={{ p: 4, mb: 3, mx: 4 }}>
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
                      background: `linear-gradient(135deg, ${theme.functional.success.main} 0%, #059669 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 20px 60px ${theme.functional.success.main}66`
                    }}
                  >
                    <Book size={32} color={theme.text.primary} />
                  </Box>
                </motion.div>

                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      color: theme.text.primary,
                      textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                      mb: 1,
                      background: `linear-gradient(135deg, ${theme.text.primary} 0%, ${theme.functional.success.main} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    База знаний
                  </Typography>
                  <Typography sx={{ color: theme.text.secondary, fontSize: '1.1rem' }}>
                    Решения и инструкции для работы
                  </Typography>
                </Box>
              </Box>

              {isManager && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/kb/create')}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.functional.success.main} 0%, #059669 100%)`,
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1rem',
                      boxShadow: `0 8px 25px ${theme.functional.success.main}66`,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        boxShadow: `0 15px 40px ${theme.functional.success.main}99`,
                      }
                    }}
                  >
                    Создать статью
                  </Button>
                </motion.div>
              )}
            </Box>
          </GlassCard>
        </motion.div>

        {/* Ошибки */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  mx: 4,
                  backgroundColor: theme.functional.error.bg,
                  color: theme.text.primary,
                  border: `1px solid ${theme.functional.error.border}`,
                  '& .MuiAlert-icon': { color: theme.functional.error.main }
                }}
              >
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* БЛОК 1: Поиск + Статистика + Активность */}
        <Box sx={{ px: 4, mb: 3 }}>
          <Grid container spacing={3}>
            {/* Поиск и фильтры */}
            <Grid item xs={12} md={3}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <GlassCard variant="dark" sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ color: theme.text.primary, mb: 2, fontWeight: 700 }}>
                    <Search size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                    Поиск и фильтры
                  </Typography>

                  <TextField
                    fullWidth
                    placeholder="Поиск по статьям..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        backgroundColor: theme.background.elevated,
                        '& fieldset': { borderColor: theme.border.main },
                        '&:hover fieldset': { borderColor: theme.functional.success.main },
                        '&.Mui-focused fieldset': { borderColor: theme.functional.success.main },
                      },
                      '& .MuiOutlinedInput-input': {
                        color: '#ffffff',
                        fontWeight: 500,
                        '&::placeholder': {
                          color: '#ffffff',
                          opacity: 0.8
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: '#ffffff' }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" sx={{ color: '#ffffff', opacity: 0.8, mb: 1, display: 'block', fontWeight: 600 }}>
                        Сортировка
                      </Typography>
                      <Select
                        fullWidth
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        size="small"
                        sx={{
                          color: '#ffffff',
                          fontWeight: 500,
                          backgroundColor: theme.background.elevated,
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.border.main },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.functional.success.main },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.functional.success.main },
                          '& .MuiSelect-icon': { color: '#ffffff' }
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              backgroundColor: theme.background.secondary,
                              '& .MuiMenuItem-root': {
                                color: theme.text.primary,
                                '&:hover': { backgroundColor: `${theme.functional.success.main}33` },
                                '&.Mui-selected': {
                                  backgroundColor: `${theme.functional.success.main}4D`,
                                  '&:hover': { backgroundColor: `${theme.functional.success.main}66` }
                                }
                              }
                            }
                          }
                        }}
                      >
                        <MenuItem value="date">По дате</MenuItem>
                        <MenuItem value="views">По просмотрам</MenuItem>
                        <MenuItem value="helpful">По рейтингу</MenuItem>
                      </Select>
                    </Grid>

                    {isManager && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" sx={{ color: '#ffffff', opacity: 0.8, mb: 1, display: 'block', fontWeight: 600 }}>
                          Публикация
                        </Typography>
                        <Select
                          fullWidth
                          value={publishedFilter}
                          onChange={(e) => setPublishedFilter(e.target.value)}
                          size="small"
                          sx={{
                            color: '#ffffff',
                            fontWeight: 500,
                            backgroundColor: theme.background.elevated,
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.border.main },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.functional.success.main },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.functional.success.main },
                            '& .MuiSelect-icon': { color: '#ffffff' }
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                backgroundColor: theme.background.secondary,
                                '& .MuiMenuItem-root': {
                                  color: theme.text.primary,
                                  '&:hover': { backgroundColor: `${theme.functional.success.main}33` },
                                  '&.Mui-selected': {
                                    backgroundColor: `${theme.functional.success.main}4D`,
                                    '&:hover': { backgroundColor: `${theme.functional.success.main}66` }
                                  }
                                }
                              }
                            }
                          }}
                        >
                          <MenuItem value="">Все</MenuItem>
                          <MenuItem value="true">Опубликованные</MenuItem>
                          <MenuItem value="false">Черновики</MenuItem>
                        </Select>
                      </Grid>
                    )}
                  </Grid>
                </GlassCard>
              </motion.div>
            </Grid>

            {/* Статистика компактно */}
            <Grid item xs={12} md={3}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <GlassCard variant="dark" sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ color: theme.text.primary, mb: 2, fontWeight: 700 }}>
                    <Category size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                    Статистика
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Book size={28} color={theme.functional.info.main} />
                        <Typography variant="h4" sx={{ color: theme.text.primary, fontWeight: 700, mt: 1 }}>
                          {totalArticles}
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.text.secondary }}>
                          Статей
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Visibility size={28} color={theme.functional.success.main} />
                        <Typography variant="h4" sx={{ color: theme.text.primary, fontWeight: 700, mt: 1 }}>
                          {totalViews}
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.text.secondary }}>
                          Просмотров
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Public size={28} color={theme.functional.warning.main} />
                        <Typography variant="h4" sx={{ color: theme.text.primary, fontWeight: 700, mt: 1 }}>
                          {publishedCount}
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.text.secondary }}>
                          Опубликовано
                        </Typography>
                      </Box>
                    </Grid>
                    {isManager && (
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Lock size={28} color={theme.functional.error.main} />
                          <Typography variant="h4" sx={{ color: theme.text.primary, fontWeight: 700, mt: 1 }}>
                            {draftsCount}
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.text.secondary }}>
                            Черновиков
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </GlassCard>
              </motion.div>
            </Grid>

            {/* Активность за неделю */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <GlassCard variant="dark" sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ color: theme.text.primary, mb: 2, fontWeight: 700 }}>
                    <TrendingUp size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                    Активность
                  </Typography>

                  {/* Мини график активности */}
                  <Box sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'flex-end', 
                    gap: 2,
                    mb: 2,
                    justifyContent: 'space-between'
                  }}>
                    {[45, 62, 38, 75, 58, 82, 95].map((height, index) => (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                        style={{
                          width: '100%',
                          background: `linear-gradient(180deg, ${theme.functional.success.main} 0%, ${theme.functional.info.main} 100%)`,
                          borderRadius: '6px 6px 0 0',
                          minHeight: '20%',
                          position: 'relative',
                          boxShadow: `0 4px 10px ${theme.functional.success.main}40`
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -22,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '0.75rem',
                            color: theme.text.primary,
                            fontWeight: 700,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {height}
                        </Box>
                      </motion.div>
                    ))}
                  </Box>

                  {/* Дни недели */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
                      <Typography 
                        key={index}
                        variant="caption" 
                        sx={{ 
                          color: index === 6 ? theme.functional.success.main : theme.text.disabled,
                          fontWeight: index === 6 ? 700 : 500,
                          fontSize: '0.7rem'
                        }}
                      >
                        {day}
                      </Typography>
                    ))}
                  </Box>

                  {/* Статистика изменений */}
                  <Box 
                    sx={{ 
                      p: 2,
                      borderRadius: 2,
                      background: `${theme.functional.success.main}15`,
                      border: `1px solid ${theme.functional.success.main}40`,
                      textAlign: 'center'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
                      <TrendingUp size={20} color={theme.functional.success.main} />
                      <Typography variant="h5" sx={{ color: theme.functional.success.main, fontWeight: 900 }}>
                        +45%
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: theme.text.secondary, fontWeight: 500 }}>
                      по сравнению с прошлой неделей
                    </Typography>
                  </Box>
                </GlassCard>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        {/* БЛОК 2: Популярные статьи горизонтально */}
        {popularArticles.length > 0 && (
          <Box sx={{ px: 4, mb: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <GlassCard variant="dark" sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>
                    <TrendingUp size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                    Популярные статьи
                  </Typography>
                  <Chip
                    icon={<Star size={14} />}
                    label="ТОП-5"
                    size="small"
                    sx={{
                      background: theme.functional.warning.bg,
                      color: theme.functional.warning.main,
                      fontWeight: 700
                    }}
                  />
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  overflowX: 'auto',
                  pb: 1,
                  '&::-webkit-scrollbar': {
                    height: 6
                  },
                  '&::-webkit-scrollbar-track': {
                    background: theme.background.elevated,
                    borderRadius: 3
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: theme.functional.success.main,
                    borderRadius: 3
                  }
                }}>
                  {popularArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      whileHover={{ scale: 1.03, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Box
                        onClick={() => navigate(`/kb/${article.id}`)}
                        sx={{
                          minWidth: 280,
                          p: 2.5,
                          borderRadius: 2,
                          background: `${theme.functional.success.main}15`,
                          border: `1px solid ${theme.functional.success.main}40`,
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          position: 'relative',
                          '&:hover': {
                            background: `${theme.functional.success.main}25`,
                            borderColor: theme.functional.success.main,
                            boxShadow: `0 8px 20px ${theme.functional.success.main}40`
                          }
                        }}
                      >
                        <Box sx={{ 
                          position: 'absolute', 
                          top: 10, 
                          left: 10,
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${theme.functional.warning.main}, ${theme.functional.success.main})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '0.9rem',
                          color: theme.text.primary
                        }}>
                          {index + 1}
                        </Box>

                        <Typography variant="body1" sx={{ 
                          color: theme.text.primary, 
                          fontWeight: 700, 
                          mb: 2,
                          mt: 3,
                          lineHeight: 1.4,
                          minHeight: 45
                        }}>
                          {truncateText(article.title, 60)}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Visibility size={16} color={theme.text.disabled} />
                            <Typography variant="body2" sx={{ color: theme.text.disabled, fontWeight: 600 }}>
                              {article.views}
                            </Typography>
                          </Box>
                          <KeyboardArrowRight size={20} color={theme.functional.success.main} />
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </GlassCard>
            </motion.div>
          </Box>
        )}

        {/* БЛОК 3: Категории */}
        {categories.length > 0 && (
          <Box sx={{ px: 4, mb: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <GlassCard variant="dark" sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: theme.text.primary, mb: 2, fontWeight: 700 }}>
                  <Category size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                  Категории
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  <Chip
                    label="Все"
                    onClick={() => setCategoryFilter('')}
                    sx={{
                      background: categoryFilter === '' ? theme.functional.success.main : theme.background.elevated,
                      color: categoryFilter === '' ? theme.text.primary : theme.text.secondary,
                      fontWeight: 600,
                      cursor: 'pointer',
                      '&:hover': {
                        background: categoryFilter === '' ? theme.functional.success.main : `${theme.functional.success.main}33`
                      }
                    }}
                  />
                  {categories.map((cat) => (
                    <Chip
                      key={cat.id}
                      icon={<Category size={14} />}
                      label={`${cat.name} (${cat.articlesCount || 0})`}
                      onClick={() => setCategoryFilter(cat.id)}
                      sx={{
                        background: categoryFilter === cat.id ? theme.functional.success.main : theme.background.elevated,
                        color: categoryFilter === cat.id ? theme.text.primary : theme.text.secondary,
                        fontWeight: 600,
                        cursor: 'pointer',
                        '&:hover': {
                          background: categoryFilter === cat.id ? theme.functional.success.main : `${theme.functional.success.main}33`
                        }
                      }}
                    />
                  ))}
                </Box>
              </GlassCard>
            </motion.div>
          </Box>
        )}

        {/* БЛОК 4: Список статей */}
        <Box sx={{ px: 4 }}>
          {loading ? (
            <Grid container spacing={3}>
              {[...Array(6)].map((_, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Skeleton 
                    variant="rectangular" 
                    height={250} 
                    sx={{ bgcolor: theme.background.elevated, borderRadius: 2 }} 
                  />
                </Grid>
              ))}
            </Grid>
          ) : articles.length === 0 ? (
            <GlassCard variant="dark" sx={{ p: 6, textAlign: 'center' }}>
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Book size={64} color={theme.text.disabled} style={{ marginBottom: 16 }} />
                <Typography variant="h6" sx={{ color: theme.text.primary, mb: 1 }}>
                  Статьи не найдены
                </Typography>
                <Typography sx={{ color: theme.text.disabled }}>
                  Попробуйте изменить параметры поиска
                </Typography>
              </motion.div>
            </GlassCard>
          ) : (
            <Grid container spacing={3}>
              {articles.map((article, index) => (
                <Grid item xs={12} sm={6} md={4} key={article.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <GlassCard
                      variant="dark"
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: `0 15px 40px ${theme.functional.success.main}4D`
                        }
                      }}
                      onClick={() => navigate(`/kb/${article.id}`)}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700, flexGrow: 1 }}>
                            {truncateText(article.title, 60)}
                          </Typography>
                          {!article.isPublished && (
                            <Chip
                              icon={<Lock size={14} />}
                              label="Черновик"
                              size="small"
                              sx={{
                                background: theme.functional.error.bg,
                                color: theme.functional.error.main,
                                ml: 1
                              }}
                            />
                          )}
                        </Box>

                        <Typography variant="body2" sx={{ color: theme.text.secondary, mb: 2, minHeight: 60 }}>
                          {truncateText(article.content, 100)}
                        </Typography>

                        {article.categoryName && (
                          <Chip
                            icon={<Category size={14} />}
                            label={article.categoryName}
                            size="small"
                            sx={{
                              background: theme.functional.success.bg,
                              color: theme.functional.success.main,
                              mb: 2,
                              fontWeight: 600
                            }}
                          />
                        )}

                        <Box sx={{ display: 'flex', gap: 2, color: theme.text.disabled, fontSize: '0.875rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Visibility size={16} />
                            {article.views}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <ThumbUp size={16} />
                            {article.helpfulCount}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Schedule size={16} />
                            {new Date(article.createdAt).toLocaleDateString('ru-RU')}
                          </Box>
                        </Box>
                      </CardContent>

                      {isManager && (
                        <CardActions sx={{ p: 2, pt: 0, gap: 1, borderTop: `1px solid ${theme.border.main}` }}>
                          <Tooltip title="Редактировать">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/kb/edit/${article.id}`);
                              }}
                              sx={{
                                background: theme.functional.info.bg,
                                color: theme.functional.info.main,
                                '&:hover': { background: `${theme.functional.info.main}4D` }
                              }}
                            >
                              <Edit size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Удалить">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(article.id);
                              }}
                              sx={{
                                background: theme.functional.error.bg,
                                color: theme.functional.error.main,
                                '&:hover': { background: `${theme.functional.error.main}4D` }
                              }}
                            >
                              <Delete size={16} />
                            </IconButton>
                          </Tooltip>
                        </CardActions>
                      )}
                    </GlassCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Пагинация */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <GlassCard variant="dark" sx={{ p: 2, display: 'flex', gap: 1 }}>
                <Button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  sx={{ 
                    color: theme.text.primary,
                    '&:disabled': { color: theme.text.disabled }
                  }}
                >
                  Назад
                </Button>
                <Typography sx={{ color: theme.text.primary, px: 2, py: 1 }}>
                  Страница {page} из {totalPages}
                </Typography>
                <Button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  sx={{ 
                    color: theme.text.primary,
                    '&:disabled': { color: theme.text.disabled }
                  }}
                >
                  Вперёд
                </Button>
              </GlassCard>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default KnowledgeBase;