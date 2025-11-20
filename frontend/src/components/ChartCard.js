import React from 'react';
import { motion } from 'framer-motion';
import { Card, Typography, Box, IconButton } from '@mui/material';
import { MoreVertical, TrendingUp, Download } from 'lucide-react';

const ChartCard = ({ 
  title, 
  children, 
  height = 400, 
  actions = true,
  subtitle,
  trend,
  icon: Icon,
  delay = 0,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 80
      }}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        {...props}
      >
        {/* Заголовок карточки */}
        <Box
          sx={{
            p: 3,
            pb: 1,
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.8), rgba(248,250,252,0.8))',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {Icon && (
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                  }}
                >
                  <Icon size={20} style={{ color: 'white' }} />
                </Box>
              )}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {title}
                </Typography>
                {subtitle && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      mt: 0.5,
                      fontSize: '0.875rem'
                    }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {trend && (
                <Box 
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  <TrendingUp size={14} />
                  {trend}
                </Box>
              )}
              
              {actions && (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: 'rgba(0,0,0,0.04)',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.08)',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Download size={16} />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: 'rgba(0,0,0,0.04)',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.08)',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <MoreVertical size={16} />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Содержимое карточки */}
        <Box 
          sx={{ 
            p: 3,
            height: height - 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {children}
          
          {/* Декоративные элементы */}
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
              filter: 'blur(20px)',
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
              filter: 'blur(15px)',
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />
        </Box>

        {/* Градиентная рамка */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 'inherit',
            padding: '1px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMaskComposite: 'xor',
            pointerEvents: 'none',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            '.MuiCard-root:hover &': {
              opacity: 1,
            }
          }}
        />
      </Card>
    </motion.div>
  );
};

export default ChartCard;