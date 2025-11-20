import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ticketService from '../services/ticketService';
import categoryService from '../services/categoryService';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Alert
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    priority: 'medium',
    userId: ''
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, isEngineer } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data.categories);
    } catch (err) {
      console.error('Ошибка загрузки категорий');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Если не выбран пользователь (обычный пользователь создает от себя)
      const ticketData = {
        ...formData,
        userId: formData.userId || user.id
      };

      await ticketService.createTicket(ticketData);
      navigate('/tickets');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка создания заявки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/tickets')}
            sx={{ mr: 2 }}
          >
            Назад
          </Button>
          <Typography variant="h4">
            Создание заявки
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            label="Тема"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            required
            multiline
            rows={4}
            label="Описание"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            required
            select
            label="Категория"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            margin="normal"
          >
            {categories.length === 0 ? (
              <MenuItem value="">Загрузка...</MenuItem>
            ) : (
              categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name} (SLA: {cat.slaTime} мин)
                </MenuItem>
              ))
            )}
          </TextField>

          <TextField
            fullWidth
            required
            select
            label="Приоритет"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value="low">Низкий</MenuItem>
            <MenuItem value="medium">Средний</MenuItem>
            <MenuItem value="high">Высокий</MenuItem>
            <MenuItem value="critical">Критичный</MenuItem>
          </TextField>

          {isEngineer && (
            <TextField
              fullWidth
              label="Пользователь (ID)"
              name="userId"
              type="number"
              value={formData.userId}
              onChange={handleChange}
              margin="normal"
              helperText="Оставьте пустым для создания от своего имени"
            />
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={loading}
              fullWidth
            >
              {loading ? 'Создание...' : 'Создать заявку'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/tickets')}
              fullWidth
            >
              Отмена
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateTicket;