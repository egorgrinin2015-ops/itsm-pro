import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import GlassCard from '../components/GlassCard';
import theme from '../theme/theme';
import {
  Typography, Button, Box, TextField, InputAdornment, Chip, Alert, IconButton, Tooltip, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, Divider
} from '@mui/material';
import {
  Search, Add, Edit, Delete, Person, Block, CheckCircle, LockReset, AdminPanelSettings, Engineering,
  SupervisorAccount, PersonOutline, TrendingUp, Group, PersonOff, Security, Email, Badge, Visibility,
  VisibilityOff, FilterList, Close, CalendarMonth, AccessTime, ContentCopy, Fingerprint, Shield,
  WorkHistory, ConfirmationNumber, PersonAdd
} from '@mui/icons-material';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [resetPasswordDialog, setResetPasswordDialog] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', fullName: '', password: '', role: 'user' });

  const { user: currentUser, isManager } = useAuth();

  useEffect(() => { loadUsers(); }, [search, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter !== '') params.isActive = statusFilter;
      const data = await userService.getAllUsers(params);
      setUsers(data.users || []);
      setStats(data.stats || null);
      setError('');
    } catch (err) {
      setError('Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user = null) => {
    setEditingUser(user);
    setFormData(user ? { username: user.username, email: user.email, fullName: user.fullName, password: '', role: user.role }
      : { username: '', email: '', fullName: '', password: '', role: 'user' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({ username: '', email: '', fullName: '', password: '', role: 'user' });
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, formData);
        setSuccess('Пользователь успешно обновлён');
      } else {
        await userService.createUser(formData);
        setSuccess('Пользователь успешно создан');
      }
      handleCloseDialog();
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка сохранения');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const result = await userService.toggleUserStatus(userId);
      setSuccess(result.message);
      loadUsers();
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(prev => ({ ...prev, isActive: !prev.isActive }));
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка изменения статуса');
    }
  };

  const handleDelete = async (id) => {
    try {
      await userService.deleteUser(id);
      setSuccess('Пользователь успешно удалён');
      loadUsers();
      setDeleteConfirmId(null);
      setSelectedUser(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка удаления');
    }
  };

  const handleResetPassword = async () => {
    try {
      if (!newPassword || newPassword.length < 6) {
        setError('Пароль должен содержать минимум 6 символов');
        return;
      }
      await userService.resetPassword(resetPasswordDialog, newPassword);
      setSuccess('Пароль успешно сброшен');
      setResetPasswordDialog(null);
      setNewPassword('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка сброса пароля');
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Скопировано в буфер обмена');
    setTimeout(() => setSuccess(''), 2000);
  };

  const getRoleConfig = (role) => {
    const configs = {
      admin: { label: 'Администратор', color: theme.functional.error.main, icon: <AdminPanelSettings sx={{ fontSize: 16 }} />, bg: `${theme.functional.error.main}15`, gradient: `linear-gradient(135deg, ${theme.functional.error.main}, #dc2626)`, permissions: ['Полный доступ', 'Управление системой', 'Все операции'] },
      manager: { label: 'Менеджер', color: theme.functional.warning.main, icon: <SupervisorAccount sx={{ fontSize: 16 }} />, bg: `${theme.functional.warning.main}15`, gradient: `linear-gradient(135deg, ${theme.functional.warning.main}, #ea580c)`, permissions: ['Управление заявками', 'Управление командой', 'Аналитика'] },
      engineer: { label: 'Инженер', color: theme.functional.info.main, icon: <Engineering sx={{ fontSize: 16 }} />, bg: `${theme.functional.info.main}15`, gradient: `linear-gradient(135deg, ${theme.functional.info.main}, #0284c7)`, permissions: ['Работа с заявками', 'База знаний', 'Архив'] },
      engineer2: { label: 'Инженер 2', color: theme.functional.info.main, icon: <Engineering sx={{ fontSize: 16 }} />, bg: `${theme.functional.info.main}15`, gradient: `linear-gradient(135deg, ${theme.functional.info.main}, #0284c7)`, permissions: ['Работа с заявками', 'База знаний', 'Архив'] },
      engineer3: { label: 'Инженер 3', color: theme.functional.info.main, icon: <Engineering sx={{ fontSize: 16 }} />, bg: `${theme.functional.info.main}15`, gradient: `linear-gradient(135deg, ${theme.functional.info.main}, #0284c7)`, permissions: ['Работа с заявками', 'База знаний', 'Архив'] },
      engineer4: { label: 'Инженер 4', color: theme.functional.info.main, icon: <Engineering sx={{ fontSize: 16 }} />, bg: `${theme.functional.info.main}15`, gradient: `linear-gradient(135deg, ${theme.functional.info.main}, #0284c7)`, permissions: ['Работа с заявками', 'База знаний', 'Архив'] },
      engineer5: { label: 'Инженер 5', color: theme.functional.info.main, icon: <Engineering sx={{ fontSize: 16 }} />, bg: `${theme.functional.info.main}15`, gradient: `linear-gradient(135deg, ${theme.functional.info.main}, #0284c7)`, permissions: ['Работа с заявками', 'База знаний', 'Архив'] },
      user: { label: 'Пользователь', color: theme.functional.success.main, icon: <PersonOutline sx={{ fontSize: 16 }} />, bg: `${theme.functional.success.main}15`, gradient: `linear-gradient(135deg, ${theme.functional.success.main}, #059669)`, permissions: ['Создание заявок', 'Просмотр своих заявок'] }
    };
    return configs[role] || configs.user;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    return new Date(dateString).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return 'Не указано';
    return new Date(dateString).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const getInitials = (name) => name ? name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2) : '?';

  if (!isManager && currentUser?.role !== 'admin') {
    return (
      <Box sx={{ position: 'relative', minHeight: '100vh', pb: 4 }}>
        <Box sx={{ py: 4, px: 4 }}>
          <GlassCard variant="dark" sx={{ p: 6, textAlign: 'center' }}>
            <Security sx={{ fontSize: 64, color: theme.functional.error.main, mb: 2 }} />
            <Typography variant="h4" sx={{ color: theme.text.primary, fontWeight: 700, mb: 2 }}>Доступ запрещён</Typography>
            <Typography sx={{ color: theme.text.secondary }}>Недостаточно прав для управления пользователями</Typography>
          </GlassCard>
        </Box>
      </Box>
    );
  }

  if (loading && users.length === 0) {
    return <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress size={60} sx={{ color: theme.primary.main }} /></Box>;
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', pb: 4 }}>
      <Box sx={{ py: 4, position: 'relative', zIndex: 10 }}>
        {/* ШАПКА */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <GlassCard variant="dark" sx={{ p: 4, mb: 3, mx: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <motion.div animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                  <Box sx={{ width: 70, height: 70, borderRadius: 3, background: `linear-gradient(135deg, ${theme.primary.main} 0%, ${theme.functional.info.main} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 20px 60px ${theme.primary.main}66` }}>
                    <Group sx={{ fontSize: 32, color: '#fff' }} />
                  </Box>
                </motion.div>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, background: `linear-gradient(135deg, ${theme.text.primary} 0%, ${theme.primary.main} 100%)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Управление пользователями</Typography>
                  <Typography sx={{ color: theme.text.secondary, fontSize: '1.1rem' }}>Роли, права доступа и активность</Typography>
                </Box>
              </Box>
              <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()} sx={{ background: `linear-gradient(135deg, ${theme.primary.main} 0%, ${theme.functional.info.main} 100%)`, borderRadius: 3, px: 4, py: 1.5, fontWeight: 700, boxShadow: `0 8px 25px ${theme.primary.main}55`, border: '2px solid transparent', '&:hover': { boxShadow: `0 12px 35px ${theme.primary.main}77`, border: '2px solid #fff' } }}>Добавить пользователя</Button>
            </Box>
          </GlassCard>
        </motion.div>

        {/* УВЕДОМЛЕНИЯ */}
        <AnimatePresence>
          {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Alert severity="error" onClose={() => setError('')} sx={{ mb: 3, mx: 4, backgroundColor: theme.functional.error.bg, color: theme.text.primary, border: `1px solid ${theme.functional.error.border}` }}>{error}</Alert></motion.div>}
          {success && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 3, mx: 4, backgroundColor: theme.functional.success.bg, color: theme.text.primary, border: `1px solid ${theme.functional.success.border}` }}>{success}</Alert></motion.div>}
        </AnimatePresence>

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <Box sx={{ px: 4 }}>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
            
            {/* ЛЕВАЯ КОЛОНКА - ФИКСИРОВАННАЯ ШИРИНА */}
            <Box sx={{ width: 320, flexShrink: 0, display: { xs: 'none', lg: 'block' } }}>
              {/* Поиск */}
              <GlassCard variant="dark" sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}><Search sx={{ color: theme.primary.main }} /><Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Поиск</Typography></Box>
                <TextField fullWidth placeholder="Имя, email или логин..." value={search} onChange={(e) => setSearch(e.target.value)} size="small" sx={{ '& .MuiOutlinedInput-root': { color: '#fff', backgroundColor: theme.background.elevated, '& fieldset': { borderColor: theme.border.main } } }} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: theme.text.disabled }} /></InputAdornment> }} />
              </GlassCard>

              {/* Статистика */}
              <GlassCard variant="dark" sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}><TrendingUp sx={{ color: theme.functional.warning.main }} /><Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Статистика</Typography></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, mb: 2, borderRadius: 2, background: `${theme.primary.main}15`, border: `1px solid ${theme.primary.main}30` }}>
                  <Avatar sx={{ width: 45, height: 45, background: theme.primary.main }}><Group /></Avatar>
                  <Box><Typography variant="h5" sx={{ color: theme.text.primary, fontWeight: 800 }}>{stats?.total || 0}</Typography><Typography variant="caption" sx={{ color: theme.text.secondary }}>всего</Typography></Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, mb: 2, borderRadius: 2, background: `${theme.functional.success.main}15`, border: `1px solid ${theme.functional.success.main}30` }}>
                  <Avatar sx={{ width: 45, height: 45, background: theme.functional.success.main }}><CheckCircle /></Avatar>
                  <Box><Typography variant="h5" sx={{ color: theme.text.primary, fontWeight: 800 }}>{stats?.active || 0}</Typography><Typography variant="caption" sx={{ color: theme.text.secondary }}>активных</Typography></Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, background: `${theme.functional.error.main}15`, border: `1px solid ${theme.functional.error.main}30` }}>
                  <Avatar sx={{ width: 45, height: 45, background: theme.functional.error.main }}><PersonOff /></Avatar>
                  <Box><Typography variant="h5" sx={{ color: theme.text.primary, fontWeight: 800 }}>{stats?.inactive || 0}</Typography><Typography variant="caption" sx={{ color: theme.text.secondary }}>заблокированных</Typography></Box>
                </Box>
              </GlassCard>

              {/* Фильтры */}
              <GlassCard variant="dark" sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}><FilterList sx={{ color: theme.functional.info.main }} /><Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Фильтры</Typography></Box>
                <Typography variant="caption" sx={{ color: theme.text.secondary, mb: 1, display: 'block' }}>Роль</Typography>
                <Select fullWidth value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} displayEmpty size="small" sx={{ mb: 2, color: '#fff', backgroundColor: theme.background.elevated, '& .MuiSelect-icon': { color: '#fff' } }} MenuProps={{ PaperProps: { sx: { backgroundColor: theme.background.secondary, border: `1px solid ${theme.border.main}`, '& .MuiMenuItem-root': { color: theme.text.primary } } } }}>
                  <MenuItem value="">Все роли</MenuItem>
                  <MenuItem value="admin">Администратор</MenuItem>
                  <MenuItem value="manager">Менеджер</MenuItem>
                  <MenuItem value="engineer">Инженер</MenuItem>
                  <MenuItem value="user">Пользователь</MenuItem>
                </Select>
                <Typography variant="caption" sx={{ color: theme.text.secondary, mb: 1, display: 'block' }}>Статус</Typography>
                <Select fullWidth value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} displayEmpty size="small" sx={{ color: '#fff', backgroundColor: theme.background.elevated, '& .MuiSelect-icon': { color: '#fff' } }} MenuProps={{ PaperProps: { sx: { backgroundColor: theme.background.secondary, border: `1px solid ${theme.border.main}`, '& .MuiMenuItem-root': { color: theme.text.primary } } } }}>
                  <MenuItem value="">Все статусы</MenuItem>
                  <MenuItem value="true">Активные</MenuItem>
                  <MenuItem value="false">Заблокированные</MenuItem>
                </Select>
              </GlassCard>

              {/* По ролям */}
              <GlassCard variant="dark" sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}><Security sx={{ color: theme.functional.warning.main }} /><Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>По ролям</Typography></Box>
                {[{ role: 'admin', label: 'Администраторы', icon: AdminPanelSettings, color: theme.functional.error.main },
                  { role: 'manager', label: 'Менеджеры', icon: SupervisorAccount, color: theme.functional.warning.main },
                  { role: 'engineer', label: 'Инженеры', icon: Engineering, color: theme.functional.info.main },
                  { role: 'user', label: 'Пользователи', icon: PersonOutline, color: theme.functional.success.main }
                ].map(item => (
                  <Box key={item.role} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, mb: 1.5, borderRadius: 2, background: `${item.color}10`, border: `1px solid ${item.color}30` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><item.icon sx={{ color: item.color, fontSize: 20 }} /><Typography variant="body2" sx={{ color: theme.text.secondary }}>{item.label}</Typography></Box>
                    <Chip label={stats?.byRole?.[item.role] || 0} size="small" sx={{ backgroundColor: item.color, color: '#fff', fontWeight: 700 }} />
                  </Box>
                ))}
              </GlassCard>
            </Box>

            {/* ПРАВАЯ КОЛОНКА - СПИСОК ПОЛЬЗОВАТЕЛЕЙ */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}><Person sx={{ color: theme.primary.main }} /><Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Все пользователи</Typography><Chip label={users.length} size="small" sx={{ ml: 1, backgroundColor: theme.primary.main, color: '#fff', fontWeight: 700 }} /></Box>

              {/* Мобильный поиск */}
              <Box sx={{ display: { xs: 'block', lg: 'none' }, mb: 2 }}>
                <TextField fullWidth placeholder="Поиск..." value={search} onChange={(e) => setSearch(e.target.value)} size="small" sx={{ '& .MuiOutlinedInput-root': { color: '#fff', backgroundColor: theme.background.elevated } }} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: theme.text.disabled }} /></InputAdornment> }} />
              </Box>

              {users.length === 0 ? (
                <GlassCard variant="dark" sx={{ p: 6, textAlign: 'center' }}><Group sx={{ fontSize: 64, color: theme.text.disabled, mb: 2 }} /><Typography variant="h6" sx={{ color: theme.text.primary }}>Пользователи не найдены</Typography></GlassCard>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {users.map((user, index) => {
                    const roleConfig = getRoleConfig(user.role);
                    const isCurrentUser = currentUser?.id === user.id;
                    return (
                      <motion.div key={user.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.03 }}>
                        <GlassCard variant="dark" sx={{ p: 3, border: `2px solid ${theme.border.main}`, opacity: user.isActive ? 1 : 0.7, cursor: 'pointer', '&:hover': { border: `2px solid ${theme.primary.main}`, boxShadow: `0 10px 30px ${theme.primary.main}25` }, transition: 'all 0.3s ease' }} onClick={() => setSelectedUser(user)}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Avatar sx={{ width: 60, height: 60, background: user.isActive ? roleConfig.gradient : theme.background.elevated, boxShadow: user.isActive ? `0 8px 20px ${roleConfig.color}40` : 'none', fontSize: '1.2rem', fontWeight: 700 }}>{getInitials(user.fullName)}</Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                                <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>{user.fullName}</Typography>
                                {isCurrentUser && <Chip label="Вы" size="small" sx={{ backgroundColor: theme.primary.main, color: '#fff', height: 20, fontSize: '0.65rem' }} />}
                                {!user.isActive && <Chip icon={<Block sx={{ fontSize: 12 }} />} label="Заблокирован" size="small" sx={{ backgroundColor: `${theme.functional.error.main}15`, color: theme.functional.error.main, height: 24 }} />}
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Email sx={{ fontSize: 14, color: theme.text.disabled }} /><Typography variant="body2" sx={{ color: theme.text.secondary }}>{user.email}</Typography></Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Badge sx={{ fontSize: 14, color: theme.text.disabled }} /><Typography variant="body2" sx={{ color: theme.text.secondary }}>@{user.username}</Typography></Box>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                                <Chip icon={roleConfig.icon} label={roleConfig.label} size="small" sx={{ backgroundColor: roleConfig.bg, color: roleConfig.color, border: `1px solid ${roleConfig.color}`, fontWeight: 600 }} />
                                <Typography variant="caption" sx={{ color: theme.text.disabled }}>Создан: {formatDate(user.createdAt)}</Typography>
                              </Box>
                            </Box>
                            {/* КНОПКИ ДЕЙСТВИЙ - ИСПРАВЛЕННЫЕ */}
                            {!isCurrentUser && (
                              <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                                <Tooltip title="Редактировать">
                                  <IconButton 
                                    onClick={() => handleOpenDialog(user)} 
                                    sx={{ 
                                      backgroundColor: `${theme.functional.info.main}20`,
                                      color: theme.functional.info.main, 
                                      border: `2px solid ${theme.functional.info.main}`,
                                      width: 40,
                                      height: 40,
                                      '&:hover': { 
                                        backgroundColor: theme.functional.info.main,
                                        color: '#fff'
                                      } 
                                    }}
                                  >
                                    <Edit sx={{ fontSize: 20 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Сбросить пароль">
                                  <IconButton 
                                    onClick={() => setResetPasswordDialog(user.id)} 
                                    sx={{ 
                                      backgroundColor: `${theme.functional.warning.main}20`,
                                      color: theme.functional.warning.main, 
                                      border: `2px solid ${theme.functional.warning.main}`,
                                      width: 40,
                                      height: 40,
                                      '&:hover': { 
                                        backgroundColor: theme.functional.warning.main,
                                        color: '#fff'
                                      } 
                                    }}
                                  >
                                    <LockReset sx={{ fontSize: 20 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title={user.isActive ? 'Заблокировать' : 'Разблокировать'}>
                                  <IconButton 
                                    onClick={() => handleToggleStatus(user.id)} 
                                    sx={{ 
                                      backgroundColor: user.isActive ? `${theme.functional.error.main}20` : `${theme.functional.success.main}20`,
                                      color: user.isActive ? theme.functional.error.main : theme.functional.success.main, 
                                      border: `2px solid ${user.isActive ? theme.functional.error.main : theme.functional.success.main}`,
                                      width: 40,
                                      height: 40,
                                      '&:hover': { 
                                        backgroundColor: user.isActive ? theme.functional.error.main : theme.functional.success.main,
                                        color: '#fff'
                                      } 
                                    }}
                                  >
                                    {user.isActive ? <Block sx={{ fontSize: 20 }} /> : <CheckCircle sx={{ fontSize: 20 }} />}
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Удалить">
                                  <IconButton 
                                    onClick={() => setDeleteConfirmId(user.id)} 
                                    sx={{ 
                                      backgroundColor: `${theme.functional.error.main}20`,
                                      color: theme.functional.error.main, 
                                      border: `2px solid ${theme.functional.error.main}`,
                                      width: 40,
                                      height: 40,
                                      '&:hover': { 
                                        backgroundColor: theme.functional.error.main,
                                        color: '#fff'
                                      } 
                                    }}
                                  >
                                    <Delete sx={{ fontSize: 20 }} />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            )}
                          </Box>
                        </GlassCard>
                      </motion.div>
                    );
                  })}
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* МОДАЛЬНАЯ КАРТОЧКА ПОЛЬЗОВАТЕЛЯ */}
        <Dialog 
          open={!!selectedUser} 
          onClose={() => setSelectedUser(null)} 
          maxWidth="sm" 
          fullWidth 
          PaperProps={{ 
            sx: { 
              background: '#1a1a2e', 
              border: `1px solid ${theme.border.main}`, 
              borderRadius: 4, 
              overflow: 'hidden',
              maxHeight: '90vh'
            } 
          }}
        >
          {selectedUser && (() => {
            const roleConfig = getRoleConfig(selectedUser.role);
            const isCurrentUser = currentUser?.id === selectedUser.id;
            return (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                {/* Шапка */}
                <Box sx={{ background: roleConfig.gradient, p: 3, position: 'relative', overflow: 'hidden' }}>
                  <Box sx={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                  <Box sx={{ position: 'absolute', bottom: -30, left: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                  <IconButton onClick={() => setSelectedUser(null)} sx={{ position: 'absolute', top: 12, right: 12, color: '#fff', '&:hover': { background: 'rgba(255,255,255,0.2)' } }}><Close /></IconButton>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, position: 'relative', zIndex: 1 }}>
                    <Avatar sx={{ width: 80, height: 80, fontSize: '2rem', fontWeight: 800, background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.4)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>{getInitials(selectedUser.fullName)}</Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800, mb: 0.5, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{selectedUser.fullName}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Chip icon={React.cloneElement(roleConfig.icon, { sx: { fontSize: 14, color: '#fff !important' } })} label={roleConfig.label} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff', fontWeight: 700 }} />
                        {selectedUser.isActive ? (
                          <Chip icon={<CheckCircle sx={{ fontSize: 12, color: '#fff !important' }} />} label="Активен" size="small" sx={{ backgroundColor: 'rgba(16,185,129,0.4)', color: '#fff', fontWeight: 600 }} />
                        ) : (
                          <Chip icon={<Block sx={{ fontSize: 12, color: '#fff !important' }} />} label="Заблокирован" size="small" sx={{ backgroundColor: 'rgba(239,68,68,0.5)', color: '#fff', fontWeight: 600 }} />
                        )}
                        {isCurrentUser && <Chip label="Это вы" size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.3)', color: '#fff', fontWeight: 600 }} />}
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Контент */}
                <DialogContent sx={{ p: 0, background: '#1a1a2e', overflowY: 'auto', maxHeight: 'calc(90vh - 200px)' }}>
                  {/* Учётные данные */}
                  <Box sx={{ p: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Fingerprint sx={{ fontSize: 16 }} /> Учётные данные
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}><Email sx={{ color: '#fff', fontSize: 18 }} /></Avatar>
                          <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: '0.7rem' }}>Email</Typography>
                            <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{selectedUser.email}</Typography>
                          </Box>
                        </Box>
                        <Tooltip title="Скопировать"><IconButton size="small" onClick={() => handleCopyToClipboard(selectedUser.email)} sx={{ color: '#fff', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}><ContentCopy sx={{ fontSize: 18 }} /></IconButton></Tooltip>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}><Badge sx={{ color: '#fff', fontSize: 18 }} /></Avatar>
                          <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: '0.7rem' }}>Логин</Typography>
                            <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>@{selectedUser.username}</Typography>
                          </Box>
                        </Box>
                        <Tooltip title="Скопировать"><IconButton size="small" onClick={() => handleCopyToClipboard(selectedUser.username)} sx={{ color: '#fff', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}><ContentCopy sx={{ fontSize: 18 }} /></IconButton></Tooltip>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}><ConfirmationNumber sx={{ color: '#fff', fontSize: 18 }} /></Avatar>
                          <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: '0.7rem' }}>ID пользователя</Typography>
                            <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>#{selectedUser.id}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                  {/* Права доступа */}
                  <Box sx={{ p: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Shield sx={{ fontSize: 16 }} /> Права доступа
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {roleConfig.permissions.map((perm, idx) => (
                        <Chip key={idx} label={perm} size="small" sx={{ backgroundColor: `${roleConfig.color}20`, color: '#fff', border: `1px solid ${roleConfig.color}50`, fontWeight: 500, fontSize: '0.75rem' }} />
                      ))}
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                  {/* История */}
                  <Box sx={{ p: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WorkHistory sx={{ fontSize: 16 }} /> История аккаунта
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                        <CalendarMonth sx={{ color: '#10b981', fontSize: 20 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>Регистрация</Typography>
                          <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem' }}>{formatDateShort(selectedUser.createdAt)}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}>
                        <AccessTime sx={{ color: '#3b82f6', fontSize: 20 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>Изменение</Typography>
                          <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem' }}>{formatDateShort(selectedUser.updatedAt)}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </DialogContent>

                {/* Действия */}
                {!isCurrentUser && (
                  <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', background: '#1a1a2e', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Edit />} onClick={() => { setSelectedUser(null); handleOpenDialog(selectedUser); }} variant="contained" sx={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', fontWeight: 600, border: '2px solid transparent', '&:hover': { border: '2px solid #fff' } }}>Редактировать</Button>
                      <Button size="small" startIcon={<LockReset />} onClick={() => { setSelectedUser(null); setResetPasswordDialog(selectedUser.id); }} variant="contained" sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', fontWeight: 600, border: '2px solid transparent', '&:hover': { border: '2px solid #fff' } }}>Пароль</Button>
                    </Box>
                    <Button size="small" startIcon={selectedUser.isActive ? <Block /> : <CheckCircle />} onClick={() => handleToggleStatus(selectedUser.id)} variant="contained" sx={{ background: selectedUser.isActive ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontWeight: 600, border: '2px solid transparent', '&:hover': { border: '2px solid #fff' } }}>{selectedUser.isActive ? 'Заблокировать' : 'Разблокировать'}</Button>
                  </DialogActions>
                )}
              </motion.div>
            );
          })()}
        </Dialog>

        {/* ДИАЛОГ СОЗДАНИЯ/РЕДАКТИРОВАНИЯ */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          maxWidth="sm" 
          fullWidth 
          PaperProps={{ 
            sx: { 
              background: '#1a1a2e', 
              border: `1px solid ${theme.border.main}`, 
              borderRadius: 4,
              overflow: 'hidden'
            } 
          }}
        >
          {/* Шапка */}
          <Box sx={{ 
            background: editingUser 
              ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
              : 'linear-gradient(135deg, #10b981, #059669)', 
            p: 3, 
            position: 'relative', 
            overflow: 'hidden' 
          }}>
            <Box sx={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
              <Avatar sx={{ width: 60, height: 60, background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.4)' }}>
                {editingUser ? <Edit sx={{ color: '#fff', fontSize: 28 }} /> : <PersonAdd sx={{ color: '#fff', fontSize: 28 }} />}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800 }}>
                  {editingUser ? 'Редактировать пользователя' : 'Новый пользователь'}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                  {editingUser ? 'Изменение данных аккаунта' : 'Создание нового аккаунта'}
                </Typography>
              </Box>
            </Box>
          </Box>

          <DialogContent sx={{ p: 2.5, background: '#1a1a2e' }}>
            {/* Полное имя */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: '0.7rem', mb: 0.5, display: 'block' }}>
                Полное имя
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                p: 1.5, 
                borderRadius: 2, 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)',
                '&:focus-within': { border: '1px solid rgba(99, 102, 241, 0.5)', background: 'rgba(255,255,255,0.08)' }
              }}>
                <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
                  <Person sx={{ color: '#fff', fontSize: 18 }} />
                </Avatar>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Иван Иванов"
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontWeight: 500, fontFamily: 'inherit' }}
                />
              </Box>
            </Box>

            {/* Логин */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: '0.7rem', mb: 0.5, display: 'block' }}>
                Логин
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                p: 1.5, 
                borderRadius: 2, 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)',
                '&:focus-within': { border: '1px solid rgba(99, 102, 241, 0.5)', background: 'rgba(255,255,255,0.08)' }
              }}>
                <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                  <Badge sx={{ color: '#fff', fontSize: 18 }} />
                </Avatar>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="username"
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontWeight: 500, fontFamily: 'inherit' }}
                />
              </Box>
            </Box>

            {/* Email */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: '0.7rem', mb: 0.5, display: 'block' }}>
                Email
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                p: 1.5, 
                borderRadius: 2, 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)',
                '&:focus-within': { border: '1px solid rgba(99, 102, 241, 0.5)', background: 'rgba(255,255,255,0.08)' }
              }}>
                <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                  <Email sx={{ color: '#fff', fontSize: 18 }} />
                </Avatar>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontWeight: 500, fontFamily: 'inherit' }}
                />
              </Box>
            </Box>

            {/* Пароль */}
            {!editingUser && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: '0.7rem', mb: 0.5, display: 'block' }}>
                  Пароль
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5, 
                  p: 1.5, 
                  borderRadius: 2, 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  '&:focus-within': { border: '1px solid rgba(99, 102, 241, 0.5)', background: 'rgba(255,255,255,0.08)' }
                }}>
                  <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                    <LockReset sx={{ color: '#fff', fontSize: 18 }} />
                  </Avatar>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontWeight: 500, fontFamily: 'inherit' }}
                  />
                  <IconButton size="small" onClick={() => setShowPassword(!showPassword)} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}>
                    {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                  </IconButton>
                </Box>
              </Box>
            )}

            {/* Роль */}
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: '0.7rem', mb: 0.5, display: 'block' }}>
                Роль
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                p: 1, 
                borderRadius: 2, 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <Avatar sx={{ width: 36, height: 36, background: getRoleConfig(formData.role).gradient }}>
                  {getRoleConfig(formData.role).icon}
                </Avatar>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  variant="standard"
                  disableUnderline
                  sx={{ 
                    flex: 1,
                    color: '#fff', 
                    fontWeight: 500,
                    '& .MuiSelect-select': { py: 0.5 },
                    '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.5)' }
                  }}
                  MenuProps={{ 
                    PaperProps: { 
                      sx: { 
                        backgroundColor: '#1a1a2e', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        '& .MuiMenuItem-root': { 
                          color: '#fff',
                          '&:hover': { background: 'rgba(255,255,255,0.1)' },
                          '&.Mui-selected': { background: 'rgba(99, 102, 241, 0.2)' }
                        } 
                      } 
                    } 
                  }}
                >
                  <MenuItem value="user">Пользователь</MenuItem>
                  <MenuItem value="engineer">Инженер</MenuItem>
                  <MenuItem value="manager">Менеджер</MenuItem>
                  <MenuItem value="admin">Администратор</MenuItem>
                </Select>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', background: '#1a1a2e', justifyContent: 'flex-end', gap: 1 }}>
            <Button 
              onClick={handleCloseDialog} 
              variant="contained" 
              sx={{ 
                background: 'rgba(255,255,255,0.1)', 
                color: '#fff', 
                fontWeight: 600,
                border: '2px solid transparent', 
                '&:hover': { background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)' } 
              }}
            >
              Отмена
            </Button>
            <Button 
              onClick={handleSave} 
              variant="contained" 
              disabled={!formData.fullName || !formData.username || !formData.email || (!editingUser && !formData.password)}
              sx={{ 
                background: editingUser 
                  ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                  : 'linear-gradient(135deg, #10b981, #059669)', 
                color: '#fff',
                fontWeight: 700, 
                border: '2px solid transparent', 
                '&:hover': { border: '2px solid #fff' }, 
                '&:disabled': { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' } 
              }}
            >
              {editingUser ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* ДИАЛОГ СБРОСА ПАРОЛЯ */}
        <Dialog open={!!resetPasswordDialog} onClose={() => { setResetPasswordDialog(null); setNewPassword(''); }} PaperProps={{ sx: { background: '#1a1a2e', border: `1px solid ${theme.border.main}`, borderRadius: 4, overflow: 'hidden' } }}>
          <Box sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 50, height: 50, background: 'rgba(255,255,255,0.2)' }}><LockReset sx={{ color: '#fff', fontSize: 24 }} /></Avatar>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>Сброс пароля</Typography>
            </Box>
          </Box>
          <DialogContent sx={{ p: 2.5, background: '#1a1a2e' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, fontSize: '0.9rem' }}>Введите новый пароль для пользователя:</Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              p: 1.5, 
              borderRadius: 2, 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)',
              '&:focus-within': { border: '1px solid rgba(245, 158, 11, 0.5)' }
            }}>
              <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                <LockReset sx={{ color: '#fff', fontSize: 18 }} />
              </Avatar>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Новый пароль"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontWeight: 500, fontFamily: 'inherit' }}
              />
              <IconButton size="small" onClick={() => setShowPassword(!showPassword)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
                {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
              </IconButton>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', background: '#1a1a2e' }}>
            <Button onClick={() => { setResetPasswordDialog(null); setNewPassword(''); }} sx={{ color: '#fff' }}>Отмена</Button>
            <Button onClick={handleResetPassword} variant="contained" sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', fontWeight: 700 }}>Сбросить</Button>
          </DialogActions>
        </Dialog>

        {/* ДИАЛОГ УДАЛЕНИЯ */}
        <Dialog open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} PaperProps={{ sx: { background: '#1a1a2e', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 4, overflow: 'hidden' } }}>
          <Box sx={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 50, height: 50, background: 'rgba(255,255,255,0.2)' }}><Delete sx={{ color: '#fff', fontSize: 24 }} /></Avatar>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>Удаление пользователя</Typography>
            </Box>
          </Box>
          <DialogContent sx={{ p: 2.5, background: '#1a1a2e', textAlign: 'center' }}>
            <Typography sx={{ color: '#fff', fontSize: '1rem' }}>Вы уверены, что хотите удалить этого пользователя?</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }}>Это действие нельзя отменить</Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', background: '#1a1a2e', justifyContent: 'center' }}>
            <Button onClick={() => setDeleteConfirmId(null)} sx={{ color: '#fff' }}>Отмена</Button>
            <Button onClick={() => handleDelete(deleteConfirmId)} variant="contained" sx={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', fontWeight: 700 }}>Удалить</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Users;