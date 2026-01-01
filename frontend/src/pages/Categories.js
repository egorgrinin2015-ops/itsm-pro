import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import categoryService from '../services/categoryService';
import GlassCard from '../components/GlassCard';
import theme from '../theme/theme';
import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
  Tooltip,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  AccessTime,
  Category,
  Settings,
  TrendingUp,
  Speed,
  Assignment,
  CheckCircle,
  Schedule,
  KeyboardArrowRight,
  Folder,
  Timer,
  LocalOffer,
  Close
} from '@mui/icons-material';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slaTime: 120
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const { isManager } = useAuth();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data.categories);
      setError('');
    } catch (err) {
      setError('Ошибка загрузки категорий');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category = null) => {
    setEditingCategory(category);
    setFormData(category ? {
      name: category.name,
      description: category.description,
      slaTime: category.slaTime
    } : {
      name: '',
      description: '',
      slaTime: 120
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', slaTime: 120 });
  };

  const handleSave = async () => {
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, formData);
      } else {
        await categoryService.createCategory(formData);
      }
      handleCloseDialog();
      loadCategories();
    } catch (err) {
      setError('Ошибка сохранения категории');
    }
  };

  const handleDelete = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      loadCategories();
      setDeleteConfirmId(null);
    } catch (err) {
      setError('Ошибка удаления категории');
    }
  };

  const getSLAColor = (slaTime) => {
    if (slaTime <= 60) return theme.functional.success.main;
    if (slaTime <= 120) return theme.functional.warning.main;
    if (slaTime <= 240) return theme.functional.error.main;
    return theme.primary.main;
  };

  const getSLALabel = (slaTime) => {
    if (slaTime <= 60) return 'Быстрый';
    if (slaTime <= 120) return 'Стандартный';
    if (slaTime <= 240) return 'Расширенный';
    return 'Длительный';
  };

  const formatSLATime = (minutes) => {
    if (minutes < 60) return `${minutes} мин`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} ч ${mins} мин` : `${hours} ч`;
  };

  // Статистика
  const totalCategories = categories.length;
  const avgSLA = categories.length > 0 
    ? Math.round(categories.reduce((sum, c) => sum + c.slaTime, 0) / categories.length) 
    : 0;
  const fastCategories = categories.filter(c => c.slaTime <= 60).length;
  const slowCategories = categories.filter(c => c.slaTime > 240).length;

  // Цвета для категорий
  const categoryColors = [
    { bg: `${theme.functional.success.main}15`, border: theme.functional.success.main, gradient: `linear-gradient(135deg, ${theme.functional.success.main}, ${theme.functional.success.main}CC)` },
    { bg: `${theme.functional.info.main}15`, border: theme.functional.info.main, gradient: `linear-gradient(135deg, ${theme.functional.info.main}, ${theme.functional.info.main}CC)` },
    { bg: `${theme.functional.warning.main}15`, border: theme.functional.warning.main, gradient: `linear-gradient(135deg, ${theme.functional.warning.main}, ${theme.functional.warning.main}CC)` },
    { bg: `${theme.primary.main}15`, border: theme.primary.main, gradient: `linear-gradient(135deg, ${theme.primary.main}, ${theme.primary.main}CC)` },
    { bg: `${theme.functional.error.main}15`, border: theme.functional.error.main, gradient: `linear-gradient(135deg, ${theme.functional.error.main}, ${theme.functional.error.main}CC)` },
  ];

  const getCategoryColor = (index) => categoryColors[index % categoryColors.length];

  if (!isManager) {
    return (
      <Box sx={{ position: 'relative', minHeight: '100vh', pb: 4 }}>
        <Box sx={{ py: 4, px: 4 }}>
          <GlassCard variant="dark" sx={{ p: 6, textAlign: 'center' }}>
            <Settings sx={{ fontSize: 64, color: theme.functional.error.main, mb: 2 }} />
            <Typography variant="h4" sx={{ color: theme.text.primary, fontWeight: 700, mb: 2 }}>
              Доступ запрещен
            </Typography>
            <Typography sx={{ color: theme.text.secondary }}>
              Недостаточно прав для управления категориями
            </Typography>
          </GlassCard>
        </Box>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} sx={{ color: theme.functional.warning.main }} />
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
                      background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 20px 60px rgba(245, 158, 11, 0.4)'
                    }}
                  >
                    <Category sx={{ fontSize: 32, color: '#fff' }} />
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
                      background: 'linear-gradient(135deg, #ffffff 0%, #f59e0b 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Категории услуг
                  </Typography>
                  <Typography sx={{ color: theme.text.secondary, fontSize: '1.1rem' }}>
                    Управление типами и SLA обращений
                  </Typography>
                </Box>
              </Box>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenDialog()}
                  sx={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)',
                    border: '2px solid transparent',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
                      boxShadow: '0 15px 40px rgba(245, 158, 11, 0.6)',
                      border: `2px solid ${theme.text.primary}`,
                    }
                  }}
                >
                  Добавить категорию
                </Button>
              </motion.div>
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

            {/* Статистика */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <GlassCard variant="dark" sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <TrendingUp sx={{ color: theme.functional.warning.main }} />
                  <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Статистика</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, mb: 2, borderRadius: 2, background: `linear-gradient(135deg, ${theme.functional.warning.main}15, ${theme.functional.warning.main}05)`, border: `1px solid ${theme.functional.warning.main}30` }}>
                  <Avatar sx={{ width: 45, height: 45, background: `linear-gradient(135deg, ${theme.functional.warning.main}, ${theme.functional.warning.main}CC)` }}>
                    <Folder sx={{ fontSize: 22 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ color: theme.text.primary, fontWeight: 800, lineHeight: 1 }}>{totalCategories}</Typography>
                    <Typography variant="caption" sx={{ color: theme.text.secondary }}>категорий</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, mb: 2, borderRadius: 2, background: `linear-gradient(135deg, ${theme.functional.info.main}15, ${theme.functional.info.main}05)`, border: `1px solid ${theme.functional.info.main}30` }}>
                  <Avatar sx={{ width: 45, height: 45, background: `linear-gradient(135deg, ${theme.functional.info.main}, ${theme.functional.info.main}CC)` }}>
                    <Timer sx={{ fontSize: 22 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ color: theme.text.primary, fontWeight: 800, lineHeight: 1 }}>{formatSLATime(avgSLA)}</Typography>
                    <Typography variant="caption" sx={{ color: theme.text.secondary }}>средний SLA</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, mb: 2, borderRadius: 2, background: `linear-gradient(135deg, ${theme.functional.success.main}15, ${theme.functional.success.main}05)`, border: `1px solid ${theme.functional.success.main}30` }}>
                  <Avatar sx={{ width: 45, height: 45, background: `linear-gradient(135deg, ${theme.functional.success.main}, ${theme.functional.success.main}CC)` }}>
                    <Speed sx={{ fontSize: 22 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ color: theme.text.primary, fontWeight: 800, lineHeight: 1 }}>{fastCategories}</Typography>
                    <Typography variant="caption" sx={{ color: theme.text.secondary }}>быстрых (≤1 ч)</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, background: `linear-gradient(135deg, ${theme.functional.error.main}15, ${theme.functional.error.main}05)`, border: `1px solid ${theme.functional.error.main}30` }}>
                  <Avatar sx={{ width: 45, height: 45, background: `linear-gradient(135deg, ${theme.functional.error.main}, ${theme.functional.error.main}CC)` }}>
                    <Schedule sx={{ fontSize: 22 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ color: theme.text.primary, fontWeight: 800, lineHeight: 1 }}>{slowCategories}</Typography>
                    <Typography variant="caption" sx={{ color: theme.text.secondary }}>длительных ({'>'}4 ч)</Typography>
                  </Box>
                </Box>
              </GlassCard>
            </motion.div>

            {/* SLA Распределение */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <GlassCard variant="dark" sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <AccessTime sx={{ color: theme.primary.main }} />
                  <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>SLA Распределение</Typography>
                </Box>

                {/* Быстрый */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: theme.text.secondary }}>Быстрый (≤1 ч)</Typography>
                    <Typography variant="body2" sx={{ color: theme.functional.success.main, fontWeight: 700 }}>{fastCategories}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={totalCategories > 0 ? (fastCategories / totalCategories) * 100 : 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: `${theme.functional.success.main}20`,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: theme.functional.success.main,
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>

                {/* Стандартный */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: theme.text.secondary }}>Стандартный (1-2 ч)</Typography>
                    <Typography variant="body2" sx={{ color: theme.functional.warning.main, fontWeight: 700 }}>
                      {categories.filter(c => c.slaTime > 60 && c.slaTime <= 120).length}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={totalCategories > 0 ? (categories.filter(c => c.slaTime > 60 && c.slaTime <= 120).length / totalCategories) * 100 : 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: `${theme.functional.warning.main}20`,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: theme.functional.warning.main,
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>

                {/* Расширенный */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: theme.text.secondary }}>Расширенный (2-4 ч)</Typography>
                    <Typography variant="body2" sx={{ color: theme.functional.error.main, fontWeight: 700 }}>
                      {categories.filter(c => c.slaTime > 120 && c.slaTime <= 240).length}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={totalCategories > 0 ? (categories.filter(c => c.slaTime > 120 && c.slaTime <= 240).length / totalCategories) * 100 : 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: `${theme.functional.error.main}20`,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: theme.functional.error.main,
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>

                {/* Длительный */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: theme.text.secondary }}>Длительный ({'>'}4 ч)</Typography>
                    <Typography variant="body2" sx={{ color: theme.primary.main, fontWeight: 700 }}>{slowCategories}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={totalCategories > 0 ? (slowCategories / totalCategories) * 100 : 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: `${theme.primary.main}20`,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: theme.primary.main,
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>
              </GlassCard>
            </motion.div>

            {/* Подсказки */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <GlassCard variant="dark" sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <LocalOffer sx={{ color: theme.functional.info.main }} />
                  <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Подсказки</Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: 2, background: `${theme.functional.info.main}10`, border: `1px solid ${theme.functional.info.main}30`, mb: 2 }}>
                  <Typography variant="body2" sx={{ color: theme.text.secondary, lineHeight: 1.6 }}>
                    <strong style={{ color: theme.text.primary }}>SLA</strong> — время, за которое инженер должен начать работу над заявкой.
                  </Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: 2, background: `${theme.functional.success.main}10`, border: `1px solid ${theme.functional.success.main}30`, mb: 2 }}>
                  <Typography variant="body2" sx={{ color: theme.text.secondary, lineHeight: 1.6 }}>
                    Рекомендуем устанавливать <strong style={{ color: theme.functional.success.main }}>SLA ≤ 2 часов</strong> для критичных категорий.
                  </Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: 2, background: `${theme.functional.warning.main}10`, border: `1px solid ${theme.functional.warning.main}30` }}>
                  <Typography variant="body2" sx={{ color: theme.text.secondary, lineHeight: 1.6 }}>
                    Категории с <strong style={{ color: theme.functional.warning.main }}>SLA {'>'} 4 часов</strong> могут снижать удовлетворённость пользователей.
                  </Typography>
                </Box>
              </GlassCard>
            </motion.div>
          </Box>

          {/* ПРАВАЯ КОЛОНКА */}
          <Box sx={{ flex: 1, minWidth: 0 }}>

            {/* Заголовок */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Category sx={{ color: theme.functional.warning.main }} />
                  <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Все категории</Typography>
                  <Chip label={totalCategories} size="small" sx={{ ml: 1, backgroundColor: theme.functional.warning.main, color: '#fff', fontWeight: 700 }} />
                </Box>
              </Box>
            </motion.div>

            {/* Список категорий */}
            {categories.length === 0 ? (
              <GlassCard variant="dark" sx={{ p: 6, textAlign: 'center' }}>
                <Folder sx={{ fontSize: 64, color: theme.text.disabled, mb: 2 }} />
                <Typography variant="h6" sx={{ color: theme.text.primary, mb: 1 }}>Категории не найдены</Typography>
                <Typography sx={{ color: theme.text.disabled }}>Создайте первую категорию для организации заявок</Typography>
              </GlassCard>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {categories.map((category, index) => {
                  const colorSet = getCategoryColor(index);
                  const slaColor = getSLAColor(category.slaTime);
                  
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <GlassCard
                        variant="dark"
                        sx={{
                          p: 3,
                          border: `2px solid ${theme.border.main}`,
                          '&:hover': {
                            border: `2px solid ${colorSet.border}`,
                            boxShadow: `0 10px 30px ${colorSet.border}25`
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          
                          {/* Иконка */}
                          <Avatar sx={{
                            width: 60,
                            height: 60,
                            background: colorSet.gradient,
                            boxShadow: `0 8px 20px ${colorSet.border}40`
                          }}>
                            <Category sx={{ fontSize: 28, color: '#fff' }} />
                          </Avatar>

                          {/* Контент */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700, mb: 0.5 }}>
                              {category.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.text.secondary, mb: 1.5, lineHeight: 1.5 }}>
                              {category.description || 'Описание не указано'}
                            </Typography>
                            
                            {/* SLA и метки */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                              <Chip
                                icon={<AccessTime sx={{ fontSize: 14 }} />}
                                label={formatSLATime(category.slaTime)}
                                size="small"
                                sx={{
                                  background: `${slaColor}20`,
                                  color: slaColor,
                                  border: `1px solid ${slaColor}`,
                                  fontWeight: 700
                                }}
                              />
                              <Chip
                                label={getSLALabel(category.slaTime)}
                                size="small"
                                sx={{
                                  background: theme.background.elevated,
                                  color: theme.text.secondary,
                                  fontWeight: 600
                                }}
                              />
                              {category.articlesCount > 0 && (
                                <Chip
                                  icon={<Assignment sx={{ fontSize: 14 }} />}
                                  label={`${category.articlesCount} заявок`}
                                  size="small"
                                  sx={{
                                    background: `${theme.functional.info.main}15`,
                                    color: theme.functional.info.main,
                                    border: `1px solid ${theme.functional.info.main}`,
                                    fontWeight: 600
                                  }}
                                />
                              )}
                            </Box>
                          </Box>

                          {/* Действия */}
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Редактировать">
                              <IconButton
                                onClick={() => handleOpenDialog(category)}
                                sx={{
                                  backgroundColor: `${theme.functional.info.main}20`,
                                  color: theme.functional.info.main,
                                  border: `2px solid ${theme.functional.info.main}`,
                                  width: 40,
                                  height: 40,
                                  '&:hover': {
                                    backgroundColor: theme.functional.info.main,
                                    color: '#fff'
                                  }
                                }}
                              >
                                <Edit sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Удалить">
                              <IconButton
                                onClick={() => setDeleteConfirmId(category.id)}
                                sx={{
                                  backgroundColor: `${theme.functional.error.main}20`,
                                  color: theme.functional.error.main,
                                  border: `2px solid ${theme.functional.error.main}`,
                                  width: 40,
                                  height: 40,
                                  '&:hover': {
                                    backgroundColor: theme.functional.error.main,
                                    color: '#fff'
                                  }
                                }}
                              >
                                <Delete sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </Box>
            )}
          </Box>
        </Box>

        {/* ДИАЛОГ СОЗДАНИЯ/РЕДАКТИРОВАНИЯ */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: '#1a1a2e',
              border: `1px solid ${theme.border.main}`,
              borderRadius: 4,
              overflow: 'hidden'
            }
          }}
        >
          {/* Шапка с градиентом */}
          <Box sx={{ 
            background: editingCategory 
              ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
              : 'linear-gradient(135deg, #f59e0b, #ea580c)', 
            p: 3, 
            position: 'relative', 
            overflow: 'hidden' 
          }}>
            <Box sx={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ position: 'absolute', bottom: -30, left: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
              <Avatar sx={{ width: 60, height: 60, background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.4)' }}>
                {editingCategory ? <Edit sx={{ color: '#fff', fontSize: 28 }} /> : <Add sx={{ color: '#fff', fontSize: 28 }} />}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800 }}>
                  {editingCategory ? 'Редактировать категорию' : 'Новая категория'}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                  {editingCategory ? 'Изменение параметров категории' : 'Создание новой категории услуг'}
                </Typography>
              </Box>
            </Box>
          </Box>

          <DialogContent sx={{ p: 2.5, background: '#1a1a2e' }}>
            {/* Название */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: '0.7rem', mb: 0.5, display: 'block' }}>
                Название категории
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                p: 1.5, 
                borderRadius: 2, 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)',
                '&:focus-within': { border: '1px solid rgba(245, 158, 11, 0.5)', background: 'rgba(255,255,255,0.08)' }
              }}>
                <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #f59e0b, #ea580c)' }}>
                  <Category sx={{ color: '#fff', fontSize: 18 }} />
                </Avatar>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Например: Проблемы с оборудованием"
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontWeight: 500, fontFamily: 'inherit' }}
                />
              </Box>
            </Box>

            {/* Описание */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: '0.7rem', mb: 0.5, display: 'block' }}>
                Описание
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 1.5, 
                p: 1.5, 
                borderRadius: 2, 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)',
                '&:focus-within': { border: '1px solid rgba(245, 158, 11, 0.5)', background: 'rgba(255,255,255,0.08)' }
              }}>
                <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
                  <Assignment sx={{ color: '#fff', fontSize: 18 }} />
                </Avatar>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Краткое описание категории..."
                  rows={3}
                  style={{ 
                    flex: 1, 
                    background: 'transparent', 
                    border: 'none', 
                    outline: 'none', 
                    color: '#fff', 
                    fontSize: '0.95rem', 
                    fontWeight: 500, 
                    fontFamily: 'inherit',
                    resize: 'none',
                    lineHeight: 1.5
                  }}
                />
              </Box>
            </Box>

            {/* SLA */}
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: '0.7rem', mb: 0.5, display: 'block' }}>
                SLA (время реакции)
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                p: 1.5, 
                borderRadius: 2, 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)',
                '&:focus-within': { border: '1px solid rgba(245, 158, 11, 0.5)', background: 'rgba(255,255,255,0.08)' }
              }}>
                <Avatar sx={{ width: 36, height: 36, background: `linear-gradient(135deg, ${getSLAColor(formData.slaTime)}, ${getSLAColor(formData.slaTime)}CC)` }}>
                  <AccessTime sx={{ color: '#fff', fontSize: 18 }} />
                </Avatar>
                <input
                  type="number"
                  value={formData.slaTime}
                  onChange={(e) => setFormData({ ...formData, slaTime: parseInt(e.target.value) || 0 })}
                  placeholder="120"
                  min="1"
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontWeight: 500, fontFamily: 'inherit' }}
                />
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 500 }}>
                  минут
                </Typography>
                <Chip 
                  label={getSLALabel(formData.slaTime)} 
                  size="small" 
                  sx={{ 
                    background: `${getSLAColor(formData.slaTime)}20`, 
                    color: getSLAColor(formData.slaTime), 
                    fontWeight: 600,
                    border: `1px solid ${getSLAColor(formData.slaTime)}50`
                  }} 
                />
              </Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.5, display: 'block', pl: 1 }}>
                Время, за которое инженер должен начать работу над заявкой
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', background: '#1a1a2e', justifyContent: 'flex-end', gap: 1 }}>
            <Button 
              onClick={handleCloseDialog} 
              variant="contained" 
              sx={{ 
                background: 'rgba(255,255,255,0.1)', 
                color: '#fff', 
                fontWeight: 600,
                border: '2px solid transparent', 
                '&:hover': { background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)' } 
              }}
            >
              Отмена
            </Button>
            <Button 
              onClick={handleSave} 
              variant="contained" 
              disabled={!formData.name.trim()}
              sx={{ 
                background: editingCategory 
                  ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                  : 'linear-gradient(135deg, #f59e0b, #ea580c)', 
                color: '#fff',
                fontWeight: 700, 
                border: '2px solid transparent', 
                '&:hover': { border: '2px solid #fff' }, 
                '&:disabled': { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' } 
              }}
            >
              {editingCategory ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* ДИАЛОГ УДАЛЕНИЯ */}
        <Dialog
          open={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
          PaperProps={{
            sx: {
              background: '#1a1a2e',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 4,
              overflow: 'hidden'
            }
          }}
        >
          <Box sx={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 50, height: 50, background: 'rgba(255,255,255,0.2)' }}>
                <Delete sx={{ color: '#fff', fontSize: 24 }} />
              </Avatar>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>Удаление категории</Typography>
            </Box>
          </Box>
          <DialogContent sx={{ p: 2.5, background: '#1a1a2e', textAlign: 'center' }}>
            <Typography sx={{ color: '#fff', fontSize: '1rem' }}>
              Вы уверены, что хотите удалить эту категорию?
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }}>
              Это действие нельзя отменить
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', background: '#1a1a2e', justifyContent: 'center' }}>
            <Button onClick={() => setDeleteConfirmId(null)} sx={{ color: '#fff' }}>Отмена</Button>
            <Button 
              onClick={() => handleDelete(deleteConfirmId)} 
              variant="contained" 
              sx={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', fontWeight: 700 }}
            >
              Удалить
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Box>
  );
};

export default Categories;