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
  Chip,
  Alert,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  Skeleton,
  Avatar
} from '@mui/material';
import {
  Search,
  Add,
  Visibility,
  ThumbUp,
  Book,
  Category,
  Edit,
  Delete,
  Lock,
  Schedule,
  Star,
  KeyboardArrowRight,
  ViewModule,
  ViewList,
  TrendingUp,
  LocalFireDepartment,
  AutoAwesome,
  MenuBook,
  Folder
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
  const [viewMode, setViewMode] = useState('grid');

  const { isManager } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await loadArticles();
      await loadPopularArticles();
      await loadCategories();
    };
    fetchData();
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
  const totalLikes = articles.reduce((sum, article) => sum + (article.helpfulCount || 0), 0);

  const categoryColors = [
    { bg: `${theme.functional.success.main}15`, border: theme.functional.success.main, color: theme.functional.success.main },
    { bg: `${theme.functional.info.main}15`, border: theme.functional.info.main, color: theme.functional.info.main },
    { bg: `${theme.functional.warning.main}15`, border: theme.functional.warning.main, color: theme.functional.warning.main },
    { bg: `${theme.primary.main}15`, border: theme.primary.main, color: theme.primary.main },
    { bg: `${theme.functional.error.main}15`, border: theme.functional.error.main, color: theme.functional.error.main },
  ];

  const getCategoryColor = (index) => categoryColors[index % categoryColors.length];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', pb: 4 }}>
      <Box sx={{ py: 4, position: 'relative', zIndex: 10 }}>
        
        {/* ШАПКА */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <GlassCard variant="dark" sx={{ p: 4, mb: 3, mx: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <motion.div
                  animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
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
                    <MenuBook sx={{ fontSize: 32, color: theme.text.primary }} />
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
                      border: '2px solid transparent',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        boxShadow: `0 15px 40px ${theme.functional.success.main}99`,
                        border: `2px solid ${theme.text.primary}`,
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

        {/* ОШИБКИ */}
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
                  mb: 3, mx: 4,
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

        {/* ДВУХКОЛОНОЧНЫЙ LAYOUT */}
        <Box sx={{ px: 4, display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
          
          {/* ЛЕВАЯ КОЛОНКА */}
          <Box sx={{ width: { xs: '100%', lg: 320 }, flexShrink: 0 }}>
            
            {/* Поиск */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <GlassCard variant="dark" sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Search sx={{ color: theme.functional.success.main }} />
                  <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Поиск</Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="Найти статью..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#ffffff',
                      backgroundColor: theme.background.elevated,
                      borderRadius: 2,
                      '& fieldset': { borderColor: theme.border.main },
                      '&:hover fieldset': { borderColor: theme.functional.success.main },
                      '&.Mui-focused fieldset': { borderColor: theme.functional.success.main },
                    },
                    '& .MuiOutlinedInput-input::placeholder': { color: '#ffffff', opacity: 0.6 }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: theme.text.disabled, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </GlassCard>
            </motion.div>

            {/* Статистика */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <GlassCard variant="dark" sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <AutoAwesome sx={{ color: theme.functional.warning.main }} />
                  <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Обзор</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, mb: 2, borderRadius: 2, background: `linear-gradient(135deg, ${theme.functional.info.main}15, ${theme.functional.info.main}05)`, border: `1px solid ${theme.functional.info.main}30` }}>
                  <Avatar sx={{ width: 45, height: 45, background: `linear-gradient(135deg, ${theme.functional.info.main}, ${theme.functional.info.main}CC)` }}>
                    <Book sx={{ fontSize: 22 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ color: theme.text.primary, fontWeight: 800, lineHeight: 1 }}>{totalArticles}</Typography>
                    <Typography variant="caption" sx={{ color: theme.text.secondary }}>статей в базе</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, mb: 2, borderRadius: 2, background: `linear-gradient(135deg, ${theme.functional.success.main}15, ${theme.functional.success.main}05)`, border: `1px solid ${theme.functional.success.main}30` }}>
                  <Avatar sx={{ width: 45, height: 45, background: `linear-gradient(135deg, ${theme.functional.success.main}, ${theme.functional.success.main}CC)` }}>
                    <Visibility sx={{ fontSize: 22 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ color: theme.text.primary, fontWeight: 800, lineHeight: 1 }}>{totalViews}</Typography>
                    <Typography variant="caption" sx={{ color: theme.text.secondary }}>просмотров</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, background: `linear-gradient(135deg, ${theme.functional.warning.main}15, ${theme.functional.warning.main}05)`, border: `1px solid ${theme.functional.warning.main}30` }}>
                  <Avatar sx={{ width: 45, height: 45, background: `linear-gradient(135deg, ${theme.functional.warning.main}, ${theme.functional.warning.main}CC)` }}>
                    <ThumbUp sx={{ fontSize: 22 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ color: theme.text.primary, fontWeight: 800, lineHeight: 1 }}>{totalLikes}</Typography>
                    <Typography variant="caption" sx={{ color: theme.text.secondary }}>полезных оценок</Typography>
                  </Box>
                </Box>
              </GlassCard>
            </motion.div>

            {/* Категории */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <GlassCard variant="dark" sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Folder sx={{ color: theme.primary.main }} />
                  <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Категории</Typography>
                </Box>

                <Box
                  onClick={() => setCategoryFilter('')}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 2, p: 2, mb: 1.5, borderRadius: 2, cursor: 'pointer',
                    background: categoryFilter === '' ? `${theme.functional.success.main}20` : 'transparent',
                    border: `2px solid ${categoryFilter === '' ? theme.functional.success.main : theme.border.main}`,
                    transition: 'all 0.2s ease',
                    '&:hover': { background: `${theme.functional.success.main}15`, border: `2px solid ${theme.functional.success.main}` }
                  }}
                >
                  <Category sx={{ color: categoryFilter === '' ? theme.functional.success.main : theme.text.secondary, fontSize: 20 }} />
                  <Typography sx={{ color: categoryFilter === '' ? theme.text.primary : theme.text.secondary, fontWeight: categoryFilter === '' ? 700 : 500, flex: 1 }}>
                    Все категории
                  </Typography>
                  <Chip label={totalArticles} size="small" sx={{ backgroundColor: theme.background.elevated, color: theme.text.secondary, fontWeight: 600, height: 24 }} />
                </Box>

                {categories.map((cat, index) => {
                  const colorSet = getCategoryColor(index);
                  const isActive = categoryFilter === cat.id;
                  return (
                    <Box
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      sx={{
                        display: 'flex', alignItems: 'center', gap: 2, p: 2, mb: 1.5, borderRadius: 2, cursor: 'pointer',
                        background: isActive ? colorSet.bg : 'transparent',
                        border: `2px solid ${isActive ? colorSet.border : theme.border.main}`,
                        transition: 'all 0.2s ease',
                        '&:hover': { background: colorSet.bg, border: `2px solid ${colorSet.border}` }
                      }}
                    >
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: colorSet.color }} />
                      <Typography sx={{ color: isActive ? theme.text.primary : theme.text.secondary, fontWeight: isActive ? 700 : 500, flex: 1 }}>{cat.name}</Typography>
                      <Chip label={cat.articlesCount || 0} size="small" sx={{ backgroundColor: isActive ? colorSet.border : theme.background.elevated, color: isActive ? '#fff' : theme.text.secondary, fontWeight: 600, height: 24 }} />
                    </Box>
                  );
                })}
              </GlassCard>
            </motion.div>

            {/* Сортировка */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <GlassCard variant="dark" sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TrendingUp sx={{ color: theme.functional.info.main }} />
                  <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Сортировка</Typography>
                </Box>

                <Select
                  fullWidth value={sortBy} onChange={(e) => setSortBy(e.target.value)} size="small"
                  sx={{ mb: 2, color: '#ffffff', backgroundColor: theme.background.elevated, borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.border.main }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.functional.success.main }, '& .MuiSelect-icon': { color: '#ffffff' } }}
                  MenuProps={{ PaperProps: { sx: { backgroundColor: theme.background.secondary, border: `1px solid ${theme.border.main}`, '& .MuiMenuItem-root': { color: theme.text.primary, '&:hover': { backgroundColor: `${theme.functional.success.main}33` }, '&.Mui-selected': { backgroundColor: `${theme.functional.success.main}4D` } } } } }}
                >
                  <MenuItem value="date">По дате создания</MenuItem>
                  <MenuItem value="views">По просмотрам</MenuItem>
                  <MenuItem value="helpful">По рейтингу</MenuItem>
                </Select>

                {isManager && (
                  <Select
                    fullWidth value={publishedFilter} onChange={(e) => setPublishedFilter(e.target.value)} size="small"
                    sx={{ color: '#ffffff', backgroundColor: theme.background.elevated, borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.border.main }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.functional.success.main }, '& .MuiSelect-icon': { color: '#ffffff' } }}
                    MenuProps={{ PaperProps: { sx: { backgroundColor: theme.background.secondary, border: `1px solid ${theme.border.main}`, '& .MuiMenuItem-root': { color: theme.text.primary, '&:hover': { backgroundColor: `${theme.functional.success.main}33` }, '&.Mui-selected': { backgroundColor: `${theme.functional.success.main}4D` } } } } }}
                  >
                    <MenuItem value="">Все статусы</MenuItem>
                    <MenuItem value="true">Опубликованные</MenuItem>
                    <MenuItem value="false">Черновики</MenuItem>
                  </Select>
                )}
              </GlassCard>
            </motion.div>
          </Box>

          {/* ПРАВАЯ КОЛОНКА */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            
            {/* Популярные */}
            {popularArticles.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <GlassCard variant="dark" sx={{ p: 3, mb: 3, overflow: 'visible' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalFireDepartment sx={{ color: theme.functional.error.main }} />
                      <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Популярное</Typography>
                    </Box>
                    <Chip icon={<Star sx={{ fontSize: 14 }} />} label="ТОП-5" size="small" sx={{ background: `linear-gradient(135deg, ${theme.functional.warning.main}, ${theme.functional.error.main})`, color: '#fff', fontWeight: 700 }} />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, pt: 1, mx: -1, px: 1 }}>
                    {popularArticles.map((article, index) => (
                      <Box 
                        key={article.id}
                        onClick={() => navigate(`/kb/${article.id}`)}
                        sx={{
                          minWidth: 220, 
                          p: 2.5, 
                          borderRadius: 3, 
                          cursor: 'pointer',
                          background: `linear-gradient(135deg, ${theme.background.elevated}, ${theme.background.secondary})`,
                          border: `2px solid ${theme.border.main}`, 
                          position: 'relative',
                          transition: 'all 0.3s ease',
                          '&:hover': { 
                            border: `2px solid ${theme.functional.warning.main}`, 
                            boxShadow: `0 10px 30px ${theme.functional.warning.main}30`,
                            transform: 'translateY(-5px)'
                          }
                        }}
                      >
                        <Box sx={{ 
                          position: 'absolute', 
                          top: 12, 
                          right: 12, 
                          width: 28, 
                          height: 28, 
                          borderRadius: '50%', 
                          background: `linear-gradient(135deg, ${theme.functional.warning.main}, ${theme.functional.error.main})`, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontWeight: 900, 
                          fontSize: '0.8rem', 
                          color: '#fff' 
                        }}>
                          {index + 1}
                        </Box>
                        <Typography variant="body2" sx={{ color: theme.text.primary, fontWeight: 600, mb: 2, pr: 4, lineHeight: 1.4, minHeight: 40 }}>
                          {truncateText(article.title, 45)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Visibility sx={{ fontSize: 14, color: theme.text.disabled }} />
                            <Typography variant="caption" sx={{ color: theme.text.disabled }}>{article.views}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <ThumbUp sx={{ fontSize: 14, color: theme.text.disabled }} />
                            <Typography variant="caption" sx={{ color: theme.text.disabled }}>{article.helpfulCount}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </GlassCard>
              </motion.div>
            )}

            {/* Заголовок + переключатель */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Book sx={{ color: theme.functional.info.main }} />
                  <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Все статьи</Typography>
                  <Chip label={totalArticles} size="small" sx={{ ml: 1, backgroundColor: theme.functional.info.main, color: '#fff', fontWeight: 700 }} />
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton onClick={() => setViewMode('grid')} sx={{ color: viewMode === 'grid' ? theme.functional.success.main : theme.text.secondary, backgroundColor: viewMode === 'grid' ? `${theme.functional.success.main}1A` : 'transparent', border: `2px solid ${viewMode === 'grid' ? theme.functional.success.main : theme.border.main}`, borderRadius: 2, '&:hover': { border: `2px solid ${theme.text.primary}` } }}>
                    <ViewModule />
                  </IconButton>
                  <IconButton onClick={() => setViewMode('list')} sx={{ color: viewMode === 'list' ? theme.functional.success.main : theme.text.secondary, backgroundColor: viewMode === 'list' ? `${theme.functional.success.main}1A` : 'transparent', border: `2px solid ${viewMode === 'list' ? theme.functional.success.main : theme.border.main}`, borderRadius: 2, '&:hover': { border: `2px solid ${theme.text.primary}` } }}>
                    <ViewList />
                  </IconButton>
                </Box>
              </Box>
            </motion.div>

            {/* Статьи */}
            {loading ? (
              <Box sx={{ display: viewMode === 'grid' ? 'grid' : 'flex', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : 'none', flexDirection: viewMode === 'list' ? 'column' : 'row', gap: 2 }}>
                {[...Array(6)].map((_, i) => <Skeleton key={i} variant="rectangular" height={viewMode === 'grid' ? 220 : 90} sx={{ bgcolor: theme.background.elevated, borderRadius: 3 }} />)}
              </Box>
            ) : articles.length === 0 ? (
              <GlassCard variant="dark" sx={{ p: 6, textAlign: 'center' }}>
                <Book sx={{ fontSize: 64, color: theme.text.disabled, mb: 2 }} />
                <Typography variant="h6" sx={{ color: theme.text.primary, mb: 1 }}>Статьи не найдены</Typography>
                <Typography sx={{ color: theme.text.disabled }}>Попробуйте изменить параметры поиска</Typography>
              </GlassCard>
            ) : (
              <Box sx={{ display: viewMode === 'grid' ? 'grid' : 'flex', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : 'none', flexDirection: viewMode === 'list' ? 'column' : 'row', gap: 2 }}>
                {articles.map((article, index) => (
                  <motion.div key={article.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.03 }}>
                    {viewMode === 'grid' ? (
                      <GlassCard variant="dark" onClick={() => navigate(`/kb/${article.id}`)} sx={{ height: '100%', p: 3, cursor: 'pointer', border: `2px solid ${theme.border.main}`, display: 'flex', flexDirection: 'column', '&:hover': { border: `2px solid ${theme.functional.success.main}`, boxShadow: `0 15px 40px ${theme.functional.success.main}25`, transform: 'translateY(-5px)' }, transition: 'all 0.3s ease' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700, lineHeight: 1.3, flex: 1 }}>{truncateText(article.title, 55)}</Typography>
                          {!article.isPublished && <Chip icon={<Lock sx={{ fontSize: 12 }} />} label="Черновик" size="small" sx={{ backgroundColor: `${theme.functional.error.main}15`, color: theme.functional.error.main, border: `1px solid ${theme.functional.error.main}`, ml: 1, height: 24 }} />}
                        </Box>
                        <Typography variant="body2" sx={{ color: theme.text.secondary, mb: 2, flex: 1, lineHeight: 1.6 }}>{truncateText(article.content, 120)}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                          {article.categoryName && <Chip icon={<Category sx={{ fontSize: 12 }} />} label={article.categoryName} size="small" sx={{ backgroundColor: `${theme.functional.success.main}15`, color: theme.functional.success.main, border: `1px solid ${theme.functional.success.main}`, height: 26 }} />}
                          <Chip icon={<Schedule sx={{ fontSize: 12 }} />} label={new Date(article.createdAt).toLocaleDateString('ru-RU')} size="small" sx={{ backgroundColor: theme.background.elevated, color: theme.text.disabled, height: 26 }} />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: `1px solid ${theme.border.main}` }}>
                          <Box sx={{ display: 'flex', gap: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Visibility sx={{ fontSize: 16, color: theme.functional.info.main }} /><Typography variant="body2" sx={{ color: theme.text.secondary, fontWeight: 600 }}>{article.views}</Typography></Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><ThumbUp sx={{ fontSize: 16, color: theme.functional.success.main }} /><Typography variant="body2" sx={{ color: theme.text.secondary, fontWeight: 600 }}>{article.helpfulCount}</Typography></Box>
                          </Box>
                          {isManager && (
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Tooltip title="Редактировать"><IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/kb/edit/${article.id}`); }} sx={{ color: theme.functional.info.main, border: `1px solid ${theme.functional.info.main}30`, '&:hover': { backgroundColor: `${theme.functional.info.main}15`, border: `1px solid ${theme.functional.info.main}` } }}><Edit sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                              <Tooltip title="Удалить"><IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(article.id); }} sx={{ color: theme.functional.error.main, border: `1px solid ${theme.functional.error.main}30`, '&:hover': { backgroundColor: `${theme.functional.error.main}15`, border: `1px solid ${theme.functional.error.main}` } }}><Delete sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                            </Box>
                          )}
                        </Box>
                      </GlassCard>
                    ) : (
                      <GlassCard variant="dark" onClick={() => navigate(`/kb/${article.id}`)} sx={{ p: 2.5, cursor: 'pointer', border: `2px solid ${theme.border.main}`, display: 'flex', alignItems: 'center', gap: 3, '&:hover': { border: `2px solid ${theme.functional.success.main}`, boxShadow: `0 8px 25px ${theme.functional.success.main}20` }, transition: 'all 0.3s ease' }}>
                        <Avatar sx={{ width: 50, height: 50, background: `linear-gradient(135deg, ${theme.functional.success.main}30, ${theme.functional.info.main}30)`, border: `2px solid ${theme.functional.success.main}50` }}><Book sx={{ color: theme.functional.success.main }} /></Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body1" sx={{ color: theme.text.primary, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.title}</Typography>
                            {!article.isPublished && <Chip label="Черновик" size="small" sx={{ backgroundColor: `${theme.functional.error.main}15`, color: theme.functional.error.main, height: 20, fontSize: '0.65rem' }} />}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {article.categoryName && <Typography variant="caption" sx={{ color: theme.functional.success.main, fontWeight: 600 }}>{article.categoryName}</Typography>}
                            <Typography variant="caption" sx={{ color: theme.text.disabled }}>{new Date(article.createdAt).toLocaleDateString('ru-RU')}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Visibility sx={{ fontSize: 18, color: theme.functional.info.main }} /><Typography variant="body2" sx={{ color: theme.text.secondary, fontWeight: 600 }}>{article.views}</Typography></Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><ThumbUp sx={{ fontSize: 18, color: theme.functional.success.main }} /><Typography variant="body2" sx={{ color: theme.text.secondary, fontWeight: 600 }}>{article.helpfulCount}</Typography></Box>
                          {isManager && (
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/kb/edit/${article.id}`); }} sx={{ color: theme.functional.info.main }}><Edit sx={{ fontSize: 18 }} /></IconButton>
                              <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(article.id); }} sx={{ color: theme.functional.error.main }}><Delete sx={{ fontSize: 18 }} /></IconButton>
                            </Box>
                          )}
                          <KeyboardArrowRight sx={{ color: theme.text.disabled }} />
                        </Box>
                      </GlassCard>
                    )}
                  </motion.div>
                ))}
              </Box>
            )}

            {/* Пагинация */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <GlassCard variant="dark" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button disabled={page === 1} onClick={() => setPage(page - 1)} variant="contained" sx={{ background: page === 1 ? theme.background.secondary : theme.gradients.primary, fontWeight: 600, border: '2px solid transparent', '&:hover': { border: `2px solid ${theme.text.primary}` }, '&:disabled': { color: theme.text.disabled, background: theme.background.secondary } }}>Назад</Button>
                  <Typography sx={{ color: theme.text.primary, px: 2, fontWeight: 600 }}>{page} / {totalPages}</Typography>
                  <Button disabled={page === totalPages} onClick={() => setPage(page + 1)} variant="contained" sx={{ background: page === totalPages ? theme.background.secondary : theme.gradients.primary, fontWeight: 600, border: '2px solid transparent', '&:hover': { border: `2px solid ${theme.text.primary}` }, '&:disabled': { color: theme.text.disabled, background: theme.background.secondary } }}>Вперёд</Button>
                </GlassCard>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default KnowledgeBase;