import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import categoryService from '../services/categoryService';
import GlassCard from '../components/GlassCard';
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

      {/* ЦВЕТНЫЕ АКЦЕНТЫ ДЛЯ АДМИНКИ */}
      <Box
        sx={{
          position: 'absolute !important',
          top: '0 !important',
          left: '0 !important',
          right: '0 !important',
          bottom: '0 !important',
          background: `
            radial-gradient(ellipse at 25% 25%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 75% 75%, rgba(59, 130, 246, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 10%, rgba(34, 197, 94, 0.2) 0%, transparent 40%),
            radial-gradient(ellipse at 10% 90%, rgba(251, 191, 36, 0.15) 0%, transparent 25%)
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
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
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
            background: `rgba(${139 + i * 8}, ${92 + i * 10}, 246, 0.7)`,
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
    if (slaTime <= 60) return '#10b981'; // Зеленый
    if (slaTime <= 120) return '#f59e0b'; // Желтый
    if (slaTime <= 240) return '#ef4444'; // Красный
    return '#8b5cf6'; // Фиолетовый
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
              <Settings size={64} color="#ef4444" style={{ marginBottom: 16 }} />
            </motion.div>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
              Доступ запрещен
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
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
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 20px 60px rgba(139, 92, 246, 0.4)'
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
                      color: '#ffffff !important',
                      textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 30px rgba(139, 92, 246, 0.5)',
                      mb: 1,
                      background: 'linear-gradient(135deg, #ffffff 0%, #8b5cf6 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    🏷️ Категории услуг
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
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
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                      boxShadow: '0 15px 40px rgba(139, 92, 246, 0.6)',
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
                    color: 'white',
                    '& .MuiAlert-icon': { color: '#ef4444' }
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
                      sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }}
                    />
                    <Skeleton 
                      variant="rectangular" 
                      width={300} 
                      height={40} 
                      sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }}
                    />
                    <Skeleton 
                      variant="rectangular" 
                      width={100} 
                      height={40} 
                      sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }}
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
                        color: 'rgba(255, 255, 255, 0.9)', 
                        fontWeight: 700, 
                        fontSize: '1rem',
                        borderBottom: '2px solid rgba(139, 92, 246, 0.3)',
                        background: 'rgba(139, 92, 246, 0.1)'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ViewList size={20} />
                          Название
                        </Box>
                      </TableCell>
                      <TableCell sx={{ 
                        color: 'rgba(255, 255, 255, 0.9)', 
                        fontWeight: 700, 
                        fontSize: '1rem',
                        borderBottom: '2px solid rgba(139, 92, 246, 0.3)',
                        background: 'rgba(139, 92, 246, 0.1)'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Info size={20} />
                          Описание
                        </Box>
                      </TableCell>
                      <TableCell sx={{ 
                        color: 'rgba(255, 255, 255, 0.9)', 
                        fontWeight: 700, 
                        fontSize: '1rem',
                        borderBottom: '2px solid rgba(139, 92, 246, 0.3)',
                        background: 'rgba(139, 92, 246, 0.1)'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime size={20} />
                          SLA
                        </Box>
                      </TableCell>
                      <TableCell sx={{ 
                        color: 'rgba(255, 255, 255, 0.9)', 
                        fontWeight: 700, 
                        fontSize: '1rem',
                        borderBottom: '2px solid rgba(139, 92, 246, 0.3)',
                        background: 'rgba(139, 92, 246, 0.1)'
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
                          color: 'rgba(255, 255, 255, 0.7)',
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
                            <Typography variant="body2" sx={{ opacity: 0.6 }}>
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
                          whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                          style={{ cursor: 'pointer' }}
                        >
                          <TableCell sx={{ 
                            color: 'white', 
                            fontWeight: 600,
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            {category.name}
                          </TableCell>
                          <TableCell sx={{ 
                            color: 'rgba(255, 255, 255, 0.8)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            maxWidth: 300
                          }}>
                            {category.description}
                          </TableCell>
                          <TableCell sx={{ 
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={`${category.slaTime} мин`}
                                size="small"
                                sx={{
                                  background: `linear-gradient(135deg, ${getSLAColor(category.slaTime)}, ${getSLAColor(category.slaTime)}cc)`,
                                  color: 'white',
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
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Редактировать">
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenDialog(category)}
                                    sx={{
                                      background: 'rgba(59, 130, 246, 0.2)',
                                      color: '#3b82f6',
                                      '&:hover': {
                                        background: 'rgba(59, 130, 246, 0.3)',
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
                                      background: 'rgba(239, 68, 68, 0.2)',
                                      color: '#ef4444',
                                      '&:hover': {
                                        background: 'rgba(239, 68, 68, 0.3)',
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

        {/* Диалог создания/редактирования */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8)'
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTitle sx={{ 
              color: 'white', 
              fontWeight: 700, 
              fontSize: '1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              {editingCategory ? '✏️ Редактировать категорию' : '➕ Создать категорию'}
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
              <TextField
                fullWidth
                label="Название"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(139, 92, 246, 0.8)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8b5cf6',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#8b5cf6',
                    },
                  },
                }}
              />
              
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
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(139, 92, 246, 0.8)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8b5cf6',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#8b5cf6',
                    },
                  },
                }}
              />
              
              <TextField
                fullWidth
                label="SLA время (минуты)"
                type="number"
                value={formData.slaTime}
                onChange={(e) => setFormData({ ...formData, slaTime: parseInt(e.target.value) || 0 })}
                margin="normal"
                helperText="Время реакции на заявки данной категории"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(139, 92, 246, 0.8)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8b5cf6',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#8b5cf6',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    color: 'rgba(255, 255, 255, 0.6)',
                  },
                }}
              />
            </DialogContent>
            
            <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={handleCloseDialog}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.6)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                    fontWeight: 700,
                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                      boxShadow: '0 8px 25px rgba(139, 92, 246, 0.6)',
                    },
                    '&:disabled': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.3)',
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
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 4,
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8)'
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTitle sx={{ color: '#ef4444', fontWeight: 700, textAlign: 'center' }}>
              ⚠️ Подтверждение удаления
            </DialogTitle>
            
            <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
              <Typography sx={{ color: 'white', fontSize: '1.1rem' }}>
                Вы уверены, что хотите удалить эту категорию?
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
                Это действие нельзя отменить
              </Typography>
            </DialogContent>
            
            <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={() => setDeleteConfirmId(null)}
                  variant="outlined"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.6)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    fontWeight: 700,
                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                      boxShadow: '0 8px 25px rgba(239, 68, 68, 0.6)',
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