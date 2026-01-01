import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Typography,
  InputAdornment
} from '@mui/material';
import { Clock, Calendar, FileText } from 'lucide-react';
import theme, { colors } from '../theme/theme';
import timeLogService from '../services/timeLogService';

const AddTimeLogDialog = ({ open, onClose, ticketId, ticketNumber, onSuccess }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    date: today,
    hoursSpent: '',
    description: `Работы по заявке ${ticketNumber || ''}`
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Валидация
      if (!formData.hoursSpent || parseFloat(formData.hoursSpent) <= 0) {
        setError('Укажите корректное время (больше 0)');
        setLoading(false);
        return;
      }

      if (parseFloat(formData.hoursSpent) > 24) {
        setError('Время не может превышать 24 часа');
        setLoading(false);
        return;
      }

      if (!formData.description.trim()) {
        setError('Описание обязательно');
        setLoading(false);
        return;
      }

      await timeLogService.addTimeLog(ticketId, {
        date: formData.date,
        hoursSpent: parseFloat(formData.hoursSpent),
        description: formData.description.trim()
      });

      // Сбрасываем форму
      setFormData({
        date: today,
        hoursSpent: '',
        description: `Работы по заявке ${ticketNumber || ''}`
      });

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка списания времени');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        date: today,
        hoursSpent: '',
        description: `Работы по заявке ${ticketNumber || ''}`
      });
      setError('');
      onClose();
    }
  };

  // Общие стили для текстовых полей - Space Indigo palette
  const textFieldStyles = {
    mb: 3,
    '& .MuiOutlinedInput-root': {
      backgroundColor: colors.spaceIndigo,  // #22223b - тёмный фон
      borderRadius: 2,
      '& fieldset': {
        borderColor: `${colors.lilacAsh}40`,  // #9a8c98 с прозрачностью
        borderWidth: 1,
      },
      '&:hover fieldset': {
        borderColor: `${colors.lilacAsh}70`,
      },
      '&.Mui-focused fieldset': {
        borderColor: colors.lilacAsh,
        borderWidth: 2,
      },
    },
    '& .MuiOutlinedInput-input': {
      color: colors.seashell,  // #f2e9e4 - светлый текст
      fontSize: '1rem',
      '&::placeholder': {
        color: `${colors.almondSilk}80`,  // #c9ada7 с прозрачностью
        opacity: 1,
      },
    },
    '& .MuiInputLabel-root': {
      color: colors.almondSilk,  // #c9ada7
      fontWeight: 500,
      '&.Mui-focused': {
        color: colors.lilacAsh,
      },
      '&.MuiFormLabel-filled': {
        color: colors.almondSilk,
      }
    },
    '& .MuiFormHelperText-root': {
      color: `${colors.almondSilk}99`,
      fontSize: '0.8rem',
      mt: 1,
    },
    '& .MuiInputAdornment-root': {
      color: colors.lilacAsh,
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: `linear-gradient(145deg, ${colors.spaceIndigo} 0%, ${colors.dustyGrape} 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${colors.lilacAsh}30`,
          borderRadius: 4,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        }
      }}
    >
      {/* Заголовок */}
      <DialogTitle sx={{ 
        background: `linear-gradient(135deg, ${colors.dustyGrape}90 0%, ${colors.lilacAsh}40 100%)`,
        borderBottom: `1px solid ${colors.lilacAsh}30`,
        pb: 2.5,
        pt: 2.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 3,
            background: theme.gradients.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 8px 20px ${colors.lilacAsh}40`
          }}
        >
          <Clock size={24} color={colors.seashell} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: colors.seashell }}>
            Списание времени
          </Typography>
          <Typography variant="body2" sx={{ color: colors.almondSilk }}>
            {ticketNumber}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 4, pb: 2, px: 3 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              backgroundColor: `${colors.error}15`,
              color: '#fca5a5',
              border: `1px solid ${colors.error}40`,
              '& .MuiAlert-icon': {
                color: colors.error
              }
            }}
          >
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Дата */}
          <Typography variant="subtitle2" sx={{ color: colors.seashell, mb: 1, fontWeight: 600 }}>
            📅 Дата *
          </Typography>
          <TextField
            fullWidth
            required
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Calendar size={20} color={colors.lilacAsh} />
                </InputAdornment>
              ),
            }}
            sx={textFieldStyles}
          />

          {/* Отработанное время */}
          <Typography variant="subtitle2" sx={{ color: colors.seashell, mb: 1, fontWeight: 600 }}>
            ⏱️ Отработанное время (в часах) *
          </Typography>
          <TextField
            fullWidth
            required
            type="number"
            name="hoursSpent"
            value={formData.hoursSpent}
            onChange={handleChange}
            placeholder="Например: 1.5"
            inputProps={{
              step: "0.01",
              min: "0.01",
              max: "24"
            }}
            helperText="Например: 0.17 = 10 минут, 1.50 = 1 час 30 минут"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Clock size={20} color={colors.lilacAsh} />
                </InputAdornment>
              ),
            }}
            sx={textFieldStyles}
          />

          {/* Подсказка */}
          <Box 
            sx={{ 
              p: 2.5, 
              mb: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${colors.dustyGrape}60 0%, ${colors.lilacAsh}30 100%)`,
              border: `1px solid ${colors.lilacAsh}40`
            }}
          >
            <Typography variant="body2" sx={{ color: colors.almondSilk, mb: 1.5, fontWeight: 600 }}>
              💡 Подсказка:
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Typography variant="body2" sx={{ color: colors.seashell, fontSize: '0.85rem' }}>
                • 10 минут = 0.17 часа
              </Typography>
              <Typography variant="body2" sx={{ color: colors.seashell, fontSize: '0.85rem' }}>
                • 30 минут = 0.50 часа
              </Typography>
              <Typography variant="body2" sx={{ color: colors.seashell, fontSize: '0.85rem' }}>
                • 1 час = 1.00 часа
              </Typography>
              <Typography variant="body2" sx={{ color: colors.seashell, fontSize: '0.85rem' }}>
                • 1 час 30 минут = 1.50 часа
              </Typography>
            </Box>
          </Box>

          {/* Описание */}
          <Typography variant="subtitle2" sx={{ color: colors.seashell, mb: 1, fontWeight: 600 }}>
            📝 Описание *
          </Typography>
          <TextField
            fullWidth
            required
            multiline
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Опишите выполненные работы..."
            helperText="Опишите выполненные работы"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                  <FileText size={20} color={colors.lilacAsh} />
                </InputAdornment>
              ),
            }}
            sx={textFieldStyles}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        px: 3, 
        pb: 3,
        pt: 2,
        borderTop: `1px solid ${colors.lilacAsh}30`,
        gap: 2
      }}>
        <Button 
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          sx={{ 
            color: colors.almondSilk,
            borderColor: `${colors.almondSilk}50`,
            px: 3,
            py: 1,
            fontWeight: 600,
            '&:hover': {
              borderColor: colors.almondSilk,
              background: `${colors.almondSilk}10`
            }
          }}
        >
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Clock size={20} />}
          sx={{
            background: theme.gradients.primary,
            color: colors.spaceIndigo,
            fontWeight: 700,
            px: 4,
            py: 1,
            borderRadius: 2,
            boxShadow: `0 8px 20px ${colors.lilacAsh}40`,
            '&:hover': {
              background: `linear-gradient(135deg, ${colors.almondSilk} 0%, ${colors.lilacAsh} 100%)`,
              boxShadow: `0 12px 28px ${colors.lilacAsh}50`,
            },
            '&:disabled': {
              background: `${colors.dustyGrape}80`,
              color: `${colors.almondSilk}50`
            }
          }}
        >
          {loading ? 'Списание...' : 'Списать время'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTimeLogDialog;