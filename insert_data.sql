--
-- PostgreSQL database dump
--


-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, "fullName", role, "isActive", "createdAt", "updatedAt", "lastLoginAt") FROM stdin;
24	admin	admin@itsm.com	$2b$10$aEIEZM2BaiGfHb77lptP4eTj9bfHqrJcGx9VgY585BWMnxYLzfBs6	Администратор	manager	t	2025-11-26 14:10:05.208799+03	2025-11-26 14:10:05.208799+03	\N
25	engineer	engineer@itsm.com	$2b$10$5iWi3hklJH0yw4N0SKxd1.nIbz9ZX5mMPpLWumc6L.SjSfgmfiuJi	Инженер	engineer	t	2025-11-26 14:10:05.208799+03	2025-11-26 14:10:05.208799+03	\N
26	user	user@itsm.com	$2b$10$MnjF/OmzPmg7qgpN9VQ3kOLnj1xiHKc8hNiJC.EwTi0en60K.cApS	Пользователь	user	t	2025-11-26 14:10:05.208799+03	2025-11-26 14:10:05.208799+03	\N
30	engineer3	engineer3@itsm.com	$2b$10$sNnhXkbXHRuGUQJHF11wnuhrFLMKahvxM8DYtAsC3.BqlXvWeETha	Мария Сидорова	engineer	t	2025-12-09 12:11:57.256776+03	2025-12-25 10:27:38.506+03	\N
29	engineer2	engineer2@itsm.com	$2b$10$sNnhXkbXHRuGUQJHF11wnuhrFLMKahvxM8DYtAsC3.BqlXvWeETha	Иван Петров	engineer	t	2025-12-09 12:11:57.256776+03	2025-12-25 10:27:46.088+03	\N
32	engineer5	engineer5@itsm.com	$2b$10$sNnhXkbXHRuGUQJHF11wnuhrFLMKahvxM8DYtAsC3.BqlXvWeETha	Елена Морозова	engineer	t	2025-12-09 12:11:57.256776+03	2025-12-25 10:27:51.669+03	\N
31	engineer4	engineer4@itsm.com	$2b$10$sNnhXkbXHRuGUQJHF11wnuhrFLMKahvxM8DYtAsC3.BqlXvWeETha	Дмитрий Козлов	engineer	t	2025-12-09 12:11:57.256776+03	2025-12-25 10:27:57.581+03	\N
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, "userId", action, entity, "entityId", "entityName", "oldValues", "newValues", "ipAddress", "userAgent", details, "createdAt") FROM stdin;
1	24	login	user	24	Администратор	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	Вход в систему: Администратор	2025-12-26 10:32:50.246+03
2	26	login	user	26	Пользователь	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	Вход в систему: Пользователь	2025-12-26 10:33:02.334+03
3	26	create	ticket	42	Переустановка ОС	\N	{"status": "new", "priority": "high"}	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	Создано: Переустановка ОС	2025-12-26 10:34:16.751+03
4	24	login	user	24	Администратор	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	Вход в систему: Администратор	2025-12-26 10:34:24.193+03
5	24	create	ticket	43	Выдача мышки	\N	{"status": "new", "priority": "critical"}	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	Создано: Выдача мышки	2025-12-26 10:41:25.488+03
6	25	login	user	25	Инженер	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	Вход в систему: Инженер	2025-12-26 10:51:34.52+03
7	25	status_change	ticket	43	Выдача мышки	{"status": "new"}	{"status": "resolved"}	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	Статус изменён: new → resolved	2025-12-26 10:51:42.202+03
8	29	login	user	29	Иван Петров	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	Вход в систему: Иван Петров	2025-12-26 10:51:53.067+03
9	30	login	user	30	Мария Сидорова	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	Вход в систему: Мария Сидорова	2025-12-26 10:52:01.823+03
10	30	status_change	ticket	41	Необходим переходник для ноутбука	{"status": "new"}	{"status": "resolved"}	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	Статус изменён: new → resolved	2025-12-26 10:52:07.15+03
11	24	login	user	24	Администратор	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	Вход в систему: Администратор	2025-12-26 10:52:12.986+03
12	24	login	user	24	Администратор	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	Вход в систему: Администратор	2025-12-31 11:04:39.973+03
13	24	login	user	24	Администратор	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	Вход в систему: Администратор	2026-01-01 15:12:48.271+03
14	24	status_change	ticket	43	Выдача мышки	{"status": "resolved"}	{"status": "closed"}	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	Статус изменён: resolved → closed	2026-01-01 15:14:42.87+03
\.


--
-- Data for Name: service_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_categories (id, name, description, "slaTime", "createdAt", "updatedAt") FROM stdin;
1	Аппаратное обеспечение	Проблемы с оборудованием	120	2025-11-26 11:02:05.948865+03	2025-11-26 11:02:05.948865+03
2	Программное обеспечение	Проблемы с ПО	60	2025-11-26 11:02:05.948865+03	2025-11-26 11:02:05.948865+03
3	Сеть и интернет	Проблемы с сетью	90	2025-11-26 11:02:05.948865+03	2025-11-26 11:02:05.948865+03
4	Доступ и права	Запросы доступа	30	2025-11-26 11:02:05.948865+03	2025-11-26 11:02:05.948865+03
5	Электронная почта	Проблемы с почтой	45	2025-11-26 11:02:05.948865+03	2025-11-26 11:02:05.948865+03
\.


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tickets (id, "ticketNumber", title, description, status, priority, "createdAt", "slaDeadline", "resolvedAt", "userId", "initiatorId", "assignedTo", "categoryId", "updatedAt") FROM stdin;
37	TICKET-000037	Предоставить удлинитель	Предоставить удлинитель	closed	low	2025-12-11 11:50:09.314+03	\N	2025-12-12 10:41:54.355+03	25	25	31	1	2025-12-12 10:41:54.356+03
41	TICKET-000041	Необходим переходник для ноутбука	Прошу выдать переходник type-c	resolved	medium	2025-12-26 10:23:57.923+03	\N	2025-12-26 10:52:07.139+03	24	24	30	1	2025-12-26 10:52:07.139+03
43	TICKET-000043	Выдача мышки	Выдача мышки	closed	critical	2025-12-26 10:41:25.477+03	\N	2025-12-26 10:51:42.197+03	24	24	25	1	2026-01-01 15:14:42.862+03
38	TICKET-000038	Прошу предоставить монитор на рабочее место	Прошу предоставить монитор на рабочее место	closed	high	2025-12-12 10:42:50.223+03	\N	2025-12-16 10:30:16.972+03	24	24	32	1	2025-12-16 10:30:19.003+03
36	TICKET-000036	Выдача гарнитуры для удаленной работы	Выдача гарнитуры для удаленной работы	closed	medium	2025-12-11 11:46:15.212+03	\N	2025-12-22 10:23:01.927+03	25	25	31	1	2025-12-22 10:23:03.965+03
29	TICKET-001	Не работает принтер	Принтер не печатает документы	closed	high	2025-11-26 14:11:14.402678+03	2025-11-26 16:11:14.402678+03	2025-12-09 15:17:25.567919+03	26	26	\N	1	2025-12-09 15:17:25.567919+03
34	TICKET-1764247850652	Не работает VPN	Не работает VPN	closed	critical	2025-11-27 15:50:50.660216+03	2025-11-27 16:50:50.652+03	2025-12-09 11:52:36.960803+03	24	24	32	2	2025-12-09 15:25:43.030072+03
33	TICKET-005	Запрос доступа к системе	Нужен доступ к CRM системе	closed	low	2025-11-26 14:11:14.402678+03	2025-11-26 14:41:14.402678+03	2025-12-09 15:34:49.68156+03	26	26	31	4	2025-12-09 16:03:36.158517+03
40	TICKET-000040	Миграция ОС	Миграция ОС до 24H2	resolved	medium	2025-12-23 12:00:31.547+03	\N	2025-12-23 12:27:48.244+03	24	24	31	2	2025-12-24 10:42:50.643+03
39	TICKET-000039	Выдайте монитор	Выдайте монитор	resolved	critical	2025-12-16 10:31:35.072+03	\N	2025-12-24 10:42:56.015+03	24	24	32	1	2025-12-24 10:42:56.015+03
35	TICKET-1765285245766	Сопровождение мероприятия	Сопроводить мероприятие в конференц зале	closed	medium	2025-12-09 16:00:45.773026+03	2025-12-09 17:00:45.766+03	2025-12-09 16:28:49.128261+03	31	31	29	2	2025-12-09 16:28:49.128261+03
30	TICKET-002	Установка Office	Нужен Office 2021	resolved	medium	2025-11-26 14:11:14.402678+03	2025-11-26 15:11:14.402678+03	2025-12-24 10:43:00.109+03	26	26	25	2	2025-12-24 10:43:00.109+03
31	TICKET-003	Нет интернета	Пропал доступ в сеть	resolved	high	2025-11-26 14:11:14.402678+03	2025-11-26 15:41:14.402678+03	2025-12-24 10:43:03.737+03	26	26	\N	3	2025-12-24 10:43:03.737+03
32	TICKET-004	Не открывается почта	Ошибка при входе в Outlook	resolved	medium	2025-11-26 14:11:14.402678+03	2025-11-26 14:56:14.402678+03	2025-12-24 10:43:07.724+03	26	26	\N	5	2025-12-24 10:43:07.724+03
42	TICKET-000042	Переустановка ОС	Переустановка ОС, необходимо установить Windows 11	new	high	2025-12-26 10:34:16.732+03	\N	\N	26	26	31	2	2025-12-26 10:34:16.783+03
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, text, "isInternal", "ticketId", "userId", "createdAt", "updatedAt") FROM stdin;
3	⏸️ ЗАЯВКА ОТЛОЖЕНА\n\n📅 Отложена до: 10 декабря 2025 г. в 16:25\n📋 Причина: По просьбе пользователя\n\n💬 Комментарий: Отложено до начала мероприятия	f	35	31	2025-12-09 16:26:03.776+03	2025-12-09 16:26:03.776+03
4	Необходимо согласование начальника управления	f	37	24	2025-12-12 10:42:21.994+03	2025-12-12 10:42:21.994+03
5	Необходима диагностика	f	40	24	2025-12-23 12:16:56.067+03	2025-12-23 12:16:56.067+03
\.


--
-- Data for Name: equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipment (id, name, type, manufacturer, model, "serialNumber", "inventoryNumber", "qrCode", specifications, status, location, department, "assignedToId", "purchaseDate", "warrantyUntil", "purchasePrice", notes, "ipAddress", "macAddress", "createdAt", "updatedAt") FROM stdin;
1	Тестовый компьютер	computer	Dell	OptiPlex 7090	TEST123456	\N	EQ-1766674430410-NUX64M66G	{}	active	Офис 101	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-25 17:53:50.392+03	2025-12-25 17:53:50.392+03
\.


--
-- Data for Name: equipment_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipment_history (id, "equipmentId", "eventType", description, details, "userId", "ticketId", cost, "createdAt") FROM stdin;
1	1	created	Оборудование "Тестовый компьютер" добавлено в систему	{"type": "computer", "status": "active"}	24	\N	\N	2025-12-25 17:53:50.613+03
\.


--
-- Data for Name: kb_articles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kb_articles (id, title, content, "categoryId", keywords, "authorId", views, "helpfulCount", "notHelpfulCount", "isPublished", "createdAt", "updatedAt") FROM stdin;
8	Проблемы с интернетом	При отсутствии интернета: 1. Проверьте кабель 2. Перезагрузите роутер 3. Проверьте настройки сети 4. Обратитесь в поддержку	3	{интернет,сеть,wifi}	24	3	1	0	t	2025-11-26 14:11:34.238873	2025-11-26 14:11:34.238873
6	Решение проблем с принтером	Если принтер не печатает: 1. Проверьте уровень тонера 2. Проверьте замятие бумаги 3. Перезагрузите принтер 4. Переустановите драйверы	1	{принтер,hp,печать}	24	17	5	0	t	2025-11-26 14:11:34.238873	2025-11-26 14:11:34.238873
7	Установка Microsoft Office	Инструкция по установке Office: 1. Загрузите установщик 2. Запустите от администратора 3. Выберите компоненты 4. Активируйте лицензию	2	{office,microsoft,установка}	24	3	1	0	t	2025-11-26 14:11:34.238873	2025-11-26 14:11:34.238873
\.


--
-- Data for Name: kb_ticket_relations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kb_ticket_relations (id, "articleId", "ticketId", "createdAt") FROM stdin;
\.


--
-- Data for Name: subtasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subtasks (id, title, description, status, "ticketId", "assignedTo", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: time_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.time_logs (id, ticket_id, user_id, date, hours_spent, description, created_at, updated_at) FROM stdin;
1	37	24	2025-12-11	0.50	Работы по заявке #37	2025-12-11 13:41:59.74	2025-12-11 13:41:59.74
3	36	24	2025-12-11	7.90	Работы по заявке #36	2025-12-11 13:45:55.991	2025-12-11 13:45:55.991
4	37	24	2025-12-12	0.50	Работы по заявке #37	2025-12-12 07:42:04.474	2025-12-12 07:42:04.474
5	38	24	2025-12-16	0.50	Работы по заявке #38	2025-12-16 07:30:31.017	2025-12-16 07:30:31.017
\.


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 14, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 5, true);


--
-- Name: equipment_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.equipment_history_id_seq', 1, true);


--
-- Name: equipment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.equipment_id_seq', 1, true);


--
-- Name: kb_articles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kb_articles_id_seq', 8, true);


--
-- Name: kb_ticket_relations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kb_ticket_relations_id_seq', 1, false);


--
-- Name: service_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.service_categories_id_seq', 5, true);


--
-- Name: subtasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subtasks_id_seq', 1, false);


--
-- Name: tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tickets_id_seq', 43, true);


--
-- Name: time_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.time_logs_id_seq', 5, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 32, true);


--
-- PostgreSQL database dump complete
--


