import React from 'react';
import { Box } from '@mui/material';
import { gradients } from '../theme/theme';

const GradientBox = ({ 
  gradient = 'primary', 
  children, 
  sx = {}, 
  hover = true,
  ...props 
}) => {
  return (
    <Box
      sx={{
        background: gradients[gradient],
        borderRadius: 2,
        p: 2,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        ...(hover && {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          },
        }),
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.1)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::before': {
          opacity: hover ? 1 : 0,
        },
        ...sx,
      }}
      {...props}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default GradientBox;