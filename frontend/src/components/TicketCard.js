import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar
} from '@mui/material';
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  Pause,
  XCircle
} from 'lucide-react';
import SlaBadge from './SlaBadge';
import theme from '../theme/theme';

const TicketCard = ({ ticket, delay = 0 }) => {
  const navigate = useNavigate();

  const getStatusInfo = (status) => {
    const statusMap = {
      new: { 
        label: 'Новая', 
        color: theme.functional.info.main,
        bgColor: theme.functional.info.bg,
        icon: <AlertTriangle size={14} />
      },
      in_progress: { 
        label: 'В работе', 
        color: theme.functional.warning.main,
        bgColor: theme.functional.warning.bg,
        icon: <PlayCircle size={14} />
      },
      waiting: { 
        label: 'Ожидание', 
        color: theme.primary.main,
        bgColor: `${theme.primary.main}20`,
        icon: <Pause size={14} />
      },
      resolved: { 
        label: 'Решена', 
        color: theme.functional.success.main,
        bgColor: theme.functional.success.bg,
        icon: <CheckCircle size={14} />
      },
      closed: { 
        label: 'Закрыта', 
        color: theme.text.secondary,
        bgColor: `${theme.text.secondary}20`,
        icon: <XCircle size={14} />
      }
    };
    return statusMap[status] || statusMap.new;
  };

  const getPriorityInfo = (priority) => {
    const priorityMap = {
      low: { label: 'Низкий', color: theme.functional.success.main, intensity: 1 },
      medium: { label: 'Средний', color: theme.functional.warning.main, intensity: 2 },
      high: { label: 'Высокий', color: theme.functional.error.main, intensity: 3 },
      critical: { label: 'Критичный', color: theme.functional.error.main, intensity: 4 }
    };
    return priorityMap[priority] || priorityMap.medium;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return '';
    }
  };

  const statusInfo = getStatusInfo(ticket.status);
  const priorityInfo = getPriorityInfo(ticket.priority);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay,
        type: "spring",
        stiffness: 120
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 }
      }}
    >
      <Card
        sx={{
          position: 'relative',
          cursor: 'pointer',
          overflow: 'hidden',
          background: theme.background.secondary,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${priorityInfo.color}40`,
          borderRadius: 3,
          boxShadow: `${theme.glass.dark.shadow}, inset 0 1px 0 ${theme.border.light}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            borderColor: `${priorityInfo.color}80`,
            boxShadow: `0 12px 40px rgba(0, 0, 0, 0.5), 0 0 30px ${priorityInfo.color}30, inset 0 1px 0 ${theme.border.main}`,
            transform: 'translateY(-2px)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${priorityInfo.color}, ${priorityInfo.color}aa)`,
            boxShadow: `0 0 10px ${priorityInfo.color}60`,
          }
        }}
        onClick={() => navigate(`/tickets/${ticket.id}`)}
      >
        <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* ID, Статус и SLA */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: '0.9rem',
                lineHeight: 1,
                color: theme.text.primary,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
              }}
            >
              #{ticket.id}
            </Typography>
            <Chip
              icon={statusInfo.icon}
              label={statusInfo.label}
              size="small"
              sx={{
                height: 22,
                fontSize: '0.7rem',
                fontWeight: 600,
                color: theme.text.primary,
                backgroundColor: statusInfo.bgColor,
                border: `1px solid ${statusInfo.color}60`,
                backdropFilter: 'blur(10px)',
                '& .MuiChip-icon': {
                  color: statusInfo.color,
                  marginLeft: '4px'
                },
                '& .MuiChip-label': {
                  padding: '0 8px'
                }
              }}
            />
            {/* SLA BADGE */}
            <SlaBadge 
              slaStatus={ticket.slaStatus} 
              slaDeadline={ticket.slaDeadline}
              compact
            />
          </Box>
          
          {/* Заголовок */}
          <Typography
            variant="body1"
            sx={{
              fontWeight: 700,
              lineHeight: 1.3,
              color: theme.text.primary,
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
              fontSize: '0.95rem',
              minHeight: '2.6em'
            }}
          >
            {ticket.title}
          </Typography>

          {/* Описание */}
          <Typography
            variant="body2"
            sx={{
              color: theme.text.secondary,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.8rem',
              mb: 2,
              flex: 1,
              minHeight: '2.8em'
            }}
          >
            {ticket.description}
          </Typography>

          {/* Футер */}
          <Box sx={{ mt: 'auto' }}>
            {/* Пользователь и Категория */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              {/* Пользователь */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Avatar
                  sx={{
                    width: 20,
                    height: 20,
                    fontSize: '0.65rem',
                    bgcolor: `${theme.functional.info.main}CC`,
                    border: `1px solid ${theme.functional.info.border}`
                  }}
                >
                  {(ticket.creatorName || ticket.creator_name || ticket.user?.fullName || 'A')?.charAt(0)}
                </Avatar>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: theme.text.secondary,
                    fontWeight: 500,
                    fontSize: '0.75rem'
                  }}
                >
                  {ticket.creatorName || ticket.creator_name || ticket.user?.fullName || 'Администратор'}
                </Typography>
              </Box>

              {/* Категория */}
              {(ticket.categoryName || ticket.category_name || ticket.category?.name) && (
                <Chip
                  label={ticket.categoryName || ticket.category_name || ticket.category?.name}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    borderColor: theme.border.main,
                    backgroundColor: theme.background.elevated,
                    color: theme.text.primary,
                    backdropFilter: 'blur(10px)',
                    '& .MuiChip-label': {
                      padding: '0 6px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100px'
                    }
                  }}
                />
              )}
            </Box>

            {/* Приоритет и Дата */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Приоритет (индикаторы) */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {[...Array(priorityInfo.intensity)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 3,
                      height: 10,
                      backgroundColor: priorityInfo.color,
                      borderRadius: 0.5,
                      boxShadow: `0 0 4px ${priorityInfo.color}60`,
                    }}
                  />
                ))}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: priorityInfo.color,
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    ml: 0.5
                  }}
                >
                  {priorityInfo.label}
                </Typography>
              </Box>

              {/* Дата */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Clock size={12} color={theme.text.disabled} />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: theme.text.disabled,
                    fontWeight: 500,
                    fontSize: '0.7rem'
                  }}
                >
                  {formatDate(ticket.createdAt || ticket.created_at)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>

        {/* Градиентная подсветка при ховере */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 0,
            background: `linear-gradient(90deg, transparent, ${priorityInfo.color}40, transparent)`,
            transition: 'height 0.3s ease',
            '.MuiCard-root:hover &': {
              height: '2px',
            }
          }}
        />
      </Card>
    </motion.div>
  );
};

export default TicketCard;