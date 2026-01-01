import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ticketService from '../services/ticketService';
import categoryService from '../services/categoryService';
import GlassCard from '../components/GlassCard';
import theme from '../theme/theme';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Alert,
  Chip,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  IconButton,
  Tooltip,
  LinearProgress,
  Fade,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Title,
  Description,
  Category,
  PriorityHigh,
  CheckCircle,
  Info,
  Lightbulb,
  Send,
  Close,
  NavigateNext,
  NavigateBefore,
  Add
} from '@mui/icons-material';
import {
  Sparkles
} from 'lucide-react';

const CreateTicket = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    priority: 'medium'
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const steps = ['Основная информация', 'Детали', 'Подтверждение'];

  const priorityConfig = {
    low: { 
      label: 'Низкий', 
      color: '#10b981',
      description: 'Некритичные вопросы',
      icon: '🟢'
    },
    medium: { 
      label: 'Средний', 
      color: '#f59e0b',
      description: 'Стандартные запросы',
      icon: '🟡'
    },
    high: { 
      label: 'Высокий', 
      color: '#f97316',
      description: 'Требует быстрого решения',
      icon: '🟠'
    },
    critical: { 
      label: 'Критичный', 
      color: '#ef4444',
      description: 'Блокирующие проблемы',
      icon: '🔴'
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data.categories);
    } catch (err) {
      console.error('Ошибка загрузки категорий');
    }
  };

  const validateField = (name, value) => {
    const errors = { ...validationErrors };
    
    switch (name) {
      case 'title':
        if (!value.trim()) {
          errors.title = 'Тема обязательна';
        } else if (value.trim().length < 5) {
          errors.title = 'Тема должна содержать минимум 5 символов';
        } else {
          delete errors.title;
        }
        break;
      case 'description':
        if (!value.trim()) {
          errors.description = 'Описание обязательно';
        } else if (value.trim().length < 10) {
          errors.description = 'Описание должно содержать минимум 10 символов';
        } else {
          delete errors.description;
        }
        break;
      case 'categoryId':
        if (!value) {
          errors.categoryId = 'Выберите категорию';
        } else {
          delete errors.categoryId;
        }
        break;
      default:
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    validateField(name, value);
  };

  const getSelectedCategory = () => {
    return categories.find(cat => cat.id === formData.categoryId);
  };

  const canProceedToNextStep = () => {
    switch (activeStep) {
      case 0:
        return formData.title.trim().length >= 5 && formData.description.trim().length >= 10;
      case 1:
        return formData.categoryId && formData.priority;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceedToNextStep() && activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const isValid = ['title', 'description', 'categoryId'].every(field => 
      validateField(field, formData[field])
    );

    if (!isValid) {
      setLoading(false);
      setError('Пожалуйста, исправьте ошибки в форме');
      return;
    }

    try {
      const ticketData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        categoryId: formData.categoryId || null,
        autoAssign: true
      };

      const response = await ticketService.createTicket(ticketData);
      
      if (response.autoAssignment?.success) {
        console.log(`✅ Заявка автоматически назначена на: ${response.autoAssignment.engineerName}`);
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/tickets');
      }, 2000);
    } catch (err) {
      console.error('❌ Ошибка:', err);
      setError(err.response?.data?.message || 'Ошибка создания заявки');
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: 2,
      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
      '&:hover fieldset': { borderColor: '#3b82f6' },
      '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
    },
    '& .MuiOutlinedInput-input': { color: '#fff' },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' },
    '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.5)' },
  };

  // Успешное создание
  if (success) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard variant="dark" sx={{ p: 6, textAlign: 'center', maxWidth: 500 }}>
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              <CheckCircle sx={{ fontSize: 80, color: '#10b981', mb: 3 }} />
            </motion.div>
            
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, mb: 2 }}>
              🎉 Заявка создана!
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 4 }}>
              Заявка успешно отправлена и автоматически назначена на инженера
            </Typography>
            
            <LinearProgress 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 1,
                '& .MuiLinearProgress-bar': { backgroundColor: '#10b981' }
              }} 
            />
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', mt: 2, fontSize: '0.875rem' }}>
              Перенаправление...
            </Typography>
          </GlassCard>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        {/* Шапка */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard variant="dark" sx={{ mb: 3, overflow: 'hidden' }}>
            <Box sx={{ 
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
              p: 3, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 50, height: 50, background: 'rgba(255,255,255,0.2)' }}>
                  <Add sx={{ fontSize: 28, color: '#fff' }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800 }}>
                    Новая заявка
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>
                    Заполните форму для создания обращения
                  </Typography>
                </Box>
              </Box>
              <IconButton 
                onClick={() => navigate('/tickets')} 
                sx={{ color: '#fff', backgroundColor: 'rgba(255,255,255,0.1)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}
              >
                <Close />
              </IconButton>
            </Box>

            {/* Stepper */}
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        '& .MuiStepLabel-label': {
                          color: 'rgba(255,255,255,0.5)',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          '&.Mui-active': { color: '#3b82f6' },
                          '&.Mui-completed': { color: '#10b981' }
                        },
                        '& .MuiStepIcon-root': {
                          color: 'rgba(255,255,255,0.2)',
                          '&.Mui-active': { color: '#3b82f6' },
                          '&.Mui-completed': { color: '#10b981' }
                        }
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* Контент формы */}
            <Box sx={{ p: 4 }}>
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#fff' }}>
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <Box component="form" onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {/* Шаг 1: Основная информация */}
                  {activeStep === 0 && (
                    <motion.div
                      key="step0"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {/* Инфо о автоназначении */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        p: 2, 
                        mb: 3, 
                        borderRadius: 2, 
                        background: 'rgba(59, 130, 246, 0.1)', 
                        border: '1px solid rgba(59, 130, 246, 0.3)' 
                      }}>
                        <Sparkles size={20} color="#3b82f6" />
                        <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}>
                          <strong>Автоматическое распределение:</strong> Заявка будет назначена на наименее загруженного инженера
                        </Typography>
                      </Box>

                      <TextField
                        fullWidth
                        required
                        label="Тема заявки"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        error={!!validationErrors.title}
                        helperText={validationErrors.title || 'Кратко опишите суть проблемы'}
                        sx={{ mb: 3, ...inputStyles }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><Title sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment>,
                        }}
                      />

                      <TextField
                        fullWidth
                        required
                        multiline
                        rows={5}
                        label="Подробное описание"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        error={!!validationErrors.description}
                        helperText={validationErrors.description || 'Детально опишите проблему'}
                        sx={{ mb: 3, ...inputStyles }}
                      />

                      {/* Подсказки */}
                      <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Lightbulb sx={{ color: '#10b981', fontSize: 20 }} />
                          <Typography sx={{ color: '#10b981', fontWeight: 600, fontSize: '0.875rem' }}>Полезные советы</Typography>
                        </Box>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                          • Укажите время возникновения проблемы<br/>
                          • Опишите шаги для воспроизведения ошибки<br/>
                          • Приложите скриншоты если возможно
                        </Typography>
                      </Box>
                    </motion.div>
                  )}

                  {/* Шаг 2: Детали */}
                  {activeStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <TextField
                        fullWidth
                        required
                        select
                        label="Категория"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        error={!!validationErrors.categoryId}
                        helperText={validationErrors.categoryId || 'Выберите подходящую категорию'}
                        sx={{ mb: 3, ...inputStyles }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><Category sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment>,
                        }}
                        SelectProps={{
                          MenuProps: {
                            PaperProps: {
                              sx: {
                                backgroundColor: '#1a1a2e',
                                border: '1px solid rgba(255,255,255,0.1)',
                                '& .MuiMenuItem-root': {
                                  color: '#fff',
                                  '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.2)' },
                                  '&.Mui-selected': { backgroundColor: 'rgba(59, 130, 246, 0.3)' }
                                }
                              }
                            }
                          }
                        }}
                      >
                        {categories.length === 0 ? (
                          <MenuItem value="">Загрузка...</MenuItem>
                        ) : (
                          categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                <span>{cat.name}</span>
                                <Chip 
                                  label={`SLA: ${cat.slaTime} мин`} 
                                  size="small"
                                  sx={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontSize: '0.7rem' }}
                                />
                              </Box>
                            </MenuItem>
                          ))
                        )}
                      </TextField>

                      {getSelectedCategory() && (
                        <Box sx={{ p: 2, mb: 3, borderRadius: 2, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                            <Typography sx={{ color: '#fff', fontWeight: 600 }}>{getSelectedCategory().name}</Typography>
                          </Box>
                          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', mt: 0.5 }}>
                            Время реакции по SLA: {getSelectedCategory().slaTime} минут
                          </Typography>
                        </Box>
                      )}

                      <Typography sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>Приоритет заявки</Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                        {Object.entries(priorityConfig).map(([value, config]) => (
                          <motion.div key={value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Box
                              onClick={() => setFormData({...formData, priority: value})}
                              sx={{ 
                                p: 2, 
                                borderRadius: 2, 
                                cursor: 'pointer',
                                background: formData.priority === value ? `${config.color}20` : 'rgba(255,255,255,0.05)',
                                border: formData.priority === value ? `2px solid ${config.color}` : '2px solid rgba(255,255,255,0.1)',
                                transition: 'all 0.2s',
                                '&:hover': { borderColor: config.color }
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <span>{config.icon}</span>
                                <Typography sx={{ color: formData.priority === value ? config.color : '#fff', fontWeight: 600 }}>
                                  {config.label}
                                </Typography>
                              </Box>
                              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                                {config.description}
                              </Typography>
                            </Box>
                          </motion.div>
                        ))}
                      </Box>
                    </motion.div>
                  )}

                  {/* Шаг 3: Подтверждение */}
                  {activeStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                          <CheckCircle sx={{ fontSize: 50, color: '#10b981', mb: 2 }} />
                        </motion.div>
                        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
                          Проверьте данные
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          Убедитесь, что всё указано корректно
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ p: 3, borderRadius: 2, background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Тема</Typography>
                          <Typography sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>{formData.title}</Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Описание</Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>{formData.description}</Typography>
                        </Box>

                        <Box sx={{ p: 3, borderRadius: 2, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Категория</Typography>
                              <Typography sx={{ color: '#fff', fontWeight: 600 }}>{getSelectedCategory()?.name}</Typography>
                              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                                SLA: {getSelectedCategory()?.slaTime} минут
                              </Typography>
                            </Box>
                            <Chip 
                              icon={<span style={{ marginLeft: 8 }}>{priorityConfig[formData.priority]?.icon}</span>}
                              label={priorityConfig[formData.priority]?.label}
                              sx={{ 
                                backgroundColor: priorityConfig[formData.priority]?.color,
                                color: '#fff',
                                fontWeight: 600
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Кнопки навигации */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <Button
                    onClick={activeStep === 0 ? () => navigate('/tickets') : handleBack}
                    startIcon={activeStep === 0 ? <Close /> : <NavigateBefore />}
                    sx={{ 
                      color: '#fff', 
                      borderColor: 'rgba(255,255,255,0.3)',
                      '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' }
                    }}
                    variant="outlined"
                  >
                    {activeStep === 0 ? 'Отмена' : 'Назад'}
                  </Button>

                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                      sx={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        px: 4,
                        '&:hover': { background: 'linear-gradient(135deg, #059669, #047857)' },
                        '&:disabled': { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }
                      }}
                    >
                      {loading ? 'Создание...' : 'Создать заявку'}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      variant="contained"
                      disabled={!canProceedToNextStep()}
                      endIcon={<NavigateNext />}
                      sx={{
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        px: 4,
                        '&:hover': { background: 'linear-gradient(135deg, #1d4ed8, #1e40af)' },
                        '&:disabled': { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }
                      }}
                    >
                      Далее
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </GlassCard>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CreateTicket;