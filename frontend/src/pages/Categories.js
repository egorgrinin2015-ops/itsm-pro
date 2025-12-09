import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import categoryService from '../services/categoryService';
import GlassCard from '../components/GlassCard';
import theme from '../theme/theme';
import {
  Container,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  Skeleton,
  GlobalStyles
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  AccessTime,
  Category,
  Info,
  Settings,
  FilterList,
  ViewList,
  Dashboard
} from '@mui/icons-material';

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

// IT-фон для админ-панели
const AdminBackground = () => {
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

      {/* ЦВЕТНЫЕ АКЦЕНТЫ ДЛЯ АДМИНКИ */}
      <Box
        sx={{
          position: 'absolute !important',
          top: '0 !important',
          left: '0 !important',
          right: '0 !important',
          bottom: '0 !important',
          background: `
            radial-gradient(ellipse at 25% 25%, ${theme.primary.main}4D 0%, transparent 50%),
            radial-gradient(ellipse at 75% 75%, ${theme.functional.info.main}40 0%, transparent 50%),
            radial-gradient(ellipse at 50% 10%, ${theme.functional.success.main}33 0%, transparent 40%),
            radial-gradient(ellipse at 10% 90%, ${theme.functional.warning.main}26 0%, transparent 25%)
          `,
        }}
      />

      {/* ДВИЖУЩАЯСЯ АДМИНСКАЯ СЕТКА */}
      <motion.div
        animate={{
          x: [0, 25],
          y: [0, 25]
        }}
        transition={{
          duration: 20,
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
          backgroundSize: '25px 25px',
          pointerEvents: 'none'
        }}
      />

      {/* ПЛАВАЮЩИЕ ЧАСТИЦЫ */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -15, 0],
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 3 + i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2
          }}
          style={{
            position: 'absolute',
            left: `${15 + i * 7}%`,
            top: `${20 + (i % 4) * 20}%`,
            width: '3px',
            height: '3px',
            background: `${theme.primary.main}B3`,
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        />
      ))}
    </Box>
  );
};

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
    if (slaTime <= 60) return 'Быстро';
    if (slaTime <= 120) return 'Стандарт';
    if (slaTime <= 240) return 'Медленно';
    return 'Очень долго';
  };

  // Только менеджеры могут управлять категориями
  if (!isManager) {
    return (
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        {darkBackgroundStyles}
        <AdminBackground />
        <Container sx={{ py: 4, position: 'relative', zIndex: 10 }}>
          <GlassCard variant="colored" color="red" sx={{ p: 4, textAlign: 'center' }}>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Settings size={64} color={theme.functional.error.main} style={{ marginBottom: 16 }} />
            </motion.div>
            <Typography variant="h4" sx={{ color: theme.text.primary, fontWeight: 700, mb: 2 }}>
              Доступ запрещен
            </Typography>
            <Typography sx={{ color: theme.text.secondary, fontSize: '1.1rem' }}>
              Недостаточно прав для управления категориями
            </Typography>
          </GlassCard>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {darkBackgroundStyles}
      <AdminBackground />
      
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 10 }}>
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <GlassCard variant="dark" sx={{ p: 4, mb: 4 }}>
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
  <Category size={32} color="white" />
</Box>
                </motion.div>
                
                <Box>
<Typography 
  variant="h3" 
  sx={{ 
    fontWeight: 900,
    color: '#ffffff',
    textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 30px rgba(245, 158, 11, 0.5)',
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

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
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
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '&:hover': {
      background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
      boxShadow: '0 15px 40px rgba(245, 158, 11, 0.6)',
    }
  }}
>
  Добавить категорию
</Button>

              </motion.div>
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
              transition={{ duration: 0.3 }}
            >
              <GlassCard variant="colored" color="red" sx={{ p: 2, mb: 3 }}>
                <Alert 
                  severity="error"
                  sx={{ 
                    background: 'transparent',
                    color: theme.text.primary,
                    '& .MuiAlert-icon': { color: theme.functional.error.main }
                  }}
                >
                  {error}
                </Alert>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
{/* Таблица */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard variant="dark" sx={{ overflow: 'hidden' }}>
            {loading ? (
              <Box sx={{ p: 4 }}>
                {[...Array(5)].map((_, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                    <Skeleton 
                      variant="rectangular" 
                      width={200} 
                      height={40} 
                      sx={{ bgcolor: theme.background.elevated, borderRadius: 2 }}
                    />
                    <Skeleton 
                      variant="rectangular" 
                      width={300} 
                      height={40} 
                      sx={{ bgcolor: theme.background.elevated, borderRadius: 2 }}
                    />
                    <Skeleton 
                      variant="rectangular" 
                      width={100} 
                      height={40} 
                      sx={{ bgcolor: theme.background.elevated, borderRadius: 2 }}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ 
                        color: theme.text.primary,
                        fontWeight: 700, 
                        fontSize: '1rem',
                        borderBottom: `2px solid ${theme.primary.main}4D`,
                        background: `${theme.primary.main}1A`
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ViewList size={20} />
                          Название
                        </Box>
                      </TableCell>
                      <TableCell sx={{ 
                        color: theme.text.primary,
                        fontWeight: 700, 
                        fontSize: '1rem',
                        borderBottom: `2px solid ${theme.primary.main}4D`,
                        background: `${theme.primary.main}1A`
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Info size={20} />
                          Описание
                        </Box>
                      </TableCell>
                      <TableCell sx={{ 
                        color: theme.text.primary,
                        fontWeight: 700, 
                        fontSize: '1rem',
                        borderBottom: `2px solid ${theme.primary.main}4D`,
                        background: `${theme.primary.main}1A`
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime size={20} />
                          SLA
                        </Box>
                      </TableCell>
                      <TableCell sx={{ 
                        color: theme.text.primary,
                        fontWeight: 700, 
                        fontSize: '1rem',
                        borderBottom: `2px solid ${theme.primary.main}4D`,
                        background: `${theme.primary.main}1A`
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Settings size={20} />
                          Действия
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ 
                          py: 6, 
                          color: theme.text.secondary,
                          borderBottom: 'none'
                        }}>
                          <motion.div
                            animate={{ 
                              scale: [1, 1.1, 1],
                              opacity: [0.7, 1, 0.7]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity
                            }}
                          >
                            <Typography variant="h6" sx={{ mb: 2 }}>
                              📂 Категории не найдены
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.text.disabled }}>
                              Создайте первую категорию для организации заявок
                            </Typography>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories.map((category, index) => (
                        <motion.tr
                          key={category.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          component={TableRow}
                          whileHover={{ backgroundColor: `${theme.primary.main}0D` }}
                          style={{ cursor: 'pointer' }}
                        >
                          <TableCell sx={{ 
                            color: theme.text.primary,
                            fontWeight: 600,
                            borderBottom: `1px solid ${theme.border.main}`
                          }}>
                            {category.name}
                          </TableCell>
                          <TableCell sx={{ 
                            color: theme.text.secondary,
                            borderBottom: `1px solid ${theme.border.main}`,
                            maxWidth: 300
                          }}>
                            {category.description}
                          </TableCell>
                          <TableCell sx={{ 
                            borderBottom: `1px solid ${theme.border.main}`
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={`${category.slaTime} мин`}
                                size="small"
                                sx={{
                                  background: `linear-gradient(135deg, ${getSLAColor(category.slaTime)}, ${getSLAColor(category.slaTime)}CC)`,
                                  color: theme.text.primary,
                                  fontWeight: 600
                                }}
                              />
                              <Typography variant="caption" sx={{ 
                                color: getSLAColor(category.slaTime),
                                fontWeight: 600
                              }}>
                                {getSLALabel(category.slaTime)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ 
                            borderBottom: `1px solid ${theme.border.main}`
                          }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Редактировать">
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenDialog(category)}
                                    sx={{
                                      background: theme.functional.info.bg,
                                      color: theme.functional.info.main,
                                      '&:hover': {
                                        background: `${theme.functional.info.main}4D`,
                                      }
                                    }}
                                  >
                                    <Edit size={16} />
                                  </IconButton>
                                </motion.div>
                              </Tooltip>
                              
                              <Tooltip title="Удалить">
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <IconButton
                                    size="small"
                                    onClick={() => setDeleteConfirmId(category.id)}
                                    sx={{
                                      background: theme.functional.error.bg,
                                      color: theme.functional.error.main,
                                      '&:hover': {
                                        background: `${theme.functional.error.main}4D`,
                                      }
                                    }}
                                  >
                                    <Delete size={16} />
                                  </IconButton>
                                </motion.div>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </motion.tr>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </GlassCard>
        </motion.div>

        {/* Диалог создания/редактирования - ИСПРАВЛЕНЫ TextField */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              background: theme.background.secondary,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${theme.border.main}`,
              borderRadius: 4,
              boxShadow: theme.glass.dark.shadow
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTitle sx={{ 
              color: theme.text.primary,
              fontWeight: 700, 
              fontSize: '1.5rem',
              borderBottom: `1px solid ${theme.border.main}`
            }}>
              {editingCategory ? '✏️ Редактировать категорию' : 'Создать категорию'}
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
              {/* ПОЛЕ НАЗВАНИЕ - ИСПРАВЛЕНО */}
              <TextField
                fullWidth
                label="Название"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme.background.elevated,
                    '& fieldset': {
                      borderColor: theme.border.main,
                    },
                    '&:hover fieldset': {
                      borderColor: theme.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.primary.main,
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#ffffff',
                    fontWeight: 500,
                    '&::placeholder': {
                      color: '#ffffff',
                      opacity: 0.9
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#ffffff',
                    opacity: 0.9,
                    fontWeight: 600,
                    '&.Mui-focused': {
                      color: theme.primary.main,
                    },
                  },
                }}
              />
              
              {/* ПОЛЕ ОПИСАНИЕ - ИСПРАВЛЕНО */}
              <TextField
                fullWidth
                label="Описание"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme.background.elevated,
                    '& fieldset': {
                      borderColor: theme.border.main,
                    },
                    '&:hover fieldset': {
                      borderColor: theme.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.primary.main,
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#ffffff',
                    fontWeight: 500,
                    '&::placeholder': {
                      color: '#ffffff',
                      opacity: 0.9
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#ffffff',
                    opacity: 0.9,
                    fontWeight: 600,
                    '&.Mui-focused': {
                      color: theme.primary.main,
                    },
                  },
                }}
              />
              
              {/* ПОЛЕ SLA ВРЕМЯ - ИСПРАВЛЕНО */}
              <TextField
                fullWidth
                label="SLA (минуты)"
                type="number"
                value={formData.slaTime}
                onChange={(e) => setFormData({ ...formData, slaTime: parseInt(e.target.value) || 0 })}
                margin="normal"
                helperText="Время реакции на заявки данной категории"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme.background.elevated,
                    '& fieldset': {
                      borderColor: theme.border.main,
                    },
                    '&:hover fieldset': {
                      borderColor: theme.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.primary.main,
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#ffffff',
                    fontWeight: 500,
                    '&::placeholder': {
                      color: '#ffffff',
                      opacity: 0.9
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#ffffff',
                    opacity: 0.9,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    '&.Mui-focused': {
                      color: theme.primary.main,
                    },
                    '&.MuiInputLabel-shrink': {
                      fontSize: '0.75rem',
                      transform: 'translate(14px, -18px) scale(1)',
                      backgroundColor: theme.background.secondary,
                      px: -0.5,
                      borderRadius: '4px'
                    }
                  },
                  '& .MuiFormHelperText-root': {
                    color: theme.text.disabled,
                  },
                }}
              />
            </DialogContent>
            
            <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.border.main}` }}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={handleCloseDialog}
                  sx={{
                    color: theme.text.secondary,
                    borderColor: theme.border.main,
                    '&:hover': {
                      borderColor: theme.border.light,
                      backgroundColor: theme.background.elevated,
                    }
                  }}
                  variant="outlined"
                >
                  Отмена
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={handleSave} 
                  variant="contained"
                  disabled={!formData.name.trim()}
                  sx={{
                    background: theme.gradients.primary,
                    fontWeight: 700,
                    boxShadow: `0 4px 15px ${theme.primary.main}66`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.primary.dark} 0%, ${theme.primary.main} 100%)`,
                      boxShadow: `0 8px 25px ${theme.primary.main}99`,
                    },
                    '&:disabled': {
                      background: theme.background.secondary,
                      color: theme.text.disabled,
                    }
                  }}
                >
                  Сохранить
                </Button>
              </motion.div>
            </DialogActions>
          </motion.div>
        </Dialog>

        {/* Диалог подтверждения удаления */}
        <Dialog 
          open={!!deleteConfirmId} 
          onClose={() => setDeleteConfirmId(null)}
          PaperProps={{
            sx: {
              background: theme.background.secondary,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${theme.functional.error.border}`,
              borderRadius: 4,
              boxShadow: theme.glass.dark.shadow
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTitle sx={{ color: theme.functional.error.main, fontWeight: 700, textAlign: 'center' }}>
              ⚠️ Подтверждение удаления
            </DialogTitle>
            
            <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
              <Typography sx={{ color: theme.text.primary, fontSize: '1.1rem' }}>
                Вы уверены, что хотите удалить эту категорию?
              </Typography>
              <Typography sx={{ color: theme.text.secondary, mt: 1 }}>
                Это действие нельзя отменить
              </Typography>
            </DialogContent>
            
            <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={() => setDeleteConfirmId(null)}
                  variant="outlined"
                  sx={{
                    color: theme.text.secondary,
                    borderColor: theme.border.main,
                    '&:hover': {
                      borderColor: theme.border.light,
                      backgroundColor: theme.background.elevated,
                    }
                  }}
                >
                  Отмена
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={() => handleDelete(deleteConfirmId)}
                  variant="contained"
                  sx={{
                    background: `linear-gradient(135deg, ${theme.functional.error.main} 0%, #dc2626 100%)`,
                    fontWeight: 700,
                    boxShadow: `0 4px 15px ${theme.functional.error.main}66`,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                      boxShadow: `0 8px 25px ${theme.functional.error.main}99`,
                    }
                  }}
                >
                  Удалить
                </Button>
              </motion.div>
            </DialogActions>
          </motion.div>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Categories;