import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  sx = {}, 
  blur = 20,
  opacity = 0.9,
  gradient = 'rgba(255, 255, 255, 0.25)',
  border = 'rgba(255, 255, 255, 0.18)',
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <Box
        sx={{
          background: `linear-gradient(135deg, ${gradient}, rgba(255, 255, 255, 0.1))`,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          border: `1px solid ${border}`,
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, 
              rgba(255, 255, 255, 0.1) 0%, 
              transparent 50%, 
              rgba(255, 255, 255, 0.05) 100%)`,
            pointerEvents: 'none',
          },
          ...sx
        }}
        {...props}
      >
        <Box sx={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
          {children}
        </Box>
      </Box>
    </motion.div>
  );
};

export default GlassCard;