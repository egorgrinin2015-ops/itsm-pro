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
  GlobalStyles,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Title,
  Description,
  Category,
  PriorityHigh,
  Person,
  CheckCircle,
  Info,
  Lightbulb,
  Send
} from '@mui/icons-material';
import {
  Sparkles
} from 'lucide-react';

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

// Фон для формы с новой палитрой
const FormBackground = () => {
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

      {/* ЦВЕТНЫЕ АКЦЕНТЫ */}
      <Box
        sx={{
          position: 'absolute !important',
          top: '0 !important',
          left: '0 !important',
          right: '0 !important',
          bottom: '0 !important',
          background: `
            radial-gradient(ellipse at 20% 30%, ${theme.primary.main}4D 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, ${theme.primary.light}40 0%, transparent 50%),
            radial-gradient(ellipse at 50% 20%, ${theme.functional.success.main}33 0%, transparent 40%)
          `,
        }}
      />

      {/* ДВИЖУЩАЯСЯ СЕТКА */}
      <motion.div
        animate={{
          x: [0, 20],
          y: [0, 20]
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
          backgroundSize: '20px 20px',
          pointerEvents: 'none'
        }}
      />
    </Box>
  );
};

const CreateTicket = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    priority: 'medium',
    userId: ''
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { user, isEngineer } = useAuth();
  const navigate = useNavigate();

  // Шаги создания заявки
  const steps = ['Основная информация', 'Детали', 'Подтверждение'];

  // Мапинг приоритетов с новыми цветами
  const priorityConfig = {
    low: { 
      label: 'Низкий', 
      color: theme.functional.success.main,
      description: 'Некритичные вопросы',
      icon: '🟢'
    },
    medium: { 
      label: 'Средний', 
      color: theme.functional.warning.main,
      description: 'Стандартные запросы',
      icon: '🟡'
    },
    high: { 
      label: 'Высокий', 
      color: theme.functional.error.main,
      description: 'Требует быстрого решения',
      icon: '🟠'
    },
    critical: { 
      label: 'Критичный', 
      color: theme.functional.error.main,
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

    // Финальная валидация
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
        ...formData,
        userId: formData.userId || user.id
      };

      await ticketService.createTicket(ticketData);
      
      // Анимация успеха перед редиректом
      setActiveStep(steps.length);
      setTimeout(() => {
        navigate('/tickets');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка создания заявки');
    } finally {
      setLoading(false);
    }
  };

  // Рендер шагов формы
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ space: 3 }}>
              {/* ПОЛЕ "Тема заявки" - ИСПРАВЛЕНО */}
              <TextField
                fullWidth
                required
                label="Тема заявки"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!validationErrors.title}
                helperText={validationErrors.title || 'Кратко опишите суть проблемы'}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Title sx={{ color: theme.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
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
                      px: 1
                    }
                  },
                  '& .MuiFormHelperText-root': {
                    color: theme.text.disabled,
                  },
                }}
              />

              {/* ПОЛЕ "Подробное описание" - ИСПРАВЛЕНО */}
              <TextField
                fullWidth
                required
                multiline
                rows={6}
                label="Подробное описание"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!validationErrors.description}
                helperText={validationErrors.description || 'Детально опишите проблему и желаемый результат'}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <Description sx={{ color: theme.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
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
                      px: 1
                    }
                  },
                  '& .MuiFormHelperText-root': {
                    color: theme.text.disabled,
                  },
                }}
              />

              {/* Подсказки */}
              <GlassCard variant="colored" color="blue" sx={{ p: 3, mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Lightbulb sx={{ color: theme.functional.info.main }} />
                  <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 600 }}>
                    Полезные советы
                  </Typography>
                </Box>
                <Box sx={{ color: theme.text.secondary }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • Укажите точное время возникновения проблемы
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • Опишите шаги для воспроизведения ошибки
                  </Typography>
                  <Typography variant="body2">
                    • Приложите скриншоты если это возможно
                  </Typography>
                </Box>
              </GlassCard>
            </Box>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ space: 3 }}>
              {/* ПОЛЕ "Категория" - ИСПРАВЛЕНО */}
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
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Category sx={{ color: theme.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        backgroundColor: theme.background.secondary,
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${theme.border.main}`,
                        boxShadow: theme.glass.dark.shadow,
                        maxHeight: 300,
                        '& .MuiMenuItem-root': {
                          color: theme.text.primary,
                          '&:hover': {
                            backgroundColor: `${theme.primary.main}33`,
                          },
                          '&.Mui-selected': {
                            backgroundColor: `${theme.primary.main}4D`,
                            '&:hover': {
                              backgroundColor: `${theme.primary.main}66`,
                            }
                          }
                        }
                      }
                    }
                  }
                }}
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
                  '& .MuiSelect-select': {
                    color: '#ffffff',
                    fontWeight: 500
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
                      px: 1
                    }
                  },
                  '& .MuiFormHelperText-root': {
                    color: theme.text.disabled,
                  },
                }}
              >
                {categories.length === 0 ? (
                  <MenuItem value="">Загрузка...</MenuItem>
                ) : (
                  categories.map((cat) => (
                    <MenuItem 
                      key={cat.id} 
                      value={cat.id}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <span>{cat.name}</span>
                        <Chip 
                          label={`SLA: ${cat.slaTime} мин`} 
                          size="small"
                          sx={{ 
                            backgroundColor: theme.functional.success.bg,
                            color: theme.functional.success.main,
                            fontSize: '0.75rem'
                          }}
                        />
                      </Box>
                    </MenuItem>
                  ))
                )}
              </TextField>

              {/* Информация о выбранной категории */}
              {getSelectedCategory() && (
                <GlassCard variant="colored" color="green" sx={{ p: 3, mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <CheckCircle sx={{ color: theme.functional.success.main }} />
                    <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 600 }}>
                      {getSelectedCategory().name}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: theme.text.secondary }}>
                    Время реакции по SLA: {getSelectedCategory().slaTime} минут
                  </Typography>
                </GlassCard>
              )}

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ color: theme.text.primary, mb: 2, fontWeight: 600 }}>
                  Приоритет заявки
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                  {Object.entries(priorityConfig).map(([value, config]) => (
                    <motion.div
                      key={value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <GlassCard
                        variant={formData.priority === value ? "colored" : "default"}
                        color={formData.priority === value ? "blue" : undefined}
                        sx={{ 
                          p: 3, 
                          cursor: 'pointer',
                          border: formData.priority === value ? 
                            `2px solid ${config.color}` : 
                            `2px solid ${theme.border.main}`,
                        }}
                        onClick={() => setFormData({...formData, priority: value})}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <span style={{ fontSize: '1.5rem' }}>{config.icon}</span>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: formData.priority === value ? theme.text.primary : config.color,
                              fontWeight: 600 
                            }}
                          >
                            {config.label}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: formData.priority === value ? 
                              theme.text.secondary : 
                              theme.text.disabled
                          }}
                        >
                          {config.description}
                        </Typography>
                      </GlassCard>
                    </motion.div>
                  ))}
                </Box>
              </Box>

              {/* ПОЛЕ "ID пользователя" - ИСПРАВЛЕНО */}
              {isEngineer && (
                <TextField
                  fullWidth
                  label="ID пользователя (опционально)"
                  name="userId"
                  type="number"
                  value={formData.userId}
                  onChange={handleChange}
                  margin="normal"
                  helperText="Оставьте пустым для создания от своего имени"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: theme.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mt: 3,
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
                        px: 1
                      }
                    },
                    '& .MuiFormHelperText-root': {
                      color: theme.text.disabled,
                    },
                  }}
                />
              )}
            </Box>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <GlassCard variant="dark" sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  <CheckCircle sx={{ fontSize: 60, color: theme.functional.success.main, mb: 2 }} />
                </motion.div>
                <Typography variant="h4" sx={{ color: theme.text.primary, fontWeight: 700, mb: 2 }}>
                  Проверьте данные
                </Typography>
                <Typography sx={{ color: theme.text.secondary }}>
                  Убедитесь, что вся информация указана корректно
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Тема и описание */}
                <GlassCard variant="colored" color="blue" sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Title sx={{ color: theme.functional.info.main, mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 600, mb: 1 }}>
                        {formData.title}
                      </Typography>
                      <Typography sx={{ color: theme.text.secondary }}>
                        {formData.description}
                      </Typography>
                    </Box>
                  </Box>
                </GlassCard>

                {/* Категория и приоритет */}
                <GlassCard variant="colored" color="green" sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Category sx={{ color: theme.functional.success.main }} />
                      <Box>
                        <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 600 }}>
                          {getSelectedCategory()?.name}
                        </Typography>
                        <Typography sx={{ color: theme.text.secondary, fontSize: '0.875rem' }}>
                          SLA: {getSelectedCategory()?.slaTime} минут
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      icon={<PriorityHigh sx={{ fontSize: '1rem' }} />}
                      label={priorityConfig[formData.priority]?.label}
                      sx={{ 
                        backgroundColor: priorityConfig[formData.priority]?.color,
                        color: theme.text.primary,
                        fontWeight: 600,
                        height: '32px'
                      }}
                    />
                  </Box>
                </GlassCard>

                {/* Пользователь (если указан) */}
                {formData.userId && (
                  <GlassCard variant="colored" color="purple" sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Person sx={{ color: theme.primary.main }} />
                      <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 600 }}>
                        Пользователь ID: {formData.userId}
                      </Typography>
                    </Box>
                  </GlassCard>
                )}
              </Box>
            </GlassCard>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Успешное создание
  if (activeStep === steps.length) {
    return (
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        {darkBackgroundStyles}
        <FormBackground />
        
        <Container maxWidth="md" sx={{ py: 8, position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard variant="colored" color="green" sx={{ p: 6, textAlign: 'center' }}>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <CheckCircle sx={{ fontSize: 80, color: theme.functional.success.main, mb: 3 }} />
              </motion.div>
              
              <Typography variant="h3" sx={{ color: theme.text.primary, fontWeight: 800, mb: 2 }}>
                🎉 Заявка создана!
              </Typography>
              <Typography variant="h6" sx={{ color: theme.text.secondary, mb: 4 }}>
                Ваша заявка успешно отправлена и будет обработана в ближайшее время
              </Typography>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
              >
                <LinearProgress 
                  sx={{ 
                    backgroundColor: theme.background.elevated,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.functional.success.main
                    }
                  }} 
                />
              </motion.div>
              
              <Typography sx={{ color: theme.text.disabled, mt: 2 }}>
                Перенаправление на список заявок...
              </Typography>
            </GlassCard>
          </motion.div>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {darkBackgroundStyles}
      <FormBackground />
      
      <Container maxWidth="md" sx={{ py: 4, position: 'relative', zIndex: 10 }}>
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
                      width: 60,
                      height: 60,
                      borderRadius: 3,
                      background: theme.gradients.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 15px 35px ${theme.primary.main}66`
                    }}
                  >
                    <Sparkles size={28} color={theme.text.primary} />
                  </Box>
                </motion.div>
                
                <Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 800,
                      color: theme.text.primary,
                      textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                    }}
                  >
                  Создание заявки
                  </Typography>
                  <Typography sx={{ color: theme.text.secondary }}>
                    Заполните форму для отправки нового обращения
                  </Typography>
                </Box>
              </Box>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/tickets')}
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
                  Назад
                </Button>
              </motion.div>
            </Box>
          </GlassCard>
        </motion.div>

        {/* Прогресс */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <GlassCard variant="dark" sx={{ p: 3, mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        color: theme.text.secondary,
                        fontWeight: 600,
                        '&.Mui-active': {
                          color: theme.primary.main,
                        },
                        '&.Mui-completed': {
                          color: theme.functional.success.main,
                        }
                      },
                      '& .MuiStepIcon-root': {
                        color: theme.border.main,
                        '&.Mui-active': {
                          color: theme.primary.main,
                        },
                        '&.Mui-completed': {
                          color: theme.functional.success.main,
                        }
                      }
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
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

        {/* Форма */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard variant="dark" sx={{ p: 4, mb: 4 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {renderStepContent(activeStep)}
              </AnimatePresence>

              {/* Навигация */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6, gap: 2 }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    variant="outlined"
                    sx={{
                      minWidth: 120,
                      color: theme.text.secondary,
                      borderColor: theme.border.main,
                      '&:hover': {
                        borderColor: theme.border.light,
                        backgroundColor: theme.background.elevated,
                      },
                      '&:disabled': {
                        color: theme.text.disabled,
                        borderColor: theme.border.main,
                      }
                    }}
                  >
                    Назад
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                      disabled={loading || !canProceedToNextStep()}
                      sx={{
                        minWidth: 160,
                        background: `linear-gradient(135deg, ${theme.functional.success.main} 0%, #059669 100%)`,
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
                      {loading ? 'Создание...' : 'Создать заявку'}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      variant="contained"
                      disabled={!canProceedToNextStep()}
                      sx={{
                        minWidth: 120,
                        background: theme.gradients.primary,
                        boxShadow: `0 8px 25px ${theme.primary.main}66`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${theme.primary.dark} 0%, ${theme.primary.main} 100%)`,
                          boxShadow: `0 15px 40px ${theme.primary.main}99`,
                        },
                        '&:disabled': {
                          background: theme.background.secondary,
                          color: theme.text.disabled,
                        }
                      }}
                    >
                      Далее
                    </Button>
                  )}
                </motion.div>
              </Box>
            </Box>
          </GlassCard>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CreateTicket;