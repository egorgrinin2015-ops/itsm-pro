SET client_encoding = 'UTF8';

TRUNCATE TABLE kb_ticket_relations CASCADE;
TRUNCATE TABLE kb_articles CASCADE;
TRUNCATE TABLE comments CASCADE;
TRUNCATE TABLE tickets CASCADE;
TRUNCATE TABLE service_categories CASCADE;
TRUNCATE TABLE users CASCADE;

INSERT INTO users (username, "fullName", email, password, role, "createdAt", "updatedAt")
VALUES 
  ('admin', 'Администратор', 'admin@test.com', '$2a$10$K9YVkwxQxJ5rJ5rJ5rJ5rOqYvKzYvKzYvKzYvKzYvKzYvKzYvKzYv', 'manager', NOW(), NOW()),
  ('engineer', 'Инженер', 'engineer@test.com', '$2a$10$K9YVkwxQxJ5rJ5rJ5rJ5rOqYvKzYvKzYvKzYvKzYvKzYvKzYvKzYv', 'engineer', NOW(), NOW()),
  ('user', 'Пользователь', 'user@test.com', '$2a$10$K9YVkwxQxJ5rJ5rJ5rJ5rOqYvKzYvKzYvKzYvKzYvKzYvKzYvKzYv', 'user', NOW(), NOW());

INSERT INTO service_categories (id, name, description, "slaTime", "createdAt", "updatedAt")
VALUES 
  (1, 'Аппаратное обеспечение', 'Проблемы с оборудованием', 120, NOW(), NOW()),
  (2, 'Программное обеспечение', 'Проблемы с ПО', 60, NOW(), NOW()),
  (3, 'Сеть и интернет', 'Проблемы с сетью', 90, NOW(), NOW()),
  (4, 'Доступ и права', 'Запросы доступа', 30, NOW(), NOW()),
  (5, 'Электронная почта', 'Проблемы с почтой', 45, NOW(), NOW());

SELECT setval('service_categories_id_seq', 5);

INSERT INTO tickets ("ticketNumber", title, description, status, priority, "userId", "initiatorId", "categoryId", "assignedTo", "createdAt", "updatedAt")
VALUES 
  ('TICKET-001', 'Не работает принтер', 'Принтер не печатает документы', 'new', 'high', 3, 3, 1, NULL, NOW(), NOW()),
  ('TICKET-002', 'Установка Office', 'Нужен Office 2021', 'in_progress', 'medium', 3, 3, 2, 2, NOW(), NOW()),
  ('TICKET-003', 'Нет интернета', 'Пропал доступ в сеть', 'new', 'high', 3, 3, 3, NULL, NOW(), NOW());

INSERT INTO kb_articles (title, content, "categoryId", keywords, "authorId", "isPublished", "createdAt", "updatedAt")
VALUES 
  ('Решение проблем с принтером', 'Проверьте тонер и замятие бумаги', 1, ARRAY['принтер'], 1, true, NOW(), NOW()),
  ('Установка Office', 'Запустите установщик от администратора', 2, ARRAY['office'], 1, true, NOW(), NOW());