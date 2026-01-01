import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import userService from '../services/userService';
import GlassCard from '../components/GlassCard';
import theme from '../theme/theme';
import { Typography, Button, Box, TextField, Chip, Alert, IconButton, Tooltip, Avatar, Dialog, DialogContent, DialogActions, Select, MenuItem, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import { Search, FilterList, History, Person, Add, Edit, Delete, Login, Logout, Visibility, Download, AssignmentInd, SwapHoriz, Close, CalendarMonth, Computer, Description, Category, ConfirmationNumber, People, Inventory, Article, TrendingUp, Security } from '@mui/icons-material';

const Audit = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Фильтры
  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  
  // Детали
  const [selectedLog, setSelectedLog] = useState(null);

  const actionConfig = {
    create: { label: 'Создание', color: '#10b981', icon: Add },
    update: { label: 'Изменение', color: '#3b82f6', icon: Edit },
    delete: { label: 'Удаление', color: '#ef4444', icon: Delete },
    login: { label: 'Вход', color: '#8b5cf6', icon: Login },
    logout: { label: 'Выход', color: '#64748b', icon: Logout },
    view: { label: 'Просмотр', color: '#06b6d4', icon: Visibility },
    export: { label: 'Экспорт', color: '#f59e0b', icon: Download },
    assign: { label: 'Назначение', color: '#ec4899', icon: AssignmentInd },
    status_change: { label: 'Смена статуса', color: '#14b8a6', icon: SwapHoriz }
  };

  const entityConfig = {
    ticket: { label: 'Тикет', icon: ConfirmationNumber },
    user: { label: 'Пользователь', icon: Person },
    equipment: { label: 'Оборудование', icon: Computer },
    article: { label: 'Статья', icon: Article },
    category: { label: 'Категория', icon: Category }
  };

  useEffect(() => {
    loadLogs();
    loadUsers();
    loadEntities();
  }, [search, userFilter, actionFilter, entityFilter, startDate, endDate, page, rowsPerPage]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const params = { page: page + 1, limit: rowsPerPage };
      if (search) params.search = search;
      if (userFilter) params.userId = userFilter;
      if (actionFilter) params.action = actionFilter;
      if (entityFilter) params.entity = entityFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await api.get('/audit', { params });
      setLogs(response.data.logs || []);
      setStats(response.data.stats || null);
      setTotalCount(response.data.pagination?.total || 0);
    } catch (err) {
      setError('Ошибка загрузки логов');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await userService.getAllUsers({ limit: 100 });
      setUsers(data.users || []);
    } catch (err) {}
  };

  const loadEntities = async () => {
    try {
      const response = await api.get('/audit/entities');
      setEntities(response.data.entities || []);
    } catch (err) {}
  };

  const formatDate = (d) => {
    if (!d) return '—';
    const date = new Date(d);
    return date.toLocaleString('ru-RU', { 
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  const clearFilters = () => {
    setSearch('');
    setUserFilter('');
    setActionFilter('');
    setEntityFilter('');
    setStartDate('');
    setEndDate('');
    setPage(0);
  };

  if (loading && logs.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} sx={{ color: '#8b5cf6' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', pb: 4 }}>
      <Box sx={{ py: 4, position: 'relative', zIndex: 10 }}>
        
        {/* Шапка */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard variant="dark" sx={{ p: 4, mb: 3, mx: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ 
                  width: 70, height: 70, borderRadius: 3, 
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 20px 60px rgba(239, 68, 68, 0.4)'
                }}>
                  <Security sx={{ fontSize: 32, color: '#fff' }} />
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 900, mb: 1,
                    background: 'linear-gradient(135deg, #ffffff, #ef4444)',
                    backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                  }}>
                    Журнал аудита
                  </Typography>
                  <Typography sx={{ color: theme.text.secondary }}>
                    История всех действий в системе
                  </Typography>
                </Box>
              </Box>
              
              {/* Статистика */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ textAlign: 'center', px: 3, py: 1, borderRadius: 2, background: 'rgba(239, 68, 68, 0.2)' }}>
                  <Typography variant="h4" sx={{ color: '#ef4444', fontWeight: 800 }}>{stats?.total || 0}</Typography>
                  <Typography variant="caption" sx={{ color: theme.text.secondary }}>Всего</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', px: 3, py: 1, borderRadius: 2, background: 'rgba(16, 185, 129, 0.2)' }}>
                  <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 800 }}>{stats?.today || 0}</Typography>
                  <Typography variant="caption" sx={{ color: theme.text.secondary }}>Сегодня</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', px: 3, py: 1, borderRadius: 2, background: 'rgba(59, 130, 246, 0.2)' }}>
                  <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 800 }}>{stats?.logins || 0}</Typography>
                  <Typography variant="caption" sx={{ color: theme.text.secondary }}>Входов</Typography>
                </Box>
              </Box>
            </Box>
          </GlassCard>
        </motion.div>

        {error && (
          <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3, mx: 4 }}>{error}</Alert>
        )}

        <Box sx={{ px: 4, display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          
          {/* Левая колонка - фильтры */}
          <Box sx={{ width: 280, flexShrink: 0, display: { xs: 'none', lg: 'block' } }}>
            <GlassCard variant="dark" sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FilterList sx={{ color: '#ef4444' }} />
                  <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Фильтры</Typography>
                </Box>
                <Button size="small" onClick={clearFilters} sx={{ color: theme.text.secondary }}>Сбросить</Button>
              </Box>

              <Typography variant="caption" sx={{ color: theme.text.secondary, mb: 1, display: 'block' }}>Поиск</Typography>
              <TextField 
                fullWidth size="small" placeholder="Поиск..." 
                value={search} onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#fff', backgroundColor: theme.background.elevated } }}
              />

              <Typography variant="caption" sx={{ color: theme.text.secondary, mb: 1, display: 'block' }}>Пользователь</Typography>
              <Select 
                fullWidth size="small" value={userFilter} onChange={(e) => setUserFilter(e.target.value)} displayEmpty
                sx={{ mb: 2, color: '#fff', backgroundColor: theme.background.elevated }}
              >
                <MenuItem value="">Все</MenuItem>
                {users.map(u => <MenuItem key={u.id} value={u.id}>{u.fullName}</MenuItem>)}
              </Select>

              <Typography variant="caption" sx={{ color: theme.text.secondary, mb: 1, display: 'block' }}>Действие</Typography>
              <Select 
                fullWidth size="small" value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} displayEmpty
                sx={{ mb: 2, color: '#fff', backgroundColor: theme.background.elevated }}
              >
                <MenuItem value="">Все</MenuItem>
                {Object.entries(actionConfig).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
              </Select>

              <Typography variant="caption" sx={{ color: theme.text.secondary, mb: 1, display: 'block' }}>Объект</Typography>
              <Select 
                fullWidth size="small" value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)} displayEmpty
                sx={{ mb: 2, color: '#fff', backgroundColor: theme.background.elevated }}
              >
                <MenuItem value="">Все</MenuItem>
                {entities.map(e => <MenuItem key={e} value={e}>{entityConfig[e]?.label || e}</MenuItem>)}
              </Select>

              <Typography variant="caption" sx={{ color: theme.text.secondary, mb: 1, display: 'block' }}>Период</Typography>
              <TextField 
                fullWidth size="small" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                sx={{ mb: 1, '& .MuiOutlinedInput-root': { color: '#fff', backgroundColor: theme.background.elevated } }}
              />
              <TextField 
                fullWidth size="small" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { color: '#fff', backgroundColor: theme.background.elevated } }}
              />
            </GlassCard>
          </Box>

          {/* Основной контент */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <GlassCard variant="dark" sx={{ overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 'calc(100vh - 350px)' }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: '#1a1a2e', color: theme.text.primary, fontWeight: 700 }}>Время</TableCell>
                      <TableCell sx={{ backgroundColor: '#1a1a2e', color: theme.text.primary, fontWeight: 700 }}>Пользователь</TableCell>
                      <TableCell sx={{ backgroundColor: '#1a1a2e', color: theme.text.primary, fontWeight: 700 }}>Действие</TableCell>
                      <TableCell sx={{ backgroundColor: '#1a1a2e', color: theme.text.primary, fontWeight: 700 }}>Объект</TableCell>
                      <TableCell sx={{ backgroundColor: '#1a1a2e', color: theme.text.primary, fontWeight: 700 }}>Описание</TableCell>
                      <TableCell sx={{ backgroundColor: '#1a1a2e', color: theme.text.primary, fontWeight: 700, width: 50 }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.map((log, index) => {
                      const ac = actionConfig[log.action] || { label: log.action, color: '#64748b', icon: History };
                      const ec = entityConfig[log.entity] || { label: log.entity, icon: Description };
                      const ActionIcon = ac.icon;
                      const EntityIcon = ec.icon;
                      
                      return (
                        <TableRow 
                          key={log.id} 
                          hover
                          sx={{ 
                            '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
                            cursor: 'pointer'
                          }}
                          onClick={() => setSelectedLog(log)}
                        >
                          <TableCell sx={{ color: theme.text.secondary, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                            {formatDate(log.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                                {log.user?.fullName?.charAt(0) || '?'}
                              </Avatar>
                              <Typography variant="body2" sx={{ color: theme.text.primary }}>
                                {log.user?.fullName || 'Система'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              icon={<ActionIcon sx={{ fontSize: 14 }} />}
                              label={ac.label} 
                              size="small" 
                              sx={{ 
                                backgroundColor: `${ac.color}20`, 
                                color: ac.color,
                                '& .MuiChip-icon': { color: ac.color }
                              }} 
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <EntityIcon sx={{ fontSize: 16, color: theme.text.disabled }} />
                              <Typography variant="body2" sx={{ color: theme.text.secondary }}>
                                {ec.label}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: theme.text.primary, maxWidth: 300 }}>
                            <Typography variant="body2" noWrap title={log.details || log.entityName}>
                              {log.details || log.entityName || '—'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" sx={{ color: theme.text.disabled }}>
                              <Visibility sx={{ fontSize: 18 }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {logs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center', py: 8 }}>
                          <History sx={{ fontSize: 48, color: theme.text.disabled, mb: 2 }} />
                          <Typography sx={{ color: theme.text.secondary }}>Записей не найдено</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                rowsPerPageOptions={[25, 50, 100]}
                labelRowsPerPage="Записей:"
                labelDisplayedRows={({ from, to, count }) => `${from}–${to} из ${count}`}
                sx={{ 
                  borderTop: `1px solid ${theme.border.main}`,
                  color: theme.text.secondary,
                  '& .MuiTablePagination-selectIcon': { color: theme.text.secondary }
                }}
              />
            </GlassCard>
          </Box>
        </Box>

        {/* Диалог деталей */}
        <Dialog 
          open={!!selectedLog} 
          onClose={() => setSelectedLog(null)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{ sx: { background: '#1a1a2e', border: `1px solid ${theme.border.main}`, borderRadius: 4 } }}
        >
          {selectedLog && (() => {
            const ac = actionConfig[selectedLog.action] || { label: selectedLog.action, color: '#64748b', icon: History };
            const ActionIcon = ac.icon;
            
            return <>
              <Box sx={{ background: `linear-gradient(135deg, ${ac.color}, ${ac.color}dd)`, p: 3, position: 'relative' }}>
                <IconButton onClick={() => setSelectedLog(null)} sx={{ position: 'absolute', top: 12, right: 12, color: '#fff' }}>
                  <Close />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 50, height: 50, background: 'rgba(255,255,255,0.2)' }}>
                    <ActionIcon sx={{ fontSize: 24, color: '#fff' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>{ac.label}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>{formatDate(selectedLog.createdAt)}</Typography>
                  </Box>
                </Box>
              </Box>
              <DialogContent sx={{ p: 3, background: '#1a1a2e' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.05)' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Пользователь</Typography>
                    <Typography sx={{ color: '#fff', fontWeight: 600 }}>{selectedLog.user?.fullName || 'Система'}</Typography>
                    <Typography variant="caption" sx={{ color: theme.text.disabled }}>{selectedLog.user?.email}</Typography>
                  </Box>
                  <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.05)' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Объект</Typography>
                    <Typography sx={{ color: '#fff', fontWeight: 600 }}>{entityConfig[selectedLog.entity]?.label || selectedLog.entity}</Typography>
                    <Typography variant="caption" sx={{ color: theme.text.disabled }}>ID: {selectedLog.entityId || '—'}</Typography>
                  </Box>
                  <Box sx={{ gridColumn: '1 / -1', p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.05)' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Описание</Typography>
                    <Typography sx={{ color: '#fff' }}>{selectedLog.details || selectedLog.entityName || '—'}</Typography>
                  </Box>
                  {selectedLog.ipAddress && (
                    <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.05)' }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>IP адрес</Typography>
                      <Typography sx={{ color: '#fff', fontFamily: 'monospace' }}>{selectedLog.ipAddress}</Typography>
                    </Box>
                  )}
                  {selectedLog.oldValues && (
                    <Box sx={{ gridColumn: '1 / -1', p: 2, borderRadius: 2, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                      <Typography variant="caption" sx={{ color: '#ef4444' }}>Было</Typography>
                      <Typography component="pre" sx={{ color: '#fff', fontSize: '0.8rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap', m: 0 }}>
                        {JSON.stringify(selectedLog.oldValues, null, 2)}
                      </Typography>
                    </Box>
                  )}
                  {selectedLog.newValues && (
                    <Box sx={{ gridColumn: '1 / -1', p: 2, borderRadius: 2, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      <Typography variant="caption" sx={{ color: '#10b981' }}>Стало</Typography>
                      <Typography component="pre" sx={{ color: '#fff', fontSize: '0.8rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap', m: 0 }}>
                        {JSON.stringify(selectedLog.newValues, null, 2)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', background: '#1a1a2e' }}>
                <Button onClick={() => setSelectedLog(null)} sx={{ color: '#fff' }}>Закрыть</Button>
              </DialogActions>
            </>;
          })()}
        </Dialog>
      </Box>
    </Box>
  );
};

export default Audit;