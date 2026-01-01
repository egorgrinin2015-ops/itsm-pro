import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import userService from '../services/userService';
import GlassCard from '../components/GlassCard';
import theme from '../theme/theme';
import { Typography, Button, Box, TextField, InputAdornment, Chip, Alert, IconButton, Tooltip, Avatar, Dialog, DialogContent, DialogActions, Select, MenuItem, CircularProgress, Divider } from '@mui/material';
import { Search, Add, Edit, Delete, Computer, Print, Monitor, Phone, Router, Storage, DevicesOther, Person, LocationOn, CalendarMonth, Build, History, Close, FilterList, TrendingUp, Warning, CheckCircle, Cancel, Inventory, Business, AttachMoney, Badge, Memory, Speed, Laptop, Scanner, Dns, ContentCopy, Assignment } from '@mui/icons-material';

// Встроенный сервис оборудования (обход проблемы с импортом)
const equipmentService = {
  getAll: async (params = {}) => {
    const response = await api.get('/equipment', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/equipment/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/equipment', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/equipment/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/equipment/${id}`);
    return response.data;
  },
  getHistory: async (id) => {
    const response = await api.get(`/equipment/${id}/history`);
    return response.data;
  }
};

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [historyDialog, setHistoryDialog] = useState(null);
  const [history, setHistory] = useState([]);
  
  const [formData, setFormData] = useState({ name: '', type: 'computer', manufacturer: '', model: '', serialNumber: '', inventoryNumber: '', specifications: {}, status: 'active', location: '', department: '', assignedToId: '', purchaseDate: '', warrantyUntil: '', purchasePrice: '', notes: '' });
  const [specFields, setSpecFields] = useState({ cpu: '', ram: '', storage: '', os: '' });

  const { isManager } = useAuth();

  const typeConfig = {
    computer: { label: 'Компьютер', icon: Computer, color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
    laptop: { label: 'Ноутбук', icon: Laptop, color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
    monitor: { label: 'Монитор', icon: Monitor, color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
    printer: { label: 'Принтер', icon: Print, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    scanner: { label: 'Сканер', icon: Scanner, color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
    phone: { label: 'Телефон', icon: Phone, color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
    network: { label: 'Сетевое', icon: Router, color: '#14b8a6', gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)' },
    server: { label: 'Сервер', icon: Dns, color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    other: { label: 'Другое', icon: DevicesOther, color: '#64748b', gradient: 'linear-gradient(135deg, #64748b, #475569)' }
  };

  const statusConfig = {
    active: { label: 'Активно', color: '#10b981', icon: CheckCircle },
    inactive: { label: 'Неактивно', color: '#64748b', icon: Cancel },
    repair: { label: 'В ремонте', color: '#f59e0b', icon: Build },
    written_off: { label: 'Списано', color: '#ef4444', icon: Delete },
    storage: { label: 'На складе', color: '#8b5cf6', icon: Storage }
  };

  const eventTypeLabels = {
    created: 'Создано', assigned: 'Назначено', unassigned: 'Снято', status_change: 'Статус изменён',
    repair: 'Ремонт', maintenance: 'Обслуживание', upgrade: 'Модернизация', relocation: 'Перемещено',
    note: 'Заметка', warranty_claim: 'Гарантия', written_off: 'Списано'
  };

  useEffect(() => { loadEquipment(); loadUsers(); }, [search, typeFilter, statusFilter, page]);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (typeFilter) params.type = typeFilter;
      if (statusFilter) params.status = statusFilter;
      const data = await equipmentService.getAll(params);
      setEquipment(data.equipment || []);
      setStats(data.stats || null);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) { setError('Ошибка загрузки'); }
    finally { setLoading(false); }
  };

  const loadUsers = async () => {
    try { const data = await userService.getAllUsers({ limit: 100 }); setUsers(data.users || []); } catch (err) {}
  };

  const loadHistory = async (id) => {
    try { const data = await equipmentService.getHistory(id); setHistory(data.history || []); } catch (err) {}
  };

  const handleOpenDialog = (item = null) => {
    setEditingEquipment(item);
    if (item) {
      setFormData({ name: item.name || '', type: item.type || 'computer', manufacturer: item.manufacturer || '', model: item.model || '', serialNumber: item.serialNumber || '', inventoryNumber: item.inventoryNumber || '', specifications: item.specifications || {}, status: item.status || 'active', location: item.location || '', department: item.department || '', assignedToId: item.assignedToId || '', purchaseDate: item.purchaseDate || '', warrantyUntil: item.warrantyUntil || '', purchasePrice: item.purchasePrice || '', notes: item.notes || '' });
      setSpecFields(item.specifications || { cpu: '', ram: '', storage: '', os: '' });
    } else {
      setFormData({ name: '', type: 'computer', manufacturer: '', model: '', serialNumber: '', inventoryNumber: '', specifications: {}, status: 'active', location: '', department: '', assignedToId: '', purchaseDate: '', warrantyUntil: '', purchasePrice: '', notes: '' });
      setSpecFields({ cpu: '', ram: '', storage: '', os: '' });
    }
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      const dataToSave = { ...formData, specifications: specFields, assignedToId: formData.assignedToId || null, purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : null };
      if (editingEquipment) { await equipmentService.update(editingEquipment.id, dataToSave); setSuccess('Обновлено'); }
      else { await equipmentService.create(dataToSave); setSuccess('Добавлено'); }
      setOpenDialog(false); setEditingEquipment(null); loadEquipment();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError(err.response?.data?.message || 'Ошибка сохранения'); }
  };

  const handleDelete = async (id) => {
    try { await equipmentService.delete(id); setSuccess('Удалено'); loadEquipment(); setDeleteConfirmId(null); setSelectedEquipment(null); setTimeout(() => setSuccess(''), 3000); }
    catch (err) { setError('Ошибка удаления'); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('ru-RU') : '—';

  if (loading && equipment.length === 0) return <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress size={60} sx={{ color: '#06b6d4' }} /></Box>;

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', pb: 4 }}>
      <Box sx={{ py: 4, position: 'relative', zIndex: 10 }}>
        
        {/* ШАПКА */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard variant="dark" sx={{ p: 4, mb: 3, mx: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ width: 70, height: 70, borderRadius: 3, background: 'linear-gradient(135deg, #06b6d4, #0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 60px rgba(6, 182, 212, 0.4)' }}>
                  <Inventory sx={{ fontSize: 32, color: '#fff' }} />
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, background: 'linear-gradient(135deg, #ffffff, #06b6d4)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Инвентаризация</Typography>
                  <Typography sx={{ color: theme.text.secondary }}>База оборудования CMDB</Typography>
                </Box>
              </Box>
              {isManager && <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()} sx={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', borderRadius: 3, px: 4, py: 1.5, fontWeight: 700, boxShadow: '0 8px 25px rgba(6, 182, 212, 0.4)' }}>Добавить</Button>}
            </Box>
          </GlassCard>
        </motion.div>

        <AnimatePresence>
          {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Alert severity="error" onClose={() => setError('')} sx={{ mb: 3, mx: 4 }}>{error}</Alert></motion.div>}
          {success && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 3, mx: 4 }}>{success}</Alert></motion.div>}
        </AnimatePresence>

        <Box sx={{ px: 4, display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          {/* ЛЕВАЯ КОЛОНКА */}
          <Box sx={{ width: 320, flexShrink: 0, display: { xs: 'none', lg: 'block' } }}>
            <GlassCard variant="dark" sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}><Search sx={{ color: '#06b6d4' }} /><Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Поиск</Typography></Box>
              <TextField fullWidth placeholder="Название, серийник..." value={search} onChange={(e) => setSearch(e.target.value)} size="small" sx={{ '& .MuiOutlinedInput-root': { color: '#fff', backgroundColor: theme.background.elevated } }} />
            </GlassCard>

            <GlassCard variant="dark" sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}><TrendingUp sx={{ color: '#06b6d4' }} /><Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Статистика</Typography></Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, mb: 2, borderRadius: 2, background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)' }}><Avatar sx={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}><Inventory /></Avatar><Box><Typography variant="h5" sx={{ color: '#fff', fontWeight: 800 }}>{stats?.total || 0}</Typography><Typography variant="caption" sx={{ color: theme.text.secondary }}>всего</Typography></Box></Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, mb: 2, borderRadius: 2, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}><Avatar sx={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}><CheckCircle /></Avatar><Box><Typography variant="h5" sx={{ color: '#fff', fontWeight: 800 }}>{stats?.active || 0}</Typography><Typography variant="caption" sx={{ color: theme.text.secondary }}>активных</Typography></Box></Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, mb: 2, borderRadius: 2, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}><Avatar sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}><Build /></Avatar><Box><Typography variant="h5" sx={{ color: '#fff', fontWeight: 800 }}>{stats?.repair || 0}</Typography><Typography variant="caption" sx={{ color: theme.text.secondary }}>в ремонте</Typography></Box></Box>
            </GlassCard>

            <GlassCard variant="dark" sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}><FilterList sx={{ color: '#8b5cf6' }} /><Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Фильтры</Typography></Box>
              <Typography variant="caption" sx={{ color: theme.text.secondary, mb: 1, display: 'block' }}>Тип</Typography>
              <Select fullWidth value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} displayEmpty size="small" sx={{ mb: 2, color: '#fff', backgroundColor: theme.background.elevated }} MenuProps={{ PaperProps: { sx: { backgroundColor: theme.background.secondary, '& .MuiMenuItem-root': { color: '#fff' } } } }}>
                <MenuItem value="">Все типы</MenuItem>
                {Object.entries(typeConfig).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
              </Select>
              <Typography variant="caption" sx={{ color: theme.text.secondary, mb: 1, display: 'block' }}>Статус</Typography>
              <Select fullWidth value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} displayEmpty size="small" sx={{ color: '#fff', backgroundColor: theme.background.elevated }} MenuProps={{ PaperProps: { sx: { backgroundColor: theme.background.secondary, '& .MuiMenuItem-root': { color: '#fff' } } } }}>
                <MenuItem value="">Все статусы</MenuItem>
                {Object.entries(statusConfig).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
              </Select>
            </GlassCard>
          </Box>

          {/* ПРАВАЯ КОЛОНКА */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}><Inventory sx={{ color: '#06b6d4' }} /><Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>Оборудование</Typography><Chip label={equipment.length} size="small" sx={{ ml: 1, backgroundColor: '#06b6d4', color: '#fff' }} /></Box>

            {equipment.length === 0 ? (
              <GlassCard variant="dark" sx={{ p: 6, textAlign: 'center' }}><Inventory sx={{ fontSize: 64, color: theme.text.disabled, mb: 2 }} /><Typography variant="h6" sx={{ color: theme.text.primary }}>Оборудование не найдено</Typography></GlassCard>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {equipment.map((item, index) => {
                  const tc = typeConfig[item.type] || typeConfig.other;
                  const sc = statusConfig[item.status] || statusConfig.active;
                  const TI = tc.icon, SI = sc.icon;
                  return (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
                      <GlassCard variant="dark" sx={{ p: 3, border: `2px solid ${theme.border.main}`, cursor: 'pointer', '&:hover': { border: `2px solid ${tc.color}` }, transition: 'all 0.3s' }} onClick={() => setSelectedEquipment(item)}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Avatar sx={{ width: 60, height: 60, background: tc.gradient }}><TI sx={{ fontSize: 28, color: '#fff' }} /></Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                              <Typography variant="h6" sx={{ color: theme.text.primary, fontWeight: 700 }}>{item.name}</Typography>
                              <Chip icon={<SI sx={{ fontSize: 12 }} />} label={sc.label} size="small" sx={{ backgroundColor: `${sc.color}20`, color: sc.color, border: `1px solid ${sc.color}`, height: 24 }} />
                            </Box>
                            <Typography variant="body2" sx={{ color: theme.text.secondary, mb: 1 }}>{item.manufacturer} {item.model}</Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip label={tc.label} size="small" sx={{ backgroundColor: `${tc.color}20`, color: tc.color }} />
                              {item.assignedTo && <Chip icon={<Person sx={{ fontSize: 12 }} />} label={item.assignedTo.fullName} size="small" sx={{ backgroundColor: theme.background.elevated, color: theme.text.secondary }} />}
                              {item.location && <Chip icon={<LocationOn sx={{ fontSize: 12 }} />} label={item.location} size="small" sx={{ backgroundColor: theme.background.elevated, color: theme.text.disabled }} />}
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }} onClick={(e) => e.stopPropagation()}>
                            <Tooltip title="История"><IconButton onClick={() => { setHistoryDialog(item); loadHistory(item.id); }} sx={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6', border: '2px solid #8b5cf6', width: 40, height: 40, '&:hover': { backgroundColor: '#8b5cf6', color: '#fff' } }}><History sx={{ fontSize: 20 }} /></IconButton></Tooltip>
                            {isManager && <>
                              <Tooltip title="Редактировать"><IconButton onClick={() => handleOpenDialog(item)} sx={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', border: '2px solid #3b82f6', width: 40, height: 40, '&:hover': { backgroundColor: '#3b82f6', color: '#fff' } }}><Edit sx={{ fontSize: 20 }} /></IconButton></Tooltip>
                              <Tooltip title="Удалить"><IconButton onClick={() => setDeleteConfirmId(item.id)} sx={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '2px solid #ef4444', width: 40, height: 40, '&:hover': { backgroundColor: '#ef4444', color: '#fff' } }}><Delete sx={{ fontSize: 20 }} /></IconButton></Tooltip>
                            </>}
                          </Box>
                        </Box>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </Box>
            )}
            {totalPages > 1 && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 2 }}><Button disabled={page === 1} onClick={() => setPage(page - 1)} variant="contained">Назад</Button><Typography sx={{ color: '#fff', alignSelf: 'center' }}>{page}/{totalPages}</Typography><Button disabled={page === totalPages} onClick={() => setPage(page + 1)} variant="contained">Вперёд</Button></Box>}
          </Box>
        </Box>

        {/* ПРОСМОТР */}
        <Dialog open={!!selectedEquipment} onClose={() => setSelectedEquipment(null)} maxWidth="md" fullWidth PaperProps={{ sx: { background: '#1a1a2e', border: `1px solid ${theme.border.main}`, borderRadius: 4, overflow: 'hidden' } }}>
          {selectedEquipment && (() => {
            const tc = typeConfig[selectedEquipment.type] || typeConfig.other;
            const sc = statusConfig[selectedEquipment.status] || statusConfig.active;
            const TI = tc.icon;
            return <>
              <Box sx={{ background: tc.gradient, p: 3, position: 'relative' }}>
                <IconButton onClick={() => setSelectedEquipment(null)} sx={{ position: 'absolute', top: 12, right: 12, color: '#fff' }}><Close /></IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                  <Avatar sx={{ width: 80, height: 80, background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.4)' }}><TI sx={{ fontSize: 40, color: '#fff' }} /></Avatar>
                  <Box><Typography variant="h5" sx={{ color: '#fff', fontWeight: 800 }}>{selectedEquipment.name}</Typography><Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}><Chip label={tc.label} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff' }} /><Chip label={sc.label} size="small" sx={{ backgroundColor: `${sc.color}50`, color: '#fff' }} /></Box></Box>
                </Box>
              </Box>
              <DialogContent sx={{ p: 2.5, background: '#1a1a2e' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                  {selectedEquipment.serialNumber && <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Серийный номер</Typography><Typography sx={{ color: '#fff', fontWeight: 600 }}>{selectedEquipment.serialNumber}</Typography></Box>}
                  {selectedEquipment.inventoryNumber && <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Инв. номер</Typography><Typography sx={{ color: '#fff', fontWeight: 600 }}>{selectedEquipment.inventoryNumber}</Typography></Box>}
                  {selectedEquipment.qrCode && <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>QR-код</Typography><Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>{selectedEquipment.qrCode}</Typography></Box>}
                  {selectedEquipment.manufacturer && <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Производитель/модель</Typography><Typography sx={{ color: '#fff', fontWeight: 600 }}>{selectedEquipment.manufacturer} {selectedEquipment.model}</Typography></Box>}
                  {selectedEquipment.assignedTo && <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Ответственный</Typography><Typography sx={{ color: '#fff', fontWeight: 600 }}>{selectedEquipment.assignedTo.fullName}</Typography></Box>}
                  {selectedEquipment.location && <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Местоположение</Typography><Typography sx={{ color: '#fff', fontWeight: 600 }}>{selectedEquipment.location}</Typography></Box>}
                  {selectedEquipment.purchaseDate && <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Дата покупки</Typography><Typography sx={{ color: '#fff', fontWeight: 600 }}>{formatDate(selectedEquipment.purchaseDate)}</Typography></Box>}
                  {selectedEquipment.warrantyUntil && <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Гарантия до</Typography><Typography sx={{ color: '#fff', fontWeight: 600 }}>{formatDate(selectedEquipment.warrantyUntil)}</Typography></Box>}
                </Box>
                {selectedEquipment.specifications && Object.values(selectedEquipment.specifications).some(v => v) && <>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />
                  <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1, fontWeight: 700 }}>Характеристики</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedEquipment.specifications.cpu && <Chip icon={<Memory sx={{ fontSize: 14 }} />} label={`CPU: ${selectedEquipment.specifications.cpu}`} size="small" sx={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }} />}
                    {selectedEquipment.specifications.ram && <Chip icon={<Speed sx={{ fontSize: 14 }} />} label={`RAM: ${selectedEquipment.specifications.ram}`} size="small" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }} />}
                    {selectedEquipment.specifications.storage && <Chip icon={<Storage sx={{ fontSize: 14 }} />} label={selectedEquipment.specifications.storage} size="small" sx={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6' }} />}
                    {selectedEquipment.specifications.os && <Chip label={selectedEquipment.specifications.os} size="small" sx={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }} />}
                  </Box>
                </>}
              </DialogContent>
              {isManager && <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', background: '#1a1a2e', justifyContent: 'space-between' }}>
                <Button startIcon={<History />} onClick={() => { setSelectedEquipment(null); setHistoryDialog(selectedEquipment); loadHistory(selectedEquipment.id); }} variant="contained" sx={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>История</Button>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button startIcon={<Edit />} onClick={() => { setSelectedEquipment(null); handleOpenDialog(selectedEquipment); }} variant="contained" sx={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>Редактировать</Button>
                  <Button startIcon={<Delete />} onClick={() => setDeleteConfirmId(selectedEquipment.id)} variant="contained" sx={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>Удалить</Button>
                </Box>
              </DialogActions>}
            </>;
          })()}
        </Dialog>

        {/* СОЗДАНИЕ/РЕДАКТИРОВАНИЕ */}
        <Dialog open={openDialog} onClose={() => { setOpenDialog(false); setEditingEquipment(null); }} maxWidth="md" fullWidth PaperProps={{ sx: { background: '#1a1a2e', border: `1px solid ${theme.border.main}`, borderRadius: 4, overflow: 'hidden' } }}>
          <Box sx={{ background: editingEquipment ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'linear-gradient(135deg, #06b6d4, #0891b2)', p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 60, height: 60, background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.4)' }}>{editingEquipment ? <Edit sx={{ color: '#fff', fontSize: 28 }} /> : <Add sx={{ color: '#fff', fontSize: 28 }} />}</Avatar>
              <Box><Typography variant="h5" sx={{ color: '#fff', fontWeight: 800 }}>{editingEquipment ? 'Редактировать' : 'Новое оборудование'}</Typography><Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>{editingEquipment ? 'Изменение данных' : 'Добавление в базу'}</Typography></Box>
            </Box>
          </Box>
          <DialogContent sx={{ p: 2.5, background: '#1a1a2e', maxHeight: '60vh', overflowY: 'auto' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <Box><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5, display: 'block' }}>Название *</Typography><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><Computer sx={{ color: '#06b6d4' }} /><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Название" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontFamily: 'inherit' }} /></Box></Box>
              <Box><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5, display: 'block' }}>Тип</Typography><Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} fullWidth size="small" sx={{ color: '#fff', backgroundColor: theme.background.elevated }} MenuProps={{ PaperProps: { sx: { backgroundColor: '#1a1a2e', '& .MuiMenuItem-root': { color: '#fff' } } } }}>{Object.entries(typeConfig).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}</Select></Box>
              <Box><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5, display: 'block' }}>Производитель</Typography><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><Business sx={{ color: '#8b5cf6' }} /><input type="text" value={formData.manufacturer} onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })} placeholder="HP, Dell..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontFamily: 'inherit' }} /></Box></Box>
              <Box><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5, display: 'block' }}>Модель</Typography><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><DevicesOther sx={{ color: '#f59e0b' }} /><input type="text" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} placeholder="ProDesk 400" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontFamily: 'inherit' }} /></Box></Box>
              <Box><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5, display: 'block' }}>Серийный номер</Typography><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><Badge sx={{ color: '#3b82f6' }} /><input type="text" value={formData.serialNumber} onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })} placeholder="SN123456" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontFamily: 'inherit' }} /></Box></Box>
              <Box><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5, display: 'block' }}>Инв. номер</Typography><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><Assignment sx={{ color: '#10b981' }} /><input type="text" value={formData.inventoryNumber} onChange={(e) => setFormData({ ...formData, inventoryNumber: e.target.value })} placeholder="INV-001" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontFamily: 'inherit' }} /></Box></Box>
              <Box><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5, display: 'block' }}>Статус</Typography><Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} fullWidth size="small" sx={{ color: '#fff', backgroundColor: theme.background.elevated }} MenuProps={{ PaperProps: { sx: { backgroundColor: '#1a1a2e', '& .MuiMenuItem-root': { color: '#fff' } } } }}>{Object.entries(statusConfig).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}</Select></Box>
              <Box><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5, display: 'block' }}>Ответственный</Typography><Select value={formData.assignedToId} onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })} displayEmpty fullWidth size="small" sx={{ color: '#fff', backgroundColor: theme.background.elevated }} MenuProps={{ PaperProps: { sx: { backgroundColor: '#1a1a2e', '& .MuiMenuItem-root': { color: '#fff' }, maxHeight: 300 } } }}><MenuItem value="">Не назначен</MenuItem>{users.map(u => <MenuItem key={u.id} value={u.id}>{u.fullName}</MenuItem>)}</Select></Box>
              <Box><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5, display: 'block' }}>Местоположение</Typography><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><LocationOn sx={{ color: '#14b8a6' }} /><input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Офис 305" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontFamily: 'inherit' }} /></Box></Box>
              <Box><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5, display: 'block' }}>Отдел</Typography><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><Business sx={{ color: '#64748b' }} /><input type="text" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="IT отдел" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontFamily: 'inherit' }} /></Box></Box>
              <Box><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5, display: 'block' }}>Дата покупки</Typography><Box sx={{ p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><input type="date" value={formData.purchaseDate} onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })} style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontFamily: 'inherit' }} /></Box></Box>
              <Box><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5, display: 'block' }}>Гарантия до</Typography><Box sx={{ p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><input type="date" value={formData.warrantyUntil} onChange={(e) => setFormData({ ...formData, warrantyUntil: e.target.value })} style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontFamily: 'inherit' }} /></Box></Box>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />
            <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1.5, fontWeight: 700 }}>Характеристики</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><Memory sx={{ color: '#3b82f6' }} /><input type="text" value={specFields.cpu} onChange={(e) => setSpecFields({ ...specFields, cpu: e.target.value })} placeholder="Процессор" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontFamily: 'inherit' }} /></Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><Speed sx={{ color: '#10b981' }} /><input type="text" value={specFields.ram} onChange={(e) => setSpecFields({ ...specFields, ram: e.target.value })} placeholder="RAM" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontFamily: 'inherit' }} /></Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><Storage sx={{ color: '#8b5cf6' }} /><input type="text" value={specFields.storage} onChange={(e) => setSpecFields({ ...specFields, storage: e.target.value })} placeholder="Диск" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontFamily: 'inherit' }} /></Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><Computer sx={{ color: '#f59e0b' }} /><input type="text" value={specFields.os} onChange={(e) => setSpecFields({ ...specFields, os: e.target.value })} placeholder="ОС" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', fontFamily: 'inherit' }} /></Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', background: '#1a1a2e', gap: 1 }}>
            <Button onClick={() => { setOpenDialog(false); setEditingEquipment(null); }} sx={{ color: '#fff' }}>Отмена</Button>
            <Button onClick={handleSave} variant="contained" disabled={!formData.name.trim()} sx={{ background: editingEquipment ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'linear-gradient(135deg, #06b6d4, #0891b2)', fontWeight: 700 }}>{editingEquipment ? 'Сохранить' : 'Создать'}</Button>
          </DialogActions>
        </Dialog>

        {/* ИСТОРИЯ */}
        <Dialog open={!!historyDialog} onClose={() => setHistoryDialog(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { background: '#1a1a2e', border: `1px solid ${theme.border.main}`, borderRadius: 4, overflow: 'hidden' } }}>
          <Box sx={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Avatar sx={{ background: 'rgba(255,255,255,0.2)' }}><History sx={{ color: '#fff' }} /></Avatar><Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>История: {historyDialog?.name}</Typography></Box>
          </Box>
          <DialogContent sx={{ p: 2, background: '#1a1a2e', maxHeight: 400, overflowY: 'auto' }}>
            {history.length === 0 ? <Typography sx={{ color: theme.text.secondary, textAlign: 'center', py: 4 }}>История пуста</Typography> : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {history.map((h) => (
                  <Box key={h.id} sx={{ p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Chip label={eventTypeLabels[h.eventType] || h.eventType} size="small" sx={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6' }} />
                      <Typography variant="caption" sx={{ color: theme.text.disabled }}>{new Date(h.createdAt).toLocaleString('ru-RU')}</Typography>
                    </Box>
                    <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>{h.description}</Typography>
                    {h.user && <Typography variant="caption" sx={{ color: theme.text.secondary }}>— {h.user.fullName}</Typography>}
                  </Box>
                ))}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', background: '#1a1a2e' }}>
            <Button onClick={() => setHistoryDialog(null)} sx={{ color: '#fff' }}>Закрыть</Button>
          </DialogActions>
        </Dialog>

        {/* УДАЛЕНИЕ */}
        <Dialog open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} PaperProps={{ sx: { background: '#1a1a2e', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 4 } }}>
          <Box sx={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', p: 2.5 }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Avatar sx={{ background: 'rgba(255,255,255,0.2)' }}><Delete sx={{ color: '#fff' }} /></Avatar><Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>Удаление</Typography></Box></Box>
          <DialogContent sx={{ p: 2.5, background: '#1a1a2e', textAlign: 'center' }}><Typography sx={{ color: '#fff' }}>Удалить оборудование?</Typography><Typography sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }}>Это действие нельзя отменить</Typography></DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', background: '#1a1a2e', justifyContent: 'center' }}><Button onClick={() => setDeleteConfirmId(null)} sx={{ color: '#fff' }}>Отмена</Button><Button onClick={() => handleDelete(deleteConfirmId)} variant="contained" sx={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', fontWeight: 700 }}>Удалить</Button></DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Equipment;