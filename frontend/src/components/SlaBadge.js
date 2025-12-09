import React from 'react';
import { Chip, Tooltip, Box } from '@mui/material';
import { AccessTime, CheckCircle, Warning, Error } from '@mui/icons-material';

const SlaBadge = ({ slaStatus, slaDeadline, compact = false }) => {
  // Рассчитываем оставшееся время
  const calculateTimeRemaining = () => {
    if (!slaDeadline) return null;
    
    const now = new Date();
    const deadline = new Date(slaDeadline);
    const diffMs = deadline - now;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMs < 0) {
      const overdueMins = Math.abs(diffMins);
      const overdueHours = Math.floor(overdueMins / 60);
      const overdueDays = Math.floor(overdueHours / 24);
      
      if (overdueDays > 0) return `Просрочено на ${overdueDays}д`;
      if (overdueHours > 0) return `Просрочено на ${overdueHours}ч`;
      return `Просрочено на ${overdueMins}м`;
    }

    if (diffDays > 0) return `${diffDays}д ${diffHours % 24}ч`;
    if (diffHours > 0) return `${diffHours}ч ${diffMins % 60}м`;
    return `${diffMins}м`;
  };

  // Определяем конфигурацию по статусу
  const getConfig = () => {
    switch (slaStatus) {
      case 'met':
        return {
          label: 'SLA выполнен',
          icon: <CheckCircle sx={{ fontSize: 16 }} />,
          color: '#10b981',
          bgColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'rgba(16, 185, 129, 0.3)'
        };
      case 'ok':
        return {
          label: calculateTimeRemaining(),
          icon: <AccessTime sx={{ fontSize: 16 }} />,
          color: '#10b981',
          bgColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'rgba(16, 185, 129, 0.3)'
        };
      case 'warning':
        return {
          label: calculateTimeRemaining(),
          icon: <Warning sx={{ fontSize: 16 }} />,
          color: '#f59e0b',
          bgColor: 'rgba(245, 158, 11, 0.1)',
          borderColor: 'rgba(245, 158, 11, 0.3)'
        };
      case 'breached':
        return {
          label: calculateTimeRemaining(),
          icon: <Error sx={{ fontSize: 16 }} />,
          color: '#ef4444',
          bgColor: 'rgba(239, 68, 68, 0.1)',
          borderColor: 'rgba(239, 68, 68, 0.3)'
        };
      default:
        return {
          label: 'Нет SLA',
          icon: <AccessTime sx={{ fontSize: 16 }} />,
          color: '#64748b',
          bgColor: 'rgba(100, 116, 139, 0.1)',
          borderColor: 'rgba(100, 116, 139, 0.3)'
        };
    }
  };

  const config = getConfig();

  // Формируем тултип
  const getTooltip = () => {
    if (!slaDeadline) return 'SLA не установлен';
    
    const deadline = new Date(slaDeadline);
    const formattedDeadline = deadline.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    switch (slaStatus) {
      case 'met':
        return `SLA выполнен успешно`;
      case 'ok':
        return `Дедлайн: ${formattedDeadline}`;
      case 'warning':
        return `⚠️ Осталось менее часа!\nДедлайн: ${formattedDeadline}`;
      case 'breached':
        return `🚨 SLA нарушен!\nДедлайн был: ${formattedDeadline}`;
      default:
        return 'SLA не установлен';
    }
  };

  if (compact) {
    // Компактный вид - только иконка с цветом
    return (
      <Tooltip title={getTooltip()} arrow>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: config.bgColor,
            border: `1px solid ${config.borderColor}`,
            color: config.color
          }}
        >
          {config.icon}
        </Box>
      </Tooltip>
    );
  }

  // Полный вид
  return (
    <Tooltip title={getTooltip()} arrow>
      <Chip
        icon={config.icon}
        label={config.label}
        size="small"
        sx={{
          backgroundColor: config.bgColor,
          border: `1px solid ${config.borderColor}`,
          color: config.color,
          fontWeight: 600,
          fontSize: '0.75rem',
          '& .MuiChip-icon': {
            color: config.color
          }
        }}
      />
    </Tooltip>
  );
};

export default SlaBadge;