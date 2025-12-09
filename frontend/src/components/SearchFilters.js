import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import theme from '../theme/theme';
import {
  Box,
  TextField,
  Chip,
  IconButton,
  Paper,
  Typography,
  Slider,
  Tooltip
} from '@mui/material';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  Calendar
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
    dateRange: initialFilters.dateRange || [0, 30],
    ...initialFilters
  });

  // Debounce для поиска
  const searchDebounceRef = useRef(null);

  const statusOptions = [
    { value: 'new', label: 'Новые', color: theme.functional.info.main },
    { value: 'in_progress', label: 'В работе', color: theme.functional.warning.main },
    { value: 'waiting', label: 'Ожидание', color: theme.primary.main },
    { value: 'resolved', label: 'Решены', color: theme.functional.success.main },
    { value: 'closed', label: 'Закрыты', color: theme.text.secondary }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Низкий', color: theme.functional.success.main },
    { value: 'medium', label: 'Средний', color: theme.functional.warning.main },
    { value: 'high', label: 'Высокий', color: theme.functional.error.main },
    { value: 'critical', label: 'Критичный', color: theme.functional.error.main }
  ];

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    
    searchDebounceRef.current = setTimeout(() => {
      handleFilterChange('search', value);
    }, 500);
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
    const newFilters = { ...activeFilters, dateRange: newValue };
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    
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
    let count = 0;
    if (activeFilters.search) count++;
    count += activeFilters.status.length;
    count += activeFilters.priority.length;
    count += activeFilters.categoryId.length;
    count += activeFilters.assignedTo.length;
    if (activeFilters.dateRange[0] !== 0 || activeFilters.dateRange[1] !== 30) count++;
    return count;
  };

  const removeFilter = (filterType, value) => {
    if (filterType === 'search') {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
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
          background: theme.background.secondary,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${theme.border.main}`,
          boxShadow: theme.glass.dark.shadow,
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Поиск заявок по номеру, теме или описанию..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <Search size={20} style={{ marginRight: 8, color: '#ffffff' }} />,
              endAdornment: searchTerm && (
                <IconButton 
                  size="small" 
                  onClick={() => {
                    setSearchTerm('');
                    handleSearchChange({ target: { value: '' } });
                  }}
                  sx={{ 
                    mr: 1,
                    color: '#ffffff',
                    '&:hover': {
                      color: '#ffffff',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <X size={16} />
                </IconButton>
              ),
              sx: {
                borderRadius: 2,
                backgroundColor: theme.background.elevated,
                color: '#ffffff',
                '& input': {
                  color: '#ffffff',
                  fontWeight: 500,
                  '&::placeholder': {
                    color: '#ffffff',
                    opacity: 0.8
                  }
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.border.main,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.primary.main,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.primary.main,
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
                backgroundColor: isExpanded ? theme.primary.main : theme.background.elevated,
                color: theme.text.primary,
                border: '2px solid',
                borderColor: isExpanded ? theme.primary.main : theme.border.main,
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  backgroundColor: isExpanded ? theme.primary.dark : theme.background.secondary,
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
                    backgroundColor: theme.functional.error.main,
                    color: theme.text.primary,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    boxShadow: `0 2px 8px ${theme.functional.error.main}66`
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
                  backgroundColor: theme.functional.error.bg,
                  color: theme.functional.error.main,
                  border: `1px solid ${theme.functional.error.border}`,
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: `${theme.functional.error.main}4D`,
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <RotateCcw size={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

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
                      backgroundColor: theme.functional.info.bg,
                      color: theme.text.primary,
                      border: `1px solid ${theme.functional.info.border}`,
                      '& .MuiChip-deleteIcon': {
                        color: theme.text.secondary,
                        '&:hover': {
                          color: theme.text.primary
                        }
                      }
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
                        backgroundColor: `${option?.color}33`,
                        color: theme.text.primary,
                        border: `1px solid ${option?.color}80`,
                        '& .MuiChip-deleteIcon': {
                          color: theme.text.secondary,
                          '&:hover': {
                            color: theme.text.primary
                          }
                        }
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
                        backgroundColor: `${option?.color}33`,
                        color: theme.text.primary,
                        border: `1px solid ${option?.color}80`,
                        '& .MuiChip-deleteIcon': {
                          color: theme.text.secondary,
                          '&:hover': {
                            color: theme.text.primary
                          }
                        }
                      }}
                    />
                  );
                })}

                {activeFilters.categoryId.map(catId => {
                  const category = categories.find(c => c.id === catId);
                  return (
                    <Chip
                      key={catId}
                      label={category?.name || `Категория ${catId}`}
                      onDelete={() => removeFilter('categoryId', catId)}
                      size="small"
                      sx={{
                        backgroundColor: `${theme.primary.main}33`,
                        color: theme.text.primary,
                        border: `1px solid ${theme.primary.main}80`,
                        '& .MuiChip-deleteIcon': {
                          color: theme.text.secondary,
                          '&:hover': {
                            color: theme.text.primary
                          }
                        }
                      }}
                    />
                  );
                })}

                {(activeFilters.dateRange[0] !== 0 || activeFilters.dateRange[1] !== 30) && (
                  <Chip
                    label={`Дата: ${activeFilters.dateRange[0]}-${activeFilters.dateRange[1]} дней`}
                    onDelete={() => {
                      const newFilters = { ...activeFilters, dateRange: [0, 30] };
                      setActiveFilters(newFilters);
                      onFiltersChange(newFilters);
                    }}
                    size="small"
                    sx={{
                      backgroundColor: theme.functional.success.bg,
                      color: theme.text.primary,
                      border: `1px solid ${theme.functional.success.border}`,
                      '& .MuiChip-deleteIcon': {
                        color: theme.text.secondary,
                        '&:hover': {
                          color: theme.text.primary
                        }
                      }
                    }}
                  />
                )}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Box sx={{ borderTop: `1px solid ${theme.border.main}`, pt: 3 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    mb: 3,
                    color: theme.text.primary,
                    fontWeight: 700
                  }}
                >
                  <Filter size={20} />
                  Расширенные фильтры
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3 }}>
                  <Box>
                    <Typography 
                      variant="subtitle1" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600,
                        color: theme.text.primary,
                        mb: 2
                      }}
                    >
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
                            borderWidth: '2px',
                            color: activeFilters.status.includes(option.value) ? 
                              '#ffffff' : option.color,
                            fontWeight: activeFilters.status.includes(option.value) ? 700 : 600,
                            '&:hover': {
                              backgroundColor: activeFilters.status.includes(option.value) ?
                                option.color : `${option.color}33`,
                              transform: 'scale(1.05)',
                              borderWidth: '2px',
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography 
                      variant="subtitle1" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600,
                        color: theme.text.primary,
                        mb: 2
                      }}
                    >
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
                            borderWidth: '2px',
                            color: activeFilters.priority.includes(option.value) ? 
                              '#ffffff' : option.color,
                            fontWeight: activeFilters.priority.includes(option.value) ? 700 : 600,
                            '&:hover': {
                              backgroundColor: activeFilters.priority.includes(option.value) ?
                                option.color : `${option.color}33`,
                              transform: 'scale(1.05)',
                              borderWidth: '2px',
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {categories.length > 0 && (
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 600,
                          color: theme.text.primary,
                          mb: 2
                        }}
                      >
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
                                theme.primary.main : 'transparent',
                              borderColor: theme.primary.main,
                              borderWidth: '2px',
                              color: activeFilters.categoryId.includes(category.id) ? 
                                '#ffffff' : theme.primary.main,
                              fontWeight: activeFilters.categoryId.includes(category.id) ? 700 : 600,
                              '&:hover': {
                                backgroundColor: activeFilters.categoryId.includes(category.id) ?
                                  theme.primary.main : `${theme.primary.main}33`,
                                transform: 'scale(1.05)',
                                borderWidth: '2px',
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ gridColumn: categories.length > 0 ? 'span 1' : 'span 2' }}>
                    <Typography 
                      variant="subtitle1" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        color: theme.text.primary,
                        mb: 3
                      }}
                    >
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
                          { value: 0, label: '' },
                          { value: 7, label: '7д' },
                          { value: 30, label: '1м' },
                          { value: 90, label: '3м' },
                          { value: 365, label: '1г' }
                        ]}
                        sx={{
                          color: theme.primary.main,
                          '& .MuiSlider-thumb': {
                            backgroundColor: theme.primary.main,
                            border: `2px solid ${theme.text.primary}`,
                            boxShadow: `0 2px 8px ${theme.primary.main}66`,
                            '&:hover': {
                              boxShadow: `0 4px 12px ${theme.primary.main}99`,
                            }
                          },
                          '& .MuiSlider-track': {
                            background: theme.gradients.primary,
                            border: 'none',
                          },
                          '& .MuiSlider-rail': {
                            backgroundColor: theme.border.main,
                          },
                          '& .MuiSlider-mark': {
                            backgroundColor: theme.border.light,
                            width: 2,
                            height: 2,
                          },
                          '& .MuiSlider-markLabel': {
                            color: theme.text.secondary,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            transform: 'translateX(-50%)',
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