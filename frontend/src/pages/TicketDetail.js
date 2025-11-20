import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ticketService from '../services/ticketService';
import commentService from '../services/commentService';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  TextField,
  List,
  ListItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { ArrowBack, Send } from '@mui/icons-material';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        // Устанавливаем пустой массив если ошибка
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
      await commentService.addComment(id, {
        text: newComment,
        isInternal: false
      });
      setNewComment('');
      
      // Перезагружаем комментарии
      const data = await commentService.getComments(id);
      setComments(data.comments);
    } catch (err) {
      alert('Ошибка добавления комментария: ' + (err.response?.data?.message || err.message));
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      new: 'Новая',
      in_progress: 'В работе',
      waiting: 'Ожидание',
      resolved: 'Решена',
      closed: 'Закрыта'
    };
    return labels[status] || status;
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      low: 'Низкий',
      medium: 'Средний',
      high: 'Высокий',
      critical: 'Критичный'
    };
    return labels[priority] || priority;
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Загрузка заявки...</Typography>
      </Container>
    );
  }

  if (error || !ticket) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Заявка не найдена'}</Alert>
        <Button onClick={() => navigate('/tickets')} sx={{ mt: 2 }}>
          Вернуться к списку
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/tickets')}
          sx={{ mr: 2 }}
        >
          Назад
        </Button>
        <Typography variant="h4">
          Заявка #{ticket.ticketNumber}
        </Typography>
      </Box>

      {/* Используем Flexbox вместо Grid */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Основная информация */}
        <Box sx={{ flex: 2 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              {ticket.title}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip
                label={getStatusLabel(ticket.status)}
                color="primary"
                size="small"
              />
              <Chip
                label={getPriorityLabel(ticket.priority)}
                color="secondary"
                size="small"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {ticket.description}
            </Typography>
          </Paper>

          {/* Комментарии */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Комментарии ({comments.length})
            </Typography>

            <List>
              {comments.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                  Комментариев пока нет
                </Typography>
              ) : (
                comments.map((comment) => (
                  <ListItem
                    key={comment.id}
                    sx={{
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      mb: 1,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      backgroundColor: '#f9f9f9'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {comment.author?.fullName || 'Неизвестный'}
                      </Typography>
                      <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }}>
                        {new Date(comment.createdAt).toLocaleString('ru-RU')}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {comment.text}
                    </Typography>
                  </ListItem>
                ))
              )}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Форма добавления комментария */}
            <Box component="form" onSubmit={handleAddComment}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Напишите комментарий..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                variant="outlined"
              />

              <Button
                type="submit"
                variant="contained"
                startIcon={<Send />}
                sx={{ mt: 2 }}
                disabled={!newComment.trim()}
              >
                Добавить комментарий
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Боковая панель */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Информация о заявке
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Пользователь:
              </Typography>
              <Typography variant="body1">
                {ticket.user?.fullName || 'Неизвестно'}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Категория:
              </Typography>
              <Typography variant="body1">
                {ticket.category?.name || 'Не указана'}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Создана:
              </Typography>
              <Typography variant="body1">
                {new Date(ticket.createdAt).toLocaleString('ru-RU')}
              </Typography>
            </Box>

            {ticket.resolvedAt && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Решена:
                  </Typography>
                  <Typography variant="body1">
                    {new Date(ticket.resolvedAt).toLocaleString('ru-RU')}
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default TicketDetail;