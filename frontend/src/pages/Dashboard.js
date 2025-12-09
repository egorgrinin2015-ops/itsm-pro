import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import statsService from '../services/statsService';
import AnimatedPage from '../components/AnimatedPage';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import GlassCard from '../components/GlassCard';
import SlaWidget from '../components/SlaWidget';
import theme from '../theme/theme';
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
  Sparkles,
  Folder,
  ArrowUp,
  ArrowDown,
  Star,
  Timer,
  UserCheck,
  MessageCircle,
  ThumbsUp,
  RefreshCw
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

// Глобальные стили с новой палитрой
const darkBackgroundStyles = (
  <GlobalStyles
    styles={{
      body: {
        background: `${theme.gradients.background} !important`,
        minHeight: '100vh !important',
      },
      '#root': {
        background: `${theme.gradients.background} !important`,
        minHeight: '100vh !important',
      },
      html: {
        background: `${theme.background.primary} !important`,
      }
    }}
  />
);

// Фон для Dashboard с новой палитрой
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
      {/* ОСНОВНОЙ ФОН */}
      <Box
        sx={{
          position: 'absolute !important',
          top: '0 !important',
          left: '0 !important',
          right: '0 !important',
          bottom: '0 !important',
          width: '100% !important',
          height: '100% !important',
          background: theme.gradients.background,
        }}
      />

      {/* ЦВЕТНЫЕ АКЦЕНТЫ */}
      <Box
        sx={{
          position: 'absolute !important',
          top: '0 !important',
          left: '0 !important',
          right: '0 !important',
          bottom: '0 !important',
          background: `
            radial-gradient(ellipse at 10% 20%, ${theme.primary.main}40 0%, transparent 50%),
            radial-gradient(ellipse at 90% 80%, ${theme.primary.light}30 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, ${theme.functional.success.main}20 0%, transparent 40%)
          `,
        }}
      />

      {/* ДВИЖУЩАЯСЯ СЕТКА */}
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
            linear-gradient(${theme.border.light} 1px, transparent 1px),
            linear-gradient(90deg, ${theme.border.light} 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
          pointerEvents: 'none'
        }}
      />

      {/* ПЛАВАЮЩИЕ ЧАСТИЦЫ */}
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
            background: theme.primary.main,
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        />
      ))}
    </Box>
  );
};

// Цвета для графиков (яркие для SLA и статусов)
const CHART_COLORS = [
  theme.functional.info.main,
  theme.functional.success.main,
  theme.functional.warning.main,
  theme.functional.error.main,
  theme.primary.main,
  theme.primary.light
];

const Dashboard = () => {
  const { isManager } = useAuth();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [topPerformers, setTopPerformers] = useState([]);
  const [slaMetrics, setSlaMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Новые данные для дополнительных виджетов
  const [categoryStats, setCategoryStats] = useState([]);
  const [qualityMetrics, setQualityMetrics] = useState(null);
  const [teamStats, setTeamStats] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);

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
      
      // Загрузка дополнительных данных (пока моки)
      loadCategoryStats();
      loadQualityMetrics();
      loadTeamStats();
      loadHeatmapData();
    } catch (err) {
      setError('Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  };
  
  // Функции для загрузки дополнительных данных (моки, пока нет API)
  const loadCategoryStats = () => {
    const mockCategories = [
      { name: 'Аппаратное обеспечение', count: 45, trend: 'up', percent: 35, color: theme.functional.info.main },
      { name: 'Программное обеспечение', count: 38, trend: 'down', percent: 30, color: theme.functional.success.main },
      { name: 'Сеть', count: 25, trend: 'up', percent: 20, color: theme.functional.warning.main },
      { name: 'Доступ', count: 12, trend: 'neutral', percent: 10, color: theme.primary.main },
      { name: 'Другое', count: 8, trend: 'down', percent: 5, color: theme.functional.error.main }
    ];
    setCategoryStats(mockCategories);
  };
  
  const loadQualityMetrics = () => {
    const mockQuality = {
      averageRating: 4.7,
      customerSatisfaction: 92,
      firstResponseTime: 15, // минуты
      repeatTicketRate: 8, // процент
      resolutionQuality: 95
    };
    setQualityMetrics(mockQuality);
  };
  
  const loadTeamStats = () => {
    const mockTeam = [
      { name: 'Администратор Системы', active: 5, avgResponse: 12, workload: 85, status: 'online' },
      { name: 'Иван Инженеров', active: 3, avgResponse: 18, workload: 60, status: 'online' },
      { name: 'Мария Техник', active: 7, avgResponse: 9, workload: 95, status: 'online' },
      { name: 'Петр Поддержкин', active: 2, avgResponse: 25, workload: 40, status: 'away' }
    ];
    setTeamStats(mockTeam);
  };
  
  const loadHeatmapData = () => {
    // Генерация данных за последний месяц
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const intensity = Math.floor(Math.random() * 20) + 1; // 1-20 заявок
      days.push({
        date: date,
        count: intensity,
        day: date.getDate(),
        weekday: date.getDay()
      });
    }
    setHeatmapData(days);
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
      fill: CHART_COLORS[index % CHART_COLORS.length]
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
      fill: CHART_COLORS[index % CHART_COLORS.length]
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            p: 2,
            minWidth: 150,
            borderRadius: 3,
            background: theme.glass.dark.background,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${theme.border.main}`,
            boxShadow: theme.glass.dark.shadow
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.text.primary, mb: 1 }}>
            {label}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.primary.main }}>
            {`Заявки: ${payload[0].value}`}
          </Typography>
        </Box>
      );
    }
    return null;
  };

const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            p: 2,
            minWidth: 150,
            borderRadius: 3,
            background: theme.glass.dark.background,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${theme.border.main}`,
            boxShadow: theme.glass.dark.shadow
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.text.primary, mb: 1 }}>
            {payload[0].payload.name}
          </Typography>
          <Typography variant="body2" sx={{ color: payload[0].payload.fill }}>
            {`Количество: ${payload[0].value}`}
          </Typography>
        </Box>
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
          <GlassCard variant="dark" sx={{ p: 4, textAlign: 'center', border: `1px solid ${theme.functional.error.border}` }}>
            <AlertTriangle size={48} color={theme.functional.error.main} style={{ marginBottom: 16 }} />
            <Typography variant="h5" sx={{ color: theme.text.primary, fontWeight: 700 }}>
              Недостаточно прав доступа
            </Typography>
            <Typography sx={{ color: theme.text.secondary, mt: 2 }}>
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
                <Activity size={60} color={theme.primary.main} />
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
                  color: theme.text.primary,
                  textAlign: 'center'
                }}
              >
                Загрузка аналитики...
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mt: 2, 
                  color: theme.text.secondary,
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
          <GlassCard variant="dark" sx={{ p: 4, textAlign: 'center', border: `1px solid ${theme.functional.error.border}` }}>
            <AlertTriangle size={48} color={theme.functional.error.main} style={{ marginBottom: 16 }} />
            <Typography variant="h5" sx={{ color: theme.text.primary, fontWeight: 700 }}>
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
      
      <Container maxWidth="xl" sx={{ py: 4, px: 2, position: 'relative', zIndex: 10 }}>
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
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 20px 60px rgba(139, 92, 246, 0.4)'
  }}
>
  <TrendingUp size={40} color="white" />
</Box>
              </motion.div>
            </Box>
            
            <Typography
  variant="h3"
  sx={{
    fontWeight: 900,
    color: '#ffffff',
    textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 30px rgba(139, 92, 246, 0.5)',
    mb: 1,
    background: 'linear-gradient(135deg, #ffffff 0%, #8b5cf6 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  }}
>
  Центр аналитики
</Typography>
            
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
  Мониторинг производительности и анализ ключевых показателей системы
</Typography>
          </GlassCard>
        </motion.div>

        {/* Карточки основных метрик */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Grid container spacing={4} sx={{ maxWidth: '1400px' }}>
            {[
              {
                title: "Всего заявок",
                value: stats?.overall?.totalTickets || 0,
                icon: Ticket,
                color: theme.functional.info.main,
                trend: "+12%",
                subtitle: "За все время",
                delay: 0
              },
              {
                title: "Решено успешно",
                value: stats?.overall?.resolvedTickets || 0,
                icon: CheckCircle,
                color: theme.functional.success.main,
                trend: "+8%",
                subtitle: `${stats?.overall?.resolutionRate || 0}% от общего числа`,
                delay: 0.1
              },
              {
                title: "Активные заявки",
                value: stats?.overall?.openTickets || 0,
                icon: Clock,
                color: theme.functional.warning.main,
                trend: "-5%",
                subtitle: "Требуют внимания",
                delay: 0.2
              },
              {
                title: "Пользователей",
                value: stats?.overall?.totalUsers || 0,
                icon: Users,
                color: theme.functional.error.main,
                trend: "+3",
                subtitle: "Зарегистрировано",
                delay: 0.3
              }
            ].map((metric, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: metric.delay }}
                  whileHover={{ scale: 1.05, y: -10 }}
                >
                  <Box
                    sx={{
                      p: 4,
                      height: '100%',
                      textAlign: 'center',
                      borderRadius: 3,
                      background: theme.background.secondary,
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${metric.color}40`,
                      boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px ${metric.color}20`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: `0 12px 40px rgba(0, 0, 0, 0.5), 0 0 30px ${metric.color}30`,
                        border: `1px solid ${metric.color}60`,
                      }
                    }}
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
                        <metric.icon size={28} color={theme.text.primary} />
                      </Box>
                    </Box>
                    
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 800, 
                        color: theme.text.primary,
                        textShadow: `0 2px 8px ${metric.color}60`,
                        mb: 1
                      }}
                    >
                      {metric.value}
                    </Typography>
                    
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: theme.text.primary,
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
                          background: theme.background.elevated,
                          backdropFilter: 'blur(10px)',
                          color: theme.text.primary,
                          fontWeight: 600,
                          border: `1px solid ${theme.border.light}`
                        }}
                      />
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.text.secondary,
                        mt: 2 
                      }}
                    >
{metric.subtitle}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* SLA Уведомления */}
        {slaMetrics && (slaMetrics.overdueTickets > 0 || slaMetrics.nearDeadline > 0) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <GlassCard variant="dark" sx={{ mb: 4, p: 4, border: `1px solid ${theme.functional.warning.border}` }}>
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
                  <AlertTriangle size={48} color={theme.functional.warning.main} />
                </motion.div>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: theme.text.primary, mb: 2 }}>
                    ⚠️ SLA уведомления
                  </Typography>
                  {slaMetrics.overdueTickets > 0 && (
                    <Typography variant="h6" sx={{ color: theme.text.primary, mb: 1 }}>
                      🔴 {slaMetrics.overdueTickets} заявок просрочены по SLA
                    </Typography>
                  )}
                  {slaMetrics.nearDeadline > 0 && (
                    <Typography variant="h6" sx={{ color: theme.text.primary }}>
                      🟡 {slaMetrics.nearDeadline} заявок приближаются к дедлайну
                    </Typography>
                  )}
                </Box>
              </Box>
            </GlassCard>
          </motion.div>
        )}

        {/* Основные графики - 4 ВИДЖЕТА В ОДИН РЯД */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {/* График динамики заявок */}
          <Grid size={{ xs: 12, sm: 3, md: 3, lg: 3 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <GlassCard variant="dark" sx={{ p: 3, height: 500 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TrendingUp size={28} color={theme.functional.info.main} />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: theme.text.primary }}>
                        Динамика
                      </Typography>
                      <Typography sx={{ color: theme.text.secondary, fontSize: '0.85rem' }}>
                        Последние 30 дней
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label="+15.3%"
                    sx={{
                      background: `linear-gradient(135deg, ${theme.functional.success.main}, ${theme.functional.success.main}dd)`,
                      color: theme.text.primary,
                      fontWeight: 700,
                      boxShadow: `0 4px 12px ${theme.functional.success.main}30`
                    }}
                  />
                </Box>
                
                <Box sx={{ height: 380 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={prepareChartData()}>
                      <defs>
                        <linearGradient id="ticketsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={`${theme.functional.info.main}66`} />
                          <stop offset="100%" stopColor={`${theme.functional.info.main}0D`} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.border.light} />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: theme.text.secondary }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: theme.text.secondary }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="tickets" 
                        stroke={theme.functional.info.main}
                        strokeWidth={3}
                        fill="url(#ticketsGradient)"
                        dot={{ fill: theme.functional.info.main, strokeWidth: 0, r: 6 }}
                        activeDot={{ r: 8, fill: theme.functional.info.main }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </GlassCard>
            </motion.div>
          </Grid>

          {/* Круговая диаграмма статусов */}
          <Grid size={{ xs: 12, sm: 3, md: 3, lg: 3 }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <GlassCard variant="dark" sx={{ p: 3, height: 500 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <PieChart size={28} color={theme.primary.main} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: theme.text.primary }}>
                      Статусы
                    </Typography>
                    <Typography sx={{ color: theme.text.secondary, fontSize: '0.85rem' }}>
                      Текущее состояние
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ height: 380 }}>
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

          {/* График приоритетов */}
          <Grid size={{ xs: 12, sm: 3, md: 3, lg: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <GlassCard variant="dark" sx={{ p: 3, height: 500 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <BarChart3 size={28} color={theme.primary.main} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: theme.text.primary }}>
                      Приоритеты
                    </Typography>
                    <Typography sx={{ color: theme.text.secondary, fontSize: '0.85rem' }}>
                      По важности
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ height: 380 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={preparePriorityData()}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={theme.primary.main} />
                          <stop offset="100%" stopColor={`${theme.primary.main}99`} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.border.light} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: theme.text.secondary }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: theme.text.secondary }}
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

          {/* Топ исполнители */}
          <Grid size={{ xs: 12, sm: 3, md: 3, lg: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <GlassCard variant="dark" sx={{ p: 3, height: 500 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Trophy size={28} color={theme.functional.warning.main} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: theme.text.primary }}>
                      Топ
                    </Typography>
                    <Typography sx={{ color: theme.text.secondary, fontSize: '0.85rem' }}>
                      Лучшие месяца
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ height: 380, overflow: 'auto' }}>
                  <List sx={{ width: '100%' }}>
                    {topPerformers.map((performer, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 10 }}
                      >
                        <ListItem
                          sx={{
                            mb: 2,
                            borderRadius: 3,
                            background: index === 0 ? 
                              `linear-gradient(135deg, ${theme.functional.warning.main}33, ${theme.functional.warning.main}1A)` :
                              index === 1 ?
                              `linear-gradient(135deg, ${theme.text.secondary}33, ${theme.text.secondary}1A)` :
                              index === 2 ?
                              'linear-gradient(135deg, rgba(205, 127, 50, 0.2), rgba(205, 127, 50, 0.1))' :
                              theme.background.secondary,
                            backdropFilter: 'blur(10px)',
                            border: `2px solid ${
                              index === 0 ? theme.functional.warning.border :
                              index === 1 ? theme.border.main :
                              index === 2 ? 'rgba(205, 127, 50, 0.4)' :
                              theme.border.light
                            }`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: `0 8px 25px ${
                                index === 0 ? theme.functional.warning.main :
                                index === 1 ? theme.text.secondary :
                                index === 2 ? 'rgba(205, 127, 50, 0.3)' :
                                theme.primary.main
                              }30`,
                            }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                width: 50,
                                height: 50,
                                background: index === 0 ? 
                                  `linear-gradient(135deg, ${theme.functional.warning.main}, ${theme.functional.warning.main}CC)` :
                                  index === 1 ?
                                  `linear-gradient(135deg, ${theme.text.secondary}, ${theme.border.main})` :
                                  index === 2 ?
                                  'linear-gradient(135deg, #cd7f32, #92571f)' :
                                  theme.gradients.primary,
                                color: theme.text.primary,
                                fontWeight: 'bold',
                                fontSize: '1.2rem',
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
                              <Typography variant="body1" sx={{ fontWeight: 700, color: theme.text.primary, fontSize: '0.9rem' }}>
                                {performer.assigneeName}
                              </Typography>
                            }
                            secondary={
                              <Chip
                                icon={<CheckCircle size={14} />}
                                label={`${performer.resolvedCount} решено`}
                                size="small"
                                sx={{
                                  background: `linear-gradient(135deg, ${theme.functional.success.main}, ${theme.functional.success.main}DD)`,
                                  color: theme.text.primary,
                                  fontWeight: 600,
                                  mt: 0.5,
                                  height: '20px',
                                  fontSize: '0.7rem'
                                }}
                              />
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
        </Grid>
{/* ВТОРОЙ РЯД: Дополнительная аналитика - 4 ВИДЖЕТА */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {/* 1. По категориям */}
          <Grid size={{ xs: 12, sm: 3, md: 3, lg: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <GlassCard variant="dark" sx={{ p: 3, height: 500 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Folder size={28} color={theme.functional.info.main} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: theme.text.primary }}>
                      Категории
                    </Typography>
                    <Typography sx={{ color: theme.text.secondary, fontSize: '0.85rem' }}>
                      ТОП-5 типов
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ height: 410, overflow: 'auto' }}>
                  {categoryStats.map((category, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <Box
                        sx={{
                          mb: 2.5,
                          p: 2,
                          borderRadius: 3,
                          background: theme.background.secondary,
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${category.color}30`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            border: `1px solid ${category.color}60`,
                            boxShadow: `0 4px 20px ${category.color}20`
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.text.primary, fontSize: '0.85rem' }}>
                            {category.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {category.trend === 'up' ? (
                              <ArrowUp size={14} color={theme.functional.success.main} />
                            ) : category.trend === 'down' ? (
                              <ArrowDown size={14} color={theme.functional.error.main} />
                            ) : null}
                            <Typography variant="h6" sx={{ fontWeight: 800, color: category.color, fontSize: '1rem' }}>
                              {category.count}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ mb: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={category.percent}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: theme.background.elevated,
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: category.color,
                                borderRadius: 3,
                                boxShadow: `0 0 10px ${category.color}60`
                              }
                            }}
                          />
                        </Box>
                        
                        <Typography variant="caption" sx={{ color: theme.text.secondary, fontSize: '0.7rem' }}>
                          {category.percent}% от всех заявок
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </GlassCard>
            </motion.div>
          </Grid>

          {/* 2. Календарь активности */}
          <Grid size={{ xs: 12, sm: 3, md: 3, lg: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <GlassCard variant="dark" sx={{ p: 3, height: 500 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Calendar size={28} color={theme.functional.success.main} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: theme.text.primary }}>
                    Активность
                    </Typography>
                    <Typography sx={{ color: theme.text.secondary, fontSize: '0.85rem' }}>
                      30 дней
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ height: 410 }}>
                  {/* Дни недели */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                    {['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map((day, index) => (
                      <Typography
                        key={index}
                        variant="caption"
                        sx={{
                          color: theme.text.disabled,
                          fontWeight: 600,
                          width: '32px',
                          textAlign: 'center',
                          fontSize: '0.7rem'
                        }}
                      >
                        {day}
                      </Typography>
                    ))}
                  </Box>
                  
                  {/* Heatmap grid */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(7, 1fr)',
                      gap: 0.8,
                      maxHeight: '340px',
                      overflow: 'auto'
                    }}
                  >
                    {heatmapData.map((item, index) => {
                      const intensity = Math.min(item.count / 20, 1);
                      const color = intensity > 0.7 ? theme.functional.error.main : 
                                   intensity > 0.4 ? theme.functional.warning.main : 
                                   intensity > 0.2 ? theme.functional.success.main : 
                                   theme.functional.info.main;
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 1 + index * 0.01 }}
                          whileHover={{ scale: 1.2 }}
                        >
                          <Box
                            sx={{
                              width: '32px',
                              height: '32px',
                              borderRadius: 1.5,
                              background: `${color}${Math.floor(intensity * 100).toString(16).padStart(2, '0')}`,
                              border: `1px solid ${color}40`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                border: `2px solid ${color}`,
                                boxShadow: `0 4px 15px ${color}40`
                              }
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: theme.text.primary,
                                fontWeight: 600,
                                fontSize: '0.65rem'
                              }}
                            >
                              {item.day}
                            </Typography>
                          </Box>
                        </motion.div>
                      );
                    })}
                  </Box>
                  
                  {/* Легенда */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2.5, justifyContent: 'center' }}>
                    <Typography variant="caption" sx={{ color: theme.text.secondary, fontSize: '0.7rem' }}>
                      Меньше
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {[theme.functional.info.main, theme.functional.success.main, theme.functional.warning.main, theme.functional.error.main].map((color, i) => (
                        <Box
                          key={i}
                          sx={{
                            width: 14,
                            height: 14,
                            borderRadius: 1,
                            backgroundColor: color,
                            border: `1px solid ${color}60`
                          }}
                        />
                      ))}
                    </Box>
                    <Typography variant="caption" sx={{ color: theme.text.secondary, fontSize: '0.7rem' }}>
                      Больше
                    </Typography>
                  </Box>
                </Box>
              </GlassCard>
            </motion.div>
          </Grid>

          {/* 3. Качество работы */}
          <Grid size={{ xs: 12, sm: 3, md: 3, lg: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <GlassCard variant="dark" sx={{ p: 3, height: 500 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Star size={28} color={theme.functional.warning.main} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: theme.text.primary }}>
                    Качество
                    </Typography>
                    <Typography sx={{ color: theme.text.secondary, fontSize: '0.85rem' }}>
                      Показатели
                    </Typography>
                  </Box>
                </Box>
                
                {qualityMetrics && (
                  <Box sx={{ height: 410 }}>
                    {/* Средняя оценка */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Box
                          sx={{
                            width: 90,
                            height: 90,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${theme.functional.warning.main}, ${theme.functional.warning.main}DD)`,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            boxShadow: `0 8px 30px ${theme.functional.warning.main}40`,
                            mb: 1.5
                          }}
                        >
                          <Typography variant="h3" sx={{ fontWeight: 800, color: theme.text.primary, fontSize: '2rem' }}>
                            {qualityMetrics.averageRating}
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.text.primary, fontSize: '0.7rem' }}>
                            из 5
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: theme.text.primary, fontWeight: 600, fontSize: '0.85rem' }}>
                          Средняя оценка
                        </Typography>
                      </Box>
                    </motion.div>
                    
                    {/* Метрики */}
                    {[
                      { label: 'Удовлетворенность', value: qualityMetrics.customerSatisfaction, suffix: '%', color: theme.functional.success.main, icon: ThumbsUp },
                      { label: 'Первый ответ', value: qualityMetrics.firstResponseTime, suffix: ' мин', color: theme.functional.info.main, icon: Timer },
                      { label: 'Повторные', value: qualityMetrics.repeatTicketRate, suffix: '%', color: theme.functional.error.main, icon: RefreshCw },
                      { label: 'Качество', value: qualityMetrics.resolutionQuality, suffix: '%', color: theme.primary.main, icon: CheckCircle }
                    ].map((metric, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.3 + index * 0.1 }}
                      >
                        <Box
                          sx={{
                            mb: 2,
                            p: 1.5,
                            borderRadius: 2,
                            background: theme.background.secondary,
                            border: `1px solid ${metric.color}30`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              border: `1px solid ${metric.color}60`,
                              boxShadow: `0 4px 15px ${metric.color}20`
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 30,
                                height: 30,
                                borderRadius: 1.5,
                                background: `${metric.color}30`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <metric.icon size={16} color={metric.color} />
                            </Box>
                            <Typography variant="body2" sx={{ color: theme.text.primary, fontSize: '0.8rem' }}>
                              {metric.label}
                            </Typography>
                          </Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: metric.color,
                              textShadow: `0 0 10px ${metric.color}40`,
                              fontSize: '0.95rem'
                            }}
                          >
                            {metric.value}{metric.suffix}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                )}
              </GlassCard>
            </motion.div>
          </Grid>

          {/* 4. Команда */}
          <Grid size={{ xs: 12, sm: 3, md: 3, lg: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <GlassCard variant="dark" sx={{ p: 3, height: 500 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <UserCheck size={28} color={theme.primary.main} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: theme.text.primary }}>
                    Команда
                    </Typography>
                    <Typography sx={{ color: theme.text.secondary, fontSize: '0.85rem' }}>
                      Специалисты
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ height: 410, overflow: 'auto' }}>
                  {teamStats.map((member, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 1.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Box
                        sx={{
                          mb: 2,
                          p: 2,
                          borderRadius: 2.5,
                          background: theme.background.secondary,
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${member.status === 'online' ? theme.functional.success.border : theme.functional.warning.border}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            border: `1px solid ${member.status === 'online' ? theme.functional.success.main : theme.functional.warning.main}60`,
                            boxShadow: `0 4px 20px ${member.status === 'online' ? theme.functional.success.main : theme.functional.warning.main}20`
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                          <Box sx={{ position: 'relative' }}>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                background: theme.gradients.primary,
                                border: `2px solid ${theme.border.main}`,
                                fontSize: '0.9rem'
                              }}
                            >
                              {member.name.charAt(0)}
                            </Avatar>
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: -2,
                                right: -2,
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: member.status === 'online' ? theme.functional.success.main : theme.functional.warning.main,
                                border: `2px solid ${theme.background.primary}`,
                                boxShadow: `0 0 8px ${member.status === 'online' ? theme.functional.success.main : theme.functional.warning.main}`
                              }}
                            />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: theme.text.primary, fontSize: '0.8rem' }}>
                              {member.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: theme.text.secondary, fontSize: '0.7rem' }}>
                              {member.status === 'online' ? '🟢 Онлайн' : '🟡 Отошел'}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
                          <Chip
                            label={`${member.active} активных`}
                            size="small"
                            sx={{
                              background: theme.functional.info.bg,
                              color: theme.functional.info.main,
                              border: `1px solid ${theme.functional.info.border}`,
                              fontSize: '0.65rem',
                              height: '20px'
                            }}
                          />
                          <Chip
                            label={`${member.avgResponse} мин`}
                            size="small"
                            sx={{
                              background: theme.functional.success.bg,
                              color: theme.functional.success.main,
                              border: `1px solid ${theme.functional.success.border}`,
                              fontSize: '0.65rem',
                              height: '20px'
                            }}
                          />
                        </Box>
                        
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ color: theme.text.secondary, fontSize: '0.7rem' }}>
                              Загрузка
                            </Typography>
                            <Typography variant="caption" sx={{ color: theme.text.primary, fontWeight: 600, fontSize: '0.7rem' }}>
                              {member.workload}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={member.workload}
                            sx={{
                              height: 5,
                              borderRadius: 2.5,
                              backgroundColor: theme.background.elevated,
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: member.workload > 80 ? theme.functional.error.main : 
                                               member.workload > 60 ? theme.functional.warning.main : 
                                               theme.functional.success.main,
                                borderRadius: 2.5,
                                boxShadow: `0 0 8px ${
                                  member.workload > 80 ? theme.functional.error.main : 
                                  member.workload > 60 ? theme.functional.warning.main : 
                                  theme.functional.success.main
                                }60`
                              }
                            }}
                          />
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </GlassCard>
            </motion.div>
          </Grid>
        </Grid>
  {/* ТРЕТИЙ РЯД: SLA ВИДЖЕТ */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <GlassCard variant="dark" sx={{ mb: 4, p: 3 }}>
            <SlaWidget />
          </GlassCard>
        </motion.div>

        {/* Дополнительная информация */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <GlassCard variant="dark" sx={{ mt: 4, p: 3, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: theme.text.secondary }}>
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