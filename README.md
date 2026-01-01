# 🚀 ITSM Pro v1.0

**Современная система управления IT-услугами с космическим дизайном "Space Indigo"**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-18+-green)
![React](https://img.shields.io/badge/react-18+-61DAFB)
![PostgreSQL](https://img.shields.io/badge/postgresql-14+-336791)

---

## ✨ Возможности

### 🎫 Управление заявками (Tickets)
- Создание, редактирование, удаление заявок
- Статусы: Новая → В работе → Отложена → Решена → Закрыта
- Приоритеты: Низкий, Средний, Высокий, Критичный
- Автоматическое назначение на наименее загруженного инженера
- Комментарии и история изменений
- Фильтрация и поиск

### 👥 Управление пользователями (Users)
- Роли: Администратор, Менеджер, Инженер, Пользователь
- Блокировка/разблокировка аккаунтов
- Сброс паролей
- Профили пользователей

### 📊 Аналитический дашборд (Dashboard)
- Статистика заявок в реальном времени
- Графики по статусам и приоритетам
- Производительность команды
- SLA мониторинг

### 🖥️ Оборудование и CMDB (Equipment)
- Учёт IT-оборудования (компьютеры, принтеры, серверы и т.д.)
- Статусы: Активно, В ремонте, Списано, На складе
- История изменений оборудования
- Привязка к пользователям
- Инвентарные номера и серийные номера

### 🔧 Управление проблемами (Problem Management)
- ITIL-совместимый процесс
- Связь с инцидентами
- Root Cause Analysis
- Known Errors Database

### 🔄 Управление изменениями (Change Management)
- Запросы на изменения (RFC)
- Процесс согласования
- Оценка рисков
- Планирование внедрения

### ⏱️ Учёт времени (Time Tracking)
- Логирование времени по заявкам
- Отчёты по трудозатратам
- Статистика по инженерам

### 🔐 Аудит и безопасность (Audit)
- Полный журнал действий пользователей
- Отслеживание входов в систему
- История изменений всех сущностей
- Фильтрация по типу действия, пользователю, дате

### 📁 Архив заявок (Archive)
- Хранение закрытых заявок
- Поиск по архиву
- Статистика

---

## 🛠️ Технологии

### Backend
- **Node.js** + Express.js
- **PostgreSQL** + Sequelize ORM
- **JWT** аутентификация
- **bcrypt** хеширование паролей

### Frontend
- **React 18** + React Router
- **Material-UI (MUI) v6**
- **Framer Motion** анимации
- **Recharts** графики
- **Lucide React** иконки

### Дизайн
- **Space Indigo** тема
- Glass-morphism эффекты
- Тёмная цветовая схема
- Адаптивный интерфейс

---

## 🚀 Установка

### Требования
- Node.js 18+
- PostgreSQL 14+
- npm или yarn

### 1. Клонирование репозитория
```bash
git clone https://github.com/egorgrinin2015-ops/itsm-pro.git
cd itsm-pro
```

### 2. Настройка Backend
```bash
cd backend
npm install
```

Создайте файл `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=itsm_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
```

Создайте базу данных:
```bash
psql -U postgres -c "CREATE DATABASE itsm_db;"
```

Запустите сервер:
```bash
npm run dev
```

### 3. Настройка Frontend
```bash
cd frontend
npm install
npm start
```

Приложение откроется на http://localhost:3000

---

## 📦 Структура проекта

```
itsm-pro/
├── backend/
│   ├── controllers/      # Контроллеры API
│   │   ├── authController.js
│   │   ├── ticketController.js
│   │   ├── userController.js
│   │   ├── equipmentController.js
│   │   ├── auditController.js
│   │   └── ...
│   ├── models/           # Sequelize модели
│   │   ├── User.js
│   │   ├── Ticket.js
│   │   ├── Equipment.js
│   │   ├── AuditLog.js
│   │   └── ...
│   ├── routes/           # Express роуты
│   ├── services/         # Бизнес-логика
│   ├── middleware/       # Middleware (auth, etc)
│   └── server.js         # Точка входа
│
├── frontend/
│   ├── src/
│   │   ├── components/   # React компоненты
│   │   ├── pages/        # Страницы
│   │   │   ├── Dashboard.js
│   │   │   ├── Tickets.js
│   │   │   ├── Users.jsx
│   │   │   ├── Equipment.jsx
│   │   │   ├── Audit.jsx
│   │   │   └── ...
│   │   ├── services/     # API сервисы
│   │   ├── context/      # React Context
│   │   └── theme/        # Тема оформления
│   └── public/
│
├── .gitignore
├── README.md
└── insert_data.sql       # Тестовые данные
```

---

## 🔑 Тестовые учётные данные

| Роль | Email | Пароль |
|------|-------|--------|
| Менеджер | admin@test.com | admin123 |
| Инженер | engineer@test.com | engineer123 |
| Пользователь | user@test.com | user123 |

---

## 📸 Скриншоты

### Дашборд
Аналитическая панель с графиками и статистикой

### Заявки
Список заявок с фильтрацией и поиском

### Оборудование
CMDB с учётом всего IT-оборудования

### Аудит
Журнал всех действий в системе

---

## 🎨 Цветовая палитра "Space Indigo"

| Цвет | HEX | Использование |
|------|-----|---------------|
| Primary Dark | `#22223b` | Основной фон |
| Primary | `#4a4e69` | Вторичный фон |
| Accent | `#9a8c98` | Акценты |
| Light | `#c9ada7` | Текст |
| Lightest | `#f2e9e4` | Заголовки |

---

## 📄 API Endpoints

### Аутентификация
- `POST /api/auth/login` - Вход
- `POST /api/auth/register` - Регистрация

### Заявки
- `GET /api/tickets` - Список заявок
- `POST /api/tickets` - Создать заявку
- `PUT /api/tickets/:id` - Обновить заявку
- `DELETE /api/tickets/:id` - Удалить заявку

### Пользователи
- `GET /api/users` - Список пользователей
- `POST /api/users` - Создать пользователя
- `PUT /api/users/:id` - Обновить пользователя

### Оборудование
- `GET /api/equipment` - Список оборудования
- `POST /api/equipment` - Добавить оборудование
- `PUT /api/equipment/:id` - Обновить оборудование

### Аудит
- `GET /api/audit` - Журнал аудита
- `GET /api/audit/stats` - Статистика аудита

---

## 🔮 Планы развития

- [ ] Мобильное приложение
- [ ] Email уведомления
- [ ] Интеграция с Active Directory
- [ ] Telegram бот
- [ ] Отчёты в PDF/Excel
- [ ] Мультиязычность

---

## 👨‍💻 Автор

**Egor Grinin**

- GitHub: [@egorgrinin2015-ops](https://github.com/egorgrinin2015-ops)

---

## 📝 Лицензия

MIT License - свободное использование

---

<p align="center">
  Создано с ❤️ и ☕
</p>
