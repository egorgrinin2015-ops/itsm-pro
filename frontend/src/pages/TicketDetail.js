import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ticketService from '../services/ticketService';
import commentService from '../services/commentService';
import userService from '../services/userService';
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
  GlobalStyles,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
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
  Chat,
  MoreVert,
  SwapHoriz,
  PlayArrow,
  Pause,
  CheckCircle,
  Close as CloseIcon,
  Engineering
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
  const { user, isManager } = useAuth();

  // Проверка прав для управления заявкой (менеджеры, админы, инженеры)
  const canManageTicket = user && (
    user.role === 'manager' || 
    user.role === 'admin' || 
    user.role === 'engineer' ||
    user.role === 'engineer2' ||
    user.role === 'engineer3' ||
    user.role === 'engineer4' ||
    user.role === 'engineer5'
  );

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  
  // Состояния для меню
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [assigneeDialogOpen, setAssigneeDialogOpen] = useState(false);
  const [engineers, setEngineers] = useState([]);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // НОВОЕ: Состояния для диалога отложения
  const [onHoldDialogOpen, setOnHoldDialogOpen] = useState(false);
  const [onHoldDate, setOnHoldDate] = useState('');
  const [onHoldReason, setOnHoldReason] = useState('');
  const [onHoldComment, setOnHoldComment] = useState('');

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

  // Загрузка списка инженеров
  useEffect(() => {
    const loadEngineers = async () => {
      try {
        const data = await userService.getEngineers();
        setEngineers(data.engineers || []);
      } catch (err) {
        console.error('Ошибка загрузки инженеров:', err);
        setEngineers([]);
      }
    };

    if (canManageTicket) {
      loadEngineers();
    }
  }, [canManageTicket]);

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

  // Обработчики для меню статуса
  const handleStatusMenuOpen = (event) => {
    setStatusMenuAnchor(event.currentTarget);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuAnchor(null);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      // ЕСЛИ СТАТУС "ОТЛОЖЕНА" - ОТКРЫТЬ ДИАЛОГ
      if (newStatus === 'on_hold') {
        setOnHoldDialogOpen(true);
        handleStatusMenuClose();
        return; // Прерываем выполнение, диалог обработает дальше
      }

      setActionLoading(true);
      
      // АВТОНАЗНАЧЕНИЕ: Если "в работу" и не назначена - назначить на себя
      if (newStatus === 'in_progress' && !ticket.assignedTo?.id) {
        console.log('🚀 Автоназначение: взятие в работу');
        console.log('👤 Назначаем на:', user.fullName);
        try {
          await ticketService.assignTicket(id, user.id);
          console.log('✅ Успешно назначен!');
        } catch (assignErr) {
          console.error('⚠️ Ошибка назначения:', assignErr);
        }
      }
      
      // Меняем статус
      await ticketService.updateTicketStatus(id, newStatus);
      
      // Обновляем заявку
      const data = await ticketService.getTicketById(id);
      setTicket(data);
      setError('');
      handleStatusMenuClose();
      console.log('✅ Статус успешно изменён');
    } catch (err) {
      console.error('❌ Ошибка:', err);
      setError('Ошибка изменения статуса: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  // Обработчики для смены ответственного
  const handleAssigneeDialogOpen = () => {
    setAssigneeDialogOpen(true);
  };

  const handleAssigneeDialogClose = () => {
    setAssigneeDialogOpen(false);
    setSelectedEngineer(null);
  };

  const handleAssigneeChange = async () => {
    if (!selectedEngineer) return;

    try {
      setActionLoading(true);
      await ticketService.assignTicket(id, selectedEngineer);
      
      // Обновляем заявку
      const data = await ticketService.getTicketById(id);
      setTicket(data);
      setError('');
      handleAssigneeDialogClose();
    } catch (err) {
      setError('Ошибка назначения ответственного: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  // НОВОЕ: Обработчики для диалога отложения
  const handleOnHoldDialogClose = () => {
    setOnHoldDialogOpen(false);
    setOnHoldDate('');
    setOnHoldReason('');
    setOnHoldComment('');
  };

  const handleOnHoldSubmit = async () => {
    try {
      if (!onHoldDate || !onHoldReason) {
        setError('Заполните дату и причину отложения');
        return;
      }

      setActionLoading(true);

      // 1. Меняем статус на "отложена"
      await ticketService.updateTicketStatus(id, 'on_hold');
      console.log('✅ Статус изменён на "отложена"');

      // 2. Если есть комментарий - добавляем его
      if (onHoldComment.trim()) {
        const commentText = `⏸️ ЗАЯВКА ОТЛОЖЕНА

📅 Отложена до: ${new Date(onHoldDate).toLocaleString('ru-RU', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
📋 Причина: ${onHoldReason}

💬 Комментарий: ${onHoldComment}`;

        await commentService.addComment(id, {
          text: commentText,
          isInternal: false
        });
        console.log('✅ Комментарий добавлен');

        // Перезагружаем комментарии
        const commentsData = await commentService.getComments(id);
        setComments(commentsData.comments);
      }

      // 3. Обновляем заявку
      const data = await ticketService.getTicketById(id);
      setTicket(data);
      setError('');
      handleOnHoldDialogClose();

      console.log('🎉 Заявка отложена успешно!');
    } catch (err) {
      console.error('❌ Ошибка отложения:', err);
      setError('Ошибка отложения заявки: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      new: { 
        label: 'Новая', 
        color: theme.functional.info.main, 
        bg: theme.functional.info.bg,
        icon: React.createElement(Info, { size: 18 })
      },
      in_progress: { 
        label: 'В работе', 
        color: theme.functional.warning.main, 
        bg: theme.functional.warning.bg,
        icon: React.createElement(PlayArrow, { size: 18 })
      },
      on_hold: { 
        label: 'Отложена', 
        color: theme.primary.main, 
        bg: `${theme.primary.main}1A`,
        icon: React.createElement(Pause, { size: 18 })
      },
      resolved: { 
        label: 'Решена', 
        color: theme.functional.success.main, 
        bg: theme.functional.success.bg,
        icon: React.createElement(CheckCircle, { size: 18 })
      },
      closed: { 
        label: 'Закрыта', 
        color: theme.text.secondary, 
        bg: `${theme.text.secondary}1A`,
        icon: React.createElement(CloseIcon, { size: 18 })
      }
    };
    return configs[status] || { 
      label: status, 
      color: theme.text.secondary, 
      bg: `${theme.text.secondary}1A`,
      icon: React.createElement(Info, { size: 18 })
    };
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

  // Получить доступные статусы для смены
  const getAvailableStatuses = () => {
    const currentStatus = ticket?.status;
    const allStatuses = ['in_progress', 'on_hold', 'resolved', 'closed'];
    
    // Убираем текущий статус из списка
    return allStatuses.filter(status => status !== currentStatus);
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
                startIcon={React.createElement(ArrowBack)}
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
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
                    {statusConfig.icon}
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
                  <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={statusConfig.label}
                      icon={statusConfig.icon}
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
                  startIcon={React.createElement(ArrowBack)}
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
{/* НОВОЕ: Блок с ответственным и кнопками управления */}
            {canManageTicket && (
              <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${theme.border.main}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                  
                  {/* Ответственный исполнитель */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {React.createElement(Engineering, { sx: { color: theme.functional.info.main } })}
                    <Box>
                      <Typography variant="caption" sx={{ color: theme.text.secondary, display: 'block' }}>
                        Ответственный:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            background: theme.gradients.primary,
                            fontSize: '0.875rem',
                            fontWeight: 700
                          }}
                        >
                          {getInitials(ticket.assignedTo?.fullName || 'Не назначен')}
                        </Avatar>
                        <Typography variant="body1" sx={{ color: theme.text.primary, fontWeight: 600 }}>
                          {ticket.assignedTo?.fullName || 'Не назначен'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Кнопки управления */}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* Кнопка изменить ответственного */}
                    <Tooltip title="Изменить ответственного">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          startIcon={React.createElement(SwapHoriz)}
                          onClick={handleAssigneeDialogOpen}
                          variant="outlined"
                          disabled={actionLoading}
                          sx={{
                            color: theme.functional.info.main,
                            borderColor: theme.functional.info.border,
                            fontWeight: 600,
                            '&:hover': {
                              borderColor: theme.functional.info.main,
                              backgroundColor: theme.functional.info.bg,
                            }
                          }}
                        >
                          Изменить ответственного
                        </Button>
                      </motion.div>
                    </Tooltip>

                    {/* Кнопка меню статуса */}
                    <Tooltip title="Изменить статус">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          startIcon={React.createElement(MoreVert)}
                          onClick={handleStatusMenuOpen}
                          variant="contained"
                          disabled={actionLoading}
                          sx={{
                            background: theme.gradients.primary,
                            fontWeight: 600,
                            boxShadow: `0 4px 15px ${theme.primary.main}66`,
                            '&:hover': {
                              background: `linear-gradient(135deg, ${theme.primary.dark} 0%, ${theme.primary.main} 100%)`,
                              boxShadow: `0 8px 25px ${theme.primary.main}99`,
                            }
                          }}
                        >
                          Статус
                        </Button>
                      </motion.div>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            )}
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
                  {React.createElement(Chat, { size: 24, color: theme.functional.success.main })}
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
                                  {React.createElement(AccessTime, { fontSize: 'inherit' })}
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
                          {React.createElement(Comment, { sx: { color: theme.text.secondary } })}
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
                        startIcon={commentLoading ? React.createElement(CircularProgress, { size: 20, color: 'inherit' }) : React.createElement(Send)}
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
                      {React.createElement(Person, { size: 18, color: theme.functional.info.main })}
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
                      {React.createElement(Category, { size: 18, color: theme.primary.main })}
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
                      {React.createElement(Schedule, { size: 18, color: theme.functional.success.main })}
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
                          {React.createElement(Check, { size: 18, color: theme.functional.success.main })}
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

        {/* НОВОЕ: Меню для смены статуса */}
        <Menu
          anchorEl={statusMenuAnchor}
          open={Boolean(statusMenuAnchor)}
          onClose={handleStatusMenuClose}
          PaperProps={{
            sx: {
              background: theme.background.secondary,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${theme.border.main}`,
              boxShadow: theme.glass.dark.shadow,
              borderRadius: 3,
              minWidth: 200
            }
          }}
        >
          {getAvailableStatuses().map((status) => {
            const config = getStatusConfig(status);
            return (
              <MenuItem
                key={status}
                onClick={() => handleStatusChange(status)}
                sx={{
                  color: theme.text.primary,
                  py: 1.5,
                  px: 2,
                  '&:hover': {
                    background: `${config.color}1A`,
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {config.icon}
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {config.label}
                  </Typography>
                </Box>
              </MenuItem>
            );
          })}
        </Menu>

        {/* НОВОЕ: Диалог выбора ответственного */}
        <Dialog
          open={assigneeDialogOpen}
          onClose={handleAssigneeDialogClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: theme.background.secondary,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${theme.border.main}`,
              borderRadius: 4,
              boxShadow: theme.glass.dark.shadow
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTitle sx={{ 
              color: theme.text.primary,
              fontWeight: 700, 
              fontSize: '1.5rem',
              borderBottom: `1px solid ${theme.border.main}`,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              {React.createElement(SwapHoriz, { sx: { color: theme.functional.info.main } })}
              Изменить ответственного
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
              <Typography variant="body2" sx={{ color: theme.text.secondary, mb: 3 }}>
                Выберите инженера, который будет ответственным за эту заявку:
              </Typography>

              <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {engineers.map((engineer) => (
                  <motion.div
                    key={engineer.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ListItem
                      button
                      selected={selectedEngineer === engineer.id}
                      onClick={() => setSelectedEngineer(engineer.id)}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        background: selectedEngineer === engineer.id ? 
                          `${theme.functional.info.main}1A` : 
                          theme.background.elevated,
                        border: selectedEngineer === engineer.id ?
                          `2px solid ${theme.functional.info.main}` :
                          `1px solid ${theme.border.main}`,
                        '&:hover': {
                          background: `${theme.functional.info.main}0D`,
                        }
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          background: theme.gradients.primary,
                          mr: 2,
                          fontWeight: 700
                        }}
                      >
                        {getInitials(engineer.fullName)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ color: theme.text.primary, fontWeight: 600 }}>
                          {engineer.fullName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.text.disabled }}>
                          {engineer.email}
                        </Typography>
                      </Box>
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.border.main}` }}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={handleAssigneeDialogClose}
                  sx={{
                    color: theme.text.secondary,
                    borderColor: theme.border.main,
                    '&:hover': {
                      borderColor: theme.border.light,
                      backgroundColor: theme.background.elevated,
                    }
                  }}
                  variant="outlined"
                >
                  Отмена
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={handleAssigneeChange} 
                  variant="contained"
                  disabled={!selectedEngineer || actionLoading}
                  startIcon={actionLoading ? React.createElement(CircularProgress, { size: 20, color: 'inherit' }) : React.createElement(Check)}
                  sx={{
                    background: theme.gradients.primary,
                    fontWeight: 700,
                    boxShadow: `0 4px 15px ${theme.primary.main}66`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.primary.dark} 0%, ${theme.primary.main} 100%)`,
                      boxShadow: `0 8px 25px ${theme.primary.main}99`,
                    },
                    '&:disabled': {
                      background: theme.background.secondary,
                      color: theme.text.disabled,
                    }
                  }}
                >
                  {actionLoading ? 'Сохранение...' : 'Назначить'}
                </Button>
              </motion.div>
            </DialogActions>
          </motion.div>
        </Dialog>

        {/* НОВОЕ: Диалог отложения заявки */}
        <Dialog
          open={onHoldDialogOpen}
          onClose={handleOnHoldDialogClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: theme.background.secondary,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${theme.border.main}`,
              borderRadius: 4,
              boxShadow: theme.glass.dark.shadow
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTitle sx={{ 
              color: theme.text.primary,
              fontWeight: 700, 
              fontSize: '1.5rem',
              borderBottom: `1px solid ${theme.border.main}`,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              {React.createElement(Pause, { sx: { color: theme.primary.main } })}
              Отложить заявку
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                
                {/* Дата отложения */}
                <Box>
                  <Typography variant="subtitle2" sx={{ color: theme.text.secondary, mb: 1, fontWeight: 600 }}>
                    📅 Отложить до: *
                  </Typography>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    value={onHoldDate}
                    onChange={(e) => setOnHoldDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: theme.text.primary,
                        backgroundColor: theme.background.elevated,
                        '& fieldset': {
                          borderColor: theme.border.main,
                        },
                        '&:hover fieldset': {
                          borderColor: theme.primary.main,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.primary.main,
                        },
                      },
                    }}
                  />
                </Box>

                {/* Причина ожидания */}
                <Box>
                  <Typography variant="subtitle2" sx={{ color: theme.text.secondary, mb: 1, fontWeight: 600 }}>
                    📋 Причина ожидания: *
                  </Typography>
                  <TextField
                    fullWidth
                    select
                    value={onHoldReason}
                    onChange={(e) => setOnHoldReason(e.target.value)}
                    SelectProps={{
                      native: true,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: theme.text.primary,
                        backgroundColor: theme.background.elevated,
                        '& fieldset': {
                          borderColor: theme.border.main,
                        },
                        '&:hover fieldset': {
                          borderColor: theme.primary.main,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.primary.main,
                        },
                      },
                    }}
                  >
                    <option value="">Выберите причину...</option>
                    <option value="Ожидание закупки">Ожидание закупки</option>
                    <option value="Передано в другое подразделение">Передано в другое подразделение</option>
                    <option value="По просьбе пользователя">По просьбе пользователя</option>
                  </TextField>
                </Box>

                {/* Комментарий */}
                <Box>
                  <Typography variant="subtitle2" sx={{ color: theme.text.secondary, mb: 1, fontWeight: 600 }}>
                    💬 Комментарий:
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Добавьте дополнительную информацию..."
                    value={onHoldComment}
                    onChange={(e) => setOnHoldComment(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: theme.text.primary,
                        backgroundColor: theme.background.elevated,
                        '& fieldset': {
                          borderColor: theme.border.main,
                        },
                        '&:hover fieldset': {
                          borderColor: theme.primary.main,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.primary.main,
                        },
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: theme.text.disabled,
                      },
                    }}
                  />
                </Box>

                <Alert severity="info" sx={{ 
                  background: `${theme.functional.info.main}1A`,
                  color: theme.text.primary,
                  border: `1px solid ${theme.functional.info.border}`,
                  '& .MuiAlert-icon': { color: theme.functional.info.main }
                }}>
                  Комментарий будет добавлен в историю заявки
                </Alert>
              </Box>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.border.main}` }}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={handleOnHoldDialogClose}
                  sx={{
                    color: theme.text.secondary,
                    borderColor: theme.border.main,
                    '&:hover': {
                      borderColor: theme.border.light,
                      backgroundColor: theme.background.elevated,
                    }
                  }}
                  variant="outlined"
                  disabled={actionLoading}
                >
                  Отмена
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={handleOnHoldSubmit} 
                  variant="contained"
                  disabled={!onHoldDate || !onHoldReason || actionLoading}
                  startIcon={actionLoading ? React.createElement(CircularProgress, { size: 20, color: 'inherit' }) : React.createElement(Check)}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.primary.main} 0%, ${theme.primary.dark} 100%)`,
                    fontWeight: 700,
                    boxShadow: `0 4px 15px ${theme.primary.main}66`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.primary.dark} 0%, ${theme.primary.main} 100%)`,
                      boxShadow: `0 8px 25px ${theme.primary.main}99`,
                    },
                    '&:disabled': {
                      background: theme.background.secondary,
                      color: theme.text.disabled,
                    }
                  }}
                >
                  {actionLoading ? 'Сохранение...' : 'Отложить'}
                </Button>
              </motion.div>
            </DialogActions>
          </motion.div>
        </Dialog>

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