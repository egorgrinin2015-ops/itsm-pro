import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import theme from '../theme/theme';

const SlaWidget = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [slaData, setSlaData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSlaStats();
  }, []);

  const fetchSlaStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/sla/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSlaData(response.data);
      setError('');
    } catch (err) {
      console.error('Ошибка загрузки SLA:', err);
      setError('Ошибка загрузки данных SLA');
    } finally {
      setLoading(false);
    }
  };

  // Перевод приоритетов
  const translatePriority = (priority) => {
    const translations = {
      'low': 'Низкий',
      'medium': 'Средний',
      'high': 'Высокий',
      'critical': 'Критичный'
    };
    return translations[priority] || priority;
  };

  // Рассчитываем процент соблюдения SLA
  const getSlaPercentage = () => {
    if (!slaData?.overall) return 0;
    return parseFloat(slaData.overall.slaCompliancePercent || 0);
  };

  // Определяем цвет по проценту (используем цвета из темы)
  const getSlaColor = (percentage) => {
    if (percentage >= 90) return theme.functional.success.main; // #10b981
    if (percentage >= 70) return theme.functional.warning.main; // #f59e0b
    return theme.functional.error.main; // #ef4444
  };

  const slaPercentage = getSlaPercentage();
  const slaColor = getSlaColor(slaPercentage);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: 300
      }}>
        <CircularProgress sx={{ color: theme.primary.main }} />
      </Box>
    );
  }

  if (error || !slaData) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <AlertTriangle size={48} color={theme.functional.error.main} />
        <Typography sx={{ color: theme.text.secondary, mt: 2 }}>
          {error || 'Нет данных'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Заголовок */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: theme.gradients.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 20px ${theme.primary.main}40`
            }}
          >
            <TrendingUp size={24} color={theme.text.primary} />
          </Box>
        </motion.div>
        
        <Box>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 800,
              background: theme.gradients.primary,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5
            }}
          >
            ⚡ SLA Мониторинг
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: theme.text.secondary }}
          >
            Контроль соблюдения дедлайнов
          </Typography>
        </Box>
      </Box>

      {/* Основная статистика */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        {/* Круговой индикатор SLA */}
        <Box sx={{ 
          flex: '0 0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          borderRadius: 3,
          background: theme.background.secondary,
          border: `1px solid ${slaColor}40`,
          minWidth: 180
        }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            {/* Фоновый круг */}
            <CircularProgress
              variant="determinate"
              value={100}
              size={120}
              thickness={4}
              sx={{
                color: theme.background.elevated,
                position: 'absolute'
              }}
            />
            {/* Прогресс */}
            <CircularProgress
              variant="determinate"
              value={slaPercentage}
              size={120}
              thickness={4}
              sx={{
                color: slaColor,
                filter: `drop-shadow(0 0 8px ${slaColor}80)`
              }}
            />
            {/* Текст в центре */}
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  color: slaColor,
                  textShadow: `0 0 20px ${slaColor}60`
                }}
              >
                {slaPercentage.toFixed(0)}%
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.text.secondary,
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}
              >
                соблюдение
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Карточки статистики */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 200 }}>
          {/* Выполнено */}
          <Box sx={{
            p: 2,
            borderRadius: 2,
            background: theme.functional.success.bg,
            border: `1px solid ${theme.functional.success.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <CheckCircle size={32} color={theme.functional.success.main} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: theme.functional.success.main }}>
                {slaData.overall.metSla || 0}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.text.secondary }}>
                Выполнено
              </Typography>
            </Box>
          </Box>

          {/* Нарушено */}
          <Box sx={{
            p: 2,
            borderRadius: 2,
            background: theme.functional.error.bg,
            border: `1px solid ${theme.functional.error.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <XCircle size={32} color={theme.functional.error.main} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: theme.functional.error.main }}>
                {(slaData.overall.breachedSla || 0) + (slaData.overall.breachedActive || 0)}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.text.secondary }}>
                Нарушено
              </Typography>
            </Box>
          </Box>

          {/* В работе */}
          <Box sx={{
            p: 2,
            borderRadius: 2,
            background: theme.functional.info.bg,
            border: `1px solid ${theme.functional.info.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Clock size={32} color={theme.functional.info.main} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: theme.functional.info.main }}>
                {slaData.overall.activeWithinSla || 0}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.text.secondary }}>
                В работе
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Заявки с нарушением SLA */}
      {slaData.breached && slaData.breached.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              color: theme.functional.error.main,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <XCircle size={20} />
            Нарушены SLA ({slaData.breached.length})
          </Typography>
          
          <List sx={{ 
            p: 0,
            maxHeight: 200,
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.functional.error.border,
              borderRadius: '3px'
            }
          }}>
            {slaData.breached.slice(0, 5).map((ticket) => (
              <motion.div
                key={ticket.id}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <ListItem
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: 2,
                    background: theme.functional.error.bg,
                    border: `1px solid ${theme.functional.error.border}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: `${theme.functional.error.main}20`,
                      border: `1px solid ${theme.functional.error.border}`
                    }
                  }}
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.text.primary }}>
                        #{ticket.id} - {ticket.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: theme.text.secondary }}>
                        Просрочено на {Math.floor(ticket.hoursOverdue)}ч
                      </Typography>
                    }
                  />
                  <Chip
                    label={translatePriority(ticket.priority || 'medium')}
                    size="small"
                    sx={{
                      backgroundColor: theme.functional.error.border,
                      color: theme.text.primary,
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      mr: 1
                    }}
                  />
                  <ChevronRight size={20} color={theme.text.secondary} />
                </ListItem>
              </motion.div>
            ))}
          </List>
        </Box>
      )}

      {/* Близкие к дедлайну */}
      {slaData.nearDeadline && slaData.nearDeadline.length > 0 && (
        <Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              color: theme.functional.warning.main,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <AlertTriangle size={20} />
            Близко к дедлайну ({slaData.nearDeadline.length})
          </Typography>
          
          <List sx={{ 
            p: 0,
            maxHeight: 200,
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.functional.warning.border,
              borderRadius: '3px'
            }
          }}>
            {slaData.nearDeadline.slice(0, 5).map((ticket) => (
              <motion.div
                key={ticket.id}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <ListItem
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: 2,
                    background: theme.functional.warning.bg,
                    border: `1px solid ${theme.functional.warning.border}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: `${theme.functional.warning.main}20`,
                      border: `1px solid ${theme.functional.warning.border}`
                    }
                  }}
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.text.primary }}>
                        #{ticket.id} - {ticket.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: theme.text.secondary }}>
                        Осталось {Math.floor(ticket.minutesRemaining)}м
                      </Typography>
                    }
                  />
                  <Chip
                    label={translatePriority(ticket.priority || 'medium')}
                    size="small"
                    sx={{
                      backgroundColor: theme.functional.warning.border,
                      color: theme.text.primary,
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      mr: 1
                    }}
                  />
                  <ChevronRight size={20} color={theme.text.secondary} />
                </ListItem>
              </motion.div>
            ))}
          </List>
        </Box>
      )}

      {/* Если всё хорошо */}
      {(!slaData.breached || slaData.breached.length === 0) && 
       (!slaData.nearDeadline || slaData.nearDeadline.length === 0) && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 4,
          borderRadius: 3,
          background: theme.functional.success.bg,
          border: `1px solid ${theme.functional.success.border}`
        }}>
          <CheckCircle size={48} color={theme.functional.success.main} />
          <Typography variant="h6" sx={{ color: theme.functional.success.main, mt: 2, fontWeight: 700 }}>
            Все заявки в рамках SLA! 🎉
          </Typography>
          <Typography variant="body2" sx={{ color: theme.text.secondary, mt: 1 }}>
            Отличная работа команды!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SlaWidget;