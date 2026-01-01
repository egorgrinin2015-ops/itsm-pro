import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Chip,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  InputAdornment,
  IconButton,
  Avatar
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Archive as ArchiveIcon,
  CheckCircle,
  Person,
  Category,
  Schedule,
  Visibility,
  KeyboardArrowRight,
  ViewModule,
  ViewList,
  FilterList,
  Inventory,
  AssignmentTurnedIn,
  TrendingUp
} from '@mui/icons-material';
import GlassCard from '../components/GlassCard';
import theme from '../theme/theme';
import ticketService from '../services/ticketService';
import categoryService from '../services/categoryService';

const Archive = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const ticketsData = await ticketService.getTickets({ showClosed: 'true', onlyClosed: 'true' });
      const categoriesData = await categoryService.getCategories();
      setTickets(ticketsData.tickets || ticketsData || []);
      setCategories(categoriesData.categories || categoriesData || []);
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (!ticket) return false;
    const matchesSearch = (ticket.title && ticket.title.toLowerCase().includes(searchQuery.toLowerCase())) || (ticket.description && ticket.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || ticket.categoryId === parseInt(selectedCategory);
    const matchesPriority = !selectedPriority || ticket.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const priorityConfig = {
    low: { label: 'Низкий', color: theme.functional.success.main, bg: `${theme.functional.success.main}15` },
    medium: { label: 'Средний', color: theme.functional.warning.main, bg: `${theme.functional.warning.main}15` },
    high: { label: 'Высокий', color: theme.functional.error.main, bg: `${theme.functional.error.main}15` },
    critical: { label: 'Критичный', color: theme.functional.error.main, bg: `${theme.functional.error.main}15` }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    return new Date(dateString).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleTicketClick = (ticketId) => { navigate(`/tickets/${ticketId}`); };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Статистика
  const totalTickets = filteredTickets.length;
  const highPriorityCount = filteredTickets.filter(t => t.priority === 'high' || t.priority === 'critical').length;
  const categoriesCount = [...new Set(filteredTickets.map(t => t.categoryId).filter(Boolean))].length;

  const categoryColors = [
    { bg: `${theme.functional.success.main}15`, border: theme.functional.success.main, color: theme.functional.success.main },
    { bg: `${theme.functional.info.main}15`, border: theme.functional.info.main, color: theme.functional.info.main },
    { bg: `${theme.functional.warning.main}15`, border: theme.functional.warning.main, color: theme.functional.warning.main },
    { bg: `${theme.primary.main}15`, border: theme.primary.main, color: theme.primary.main },
    { bg: `${theme.functional.error.main}15`, border: theme.functional.error.main, color: theme.functional.error.main },
  ];

  const getCategoryColor = (index) => categoryColors[index % categoryColors.length];

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} sx={{ color: theme.primary.main }} />
      </Box>
    );
  }

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
                      background: `linear-gradient(135deg, ${theme.functional.info.main} 0%, ${theme.primary.main} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 20px 60px ${theme.functional.info.main}66`
                    }}
                  >
                    <ArchiveIcon sx={{ fontSize: 32, color: theme.text.primary }} />
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
                      background: `linear-gradient(135deg, ${theme.text.primary} 0%, ${theme.functional.info.main} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Архив заявок
                  </Typography>
                  <Typography sx={{ color: theme.text.secondary, fontSize: '1.1rem' }}>
                    Все закрытые заявки хранятся здесь
                  </Typography>
                </Box>
              </Box>
            </Box>
          </GlassCard>
        </motion.div>

        {/* ОШИБКИ */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <Alert severity="error" sx={{ mb: 3, mx: 4, backgroundColor: theme.functional.error.bg, color: theme.text.primary, border: `1px solid ${theme.functional.error.border}`, '& .MuiAlert-icon': { color: theme.functional.error.main } }}>
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
                  <Search sx={{ color: theme.functional.info.main }} />
                  <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Поиск</Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="Найти заявку..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#ffffff',
                      backgroundColor: theme.background.elevated,
                      borderRadius: 2,
                      '& fieldset': { borderColor: theme.border.main },
                      '&:hover fieldset': { borderColor: theme.functional.info.main },
                      '&.Mui-focused fieldset': { borderColor: theme.functional.info.main },
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
                  <TrendingUp sx={{ color: theme.functional.warning.main }} />
                  <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Статистика</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, mb: 2, borderRadius: 2, background: `linear-gradient(135deg, ${theme.functional.info.main}15, ${theme.functional.info.main}05)`, border: `1px solid ${theme.functional.info.main}30` }}>
                  <Avatar sx={{ width: 45, height: 45, background: `linear-gradient(135deg, ${theme.functional.info.main}, ${theme.functional.info.main}CC)` }}>
                    <Inventory sx={{ fontSize: 22 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ color: theme.text.primary, fontWeight: 800, lineHeight: 1 }}>{totalTickets}</Typography>
                    <Typography variant="caption" sx={{ color: theme.text.secondary }}>в архиве</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, mb: 2, borderRadius: 2, background: `linear-gradient(135deg, ${theme.functional.success.main}15, ${theme.functional.success.main}05)`, border: `1px solid ${theme.functional.success.main}30` }}>
                  <Avatar sx={{ width: 45, height: 45, background: `linear-gradient(135deg, ${theme.functional.success.main}, ${theme.functional.success.main}CC)` }}>
                    <AssignmentTurnedIn sx={{ fontSize: 22 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ color: theme.text.primary, fontWeight: 800, lineHeight: 1 }}>{categoriesCount}</Typography>
                    <Typography variant="caption" sx={{ color: theme.text.secondary }}>категорий</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, background: `linear-gradient(135deg, ${theme.functional.error.main}15, ${theme.functional.error.main}05)`, border: `1px solid ${theme.functional.error.main}30` }}>
                  <Avatar sx={{ width: 45, height: 45, background: `linear-gradient(135deg, ${theme.functional.error.main}, ${theme.functional.error.main}CC)` }}>
                    <CheckCircle sx={{ fontSize: 22 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ color: theme.text.primary, fontWeight: 800, lineHeight: 1 }}>{highPriorityCount}</Typography>
                    <Typography variant="caption" sx={{ color: theme.text.secondary }}>высокий приоритет</Typography>
                  </Box>
                </Box>
              </GlassCard>
            </motion.div>

            {/* Категории */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <GlassCard variant="dark" sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Category sx={{ color: theme.primary.main }} />
                  <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Категории</Typography>
                </Box>

                <Box
                  onClick={() => setSelectedCategory('')}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 2, p: 2, mb: 1.5, borderRadius: 2, cursor: 'pointer',
                    background: selectedCategory === '' ? `${theme.functional.info.main}20` : 'transparent',
                    border: `2px solid ${selectedCategory === '' ? theme.functional.info.main : theme.border.main}`,
                    transition: 'all 0.2s ease',
                    '&:hover': { background: `${theme.functional.info.main}15`, border: `2px solid ${theme.functional.info.main}` }
                  }}
                >
                  <Category sx={{ color: selectedCategory === '' ? theme.functional.info.main : theme.text.secondary, fontSize: 20 }} />
                  <Typography sx={{ color: selectedCategory === '' ? theme.text.primary : theme.text.secondary, fontWeight: selectedCategory === '' ? 700 : 500, flex: 1 }}>
                    Все категории
                  </Typography>
                  <Chip label={totalTickets} size="small" sx={{ backgroundColor: theme.background.elevated, color: theme.text.secondary, fontWeight: 600, height: 24 }} />
                </Box>

                {categories.map((cat, index) => {
                  const colorSet = getCategoryColor(index);
                  const isActive = selectedCategory === String(cat.id);
                  const count = filteredTickets.filter(t => t.categoryId === cat.id).length;
                  return (
                    <Box
                      key={cat.id}
                      onClick={() => setSelectedCategory(String(cat.id))}
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
                      <Chip label={count} size="small" sx={{ backgroundColor: isActive ? colorSet.border : theme.background.elevated, color: isActive ? '#fff' : theme.text.secondary, fontWeight: 600, height: 24 }} />
                    </Box>
                  );
                })}
              </GlassCard>
            </motion.div>

            {/* Приоритет */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <GlassCard variant="dark" sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <FilterList sx={{ color: theme.functional.warning.main }} />
                  <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Приоритет</Typography>
                </Box>

                <Select
                  fullWidth
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  displayEmpty
                  size="small"
                  sx={{
                    color: '#ffffff',
                    backgroundColor: theme.background.elevated,
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.border.main },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.functional.info.main },
                    '& .MuiSelect-icon': { color: '#ffffff' }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: theme.background.secondary,
                        border: `1px solid ${theme.border.main}`,
                        '& .MuiMenuItem-root': {
                          color: theme.text.primary,
                          '&:hover': { backgroundColor: `${theme.functional.info.main}33` },
                          '&.Mui-selected': { backgroundColor: `${theme.functional.info.main}4D` }
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value="">Все приоритеты</MenuItem>
                  <MenuItem value="low">Низкий</MenuItem>
                  <MenuItem value="medium">Средний</MenuItem>
                  <MenuItem value="high">Высокий</MenuItem>
                  <MenuItem value="critical">Критичный</MenuItem>
                </Select>
              </GlassCard>
            </motion.div>
          </Box>

          {/* ПРАВАЯ КОЛОНКА */}
          <Box sx={{ flex: 1, minWidth: 0 }}>

            {/* Заголовок + переключатель */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ArchiveIcon sx={{ color: theme.functional.info.main }} />
                  <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Закрытые заявки</Typography>
                  <Chip label={filteredTickets.length} size="small" sx={{ ml: 1, backgroundColor: theme.functional.info.main, color: '#fff', fontWeight: 700 }} />
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={() => setViewMode('grid')}
                    sx={{
                      color: viewMode === 'grid' ? theme.functional.info.main : theme.text.secondary,
                      backgroundColor: viewMode === 'grid' ? `${theme.functional.info.main}1A` : 'transparent',
                      border: `2px solid ${viewMode === 'grid' ? theme.functional.info.main : theme.border.main}`,
                      borderRadius: 2,
                      '&:hover': { border: `2px solid ${theme.text.primary}` }
                    }}
                  >
                    <ViewModule />
                  </IconButton>
                  <IconButton
                    onClick={() => setViewMode('list')}
                    sx={{
                      color: viewMode === 'list' ? theme.functional.info.main : theme.text.secondary,
                      backgroundColor: viewMode === 'list' ? `${theme.functional.info.main}1A` : 'transparent',
                      border: `2px solid ${viewMode === 'list' ? theme.functional.info.main : theme.border.main}`,
                      borderRadius: 2,
                      '&:hover': { border: `2px solid ${theme.text.primary}` }
                    }}
                  >
                    <ViewList />
                  </IconButton>
                </Box>
              </Box>
            </motion.div>

            {/* Заявки */}
            {filteredTickets.length === 0 ? (
              <GlassCard variant="dark" sx={{ p: 6, textAlign: 'center' }}>
                <ArchiveIcon sx={{ fontSize: 64, color: theme.text.disabled, mb: 2 }} />
                <Typography variant="h6" sx={{ color: theme.text.primary, mb: 1 }}>Архив пуст</Typography>
                <Typography sx={{ color: theme.text.disabled }}>Здесь будут отображаться закрытые заявки</Typography>
              </GlassCard>
            ) : (
              <Box sx={{
                display: viewMode === 'grid' ? 'grid' : 'flex',
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : 'none',
                flexDirection: viewMode === 'list' ? 'column' : 'row',
                gap: 2
              }}>
                {filteredTickets.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                  >
                    {viewMode === 'grid' ? (
                      /* GRID VIEW */
                      <GlassCard
                        variant="dark"
                        onClick={() => handleTicketClick(ticket.id)}
                        sx={{
                          height: '100%',
                          p: 3,
                          cursor: 'pointer',
                          border: `2px solid ${theme.border.main}`,
                          display: 'flex',
                          flexDirection: 'column',
                          '&:hover': {
                            border: `2px solid ${theme.functional.info.main}`,
                            boxShadow: `0 15px 40px ${theme.functional.info.main}25`,
                            transform: 'translateY(-5px)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {/* Заголовок */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700, lineHeight: 1.3, flex: 1 }}>
                            #{ticket.id} - {truncateText(ticket.title, 45)}
                          </Typography>
                          <Chip
                            icon={<CheckCircle sx={{ fontSize: 12 }} />}
                            label="Закрыта"
                            size="small"
                            sx={{
                              backgroundColor: `${theme.functional.info.main}15`,
                              color: theme.functional.info.main,
                              border: `1px solid ${theme.functional.info.main}`,
                              ml: 1,
                              height: 24
                            }}
                          />
                        </Box>

                        {/* Описание */}
                        <Typography variant="body2" sx={{ color: theme.text.secondary, mb: 2, flex: 1, lineHeight: 1.6 }}>
                          {truncateText(ticket.description, 100)}
                        </Typography>

                        {/* Категория и приоритет */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                          {ticket.categoryName && (
                            <Chip
                              icon={<Category sx={{ fontSize: 12 }} />}
                              label={ticket.categoryName}
                              size="small"
                              sx={{
                                backgroundColor: `${theme.primary.main}15`,
                                color: theme.primary.main,
                                border: `1px solid ${theme.primary.main}`,
                                height: 26
                              }}
                            />
                          )}
                          {ticket.priority && priorityConfig[ticket.priority] && (
                            <Chip
                              label={priorityConfig[ticket.priority].label}
                              size="small"
                              sx={{
                                backgroundColor: priorityConfig[ticket.priority].bg,
                                color: priorityConfig[ticket.priority].color,
                                border: `1px solid ${priorityConfig[ticket.priority].color}`,
                                height: 26
                              }}
                            />
                          )}
                        </Box>

                        {/* Футер */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: `1px solid ${theme.border.main}` }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Person sx={{ fontSize: 16, color: theme.text.disabled }} />
                            <Typography variant="caption" sx={{ color: theme.text.secondary }}>{ticket.creatorName}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Schedule sx={{ fontSize: 16, color: theme.text.disabled }} />
                            <Typography variant="caption" sx={{ color: theme.text.secondary }}>{formatDate(ticket.resolvedAt || ticket.updatedAt)}</Typography>
                          </Box>
                        </Box>
                      </GlassCard>
                    ) : (
                      /* LIST VIEW */
                      <GlassCard
                        variant="dark"
                        onClick={() => handleTicketClick(ticket.id)}
                        sx={{
                          p: 2.5,
                          cursor: 'pointer',
                          border: `2px solid ${theme.border.main}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          '&:hover': {
                            border: `2px solid ${theme.functional.info.main}`,
                            boxShadow: `0 8px 25px ${theme.functional.info.main}20`
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {/* Иконка */}
                        <Avatar sx={{
                          width: 50,
                          height: 50,
                          background: `linear-gradient(135deg, ${theme.functional.info.main}30, ${theme.primary.main}30)`,
                          border: `2px solid ${theme.functional.info.main}50`
                        }}>
                          <ArchiveIcon sx={{ color: theme.functional.info.main }} />
                        </Avatar>

                        {/* Контент */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body1" sx={{ color: theme.text.primary, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              #{ticket.id} - {ticket.title}
                            </Typography>
                            <Chip label="Закрыта" size="small" sx={{ backgroundColor: `${theme.functional.info.main}15`, color: theme.functional.info.main, height: 20, fontSize: '0.65rem' }} />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {ticket.categoryName && (
                              <Typography variant="caption" sx={{ color: theme.primary.main, fontWeight: 600 }}>{ticket.categoryName}</Typography>
                            )}
                            {ticket.priority && priorityConfig[ticket.priority] && (
                              <Typography variant="caption" sx={{ color: priorityConfig[ticket.priority].color, fontWeight: 600 }}>{priorityConfig[ticket.priority].label}</Typography>
                            )}
                            <Typography variant="caption" sx={{ color: theme.text.disabled }}>{formatDate(ticket.resolvedAt || ticket.updatedAt)}</Typography>
                          </Box>
                        </Box>

                        {/* Автор */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                          <Person sx={{ fontSize: 18, color: theme.text.disabled }} />
                          <Typography variant="body2" sx={{ color: theme.text.secondary }}>{ticket.creatorName}</Typography>
                        </Box>

                        <KeyboardArrowRight sx={{ color: theme.text.disabled }} />
                      </GlassCard>
                    )}
                  </motion.div>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Archive;