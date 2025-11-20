import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  sx = {}, 
  blur = 20,
  opacity = 0.9,
  gradient = 'rgba(255, 255, 255, 0.1)',
  border = 'rgba(255, 255, 255, 0.2)',
  variant = 'default', // 'default', 'dark', 'colored'
  color = 'blue', // для colored варианта
  delay = 0,
  hover = true,
  ...props 
}) => {
  // Варианты дизайна
  const getVariantStyles = () => {
    switch (variant) {
      case 'dark':
        return {
          background: `linear-gradient(135deg, 
            rgba(15, 23, 42, 0.8) 0%, 
            rgba(30, 41, 59, 0.6) 100%
          )`,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        };
      
      case 'colored':
        const colorMap = {
          blue: 'rgba(59, 130, 246, 0.1)',
          purple: 'rgba(139, 92, 246, 0.1)',
          green: 'rgba(34, 197, 94, 0.1)',
          yellow: 'rgba(251, 191, 36, 0.1)',
          red: 'rgba(239, 68, 68, 0.1)'
        };
        return {
          background: `linear-gradient(135deg, 
            ${colorMap[color] || colorMap.blue} 0%, 
            rgba(255, 255, 255, 0.05) 100%
          )`,
          border: `1px solid ${colorMap[color] || colorMap.blue}`,
          boxShadow: `0 20px 60px ${colorMap[color] || colorMap.blue}`
        };
      
      default:
        return {
          background: `linear-gradient(135deg, ${gradient}, rgba(255, 255, 255, 0.05))`,
          border: `1px solid ${border}`,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        };
    }
  };

  const variantStyles = getVariantStyles();

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
                rgba(255, 255, 255, 0.1) 0%, 
                transparent 30%, 
                rgba(255, 255, 255, 0.05) 100%
              )` :
              `linear-gradient(135deg, 
                rgba(255, 255, 255, 0.1) 0%, 
                transparent 50%, 
                rgba(255, 255, 255, 0.05) 100%
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
                ${color === 'blue' ? 'rgba(59, 130, 246, 0.5)' : 
                  color === 'purple' ? 'rgba(139, 92, 246, 0.5)' :
                  color === 'green' ? 'rgba(34, 197, 94, 0.5)' :
                  color === 'yellow' ? 'rgba(251, 191, 36, 0.5)' :
                  'rgba(239, 68, 68, 0.5)'} 0%, 
                transparent 50%,
                ${color === 'blue' ? 'rgba(59, 130, 246, 0.5)' : 
                  color === 'purple' ? 'rgba(139, 92, 246, 0.5)' :
                  color === 'green' ? 'rgba(34, 197, 94, 0.5)' :
                  color === 'yellow' ? 'rgba(251, 191, 36, 0.5)' :
                  'rgba(239, 68, 68, 0.5)'} 100%
              )` :
              'linear-gradient(45deg, rgba(255, 255, 255, 0.2), transparent, rgba(255, 255, 255, 0.2))',
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
                `0 30px 80px ${color === 'blue' ? 'rgba(59, 130, 246, 0.4)' : 
                  color === 'purple' ? 'rgba(139, 92, 246, 0.4)' :
                  color === 'green' ? 'rgba(34, 197, 94, 0.4)' :
                  color === 'yellow' ? 'rgba(251, 191, 36, 0.4)' :
                  'rgba(239, 68, 68, 0.4)'}` :
                '0 30px 80px rgba(0, 0, 0, 0.5)',
              
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