import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  TextField,
  Chip,
  IconButton,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Slider,
  Button,
  Tooltip
} from '@mui/material';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  RotateCcw,
  Calendar,
  User,
  Tag
} from 'lucide-react';

const SearchFilters = ({ 
  onFiltersChange, 
  categories = [], 
  users = [],
  initialFilters = {}
}) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: initialFilters.status || [],
    priority: initialFilters.priority || [],
    categoryId: initialFilters.categoryId || [],
    assignedTo: initialFilters.assignedTo || [],
    dateRange: initialFilters.dateRange || [0, 30], // Последние 30 дней
    ...initialFilters
  });

  const statusOptions = [
    { value: 'new', label: 'Новые', color: '#3b82f6' },
    { value: 'in_progress', label: 'В работе', color: '#f59e0b' },
    { value: 'waiting', label: 'Ожидание', color: '#8b5cf6' },
    { value: 'resolved', label: 'Решены', color: '#10b981' },
    { value: 'closed', label: 'Закрыты', color: '#6b7280' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Низкий', color: '#10b981' },
    { value: 'medium', label: 'Средний', color: '#f59e0b' },
    { value: 'high', label: 'Высокий', color: '#f97316' },
    { value: 'critical', label: 'Критичный', color: '#ef4444' }
  ];

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    handleFilterChange('search', value);
  };

  const handleFilterChange = (filterType, value) => {
    let newFilters = { ...activeFilters };
    
    if (filterType === 'search') {
      newFilters.search = value;
    } else if (Array.isArray(newFilters[filterType])) {
      if (newFilters[filterType].includes(value)) {
        newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
      } else {
        newFilters[filterType] = [...newFilters[filterType], value];
      }
    } else {
      newFilters[filterType] = value;
    }
    
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateRangeChange = (event, newValue) => {
    handleFilterChange('dateRange', newValue);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      status: [],
      priority: [],
      categoryId: [],
      assignedTo: [],
      dateRange: [0, 30]
    };
    setSearchTerm('');
    setActiveFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).flat().filter(val => 
      val !== '' && val !== 0 && val !== 30
    ).length;
  };

  const removeFilter = (filterType, value) => {
    if (filterType === 'search') {
      setSearchTerm('');
      handleFilterChange('search', '');
    } else {
      handleFilterChange(filterType, value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        {/* Основная строка поиска */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Поиск заявок по номеру, теме или описанию..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <Search size={20} style={{ marginRight: 8, color: '#64748b' }} />,
              endAdornment: searchTerm && (
                <IconButton 
                  size="small" 
                  onClick={() => handleSearchChange({ target: { value: '' } })}
                  sx={{ mr: 1 }}
                >
                  <X size={16} />
                </IconButton>
              ),
              sx: {
                borderRadius: 2,
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  }
                }
              }
            }}
          />
          
          <Tooltip title={`Фильтры (${getActiveFilterCount()})`}>
            <IconButton
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{
                width: 48,
                height: 48,
                backgroundColor: isExpanded ? 'primary.main' : 'background.paper',
                color: isExpanded ? 'white' : 'text.primary',
                border: '2px solid',
                borderColor: isExpanded ? 'primary.main' : 'divider',
                '&:hover': {
                  backgroundColor: isExpanded ? 'primary.dark' : 'action.hover',
                  transform: 'scale(1.05)',
                }
              }}
            >
              <Filter size={20} />
              {getActiveFilterCount() > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    width: 20,
                    height: 20,
                    backgroundColor: 'error.main',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}
                >
                  {getActiveFilterCount()}
                </Box>
              )}
            </IconButton>
          </Tooltip>

          {getActiveFilterCount() > 0 && (
            <Tooltip title="Очистить все фильтры">
              <IconButton
                onClick={clearAllFilters}
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: 'error.light',
                  color: 'error.contrastText',
                  '&:hover': {
                    backgroundColor: 'error.main',
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <RotateCcw size={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Активные фильтры */}
        <AnimatePresence>
          {getActiveFilterCount() > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {searchTerm && (
                  <Chip
                    label={`Поиск: "${searchTerm}"`}
                    onDelete={() => removeFilter('search')}
                    size="small"
                    sx={{
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                    }}
                  />
                )}
                
                {activeFilters.status.map(status => {
                  const option = statusOptions.find(opt => opt.value === status);
                  return (
                    <Chip
                      key={status}
                      label={option?.label || status}
                      onDelete={() => removeFilter('status', status)}
                      size="small"
                      sx={{
                        backgroundColor: `${option?.color}20`,
                        color: option?.color,
                        borderColor: option?.color,
                      }}
                    />
                  );
                })}

                {activeFilters.priority.map(priority => {
                  const option = priorityOptions.find(opt => opt.value === priority);
                  return (
                    <Chip
                      key={priority}
                      label={option?.label || priority}
                      onDelete={() => removeFilter('priority', priority)}
                      size="small"
                      sx={{
                        backgroundColor: `${option?.color}20`,
                        color: option?.color,
                        borderColor: option?.color,
                      }}
                    />
                  );
                })}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Расширенные фильтры */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Filter size={20} />
                  Расширенные фильтры
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3 }}>
                  {/* Статусы */}
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      Статус
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {statusOptions.map(option => (
                        <Chip
                          key={option.value}
                          label={option.label}
                          clickable
                          onClick={() => handleFilterChange('status', option.value)}
                          variant={activeFilters.status.includes(option.value) ? 'filled' : 'outlined'}
                          sx={{
                            backgroundColor: activeFilters.status.includes(option.value) ? 
                              option.color : 'transparent',
                            borderColor: option.color,
                            color: activeFilters.status.includes(option.value) ? 
                              'white' : option.color,
                            '&:hover': {
                              backgroundColor: `${option.color}20`,
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Приоритеты */}
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      Приоритет
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {priorityOptions.map(option => (
                        <Chip
                          key={option.value}
                          label={option.label}
                          clickable
                          onClick={() => handleFilterChange('priority', option.value)}
                          variant={activeFilters.priority.includes(option.value) ? 'filled' : 'outlined'}
                          sx={{
                            backgroundColor: activeFilters.priority.includes(option.value) ? 
                              option.color : 'transparent',
                            borderColor: option.color,
                            color: activeFilters.priority.includes(option.value) ? 
                              'white' : option.color,
                            '&:hover': {
                              backgroundColor: `${option.color}20`,
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Категории */}
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      Категории
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {categories.map(category => (
                        <Chip
                          key={category.id}
                          label={category.name}
                          clickable
                          onClick={() => handleFilterChange('categoryId', category.id)}
                          variant={activeFilters.categoryId.includes(category.id) ? 'filled' : 'outlined'}
                          sx={{
                            backgroundColor: activeFilters.categoryId.includes(category.id) ? 
                              'secondary.main' : 'transparent',
                            '&:hover': {
                              backgroundColor: 'secondary.light',
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Временной диапазон */}
                  <Box sx={{ gridColumn: 'span 2' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Calendar size={16} />
                      Период создания (дни назад)
                    </Typography>
                    <Box sx={{ px: 2 }}>
                      <Slider
                        value={activeFilters.dateRange}
                        onChange={handleDateRangeChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={365}
                        marks={[
                          { value: 0, label: 'Сегодня' },
                          { value: 7, label: 'Неделя' },
                          { value: 30, label: 'Месяц' },
                          { value: 90, label: '3 мес' },
                          { value: 365, label: 'Год' }
                        ]}
                        sx={{
                          '& .MuiSlider-thumb': {
                            backgroundColor: 'primary.main',
                          },
                          '& .MuiSlider-track': {
                            background: 'linear-gradient(90deg, #667eea, #764ba2)',
                          }
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Paper>
    </motion.div>
  );
};

export default SearchFilters;