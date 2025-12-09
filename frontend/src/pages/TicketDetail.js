import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ticketService from '../services/ticketService';
import commentService from '../services/commentService';
import GlassCard from '../components/GlassCard';
import theme from '../theme/theme';
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

// Глобальные стили с Space Indigo темой
const darkBackgroundStyles = (
  <GlobalStyles
    styles={{
      body: {
        background: `${theme.gradients.background} !important`,
        minHeight: '100vh !important',
      },
      '#root': {
        background: `${theme.gradients.background} !important`,
        minHeight: '100vh !important',
      },
      html: {
        background: `${theme.background.primary} !important`,
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
      {/* ОСНОВНОЙ ФОН */}
      <Box
        sx={{
          position: 'absolute !important',
          top: '0 !important',
          left: '0 !important',
          right: '0 !important',
          bottom: '0 !important',
          width: '100% !important',
          height: '100% !important',
          background: theme.gradients.background,
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
            radial-gradient(ellipse at 15% 20%, ${theme.functional.success.main}4D 0%, transparent 50%),
            radial-gradient(ellipse at 85% 80%, ${theme.functional.info.main}40 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, ${theme.primary.main}33 0%, transparent 40%)
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
            linear-gradient(${theme.border.main} 1px, transparent 1px),
            linear-gradient(90deg, ${theme.border.main} 1px, transparent 1px)
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
        setTicket(data);
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
      new: { label: 'Новая', color: theme.functional.info.main, bg: theme.functional.info.bg },
      in_progress: { label: 'В работе', color: theme.functional.warning.main, bg: theme.functional.warning.bg },
      waiting: { label: 'Ожидание', color: theme.primary.main, bg: `${theme.primary.main}1A` },
      resolved: { label: 'Решена', color: theme.functional.success.main, bg: theme.functional.success.bg },
      closed: { label: 'Закрыта', color: theme.text.secondary, bg: `${theme.text.secondary}1A` }
    };
    return configs[status] || { label: status, color: theme.text.secondary, bg: `${theme.text.secondary}1A` };
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      low: { label: 'Низкий', color: theme.functional.success.main, bg: theme.functional.success.bg, icon: '🟢' },
      medium: { label: 'Средний', color: theme.functional.warning.main, bg: theme.functional.warning.bg, icon: '🟡' },
      high: { label: 'Высокий', color: theme.functional.error.main, bg: theme.functional.error.bg, icon: '🟠' },
      critical: { label: 'Критичный', color: theme.functional.error.main, bg: theme.functional.error.bg, icon: '🔴' }
    };
    return configs[priority] || { label: priority, color: theme.text.secondary, bg: `${theme.text.secondary}1A`, icon: '⚪' };
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
              <CircularProgress size={60} sx={{ color: theme.functional.success.main, mb: 3 }} />
            </motion.div>
            <Typography variant="h5" sx={{ color: theme.text.primary, fontWeight: 700 }}>
              Загрузка заявки...
            </Typography>
            <Typography sx={{ color: theme.text.secondary, mt: 1 }}>
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
            <Typography variant="h5" sx={{ color: theme.text.primary, fontWeight: 700, mb: 3 }}>
              ❌ {error || 'Заявка не найдена'}
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={() => navigate('/tickets')}
                variant="contained"
                startIcon={<ArrowBack />}
                sx={{
                  background: `linear-gradient(135deg, ${theme.functional.error.main} 0%, #dc2626 100%)`,
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
                      background: `linear-gradient(135deg, ${statusConfig.color}, ${statusConfig.color}CC)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 15px 35px ${statusConfig.color}66`
                    }}
                  >
                    <Info size={28} color={theme.text.primary} />
                  </Box>
                </motion.div>
                
                <Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 800,
                      color: theme.text.primary,
                      textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                    }}
                  >
                    🎫 Заявка #{ticket.id}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Chip
                      label={statusConfig.label}
                      sx={{
                        background: `linear-gradient(135deg, ${statusConfig.color}, ${statusConfig.color}CC)`,
                        color: theme.text.primary,
                        fontWeight: 600
                      }}
                    />
                    <Chip
                      label={`${priorityConfig.icon} ${priorityConfig.label}`}
                      sx={{
                        background: `linear-gradient(135deg, ${priorityConfig.color}, ${priorityConfig.color}CC)`,
                        color: theme.text.primary,
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
                    color: theme.text.secondary,
                    borderColor: theme.border.main,
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: theme.border.light,
                      backgroundColor: theme.background.elevated,
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
                    color: theme.text.primary, 
                    fontWeight: 700, 
                    mb: 3,
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                  }}
                >
                  📝 {ticket.title}
                </Typography>

                <Divider sx={{ 
                  my: 3, 
                  background: `linear-gradient(90deg, transparent, ${theme.border.main}, transparent)`
                }} />

                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: theme.text.primary,
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
                  <Chat size={24} color={theme.functional.success.main} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: theme.text.primary, 
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
                          color: theme.text.secondary
                        }}>
                          <Typography variant="h6" sx={{ mb: 1 }}>
                            💭 Комментариев пока нет
                          </Typography>
                          <Typography variant="body2" sx={{ color: theme.text.disabled }}>
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
                              background: theme.background.elevated,
                              border: `1px solid ${theme.border.main}`,
                              backdropFilter: 'blur(10px)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                background: theme.background.secondary,
                                transform: 'translateY(-2px)',
                                boxShadow: theme.glass.dark.shadow
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  background: theme.gradients.primary,
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
                                    color: theme.text.primary,
                                    textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                                  }}
                                >
                                  {comment.author?.fullName || 'Неизвестный'}
                                </Typography>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: theme.text.disabled,
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
                                color: theme.text.primary,
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
                  background: `linear-gradient(90deg, transparent, ${theme.border.main}, transparent)`
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
                          <Comment sx={{ color: theme.text.secondary }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: theme.text.primary,
                        backgroundColor: theme.background.elevated,
                        '& fieldset': {
                          borderColor: theme.border.main,
                        },
                        '&:hover fieldset': {
                          borderColor: theme.functional.success.main,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.functional.success.main,
                        },
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: theme.text.disabled,
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
                          background: `linear-gradient(135deg, ${theme.functional.success.main} 0%, #059669 100%)`,
                          fontWeight: 700,
                          borderRadius: 3,
                          px: 4,
                          py: 1.5,
                          boxShadow: `0 8px 25px ${theme.functional.success.main}66`,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                            boxShadow: `0 15px 40px ${theme.functional.success.main}99`,
                          },
                          '&:disabled': {
                            background: theme.background.secondary,
                            color: theme.text.disabled,
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
                    color: theme.text.primary, 
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
                      <Person size={18} color={theme.functional.info.main} />
                      <Typography 
                        variant="subtitle2" 
                        sx={{ color: theme.text.secondary, fontWeight: 600 }}
                      >
                        Пользователь:
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: theme.text.primary,
                        fontWeight: 600,
                        ml: 3
                      }}
                    >
                      {ticket.creatorName || 'Неизвестно'}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2, background: theme.border.main }} />

                  {/* Категория */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Category size={18} color={theme.primary.main} />
                      <Typography 
                        variant="subtitle2" 
                        sx={{ color: theme.text.secondary, fontWeight: 600 }}
                      >
                        Категория:
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: theme.text.primary,
                        fontWeight: 600,
                        ml: 3
                      }}
                    >
                      {ticket.categoryName || 'Не указана'}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2, background: theme.border.main }} />

                  {/* Создана */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Schedule size={18} color={theme.functional.success.main} />
                      <Typography 
                        variant="subtitle2" 
                        sx={{ color: theme.text.secondary, fontWeight: 600 }}
                      >
                        Создана:
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: theme.text.primary,
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
                      <Divider sx={{ my: 2, background: theme.border.main }} />
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Check size={18} color={theme.functional.success.main} />
                          <Typography 
                            variant="subtitle2" 
                            sx={{ color: theme.text.secondary, fontWeight: 600 }}
                          >
                            Решена:
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: theme.text.primary,
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
                    color: theme.text.primary,
                    '& .MuiAlert-icon': { color: theme.functional.error.main }
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