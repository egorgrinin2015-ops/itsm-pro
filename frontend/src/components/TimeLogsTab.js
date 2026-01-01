import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  LinearProgress,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Plus, Calendar, User, Trash2, Edit } from 'lucide-react';
import theme from '../theme/theme';
import timeLogService from '../services/timeLogService';
import AddTimeLogDialog from './AddTimeLogDialog';
import GlassCard from './GlassCard';
import { useAuth } from '../context/AuthContext';

const TimeLogsTab = ({ ticketId, ticketNumber }) => {
  const [timeLogs, setTimeLogs] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadTimeLogs();
  }, [ticketId]);

  const loadTimeLogs = async () => {
    try {
      setLoading(true);
      const data = await timeLogService.getTicketTimeLogs(ticketId);
      setTimeLogs(data.timeLogs || []);
      setTotalHours(parseFloat(data.totalHours || 0));
    } catch (err) {
      console.error('Ошибка загрузки логов времени:', err);
      setError('Не удалось загрузить логи времени');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (timeLogId) => {
    if (!window.confirm('Удалить этот лог времени?')) {
      return;
    }

    try {
      await timeLogService.deleteTimeLog(timeLogId);
      loadTimeLogs();
    } catch (err) {
      console.error('Ошибка удаления лога:', err);
      alert('Не удалось удалить лог времени');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatHours = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    
    if (h === 0) {
      return `${m} мин`;
    } else if (m === 0) {
      return `${h} ч`;
    } else {
      return `${h} ч ${m} мин`;
    }
  };

  // Прогресс рабочего дня (8 часов)
  const workdayHours = 8;
  const progressPercent = Math.min((totalHours / workdayHours) * 100, 100);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Заголовок и кнопка */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: theme.text.primary, fontWeight: 700, mb: 1 }}>
            Учёт времени
          </Typography>
          <Typography variant="body2" sx={{ color: theme.text.secondary }}>
            Списание рабочего времени по заявке
          </Typography>
        </Box>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
  variant="contained"
  startIcon={<Plus size={20} />}
  onClick={() => setDialogOpen(true)}
  sx={{
    background: theme.gradients.primary,
    fontWeight: 600,
    px: 3,
    boxShadow: `0 8px 25px ${theme.primary.main}66`,
    border: '2px solid transparent',
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.primary.dark}, ${theme.primary.main})`,
      boxShadow: `0 12px 35px ${theme.primary.main}99`,
      border: `2px solid ${theme.text.primary}`,
    }
  }}
>
  Списать время
</Button>
        </motion.div>
      </Box>

      {/* Прогресс бар */}
      <GlassCard variant="colored" color="blue" sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Clock size={24} color={theme.primary.main} />
            <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 600 }}>
              Потрачено времени
            </Typography>
          </Box>
          <Chip 
            label={`${formatHours(totalHours)} / ${workdayHours} ч`}
            sx={{
              background: progressPercent >= 100 ? theme.functional.error.main : theme.primary.main,
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem'
            }}
          />
        </Box>

        <LinearProgress 
          variant="determinate" 
          value={progressPercent}
          sx={{
            height: 12,
            borderRadius: 2,
            backgroundColor: theme.background.secondary,
            '& .MuiLinearProgress-bar': {
              backgroundColor: progressPercent >= 100 ? theme.functional.error.main : theme.primary.main,
              borderRadius: 2
            }
          }}
        />

        <Typography 
          variant="body2" 
          sx={{ 
            color: theme.text.secondary, 
            mt: 1,
            textAlign: 'center'
          }}
        >
          {progressPercent >= 100 ? '⚠️ Превышен стандартный рабочий день' : `${progressPercent.toFixed(1)}% от рабочего дня`}
        </Typography>
      </GlassCard>

      {/* Ошибки */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Список логов */}
      {timeLogs.length === 0 ? (
        <GlassCard variant="dark" sx={{ p: 6, textAlign: 'center' }}>
          <Clock size={48} color={theme.text.disabled} style={{ marginBottom: 16 }} />
          <Typography variant="h6" sx={{ color: theme.text.secondary, mb: 1 }}>
            Время ещё не списано
          </Typography>
          <Typography variant="body2" sx={{ color: theme.text.disabled }}>
            Нажмите "Списать время" чтобы добавить первую запись
          </Typography>
        </GlassCard>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <AnimatePresence>
            {timeLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <GlassCard variant="dark" sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    {/* Левая часть - информация */}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Chip 
                          icon={<Calendar size={14} />}
                          label={formatDate(log.date)}
                          size="small"
                          sx={{
                            backgroundColor: theme.background.secondary,
                            color: theme.text.secondary,
                            fontWeight: 600
                          }}
                        />
                        <Chip 
                          icon={<Clock size={14} />}
                          label={formatHours(parseFloat(log.hoursSpent))}
                          size="small"
                          sx={{
                            backgroundColor: theme.primary.main,
                            color: '#fff',
                            fontWeight: 700
                          }}
                        />
                      </Box>

                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: theme.text.primary,
                          mb: 2,
                          lineHeight: 1.6
                        }}
                      >
                        {log.description}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <User size={14} color={theme.text.disabled} />
                        <Typography 
                          variant="body2" 
                          sx={{ color: theme.text.disabled }}
                        >
                          {log.user?.fullName || 'Неизвестный пользователь'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Правая часть - действия */}
                    {(user?.id === log.userId || ['admin', 'manager'].includes(user?.role)) && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Удалить">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(log.id)}
                            sx={{
                              color: theme.functional.error.main,
                              '&:hover': {
                                backgroundColor: `${theme.functional.error.main}1A`
                              }
                            }}
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      )}

      {/* Диалог добавления */}
      <AddTimeLogDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        ticketId={ticketId}
        ticketNumber={ticketNumber}
        onSuccess={loadTimeLogs}
      />
    </Box>
  );
};

export default TimeLogsTab;