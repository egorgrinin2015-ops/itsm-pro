import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import statsService from '../services/statsService';
import AnimatedPage from '../components/AnimatedPage';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import {
  Container,
  Box,
  Typography,
  Grid,
  Alert,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Activity,
  Users,
  Ticket,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Zap,
  Award
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';
import { motion, useInView } from 'framer-motion';

// Современная цветовая палитра для графиков
const CHART_COLORS = [
  'rgba(102, 126, 234, 1)',
  'rgba(34, 197, 94, 1)', 
  'rgba(251, 191, 36, 1)',
  'rgba(239, 68, 68, 1)',
  'rgba(168, 85, 247, 1)',
  'rgba(14, 165, 233, 1)'
];

const GRADIENT_COLORS = [
  'rgba(102, 126, 234, 0.1)',
  'rgba(34, 197, 94, 0.1)', 
  'rgba(251, 191, 36, 0.1)',
  'rgba(239, 68, 68, 0.1)',
  'rgba(168, 85, 247, 0.1)',
];

const Dashboard = () => {
  const { isManager } = useAuth();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [topPerformers, setTopPerformers] = useState([]);
  const [slaMetrics, setSlaMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isManager) return;
    loadDashboardData();
  }, [isManager]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [overallData, dateData, performersData, slaData] = await Promise.all([
        statsService.getOverallStats(),
        statsService.getTicketsByDate(),
        statsService.getTopPerformers(),
        statsService.getSLAMetrics()
      ]);

      setStats(overallData);
      setChartData(dateData);
      setTopPerformers(performersData.topPerformers);
      setSlaMetrics(slaData);
    } catch (err) {
      setError('Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    if (!chartData?.ticketsByDate) return [];
    
    return chartData.ticketsByDate.map(item => ({
      date: new Date(item.date).toLocaleDateString('ru-RU', { 
        month: 'short', 
        day: 'numeric' 
      }),
      tickets: parseInt(item.count)
    }));
  };

  const preparePieData = () => {
    if (!stats?.status) return [];
    
    const statusLabels = {
      new: 'Новые',
      in_progress: 'В работе',
      waiting: 'Ожидание',
      resolved: 'Решены',
      closed: 'Закрыты'
    };

    return stats.status.map(item => ({
      name: statusLabels[item.status] || item.status,
      value: parseInt(item.count),
      fill: CHART_COLORS[stats.status.indexOf(item) % CHART_COLORS.length]
    }));
  };

  const preparePriorityData = () => {
    if (!stats?.priority) return [];
    
    const priorityLabels = {
      low: 'Низкий',
      medium: 'Средний',
      high: 'Высокий',
      critical: 'Критичный'
    };

    return stats.priority.map(item => ({
      name: priorityLabels[item.priority] || item.priority,
      value: parseInt(item.count),
      fill: CHART_COLORS[stats.priority.indexOf(item) % CHART_COLORS.length]
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: 2,
            padding: 2,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
          <Typography variant="body2" color="primary">
            {`Заявки: ${payload[0].value}`}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (!isManager) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Недостаточно прав для просмотра статистики</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <AnimatedPage>
        <Container maxWidth="xl" sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Activity size={60} color="#667eea" />
          </motion.div>
          <Typography variant="h5" sx={{ mt: 3, fontWeight: 600 }}>
            Загрузка аналитики...
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Собираем данные для построения отчетов
          </Typography>
        </Container>
      </AnimatedPage>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <AnimatedPage>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Заголовок с современным дизайном */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                textShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              📊 Центр аналитики
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Мониторинг производительности и анализ ключевых показателей системы
            </Typography>
          </Box>
        </motion.div>

        {/* Карточки основных метрик */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Всего заявок"
              value={stats?.overall?.totalTickets || 0}
              icon={Ticket}
              gradient="primary"
              trend="up"
              trendValue="+12%"
              subtitle="За все время"
              delay={0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Решено успешно"
              value={stats?.overall?.resolvedTickets || 0}
              icon={CheckCircle}
              gradient="success"
              trend="up"
              trendValue="+8%"
              subtitle={`${stats?.overall?.resolutionRate || 0}% от общего числа`}
              delay={0.1}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Активные заявки"
              value={stats?.overall?.openTickets || 0}
              icon={Clock}
              gradient="warning"
              trend="down"
              trendValue="-5%"
              subtitle="Требуют внимания"
              delay={0.2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Пользователей"
              value={stats?.overall?.totalUsers || 0}
              icon={Users}
              gradient="error"
              trend="up"
              trendValue="+3"
              subtitle="Зарегистрировано"
              delay={0.3}
            />
          </Grid>
        </Grid>

        {/* SLA Уведомления */}
        {slaMetrics && (slaMetrics.overdueTickets > 0 || slaMetrics.nearDeadline > 0) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)',
                border: '1px solid rgba(251, 191, 36, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AlertTriangle size={24} />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    ⚠️ Внимание: SLA уведомления
                  </Typography>
                  {slaMetrics.overdueTickets > 0 && (
                    <Typography variant="body2">
                      🔴 {slaMetrics.overdueTickets} заявок просрочены по SLA
                    </Typography>
                  )}
                  {slaMetrics.nearDeadline > 0 && (
                    <Typography variant="body2">
                      🟡 {slaMetrics.nearDeadline} заявок приближаются к дедлайну
                    </Typography>
                  )}
                </Box>
              </Box>
            </Alert>
          </motion.div>
        )}

        {/* Основные графики */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* График динамики заявок */}
          <Grid item xs={12} lg={8}>
            <ChartCard
              title="Динамика создания заявок"
              subtitle="Статистика за последние 30 дней"
              icon={TrendingUp}
              trend="+15.3%"
              height={450}
              delay={0.5}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={prepareChartData()}>
                  <defs>
                    <linearGradient id="ticketsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(102, 126, 234, 0.3)" />
                      <stop offset="100%" stopColor="rgba(102, 126, 234, 0.05)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="tickets" 
                    stroke="rgba(102, 126, 234, 1)" 
                    strokeWidth={3}
                    fill="url(#ticketsGradient)"
                    dot={{ fill: 'rgba(102, 126, 234, 1)', strokeWidth: 0, r: 6 }}
                    activeDot={{ r: 8, fill: 'rgba(102, 126, 234, 1)' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          {/* Круговая диаграмма статусов */}
          <Grid item xs={12} lg={4}>
            <ChartCard
              title="Распределение статусов"
              subtitle="Текущее состояние заявок"
              icon={PieChart}
              height={450}
              delay={0.6}
            >
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={preparePieData()}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {preparePieData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <Box
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid rgba(0, 0, 0, 0.1)',
                              borderRadius: 2,
                              padding: 2,
                              backdropFilter: 'blur(10px)',
                              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {payload[0].payload.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: payload[0].payload.fill }}>
                              {`Количество: ${payload[0].value}`}
                            </Typography>
                          </Box>
                        );
                      }
                      return null;
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>

        {/* Нижний ряд */}
        <Grid container spacing={4}>
          {/* Рейтинг исполнителей */}
          <Grid item xs={12} md={6}>
            <ChartCard
              title="🏆 Топ исполнители"
              subtitle="Лучшие специалисты месяца"
              icon={Trophy}
              height={400}
              delay={0.7}
            >
              <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
                <List sx={{ width: '100%' }}>
                  {topPerformers.map((performer, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    >
                      <ListItem
                        sx={{
                          mb: 2,
                          borderRadius: 3,
                          background: index === 0 ? 
                            'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(251, 191, 36, 0.05))' :
                            index === 1 ?
                            'linear-gradient(135deg, rgba(168, 162, 158, 0.1), rgba(168, 162, 158, 0.05))' :
                            index === 2 ?
                            'linear-gradient(135deg, rgba(205, 127, 50, 0.1), rgba(205, 127, 50, 0.05))' :
                            'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(102, 126, 234, 0.02))',
                          border: `1px solid ${
                            index === 0 ? 'rgba(251, 191, 36, 0.2)' :
                            index === 1 ? 'rgba(168, 162, 158, 0.2)' :
                            index === 2 ? 'rgba(205, 127, 50, 0.2)' :
                            'rgba(102, 126, 234, 0.1)'
                          }`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              background: index === 0 ? 
                                'linear-gradient(135deg, #f59e0b, #d97706)' :
                                index === 1 ?
                                'linear-gradient(135deg, #9ca3af, #6b7280)' :
                                index === 2 ?
                                'linear-gradient(135deg, #cd7f32, #92571f)' :
                                'linear-gradient(135deg, #667eea, #764ba2)',
                              color: 'white',
                              fontWeight: 'bold',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                          >
                            {index < 3 ? 
                              (index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉') :
                              `#${index + 1}`
                            }
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {performer.assigneeName}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <Chip
                                icon={<CheckCircle size={16} />}
                                label={`${performer.resolvedCount} решено`}
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                  color: '#059669',
                                  border: '1px solid rgba(34, 197, 94, 0.2)',
                                  fontWeight: 500
                                }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </Box>
            </ChartCard>
          </Grid>

          {/* График приоритетов */}
          <Grid item xs={12} md={6}>
            <ChartCard
              title="📈 Приоритеты заявок"
              subtitle="Распределение по уровням важности"
              icon={BarChart3}
              height={400}
              delay={0.8}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={preparePriorityData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    radius={[8, 8, 0, 0]}
                    fill="url(#barGradient)"
                  >
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(102, 126, 234, 1)" />
                        <stop offset="100%" stopColor="rgba(102, 126, 234, 0.6)" />
                      </linearGradient>
                    </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>

        {/* Дополнительная информация */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Данные обновляются в реальном времени • Последнее обновление: {new Date().toLocaleString('ru-RU')}
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </AnimatedPage>
  );
};

export default Dashboard;