import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedBackgroundImages = () => {
  // Используем бесплатные изображения Unsplash
  const backgroundImages = [
    // Современные tech изображения
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Space/tech
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Digital waves
    'https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Abstract tech
  ];

  const currentImage = backgroundImages[0]; // Можно сделать смену изображений

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: -1,
      }}
    >
      {/* Основное изображение */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${currentImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.3) saturate(1.2)',
        }}
      />

      {/* Градиентные оверлеи */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(135deg, 
              rgba(102, 126, 234, 0.8) 0%,
              rgba(168, 85, 247, 0.6) 25%,
              rgba(30, 41, 59, 0.9) 50%,
              rgba(51, 65, 85, 0.8) 75%,
              rgba(102, 126, 234, 0.7) 100%
            )
          `,
        }}
      />

      {/* Дополнительные световые эффекты */}
      <motion.div
        animate={{
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '20%',
          right: '20%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          filter: 'blur(80px)'
        }}
      />

      <motion.div
        animate={{
          opacity: [0.1, 0.25, 0.1],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '15%',
          width: 350,
          height: 350,
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          filter: 'blur(60px)'
        }}
      />

      {/* Паттерн точек */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 1px, transparent 1px),
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.06) 1px, transparent 1px),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          opacity: 0.5
        }}
      />
    </Box>
  );
};

export default AnimatedBackgroundImages;