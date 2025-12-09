import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import theme from '../theme/theme';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem
} from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

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
      await authService.register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            padding: 4, 
            width: '100%',
            background: theme.background.secondary,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${theme.border.main}`,
            boxShadow: theme.glass.dark.shadow
          }}
        >
          <Typography 
            component="h1" 
            variant="h5" 
            align="center" 
            gutterBottom
            sx={{
              color: theme.text.primary,
              fontWeight: 700,
              background: theme.gradients.primary,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Регистрация
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                backgroundColor: theme.functional.error.bg,
                color: theme.text.primary,
                border: `1px solid ${theme.functional.error.border}`,
                '& .MuiAlert-icon': {
                  color: theme.functional.error.main
                }
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="username"
              label="Имя пользователя"
              value={formData.username}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.background.elevated,
                  color: theme.text.primary,
                  '& fieldset': {
                    borderColor: theme.border.main
                  },
                  '&:hover fieldset': {
                    borderColor: theme.primary.main
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.primary.main
                  }
                },
                '& .MuiInputLabel-root': {
                  color: theme.text.secondary,
                  '&.Mui-focused': {
                    color: theme.primary.main
                  }
                },
                '& input': {
                  color: theme.text.primary
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.background.elevated,
                  color: theme.text.primary,
                  '& fieldset': {
                    borderColor: theme.border.main
                  },
                  '&:hover fieldset': {
                    borderColor: theme.primary.main
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.primary.main
                  }
                },
                '& .MuiInputLabel-root': {
                  color: theme.text.secondary,
                  '&.Mui-focused': {
                    color: theme.primary.main
                  }
                },
                '& input': {
                  color: theme.text.primary
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              value={formData.password}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.background.elevated,
                  color: theme.text.primary,
                  '& fieldset': {
                    borderColor: theme.border.main
                  },
                  '&:hover fieldset': {
                    borderColor: theme.primary.main
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.primary.main
                  }
                },
                '& .MuiInputLabel-root': {
                  color: theme.text.secondary,
                  '&.Mui-focused': {
                    color: theme.primary.main
                  }
                },
                '& input': {
                  color: theme.text.primary
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="fullName"
              label="Полное имя"
              value={formData.fullName}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.background.elevated,
                  color: theme.text.primary,
                  '& fieldset': {
                    borderColor: theme.border.main
                  },
                  '&:hover fieldset': {
                    borderColor: theme.primary.main
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.primary.main
                  }
                },
                '& .MuiInputLabel-root': {
                  color: theme.text.secondary,
                  '&.Mui-focused': {
                    color: theme.primary.main
                  }
                },
                '& input': {
                  color: theme.text.primary
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              select
              name="role"
              label="Роль"
              value={formData.role}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.background.elevated,
                  color: theme.text.primary,
                  '& fieldset': {
                    borderColor: theme.border.main
                  },
                  '&:hover fieldset': {
                    borderColor: theme.primary.main
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.primary.main
                  }
                },
                '& .MuiInputLabel-root': {
                  color: theme.text.secondary,
                  '&.Mui-focused': {
                    color: theme.primary.main
                  }
                },
                '& .MuiSelect-select': {
                  color: theme.text.primary
                }
              }}
            >
              <MenuItem 
                value="user"
                sx={{
                  backgroundColor: theme.background.elevated,
                  color: theme.text.primary,
                  '&:hover': {
                    backgroundColor: theme.background.secondary
                  },
                  '&.Mui-selected': {
                    backgroundColor: `${theme.primary.main}33`,
                    '&:hover': {
                      backgroundColor: `${theme.primary.main}4D`
                    }
                  }
                }}
              >
                Пользователь
              </MenuItem>
              <MenuItem 
                value="engineer"
                sx={{
                  backgroundColor: theme.background.elevated,
                  color: theme.text.primary,
                  '&:hover': {
                    backgroundColor: theme.background.secondary
                  },
                  '&.Mui-selected': {
                    backgroundColor: `${theme.primary.main}33`,
                    '&:hover': {
                      backgroundColor: `${theme.primary.main}4D`
                    }
                  }
                }}
              >
                Инженер
              </MenuItem>
              <MenuItem 
                value="manager"
                sx={{
                  backgroundColor: theme.background.elevated,
                  color: theme.text.primary,
                  '&:hover': {
                    backgroundColor: theme.background.secondary
                  },
                  '&.Mui-selected': {
                    backgroundColor: `${theme.primary.main}33`,
                    '&:hover': {
                      backgroundColor: `${theme.primary.main}4D`
                    }
                  }
                }}
              >
                Менеджер
              </MenuItem>
            </TextField>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mt: 3, 
                mb: 2,
                background: theme.gradients.primary,
                color: theme.text.primary,
                fontWeight: 700,
                py: 1.5,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.primary.dark} 0%, ${theme.primary.main} 100%)`,
                  boxShadow: `0 8px 24px ${theme.primary.main}66`
                },
                '&:disabled': {
                  background: theme.background.secondary,
                  color: theme.text.disabled
                }
              }}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography 
                  sx={{
                    color: theme.primary.main,
                    fontWeight: 600,
                    '&:hover': {
                      color: theme.primary.light,
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Уже есть аккаунт? Войти
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;