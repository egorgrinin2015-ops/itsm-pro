import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ticketService from '../services/ticketService';
import commentService from '../services/commentService';
import userService from '../services/userService';
import GlassCard from '../components/GlassCard';
import TimeLogsTab from '../components/TimeLogsTab';
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
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Tabs,
  Tab
} from '@mui/material';
import {
  ArrowBack,
  Send,
  Person,
  AccessTime,
  Category,
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
  Close,
  Engineering,
  Description as DescriptionIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { Clock } from 'lucide-react';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isManager } = useAuth();

  const canManageTicket = user && (
    user.role === 'manager' || 
    user.role === 'admin' || 
    ['engineer', 'engineer2', 'engineer3', 'engineer4', 'engineer5'].includes(user.role)
  );

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [assigneeDialogOpen, setAssigneeDialogOpen] = useState(false);
  const [engineers, setEngineers] = useState([]);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
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
        setComments([]);
      }
    };
    if (id) loadComments();
  }, [id]);

  useEffect(() => {
    const loadEngineers = async () => {
      try {
        const data = await userService.getEngineers();
        setEngineers(data.engineers || []);
      } catch (err) {
        setEngineers([]);
      }
    };
    if (canManageTicket) loadEngineers();
  }, [canManageTicket]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      setCommentLoading(true);
      await commentService.addComment(id, { text: newComment, isInternal: false });
      setNewComment('');
      const data = await commentService.getComments(id);
      setComments(data.comments);
    } catch (err) {
      setError('Ошибка добавления комментария');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      if (newStatus === 'on_hold') {
        setOnHoldDialogOpen(true);
        setStatusMenuAnchor(null);
        return;
      }
      setActionLoading(true);
      if (newStatus === 'in_progress' && !ticket.assignedTo?.id) {
        await ticketService.assignTicket(id, user.id);
      }
      await ticketService.updateTicketStatus(id, newStatus);
      const data = await ticketService.getTicketById(id);
      setTicket(data);
      setStatusMenuAnchor(null);
    } catch (err) {
      setError('Ошибка изменения статуса');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssigneeChange = async () => {
    if (!selectedEngineer) return;
    try {
      setActionLoading(true);
      await ticketService.assignTicket(id, selectedEngineer);
      const data = await ticketService.getTicketById(id);
      setTicket(data);
      setAssigneeDialogOpen(false);
      setSelectedEngineer(null);
    } catch (err) {
      setError('Ошибка назначения ответственного');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOnHoldSubmit = async () => {
    if (!onHoldDate || !onHoldReason) {
      setError('Заполните дату и причину');
      return;
    }
    try {
      setActionLoading(true);
      await ticketService.updateTicketStatus(id, 'on_hold');
      if (onHoldComment.trim()) {
        const commentText = `⏸️ ЗАЯВКА ОТЛОЖЕНА\n📅 До: ${new Date(onHoldDate).toLocaleString('ru-RU')}\n📋 Причина: ${onHoldReason}\n\n${onHoldComment}`;
        await commentService.addComment(id, { text: commentText, isInternal: false });
        const commentsData = await commentService.getComments(id);
        setComments(commentsData.comments);
      }
      const data = await ticketService.getTicketById(id);
      setTicket(data);
      setOnHoldDialogOpen(false);
      setOnHoldDate('');
      setOnHoldReason('');
      setOnHoldComment('');
    } catch (err) {
      setError('Ошибка отложения заявки');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      new: { label: 'Новая', color: '#3b82f6', icon: <Info sx={{ fontSize: 18 }} /> },
      in_progress: { label: 'В работе', color: '#ef4444', icon: <PlayArrow sx={{ fontSize: 18 }} /> },
      on_hold: { label: 'Отложена', color: '#9ca3af', icon: <Pause sx={{ fontSize: 18 }} /> },
      resolved: { label: 'Решена', color: '#22c55e', icon: <CheckCircle sx={{ fontSize: 18 }} /> },
      closed: { label: 'Закрыта', color: '#64748b', icon: <Close sx={{ fontSize: 18 }} /> }
    };
    return configs[status] || { label: status, color: '#64748b', icon: <Info sx={{ fontSize: 18 }} /> };
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      low: { label: 'Низкий', color: '#10b981', icon: '🟢' },
      medium: { label: 'Средний', color: '#f59e0b', icon: '🟡' },
      high: { label: 'Высокий', color: '#f97316', icon: '🟠' },
      critical: { label: 'Критичный', color: '#ef4444', icon: '🔴' }
    };
    return configs[priority] || { label: priority, color: '#64748b', icon: '⚪' };
  };

  const getAvailableStatuses = () => {
    return ['in_progress', 'on_hold', 'resolved', 'closed'].filter(s => s !== ticket?.status);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(p => p[0]).join('').toUpperCase();
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: 2,
      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
      '&:hover fieldset': { borderColor: '#3b82f6' },
      '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
    },
    '& .MuiOutlinedInput-input': { color: '#fff' },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <GlassCard variant="dark" sx={{ p: 6, textAlign: 'center' }}>
          <CircularProgress size={50} sx={{ color: '#3b82f6', mb: 2 }} />
          <Typography sx={{ color: '#fff', fontWeight: 600 }}>Загрузка заявки...</Typography>
        </GlassCard>
      </Box>
    );
  }

  if (error && !ticket) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <GlassCard variant="dark" sx={{ p: 6, textAlign: 'center', maxWidth: 500 }}>
          <Typography variant="h5" sx={{ color: '#ef4444', fontWeight: 700, mb: 3 }}>❌ {error}</Typography>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/tickets')} variant="contained"
            sx={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            Назад к списку
          </Button>
        </GlassCard>
      </Box>
    );
  }

  const statusConfig = getStatusConfig(ticket.status);
  const priorityConfig = getPriorityConfig(ticket.priority);

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard variant="dark" sx={{ mb: 3, overflow: 'hidden' }}>
            {/* Шапка */}
            <Box sx={{ 
              background: `linear-gradient(135deg, ${statusConfig.color}, ${statusConfig.color}CC)`, 
              p: 3, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 50, height: 50, background: 'rgba(255,255,255,0.2)' }}>
                  {statusConfig.icon}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800 }}>
                    Заявка #{ticket.id}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Chip label={statusConfig.label} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }} />
                    <Chip label={`${priorityConfig.icon} ${priorityConfig.label}`} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }} />
                  </Box>
                </Box>
              </Box>
              <IconButton onClick={() => navigate('/tickets')} sx={{ color: '#fff', backgroundColor: 'rgba(255,255,255,0.1)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}>
                <Close />
              </IconButton>
            </Box>

            {/* Панель управления для инженеров/менеджеров */}
            {canManageTicket && (
              <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Engineering sx={{ color: '#3b82f6' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Ответственный</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 28, height: 28, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', fontSize: '0.75rem' }}>
                        {getInitials(ticket.assignedTo?.fullName)}
                      </Avatar>
                      <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                        {ticket.assignedTo?.fullName || 'Не назначен'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button startIcon={<SwapHoriz />} onClick={() => setAssigneeDialogOpen(true)} size="small" variant="outlined"
                    sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' } }}>
                    Изменить
                  </Button>
                  <Button startIcon={<MoreVert />} onClick={(e) => setStatusMenuAnchor(e.currentTarget)} size="small" variant="contained"
                    sx={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                    Статус
                  </Button>
                </Box>
              </Box>
            )}

            {/* Вкладки */}
            <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}
                sx={{
                  '& .MuiTab-root': { color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'none', minHeight: 56 },
                  '& .Mui-selected': { color: '#3b82f6' },
                  '& .MuiTabs-indicator': { backgroundColor: '#3b82f6', height: 3 }
                }}>
                <Tab icon={<DescriptionIcon />} iconPosition="start" label="Детали" />
                <Tab icon={<HistoryIcon />} iconPosition="start" label={`Комментарии (${comments.length})`} />
                <Tab icon={<Clock size={18} />} iconPosition="start" label="Время" />
              </Tabs>
            </Box>

            {/* Контент вкладок */}
            <Box sx={{ p: 3 }}>
              {/* Детали */}
              {activeTab === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>📝 {ticket.title}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap', lineHeight: 1.8, mb: 3 }}>
                    {ticket.description}
                  </Typography>
                  <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                    <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Person sx={{ color: '#3b82f6', fontSize: 18 }} />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Автор</Typography>
                      </Box>
                      <Typography sx={{ color: '#fff', fontWeight: 600 }}>{ticket.creatorName || 'Неизвестно'}</Typography>
                    </Box>
                    <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Category sx={{ color: '#10b981', fontSize: 18 }} />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Категория</Typography>
                      </Box>
                      <Typography sx={{ color: '#fff', fontWeight: 600 }}>{ticket.categoryName || 'Не указана'}</Typography>
                    </Box>
                    <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Schedule sx={{ color: '#8b5cf6', fontSize: 18 }} />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Создана</Typography>
                      </Box>
                      <Typography sx={{ color: '#fff', fontWeight: 600 }}>{formatDate(ticket.createdAt)}</Typography>
                    </Box>
                    {ticket.resolvedAt && (
                      <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <CheckCircle sx={{ color: '#22c55e', fontSize: 18 }} />
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Решена</Typography>
                        </Box>
                        <Typography sx={{ color: '#fff', fontWeight: 600 }}>{formatDate(ticket.resolvedAt)}</Typography>
                      </Box>
                    )}
                  </Box>
                </motion.div>
              )}

              {/* Комментарии */}
              {activeTab === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Box sx={{ maxHeight: 400, overflowY: 'auto', mb: 3 }}>
                    {comments.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 6 }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>💭 Комментариев пока нет</Typography>
                      </Box>
                    ) : (
                      comments.map((comment, index) => (
                        <motion.div key={comment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                          <Box sx={{ p: 2, mb: 2, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Avatar sx={{ width: 32, height: 32, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', fontSize: '0.8rem' }}>
                                {getInitials(comment.author?.fullName)}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{comment.author?.fullName}</Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <AccessTime sx={{ fontSize: 12 }} /> {formatDate(comment.createdAt)}
                                </Typography>
                              </Box>
                            </Box>
                            <Typography sx={{ color: 'rgba(255,255,255,0.9)', whiteSpace: 'pre-wrap', ml: 6 }}>{comment.text}</Typography>
                          </Box>
                        </motion.div>
                      ))
                    )}
                  </Box>
                  <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                  <Box component="form" onSubmit={handleAddComment}>
                    <TextField fullWidth multiline rows={3} placeholder="Напишите комментарий..." value={newComment} onChange={(e) => setNewComment(e.target.value)}
                      sx={{ mb: 2, ...inputStyles }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button type="submit" variant="contained" startIcon={commentLoading ? <CircularProgress size={18} color="inherit" /> : <Send />}
                        disabled={!newComment.trim() || commentLoading}
                        sx={{ background: 'linear-gradient(135deg, #10b981, #059669)', '&:disabled': { background: 'rgba(255,255,255,0.1)' } }}>
                        {commentLoading ? 'Отправка...' : 'Отправить'}
                      </Button>
                    </Box>
                  </Box>
                </motion.div>
              )}

              {/* Время */}
              {activeTab === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <TimeLogsTab ticketId={ticket.id} ticketNumber={ticket.ticketNumber || `#${ticket.id}`} />
                </motion.div>
              )}
            </Box>
          </GlassCard>
        </motion.div>

        {/* Меню статуса */}
        <Menu anchorEl={statusMenuAnchor} open={Boolean(statusMenuAnchor)} onClose={() => setStatusMenuAnchor(null)}
          PaperProps={{ sx: { background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, minWidth: 200, p: 1 } }}>
          {getAvailableStatuses().map((status) => {
            const config = getStatusConfig(status);
            return (
              <MenuItem key={status} onClick={() => handleStatusChange(status)}
                sx={{ color: '#fff', py: 1.5, borderRadius: 1, mb: 0.5, background: `${config.color}20`, border: `1px solid ${config.color}50`,
                  '&:hover': { background: `${config.color}40` } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {config.icon}
                  <Typography sx={{ fontWeight: 600 }}>{config.label}</Typography>
                </Box>
              </MenuItem>
            );
          })}
        </Menu>

        {/* Диалог назначения */}
        <Dialog open={assigneeDialogOpen} onClose={() => setAssigneeDialogOpen(false)} maxWidth="sm" fullWidth
          PaperProps={{ sx: { background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 } }}>
          <DialogTitle sx={{ color: '#fff', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 2 }}>
            <SwapHoriz sx={{ color: '#3b82f6' }} /> Изменить ответственного
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {engineers.map((eng) => (
                <ListItem key={eng.id} button selected={selectedEngineer === eng.id} onClick={() => setSelectedEngineer(eng.id)}
                  sx={{ borderRadius: 2, mb: 1, background: selectedEngineer === eng.id ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
                    border: selectedEngineer === eng.id ? '2px solid #3b82f6' : '2px solid rgba(255,255,255,0.1)',
                    '&:hover': { background: 'rgba(59,130,246,0.1)' } }}>
                  <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', mr: 2, fontSize: '0.85rem' }}>
                    {getInitials(eng.fullName)}
                  </Avatar>
                  <Box>
                    <Typography sx={{ color: '#fff', fontWeight: 600 }}>{eng.fullName}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{eng.email}</Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Button onClick={() => setAssigneeDialogOpen(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>Отмена</Button>
            <Button onClick={handleAssigneeChange} variant="contained" disabled={!selectedEngineer || actionLoading}
              startIcon={actionLoading ? <CircularProgress size={18} color="inherit" /> : <Check />}
              sx={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              {actionLoading ? 'Сохранение...' : 'Назначить'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Диалог отложения */}
        <Dialog open={onHoldDialogOpen} onClose={() => setOnHoldDialogOpen(false)} maxWidth="sm" fullWidth
          PaperProps={{ sx: { background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 } }}>
          <DialogTitle sx={{ color: '#fff', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Pause sx={{ color: '#9ca3af' }} /> Отложить заявку
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mb: 0.5, display: 'block' }}>📅 Отложить до *</Typography>
                <TextField fullWidth type="datetime-local" value={onHoldDate} onChange={(e) => setOnHoldDate(e.target.value)} sx={inputStyles} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mb: 0.5, display: 'block' }}>📋 Причина *</Typography>
                <TextField fullWidth select value={onHoldReason} onChange={(e) => setOnHoldReason(e.target.value)} SelectProps={{ native: true }} sx={inputStyles}>
                  <option value="">Выберите причину...</option>
                  <option value="Ожидание закупки">Ожидание закупки</option>
                  <option value="Передано в другое подразделение">Передано в другое подразделение</option>
                  <option value="По просьбе пользователя">По просьбе пользователя</option>
                </TextField>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mb: 0.5, display: 'block' }}>Комментарий</Typography>
                <TextField fullWidth multiline rows={3} placeholder="Дополнительная информация..." value={onHoldComment} onChange={(e) => setOnHoldComment(e.target.value)} sx={inputStyles} />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Button onClick={() => setOnHoldDialogOpen(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>Отмена</Button>
            <Button onClick={handleOnHoldSubmit} variant="contained" disabled={!onHoldDate || !onHoldReason || actionLoading}
              startIcon={actionLoading ? <CircularProgress size={18} color="inherit" /> : <Pause />}
              sx={{ background: 'linear-gradient(135deg, #9ca3af, #6b7280)' }}>
              {actionLoading ? 'Сохранение...' : 'Отложить'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Уведомление об ошибке */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
              style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
              <Alert severity="error" onClose={() => setError('')} sx={{ backgroundColor: 'rgba(239, 68, 68, 0.9)', color: '#fff' }}>
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default TicketDetail;