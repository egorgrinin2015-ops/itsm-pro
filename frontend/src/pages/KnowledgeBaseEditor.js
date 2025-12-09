import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import kbService from '../services/kbService';
import categoryService from '../services/categoryService';
import GlassCard from '../components/GlassCard';
import theme from '../theme/theme';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Add,
  Close
} from '@mui/icons-material';

const KnowledgeBaseEditor = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
    keywords: [],
    isPublished: false
  });
  const [categories, setCategories] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();
  const { isManager } = useAuth();

  const isEditMode = !!id;

  useEffect(() => {
    if (!isManager) {
      navigate('/kb');
      return;
    }
    loadCategories();
    if (isEditMode) {
      loadArticle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isManager]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data.categories);
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err);
    }
  };

  const loadArticle = async () => {
    try {
      setLoading(true);
      const data = await kbService.getArticleById(id);
      setFormData({
        title: data.title,
        content: data.content,
        categoryId: data.categoryId || '',
        keywords: data.keywords || [],
        isPublished: data.isPublished
      });
    } catch (err) {
      setError('Ошибка загрузки статьи');
    } finally {
      setLoading(false);
    }
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      const newKeyword = keywordInput.trim().toLowerCase();
      if (!formData.keywords.includes(newKeyword)) {
        setFormData({
          ...formData,
          keywords: [...formData.keywords, newKeyword]
        });
      }
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Заполните все обязательные поля');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      if (isEditMode) {
        await kbService.updateArticle(id, formData);
        setSuccess('Статья успешно обновлена');
      } else {
        await kbService.createArticle(formData);
        setSuccess('Статья успешно создана');
      }
      
      setTimeout(() => {
        navigate('/kb');
      }, 1500);
    } catch (err) {
      setError(isEditMode ? 'Ошибка обновления статьи' : 'Ошибка создания статьи');
    } finally {
      setLoading(false);
    }
  };

  if (!isManager) {
    return null;
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', pb: 4 }}>
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 10 }}>
        {/* Кнопка назад */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/kb')}
            sx={{
              color: theme.text.primary,
              mb: 3,
              '&:hover': {
                background: theme.background.elevated
              }
            }}
          >
            Назад к базе знаний
          </Button>
        </motion.div>

        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard variant="dark" sx={{ p: 4, mb: 3 }}>
            <Typography
              variant="h3"
              sx={{
                color: theme.text.primary,
                fontWeight: 900,
                background: `linear-gradient(135deg, ${theme.text.primary} 0%, ${theme.functional.success.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {isEditMode ? 'Редактировать статью' : 'Создать статью'}
            </Typography>
          </GlassCard>
        </motion.div>

        {/* Уведомления */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                backgroundColor: theme.functional.error.bg,
                color: theme.text.primary,
                border: `1px solid ${theme.functional.error.border}`,
                '& .MuiAlert-icon': { color: theme.functional.error.main }
              }} 
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                backgroundColor: theme.functional.success.bg,
                color: theme.text.primary,
                border: `1px solid ${theme.functional.success.border}`,
                '& .MuiAlert-icon': { color: theme.functional.success.main }
              }}
            >
              {success}
            </Alert>
          </motion.div>
        )}

        {/* Форма */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard variant="dark" sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              {/* Заголовок статьи */}
              <TextField
                fullWidth
                label="Заголовок статьи *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                margin="normal"
                disabled={loading}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
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
                      opacity: 0.9
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#ffffff',
                    opacity: 0.9,
                    fontWeight: 600,
                    '&.Mui-focused': { color: theme.functional.success.main },
                  },
                }}
              />

              {/* Категория */}
              <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                <InputLabel sx={{ color: '#ffffff', opacity: 0.9, fontWeight: 600, '&.Mui-focused': { color: theme.functional.success.main } }}>
                  Категория
                </InputLabel>
                <Select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  disabled={loading}
                  sx={{
                    backgroundColor: theme.background.elevated,
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.border.main },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.functional.success.main },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.functional.success.main },
                    '& .MuiSelect-select': {
                      color: '#ffffff',
                      fontWeight: 500
                    },
                    '& .MuiSelect-icon': {
                      color: '#ffffff'
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: theme.background.secondary,
                        '& .MuiMenuItem-root': {
                          color: theme.text.primary,
                          '&:hover': {
                            backgroundColor: theme.background.elevated,
                          },
                          '&.Mui-selected': {
                            backgroundColor: `${theme.functional.success.main}33`,
                            '&:hover': {
                              backgroundColor: `${theme.functional.success.main}4D`,
                            }
                          }
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value="">Без категории</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Содержание */}
              <TextField
                fullWidth
                label="Содержание статьи *"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                margin="normal"
                multiline
                rows={15}
                disabled={loading}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
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
                      opacity: 0.9
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#ffffff',
                    opacity: 0.9,
                    fontWeight: 600,
                    '&.Mui-focused': { color: theme.functional.success.main },
                  },
                }}
                helperText="Опишите решение проблемы максимально подробно"
                FormHelperTextProps={{
                  sx: { color: theme.text.disabled }
                }}
              />

              {/* Ключевые слова */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: theme.text.primary, mb: 2, fontWeight: 700 }}>
                  Ключевые слова
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Добавить ключевое слово"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
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
                          opacity: 0.9
                        }
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddKeyword}
                    disabled={loading || !keywordInput.trim()}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.functional.success.main} 0%, #059669 100%)`,
                      minWidth: 120,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      },
                      '&:disabled': {
                        background: theme.background.secondary,
                        color: theme.text.disabled,
                      }
                    }}
                  >
                    Добавить
                  </Button>
                </Box>

                {/* Список ключевых слов */}
                {formData.keywords.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {formData.keywords.map((keyword, index) => (
                      <Chip
                        key={index}
                        label={keyword}
                        onDelete={() => handleRemoveKeyword(keyword)}
                        deleteIcon={<Close />}
                        sx={{
                          background: `${theme.primary.main}33`,
                          color: theme.primary.main,
                          fontWeight: 600,
                          '& .MuiChip-deleteIcon': {
                            color: theme.primary.main,
                            '&:hover': {
                              color: theme.primary.light
                            }
                          }
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>

              {/* Публикация */}
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    disabled={loading}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: theme.functional.success.main,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: theme.functional.success.main,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: theme.text.primary, fontWeight: 600 }}>
                    {formData.isPublished ? 'Опубликовать статью' : 'Сохранить как черновик'}
                  </Typography>
                }
                sx={{ mb: 3 }}
              />

              {/* Кнопки */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/kb')}
                  disabled={loading}
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
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                    disabled={loading || !formData.title.trim() || !formData.content.trim()}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.functional.success.main} 0%, #059669 100%)`,
                      px: 4,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1rem',
                      boxShadow: `0 8px 25px ${theme.functional.success.main}66`,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        boxShadow: `0 15px 40px ${theme.functional.success.main}99`,
                      },
                      '&:disabled': {
                        background: theme.background.secondary,
                        color: theme.text.disabled,
                      }
                    }}
                  >
                    {loading ? 'Сохранение...' : (isEditMode ? 'Обновить' : 'Создать')}
                  </Button>
                </motion.div>
              </Box>
            </form>
          </GlassCard>
        </motion.div>
      </Container>
    </Box>
  );
};

export default KnowledgeBaseEditor;