import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Clock,
  User,
  Eye,
  MessageSquare,
  Calendar,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  Pause,
  XCircle
} from 'lucide-react';

const TicketCard = ({ ticket, delay = 0 }) => {
  const navigate = useNavigate();

  const getStatusInfo = (status) => {
    const statusMap = {
      new: { 
        label: 'Новая', 
        color: '#3b82f6', 
        bgColor: 'rgba(59, 130, 246, 0.1)',
        icon: <AlertTriangle size={16} />
      },
      in_progress: { 
        label: 'В работе', 
        color: '#f59e0b', 
        bgColor: 'rgba(245, 158, 11, 0.1)',
        icon: <PlayCircle size={16} />
      },
      waiting: { 
        label: 'Ожидание', 
        color: '#8b5cf6', 
        bgColor: 'rgba(139, 92, 246, 0.1)',
        icon: <Pause size={16} />
      },
      resolved: { 
        label: 'Решена', 
        color: '#10b981', 
        bgColor: 'rgba(16, 185, 129, 0.1)',
        icon: <CheckCircle size={16} />
      },
      closed: { 
        label: 'Закрыта', 
        color: '#6b7280', 
        bgColor: 'rgba(107, 114, 128, 0.1)',
        icon: <XCircle size={16} />
      }
    };
    return statusMap[status] || statusMap.new;
  };

  const getPriorityInfo = (priority) => {
    const priorityMap = {
      low: { label: 'Низкий', color: '#10b981', intensity: 1 },
      medium: { label: 'Средний', color: '#f59e0b', intensity: 2 },
      high: { label: 'Высокий', color: '#f97316', intensity: 3 },
      critical: { label: 'Критичный', color: '#ef4444', intensity: 4 }
    };
    return priorityMap[priority] || priorityMap.medium;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = () => {
    if (!ticket.slaDeadline) return null;
    
    const now = new Date();
    const deadline = new Date(ticket.slaDeadline);
    const diff = deadline - now;
    
    if (diff < 0) {
      const overdue = Math.abs(diff);
      const hours = Math.floor(overdue / (1000 * 60 * 60));
      return { text: `Просрочено на ${hours}ч`, isOverdue: true };
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours < 2) {
      return { text: `${hours}ч ${minutes}м`, isUrgent: true };
    }
    
    return { text: `${hours}ч ${minutes}м`, isNormal: true };
  };

  const statusInfo = getStatusInfo(ticket.status);
  const priorityInfo = getPriorityInfo(ticket.priority);
  const timeInfo = getTimeRemaining();

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
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: 3,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            '& .ticket-actions': {
              opacity: 1,
              transform: 'translateX(0)',
            }
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${priorityInfo.color}, ${priorityInfo.color}aa)`,
          }
        }}
        onClick={() => navigate(`/tickets/${ticket.id}`)}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Заголовок */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ flex: 1, mr: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    lineHeight: 1.3,
                    color: 'text.primary'
                  }}
                >
                  #{ticket.ticketNumber}
                </Typography>
                <Chip
                  icon={statusInfo.icon}
                  label={statusInfo.label}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: statusInfo.color,
                    backgroundColor: statusInfo.bgColor,
                    border: `1px solid ${statusInfo.color}33`,
                  }}
                />
              </Box>
              
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  lineHeight: 1.4,
                  color: 'text.primary',
                  mb: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {ticket.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {ticket.description}
              </Typography>
            </Box>

            {/* Действия */}
            <Box
              className="ticket-actions"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                opacity: 0,
                transform: 'translateX(10px)',
                transition: 'all 0.3s ease',
              }}
            >
              <Tooltip title="Открыть заявку">
                <IconButton
                  size="small"
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                      transform: 'scale(1.1)',
                    }
                  }}
                >
                  <Eye size={16} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Метаинформация */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Пользователь */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: '0.75rem',
                    bgcolor: 'primary.main'
                  }}
                >
                  {ticket.user?.fullName?.charAt(0) || 'U'}
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  {ticket.user?.fullName || 'Неизвестно'}
                </Typography>
              </Box>

              {/* Категория */}
              {ticket.category && (
                <Chip
                  label={ticket.category.name}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 24,
                    fontSize: '0.7rem',
                    borderColor: 'divider',
                    backgroundColor: 'background.paper'
                  }}
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Приоритет */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {[...Array(priorityInfo.intensity)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 4,
                      height: 12,
                      backgroundColor: priorityInfo.color,
                      borderRadius: 0.5,
                    }}
                  />
                ))}
              </Box>

              {/* SLA время */}
              {timeInfo && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    backgroundColor: timeInfo.isOverdue ? 
                      'rgba(239, 68, 68, 0.1)' : 
                      timeInfo.isUrgent ? 
                      'rgba(245, 158, 11, 0.1)' : 
                      'rgba(16, 185, 129, 0.1)',
                    color: timeInfo.isOverdue ? 
                      '#dc2626' : 
                      timeInfo.isUrgent ? 
                      '#d97706' : 
                      '#059669',
                  }}
                >
                  <Clock size={12} />
                  {timeInfo.text}
                </Box>
              )}

              {/* Дата */}
              <Typography variant="caption" color="text.disabled">
                {formatDate(ticket.createdAt)}
              </Typography>
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
            background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent)',
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