import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import kbService from '../services/kbService';
import GlassCard from '../components/GlassCard';
import theme from '../theme/theme';
import {
  Container,
  Typography,
  Button,
  Box,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
  Paper
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  ThumbUp,
  ThumbDown,
  Visibility,
  Person,
  AccessTime,
  Category,
  Public,
  Lock
} from '@mui/icons-material';

const KnowledgeBaseArticle = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rated, setRated] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { isManager } = useAuth();

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const data = await kbService.getArticleById(id);
      setArticle(data);
      setError('');
    } catch (err) {
      setError('Ошибка загрузки статьи');
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (helpful) => {
    try {
      await kbService.rateArticle(id, helpful);
      setRated(true);
      loadArticle();
    } catch (err) {
      setError('Ошибка оценки статьи');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту статью?')) {
      try {
        await kbService.deleteArticle(id);
        navigate('/kb');
      } catch (err) {
        setError('Ошибка удаления статьи');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress sx={{ color: theme.functional.success.main }} />
        <Typography sx={{ color: theme.text.primary, mt: 2 }}>Загрузка статьи...</Typography>
      </Container>
    );
  }

  if (error || !article) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert 
          severity="error"
          sx={{
            backgroundColor: theme.functional.error.bg,
            color: theme.text.primary,
            border: `1px solid ${theme.functional.error.border}`,
            '& .MuiAlert-icon': { color: theme.functional.error.main }
          }}
        >
          {error || 'Статья не найдена'}
        </Alert>
        <Button 
          onClick={() => navigate('/kb')} 
          sx={{ 
            mt: 2,
            color: theme.text.primary,
            borderColor: theme.border.main,
            '&:hover': {
              borderColor: theme.border.light,
              backgroundColor: theme.background.elevated
            }
          }}
          variant="outlined"
        >
          Вернуться к базе знаний
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', pb: 4 }}>
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 10 }}>
        {/* Кнопка назад */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/kb')}
            sx={{
              color: theme.text.primary,
              mb: 3,
              '&:hover': {
                background: theme.background.elevated
              }
            }}
          >
            Назад к базе знаний
          </Button>
        </motion.div>

        {/* Заголовок и действия */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard variant="dark" sx={{ p: 4, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: theme.text.primary,
                    fontWeight: 900,
                    mb: 2,
                    background: `linear-gradient(135deg, ${theme.text.primary} 0%, ${theme.functional.success.main} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {article.title}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                  {!article.isPublished && (
                    <Chip
                      icon={<Lock size={16} />}
                      label="Черновик"
                      sx={{
                        background: theme.functional.error.bg,
                        color: theme.functional.error.main,
                        fontWeight: 600
                      }}
                    />
                  )}
                  {article.isPublished && (
                    <Chip
                      icon={<Public size={16} />}
                      label="Опубликовано"
                      sx={{
                        background: theme.functional.success.bg,
                        color: theme.functional.success.main,
                        fontWeight: 600
                      }}
                    />
                  )}
                  {article.categoryName && (
                    <Chip
                      icon={<Category size={16} />}
                      label={article.categoryName}
                      sx={{
                        background: theme.functional.info.bg,
                        color: theme.functional.info.main,
                        fontWeight: 600
                      }}
                    />
                  )}
                </Box>
              </Box>

              {isManager && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Редактировать">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <IconButton
                        onClick={() => navigate(`/kb/edit/${id}`)}
                        sx={{
                          background: theme.functional.info.bg,
                          color: theme.functional.info.main,
                          '&:hover': { background: `${theme.functional.info.main}4D` }
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </motion.div>
                  </Tooltip>
                  <Tooltip title="Удалить">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <IconButton
                        onClick={handleDelete}
                        sx={{
                          background: theme.functional.error.bg,
                          color: theme.functional.error.main,
                          '&:hover': { background: `${theme.functional.error.main}4D` }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </motion.div>
                  </Tooltip>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3, borderColor: theme.border.main }} />

            {/* Метаданные */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', color: theme.text.secondary }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person size={18} />
                <Typography variant="body2">{article.authorName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime size={18} />
                <Typography variant="body2">{formatDate(article.createdAt)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Visibility size={18} />
                <Typography variant="body2">{article.views} просмотров</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ThumbUp size={18} />
                <Typography variant="body2">{article.helpfulCount} полезно</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ThumbDown size={18} />
                <Typography variant="body2">{article.notHelpfulCount} не полезно</Typography>
              </Box>
            </Box>
          </GlassCard>
        </motion.div>

        {/* Содержание статьи */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard variant="dark" sx={{ p: 4, mb: 3 }}>
            <Typography
              sx={{
                color: theme.text.primary,
                fontSize: '1.1rem',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word'
              }}
            >
              {article.content}
            </Typography>
          </GlassCard>
        </motion.div>

        {/* Ключевые слова */}
        {article.keywords && article.keywords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassCard variant="dark" sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ color: theme.text.primary, mb: 2, fontWeight: 700 }}>
                Ключевые слова
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {article.keywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    sx={{
                      background: `${theme.primary.main}33`,
                      color: theme.primary.main,
                      fontWeight: 600
                    }}
                  />
                ))}
              </Box>
            </GlassCard>
          </motion.div>
        )}

        {/* Оценка полезности */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GlassCard variant="dark" sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: theme.text.primary, mb: 3, fontWeight: 700 }}>
              Эта статья была полезна?
            </Typography>
            {rated ? (
              <Alert 
                severity="success" 
                sx={{ 
                  maxWidth: 400, 
                  mx: 'auto',
                  backgroundColor: theme.functional.success.bg,
                  color: theme.text.primary,
                  border: `1px solid ${theme.functional.success.border}`,
                  '& .MuiAlert-icon': { color: theme.functional.success.main }
                }}
              >
                Спасибо за вашу оценку!
              </Alert>
            ) : (
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="contained"
                    startIcon={<ThumbUp />}
                    onClick={() => handleRate(true)}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.functional.success.main} 0%, #059669 100%)`,
                      px: 4,
                      py: 1.5,
                      fontWeight: 700,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      }
                    }}
                  >
                    Да, полезно
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ThumbDown />}
                    onClick={() => handleRate(false)}
                    sx={{
                      borderColor: theme.functional.error.border,
                      color: theme.functional.error.main,
                      px: 4,
                      py: 1.5,
                      fontWeight: 700,
                      '&:hover': {
                        borderColor: theme.functional.error.main,
                        background: theme.functional.error.bg
                      }
                    }}
                  >
                    Нет, не помогло
                  </Button>
                </motion.div>
              </Box>
            )}
          </GlassCard>
        </motion.div>
      </Container>
    </Box>
  );
};

export default KnowledgeBaseArticle;