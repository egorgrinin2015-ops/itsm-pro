import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ticketService from '../services/ticketService';
import commentService from '../services/commentService';
import GlassCard from '../components/GlassCard';
import {
  Container,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  TextField,
  List,
  ListItem,
  CircularProgress,
  Alert,
  Avatar,
  InputAdornment,
  Skeleton,
  GlobalStyles
} from '@mui/material';
import {
  ArrowBack,
  Send,
  Person,
  AccessTime,
  Category,
  Priority,
  Comment,
  Check,
  Schedule,
  Info,
  Chat
} from '@mui/icons-material';

// Принудительные глобальные стили для темного фона
const darkBackgroundStyles = (
  <GlobalStyles
    styles={{
      body: {
        background: 'linear-gradient(135deg, #000000 0%, #1a1a2e 20%, #16213e 40%, #0f172a 60%, #020617 80%, #000000 100%) !important',
        minHeight: '100vh !important',
      },
      '#root': {
        background: 'linear-gradient(135deg, #000000 0%, #1a1a2e 20%, #16213e 40%, #0f172a 60%, #020617 80%, #000000 100%) !important',
        minHeight: '100vh !important',
      },
      html: {
        background: '#000000 !important',
      }
    }}
  />
);

// Фон для страницы детальной заявки
const TicketDetailBackground = () => {
  return (
    <Box
      sx={{
        position: 'fixed !important',
        top: '0 !important',
        left: '0 !important',
        right: '0 !important',
        bottom: '0 !important',
        width: '100vw !important',
        height: '100vh !important',
        overflow: 'hidden !important',
        zIndex: '-999 !important',
      }}
    >
      {/* ТЕМНЫЙ ФОН */}
      <Box
        sx={{
          position: 'absolute !important',
          top: '0 !important',
          left: '0 !important',
          right: '0 !important',
          bottom: '0 !important',
          width: '100% !important',
          height: '100% !important',
          background: `
            linear-gradient(135deg, 
              #000000 0%,
              #1a1a2e 20%,
              #16213e 40%,
              #0f172a 60%,
              #020617 80%,
              #000000 100%
            ) !important
          `,
        }}
      />

      {/* ЦВЕТНЫЕ АКЦЕНТЫ */}
      <Box
        sx={{
          position: 'absolute !important',
          top: '0 !important',
          left: '0 !important',
          right: '0 !important',
          bottom: '0 !important',
          background: `
            radial-gradient(ellipse at 15% 20%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 85% 80%, rgba(59, 130, 246, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 40%)
          `,
        }}
      />

      {/* ДВИЖУЩАЯСЯ СЕТКА */}
      <motion.div
        animate={{
          x: [0, 20],
          y: [0, 20]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          pointerEvents: 'none'
        }}
      />
    </Box>
  );
};

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const loadTicket = async () => {
      try {
        setLoading(true);
        const data = await ticketService.getTicketById(id);
        setTicket(data.ticket);
        setError('');
      } catch (err) {
        setError('Ошибка загрузки заявки');
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [id]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await commentService.getComments(id);
        setComments(data.comments);
      } catch (err) {
        console.error('Ошибка загрузки комментариев');
        setComments([]);
      }
    };

    if (id) {
      loadComments();
    }
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      await commentService.addComment(id, {
        text: newComment,
        isInternal: false
      });
      setNewComment('');
      
      const data = await commentService.getComments(id);
      setComments(data.comments);
    } catch (err) {
      setError('Ошибка добавления комментария: ' + (err.response?.data?.message || err.message));
    } finally {
      setCommentLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      new: { label: 'Новая', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
      in_progress: { label: 'В работе', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
      waiting: { label: 'Ожидание', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
      resolved: { label: 'Решена', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
      closed: { label: 'Закрыта', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' }
    };
    return configs[status] || { label: status, color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' };
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      low: { label: 'Низкий', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: '🟢' },
      medium: { label: 'Средний', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: '🟡' },
      high: { label: 'Высокий', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: '🟠' },
      critical: { label: 'Критичный', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)', icon: '🔴' }
    };
    return configs[priority] || { label: priority, color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)', icon: '⚪' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        {darkBackgroundStyles}
        <TicketDetailBackground />
        <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 10 }}>
          <GlassCard variant="dark" sx={{ p: 4, textAlign: 'center' }}>
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity
              }}
            >
              <CircularProgress size={60} sx={{ color: '#10b981', mb: 3 }} />
            </motion.div>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
              Загрузка заявки...
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
              Получаем детальную информацию
            </Typography>
          </GlassCard>
        </Container>
      </Box>
    );
  }

  if (error || !ticket) {
    return (
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        {darkBackgroundStyles}
        <TicketDetailBackground />
        <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 10 }}>
          <GlassCard variant="colored" color="red" sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
              ❌ {error || 'Заявка не найдена'}
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={() => navigate('/tickets')}
                variant="contained"
                startIcon={<ArrowBack />}
                sx={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  fontWeight: 700,
                  borderRadius: 3
                }}
              >
                Вернуться к списку
              </Button>
            </motion.div>
          </GlassCard>
        </Container>
      </Box>
    );
  }

  const statusConfig = getStatusConfig(ticket.status);
  const priorityConfig = getPriorityConfig(ticket.priority);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {darkBackgroundStyles}
      <TicketDetailBackground />
      
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 10 }}>
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard variant="dark" sx={{ p: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${statusConfig.color}, ${statusConfig.color}cc)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 15px 35px ${statusConfig.color}40`
                    }}
                  >
                    <Info size={28} color="white" />
                  </Box>
                </motion.div>
                
                <Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 800,
                      color: 'white',
                      textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                    }}
                  >
                    🎫 Заявка #{ticket.ticketNumber}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Chip
                      label={statusConfig.label}
                      sx={{
                        background: `linear-gradient(135deg, ${statusConfig.color}, ${statusConfig.color}cc)`,
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                    <Chip
                      label={`${priorityConfig.icon} ${priorityConfig.label}`}
                      sx={{
                        background: `linear-gradient(135deg, ${priorityConfig.color}, ${priorityConfig.color}cc)`,
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/tickets')}
                  variant="outlined"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.6)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  Назад к списку
                </Button>
              </motion.div>
            </Box>
          </GlassCard>
        </motion.div>

        {/* Основной контент */}
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
          
          {/* Основная информация */}
          <Box sx={{ flex: 2 }}>
            
            {/* Детали заявки */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <GlassCard variant="dark" sx={{ p: 4, mb: 4 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    mb: 3,
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                  }}
                >
                  📝 {ticket.title}
                </Typography>

                <Divider sx={{ 
                  my: 3, 
                  background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.3), rgba(255,255,255,0))'
                }} />

                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.8,
                    fontSize: '1.1rem'
                  }}
                >
                  {ticket.description}
                </Typography>
              </GlassCard>
            </motion.div>

            {/* Комментарии */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlassCard variant="dark" sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Chat size={24} color="#10b981" />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'white', 
                      fontWeight: 700,
                      textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                    }}
                  >
                    💬 Комментарии ({comments.length})
                  </Typography>
                </Box>

                <List sx={{ maxHeight: 400, overflowY: 'auto', mb: 3 }}>
                  <AnimatePresence>
                    {comments.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Box sx={{ 
                          textAlign: 'center', 
                          py: 6,
                          color: 'rgba(255, 255, 255, 0.7)'
                        }}>
                          <Typography variant="h6" sx={{ mb: 1, opacity: 0.8 }}>
                            💭 Комментариев пока нет
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.6 }}>
                            Будьте первым, кто оставит комментарий
                          </Typography>
                        </Box>
                      </motion.div>
                    ) : (
                      comments.map((comment, index) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <ListItem
                            sx={{
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              mb: 2,
                              p: 3,
                              borderRadius: 3,
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(10px)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.08)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                  mr: 2,
                                  fontWeight: 700
                                }}
                              >
                                {getInitials(comment.author?.fullName)}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography 
                                  variant="subtitle1" 
                                  sx={{ 
                                    fontWeight: 700, 
                                    color: 'white',
                                    textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                                  }}
                                >
                                  {comment.author?.fullName || 'Неизвестный'}
                                </Typography>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                  }}
                                >
                                  <AccessTime fontSize="inherit" />
                                  {formatDate(comment.createdAt)}
                                </Typography>
                              </Box>
                            </Box>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                whiteSpace: 'pre-wrap',
                                color: 'rgba(255, 255, 255, 0.9)',
                                lineHeight: 1.6,
                                ml: 7
                              }}
                            >
                              {comment.text}
                            </Typography>
                          </ListItem>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </List>

                <Divider sx={{ 
                  my: 3, 
                  background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.3), rgba(255,255,255,0))'
                }} />

                {/* Форма добавления комментария */}
                <Box component="form" onSubmit={handleAddComment}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="💬 Напишите комментарий..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                          <Comment sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(16, 185, 129, 0.8)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#10b981',
                        },
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: 'rgba(255, 255, 255, 0.5)',
                      },
                    }}
                  />

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={commentLoading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                        disabled={!newComment.trim() || commentLoading}
                        sx={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          fontWeight: 700,
                          borderRadius: 3,
                          px: 4,
                          py: 1.5,
                          boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                            boxShadow: '0 15px 40px rgba(16, 185, 129, 0.6)',
                          },
                          '&:disabled': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.3)',
                          }
                        }}
                      >
                        {commentLoading ? 'Отправка...' : 'Добавить комментарий'}
                      </Button>
                    </motion.div>
                  </Box>
                </Box>
              </GlassCard>
            </motion.div>
          </Box>

          {/* Боковая панель */}
          <Box sx={{ flex: 1 }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <GlassCard variant="dark" sx={{ p: 4, position: 'sticky', top: 20 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    mb: 3,
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                  }}
                >
                  📋 Информация о заявке
                </Typography>

                <Box sx={{ space: 3 }}>
                  
                  {/* Пользователь */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Person size={18} color="#3b82f6" />
                      <Typography 
                        variant="subtitle2" 
                        sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}
                      >
                        Пользователь:
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'white',
                        fontWeight: 600,
                        ml: 3
                      }}
                    >
                      {ticket.user?.fullName || 'Неизвестно'}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2, background: 'rgba(255, 255, 255, 0.1)' }} />

                  {/* Категория */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Category size={18} color="#8b5cf6" />
                      <Typography 
                        variant="subtitle2" 
                        sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}
                      >
                        Категория:
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'white',
                        fontWeight: 600,
                        ml: 3
                      }}
                    >
                      {ticket.category?.name || 'Не указана'}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2, background: 'rgba(255, 255, 255, 0.1)' }} />

                  {/* Создана */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Schedule size={18} color="#10b981" />
                      <Typography 
                        variant="subtitle2" 
                        sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}
                      >
                        Создана:
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'white',
                        fontWeight: 600,
                        ml: 3
                      }}
                    >
                      {formatDate(ticket.createdAt)}
                    </Typography>
                  </Box>

                  {/* Решена (если есть) */}
                  {ticket.resolvedAt && (
                    <>
                      <Divider sx={{ my: 2, background: 'rgba(255, 255, 255, 0.1)' }} />
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Check size={18} color="#10b981" />
                          <Typography 
                            variant="subtitle2" 
                            sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}
                          >
                            Решена:
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: 'white',
                            fontWeight: 600,
                            ml: 3
                          }}
                        >
                          {formatDate(ticket.resolvedAt)}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </GlassCard>
            </motion.div>
          </Box>
        </Box>

        {/* Ошибки */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{ 
                position: 'fixed', 
                bottom: 20, 
                right: 20, 
                zIndex: 1000,
                maxWidth: 400
              }}
            >
              <GlassCard variant="colored" color="red" sx={{ p: 3 }}>
                <Alert 
                  severity="error"
                  sx={{ 
                    background: 'transparent',
                    color: 'white',
                    '& .MuiAlert-icon': { color: '#ef4444' }
                  }}
                >
                  {error}
                </Alert>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default TicketDetail;