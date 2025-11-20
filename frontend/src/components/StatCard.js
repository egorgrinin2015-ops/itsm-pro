import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Card, Avatar } from '@mui/material';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import GradientBox from './GradientBox';

const StatCard = ({ 
  title, 
  value, 
  trend, 
  trendValue, 
  icon: Icon, 
  gradient = 'primary',
  delay = 0,
  subtitle,
  ...props 
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={16} />;
    if (trend === 'down') return <TrendingDown size={16} />;
    return <Minus size={16} />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return '#22c55e';
    if (trend === 'down') return '#ef4444';
    return '#6b7280';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <Card
        sx={{
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          border: 'none',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, 
              ${gradient === 'primary' ? '#667eea, #764ba2' : 
                gradient === 'success' ? '#4facfe, #00f2fe' :
                gradient === 'warning' ? '#43e97b, #38f9d7' :
                gradient === 'error' ? '#fa709a, #fee140' :
                '#667eea, #764ba2'})`
          },
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          }
        }}
        {...props}
      >
        <Box sx={{ p: 3 }}>
          {/* Верхняя часть с иконкой */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Avatar
              sx={{
                background: `linear-gradient(135deg, 
                  ${gradient === 'primary' ? '#667eea, #764ba2' : 
                    gradient === 'success' ? '#4facfe, #00f2fe' :
                    gradient === 'warning' ? '#43e97b, #38f9d7' :
                    gradient === 'error' ? '#fa709a, #fee140' :
                    '#667eea, #764ba2'})`,
                width: 48,
                height: 48,
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
              }}
            >
              <Icon size={24} style={{ color: 'white' }} />
            </Avatar>
            
            {trendValue && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  color: getTrendColor(),
                  backgroundColor: `${getTrendColor()}15`,
                  px: 1,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                {getTrendIcon()}
                {trendValue}
              </Box>
            )}
          </Box>

          {/* Основное значение */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.3, type: "spring", stiffness: 200 }}
          >
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                mb: 0.5,
                background: `linear-gradient(135deg, 
                  ${gradient === 'primary' ? '#667eea, #764ba2' : 
                    gradient === 'success' ? '#4facfe, #00f2fe' :
                    gradient === 'warning' ? '#43e97b, #38f9d7' :
                    gradient === 'error' ? '#fa709a, #fee140' :
                    '#667eea, #764ba2'})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
              }}
            >
              {value}
            </Typography>
          </motion.div>

          {/* Заголовок */}
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 500,
              mb: subtitle ? 0.5 : 0
            }}
          >
            {title}
          </Typography>

          {/* Подзаголовок */}
          {subtitle && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.disabled',
                fontSize: '0.75rem'
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Декоративные элементы */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `linear-gradient(135deg, 
              ${gradient === 'primary' ? '#667eea22, #764ba222' : 
                gradient === 'success' ? '#4facfe22, #00f2fe22' :
                gradient === 'warning' ? '#43e97b22, #38f9d722' :
                gradient === 'error' ? '#fa709a22, #fee14022' :
                '#667eea22, #764ba222'})`,
            filter: 'blur(20px)',
            zIndex: 0
          }}
        />
      </Card>
    </motion.div>
  );
};

export default StatCard;