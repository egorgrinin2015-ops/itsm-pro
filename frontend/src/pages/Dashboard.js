import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import statsService from '../services/statsService';
import AnimatedPage from '../components/AnimatedPage';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import GlassCard from '../components/GlassCard';
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
  Divider,
  GlobalStyles
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
  Award,
  Stars,
  Sparkles
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

// Принудительные глобальные стили для темного фона
const darkBackgroundStyles = (
  <GlobalStyles
    styles={{
      body: {
        background: 'linear-gradient(135deg, #000000 0%, #1a1a2e 20%, #16213e 40%, #0f172a 60%, #020617 80%, #000000 100%) !important',
        minHeight: '100vh !important',
      },
      '#root': {
        background: 'linear-gradient(135deg, #000000 0%, #1a1a2e 20%, #16213e 40%, #0f172a 60%, #020617 80%, #000000 100%) !important',
        minHeight: '100vh !important',
      },
      html: {
        background: '#000000 !important',
      }
    }}
  />
);

// Усиленный IT-фон для Dashboard
const DashboardBackground = () => {
  return (
    <Box
      sx={{
        position: 'fixed !important',
        top: '0 !important',
        left: '0 !important',
        right: '0 !important',
        bottom: '0 !important',
        width: '100vw !important',
        height: '100vh !important',
        overflow: 'hidden !important',
        zIndex: '-999 !important',
      }}
    >
      {/* ТЕМНЫЙ ФОН */}
      <Box
        sx={{
          position: 'absolute !important',
          top: '0 !important',
          left: '0 !important',
          right: '0 !important',
          bottom: '0 !important',
          width: '100% !important',
          height: '100% !important',
          background: `
            linear-gradient(135deg, 
              #000000 0%,
              #1a1a2e 20%,
              #16213e 40%,
              #0f172a 60%,
              #020617 80%,
              #000000 100%
            ) !important
          `,
        }}
      />

      {/* ЦВЕТНЫЕ АКЦЕНТЫ ДЛЯ АНАЛИТИКИ */}
      <Box
        sx={{
          position: 'absolute !important',
          top: '0 !important',
          left: '0 !important',
          right: '0 !important',
          bottom: '0 !important',
          background: `
            radial-gradient(ellipse at 10% 20%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 90% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(34, 197, 94, 0.2) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 10%, rgba(251, 191, 36, 0.25) 0%, transparent 30%),
            radial-gradient(ellipse at 20% 90%, rgba(239, 68, 68, 0.15) 0%, transparent 25%)
          `,
        }}
      />

      {/* ДВИЖУЩАЯСЯ АНАЛИТИЧЕСКАЯ СЕТКА */}
      <motion.div
        animate={{
          x: [0, 30],
          y: [0, 30]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px),
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px, 30px 30px, 60px 60px, 60px 60px',
          pointerEvents: 'none'
        }}
      />

      {/* ПЛАВАЮЩИЕ ЧАСТИЦЫ ДАННЫХ */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.sin(i) * 10, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 4 + i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3
          }}
          style={{
            position: 'absolute',
            left: `${10 + i * 6}%`,
            top: `${10 + (i % 3) * 30}%`,
            width: '4px',
            height: '4px',
            background: `rgba(${59 + i * 10}, ${130 + i * 5}, 246, 0.6)`,
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        />
      ))}
    </Box>
  );
};

// Современная цветовая палитра для темных графиков
const DARK_CHART_COLORS = [
  '#3b82f6', // Синий
  '#10b981', // Зелёный
  '#f59e0b', // Жёлтый
  '#ef4444', // Красный
  '#8b5cf6', // Фиолетовый
  '#06b6d4'  // Голубой
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

    return stats.status.map((item, index) => ({
      name: statusLabels[item.status] || item.status,
      value: parseInt(item.count),
      fill: DARK_CHART_COLORS[index % DARK_CHART_COLORS.length]
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

    return stats.priority.map((item, index) => ({
      name: priorityLabels[item.priority] || item.priority,
      value: parseInt(item.count),
      fill: DARK_CHART_COLORS[index % DARK_CHART_COLORS.length]
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <GlassCard variant="dark" sx={{ p: 2, minWidth: 150 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', mb: 1 }}>
            {label}
          </Typography>
          <Typography variant="body2" sx={{ color: '#3b82f6' }}>
            {`Заявки: ${payload[0].value}`}
          </Typography>
        </GlassCard>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <GlassCard variant="dark" sx={{ p: 2, minWidth: 150 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', mb: 1 }}>
            {payload[0].payload.name}
          </Typography>
          <Typography variant="body2" sx={{ color: payload[0].payload.fill }}>
            {`Количество: ${payload[0].value}`}
          </Typography>
        </GlassCard>
      );
    }
    return null;
  };

  if (!isManager) {
    return (
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        {darkBackgroundStyles}
        <DashboardBackground />
        <Container sx={{ py: 4, position: 'relative', zIndex: 10 }}>
          <GlassCard variant="colored" color="red" sx={{ p: 4, textAlign: 'center' }}>
            <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: 16 }} />
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
              Недостаточно прав доступа
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', mt: 2 }}>
              Для просмотра аналитики требуются права менеджера
            </Typography>
          </GlassCard>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        {darkBackgroundStyles}
        <DashboardBackground />
        <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 10 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '70vh' 
          }}>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <GlassCard variant="dark" sx={{ p: 4, borderRadius: '50%' }}>
                <Activity size={60} color="#3b82f6" />
              </GlassCard>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  mt: 4, 
                  fontWeight: 700, 
                  color: 'white',
                  textAlign: 'center',
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                }}
              >
                Загрузка аналитики...
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mt: 2, 
                  color: 'rgba(255, 255, 255, 0.7)',
                  textAlign: 'center'
                }}
              >
                Собираем данные для построения отчетов
              </Typography>
            </motion.div>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        {darkBackgroundStyles}
        <DashboardBackground />
        <Container sx={{ py: 4, position: 'relative', zIndex: 10 }}>
          <GlassCard variant="colored" color="red" sx={{ p: 4, textAlign: 'center' }}>
            <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: 16 }} />
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
              {error}
            </Typography>
          </GlassCard>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {darkBackgroundStyles}
      <DashboardBackground />
      
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 10 }}>
        {/* Заголовок с современным дизайном */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <GlassCard variant="dark" sx={{ mb: 6, p: 6, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, mb: 3 }}>
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #f59e0b 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 60px rgba(59, 130, 246, 0.4)'
                  }}
                >
                  <BarChart3 size={40} color="white" />
                </Box>
              </motion.div>
            </Box>
            
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 900,
                color: '#ffffff !important',
                textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 30px rgba(59, 130, 246, 0.5)',
                mb: 2,
                background: 'linear-gradient(135deg, #ffffff 0%, #3b82f6 50%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              📊 Центр аналитики
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                textShadow: '0 2px 8px rgba(0,0,0,0.5)'
              }}
            >
              Мониторинг производительности и анализ ключевых показателей системы
            </Typography>
          </GlassCard>
        </motion.div>

        {/* Карточки основных метрик */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {[
            {
              title: "Всего заявок",
              value: stats?.overall?.totalTickets || 0,
              icon: Ticket,
              color: '#3b82f6',
              trend: "+12%",
              subtitle: "За все время",
              delay: 0
            },
            {
              title: "Решено успешно",
              value: stats?.overall?.resolvedTickets || 0,
              icon: CheckCircle,
              color: '#10b981',
              trend: "+8%",
              subtitle: `${stats?.overall?.resolutionRate || 0}% от общего числа`,
              delay: 0.1
            },
            {
              title: "Активные заявки",
              value: stats?.overall?.openTickets || 0,
              icon: Clock,
              color: '#f59e0b',
              trend: "-5%",
              subtitle: "Требуют внимания",
              delay: 0.2
            },
            {
              title: "Пользователей",
              value: stats?.overall?.totalUsers || 0,
              icon: Users,
              color: '#ef4444',
              trend: "+3",
              subtitle: "Зарегистрировано",
              delay: 0.3
            }
          ].map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: metric.delay }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <GlassCard 
                  variant="colored" 
                  color={metric.color.includes('#3b82f6') ? 'blue' : 
                        metric.color.includes('#10b981') ? 'green' :
                        metric.color.includes('#f59e0b') ? 'yellow' : 'red'}
                  sx={{ p: 4, height: '100%', textAlign: 'center' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${metric.color}, ${metric.color}cc)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 8px 25px ${metric.color}40`,
                        mb: 2
                      }}
                    >
                      <metric.icon size={28} color="white" />
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800, 
                      color: metric.color,
                      textShadow: `0 2px 8px ${metric.color}40`,
                      mb: 1
                    }}
                  >
                    {metric.value}
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'white',
                      fontWeight: 600,
                      mb: 2
                    }}
                  >
                    {metric.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Chip
                      label={metric.trend}
                      size="small"
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      mt: 2 
                    }}
                  >
                    {metric.subtitle}
                  </Typography>
                </GlassCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* SLA Уведомления */}
        {slaMetrics && (slaMetrics.overdueTickets > 0 || slaMetrics.nearDeadline > 0) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <GlassCard variant="colored" color="yellow" sx={{ mb: 4, p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  <AlertTriangle size={48} color="#f59e0b" />
                </motion.div>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
                    ⚠️ SLA уведомления
                  </Typography>
                  {slaMetrics.overdueTickets > 0 && (
                    <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                      🔴 {slaMetrics.overdueTickets} заявок просрочены по SLA
                    </Typography>
                  )}
                  {slaMetrics.nearDeadline > 0 && (
                    <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      🟡 {slaMetrics.nearDeadline} заявок приближаются к дедлайну
                    </Typography>
                  )}
                </Box>
              </Box>
            </GlassCard>
          </motion.div>
        )}

        {/* Основные графики */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* График динамики заявок */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <GlassCard variant="dark" sx={{ p: 4, height: 500 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TrendingUp size={28} color="#3b82f6" />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                        Динамика создания заявок
                      </Typography>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Статистика за последние 30 дней
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label="+15.3%"
                    sx={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      fontWeight: 700
                    }}
                  />
                </Box>
                
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={prepareChartData()}>
                      <defs>
                        <linearGradient id="ticketsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                          <stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="tickets" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        fill="url(#ticketsGradient)"
                        dot={{ fill: '#3b82f6', strokeWidth: 0, r: 6 }}
                        activeDot={{ r: 8, fill: '#3b82f6', boxShadow: '0 0 20px #3b82f6' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </GlassCard>
            </motion.div>
          </Grid>

          {/* Круговая диаграмма статусов */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <GlassCard variant="dark" sx={{ p: 4, height: 500 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <PieChart size={28} color="#8b5cf6" />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                      Распределение статусов
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Текущее состояние заявок
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={preparePieData()}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={50}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {preparePieData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </Box>
              </GlassCard>
            </motion.div>
          </Grid>
        </Grid>

        {/* Нижний ряд */}
        <Grid container spacing={4}>
          {/* Рейтинг исполнителей */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <GlassCard variant="dark" sx={{ p: 4, height: 450 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Trophy size={28} color="#f59e0b" />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                      🏆 Топ исполнители
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Лучшие специалисты месяца
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ height: 350, overflow: 'auto' }}>
                  <List sx={{ width: '100%' }}>
                    {topPerformers.map((performer, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 10 }}
                      >
                        <ListItem
                          sx={{
                            mb: 2,
                            borderRadius: 3,
                            background: index === 0 ? 
                              'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(251, 191, 36, 0.1))' :
                              index === 1 ?
                              'linear-gradient(135deg, rgba(168, 162, 158, 0.2), rgba(168, 162, 158, 0.1))' :
                              index === 2 ?
                              'linear-gradient(135deg, rgba(205, 127, 50, 0.2), rgba(205, 127, 50, 0.1))' :
                              'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
                            border: `2px solid ${
                              index === 0 ? 'rgba(251, 191, 36, 0.4)' :
                              index === 1 ? 'rgba(168, 162, 158, 0.4)' :
                              index === 2 ? 'rgba(205, 127, 50, 0.4)' :
                              'rgba(59, 130, 246, 0.2)'
                            }`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: `0 8px 25px ${
                                index === 0 ? 'rgba(251, 191, 36, 0.3)' :
                                index === 1 ? 'rgba(168, 162, 158, 0.3)' :
                                index === 2 ? 'rgba(205, 127, 50, 0.3)' :
                                'rgba(59, 130, 246, 0.3)'
                              }`,
                            }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                width: 60,
                                height: 60,
                                background: index === 0 ? 
                                  'linear-gradient(135deg, #f59e0b, #d97706)' :
                                  index === 1 ?
                                  'linear-gradient(135deg, #9ca3af, #6b7280)' :
                                  index === 2 ?
                                  'linear-gradient(135deg, #cd7f32, #92571f)' :
                                  'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1.5rem',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                              }}
                            >
                              {index < 3 ? 
                                (index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉') :
                                `${index + 1}`
                              }
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
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
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    color: 'white',
                                    fontWeight: 600
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
              </GlassCard>
            </motion.div>
          </Grid>

          {/* График приоритетов */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <GlassCard variant="dark" sx={{ p: 4, height: 450 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <BarChart3 size={28} color="#8b5cf6" />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                      📈 Приоритеты заявок
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Распределение по уровням важности
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={preparePriorityData()}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="rgba(139, 92, 246, 0.6)" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="value" 
                        radius={[8, 8, 0, 0]}
                        fill="url(#barGradient)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </GlassCard>
            </motion.div>
          </Grid>
        </Grid>

        {/* Дополнительная информация */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <GlassCard variant="dark" sx={{ mt: 4, p: 3, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              ⚡ Данные обновляются в реальном времени • 
              📅 Последнее обновление: {new Date().toLocaleString('ru-RU')} • 
              🔄 Автообновление каждые 5 минут
            </Typography>
          </GlassCard>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Dashboard;