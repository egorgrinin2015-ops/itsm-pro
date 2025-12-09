import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import theme from '../theme/theme';

const GlassCard = ({ 
  children, 
  sx = {}, 
  blur = 20,
  opacity = 0.9,
  gradient = theme.background.elevated,
  border = theme.border.main,
  variant = 'default', // 'default', 'dark', 'colored'
  color = 'blue', // для colored варианта
  delay = 0,
  hover = true,
  ...props 
}) => {
  // Варианты дизайна с новой палитрой
  const getVariantStyles = () => {
    switch (variant) {
      case 'dark':
        return {
          background: `linear-gradient(135deg, 
            ${theme.background.primary}CC 0%, 
            ${theme.background.secondary}99 100%
          )`,
          border: `1px solid ${theme.border.main}`,
          boxShadow: theme.glass.dark.shadow
        };
      
      case 'colored':
        const colorMap = {
          blue: theme.functional.info.main,
          purple: theme.primary.main,
          green: theme.functional.success.main,
          yellow: theme.functional.warning.main,
          red: theme.functional.error.main
        };
        const selectedColor = colorMap[color] || colorMap.blue;
        return {
          background: `linear-gradient(135deg, 
            ${selectedColor}1A 0%, 
            ${theme.background.elevated}80 100%
          )`,
          border: `1px solid ${selectedColor}40`,
          boxShadow: `0 20px 60px ${selectedColor}30`
        };
      
      default:
        return {
          background: `linear-gradient(135deg, ${theme.background.elevated}, ${theme.background.secondary}80)`,
          border: `1px solid ${border}`,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        };
    }
  };

  const variantStyles = getVariantStyles();

  // Получаем цвет для анимаций
  const getAnimationColor = () => {
    const colorMap = {
      blue: theme.functional.info.main,
      purple: theme.primary.main,
      green: theme.functional.success.main,
      yellow: theme.functional.warning.main,
      red: theme.functional.error.main
    };
    return colorMap[color] || theme.primary.main;
  };

  const animationColor = getAnimationColor();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        delay
      }}
      whileHover={hover ? {
        scale: 1.02,
        y: -5,
        transition: { duration: 0.3 }
      } : {}}
      style={{ width: '100%', height: '100%' }}
    >
      <Box
        sx={{
          ...variantStyles,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          
          // Внутреннее свечение
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: variant === 'colored' ? 
              `linear-gradient(135deg, 
                ${theme.text.primary}1A 0%, 
                transparent 30%, 
                ${theme.text.primary}0D 100%
              )` :
              `linear-gradient(135deg, 
                ${theme.text.primary}1A 0%, 
                transparent 50%, 
                ${theme.text.primary}0D 100%
              )`,
            pointerEvents: 'none',
            borderRadius: 'inherit'
          },

          // Анимированная граница при hover
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -1,
            left: -1,
            right: -1,
            bottom: -1,
            background: variant === 'colored' ? 
              `linear-gradient(45deg, 
                ${animationColor}80 0%, 
                transparent 50%,
                ${animationColor}80 100%
              )` :
              `linear-gradient(45deg, ${theme.primary.main}33, transparent, ${theme.primary.main}33)`,
            borderRadius: 'inherit',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            zIndex: -1
          },

          // Hover эффекты
          ...(hover && {
            '&:hover': {
              boxShadow: variant === 'colored' ?
                `0 30px 80px ${animationColor}40` :
                `0 30px 80px ${theme.primary.main}30`,
              
              '&::after': {
                opacity: 1
              }
            }
          }),

          ...sx
        }}
        {...props}
      >
        <Box sx={{ 
          position: 'relative', 
          zIndex: 1, 
          width: '100%', 
          height: '100%',
          // Обеспечиваем правильные отступы
          p: sx.p !== undefined ? 0 : 0
        }}>
          {children}
        </Box>
      </Box>
    </motion.div>
  );
};

export default GlassCard;