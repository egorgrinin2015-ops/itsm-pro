const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

// Получение всех статей
exports.getArticles = async (req, res) => {
  try {
    const { search, categoryId, published } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        a.*,
        u."fullName" as "authorName",
        c.name as "categoryName"
      FROM kb_articles a
      LEFT JOIN users u ON a."authorId" = u.id
      LEFT JOIN service_categories c ON a."categoryId" = c.id
      WHERE 1=1
    `;
    const replacements = {};

    // Фильтр по публикации
    if (published !== undefined) {
      query += ` AND a."isPublished" = :published`;
      replacements.published = published === 'true';
    }

    // Фильтр по категории
    if (categoryId) {
      query += ` AND a."categoryId" = :categoryId`;
      replacements.categoryId = parseInt(categoryId);
    }

    // Поиск по заголовку и контенту
    if (search && search.trim()) {
      query += ` AND (
        a.title ILIKE :search OR 
        a.content ILIKE :search OR
        :searchTerm = ANY(a.keywords)
      )`;
      replacements.search = `%${search.trim()}%`;
      replacements.searchTerm = search.trim().toLowerCase();
    }

    // COUNT
    const countQuery = query.replace(/SELECT.*?FROM/s, 'SELECT COUNT(*) as total FROM');
    const countResult = await sequelize.query(countQuery, {
      replacements,
      type: QueryTypes.SELECT
    });
    const total = parseInt(countResult[0]?.total || 0);

    // Данные с пагинацией
    query += ` ORDER BY a."createdAt" DESC LIMIT :limit OFFSET :offset`;
    replacements.limit = limit;
    replacements.offset = offset;

    const articles = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT
    });

    res.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Ошибка получения статей:', error);
    res.status(500).json({ 
      message: 'Ошибка получения статей',
      error: error.message 
    });
  }
};

// Получение одной статьи
exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        a.*,
        u."fullName" as "authorName",
        u.email as "authorEmail",
        c.name as "categoryName"
      FROM kb_articles a
      LEFT JOIN users u ON a."authorId" = u.id
      LEFT JOIN service_categories c ON a."categoryId" = c.id
      WHERE a.id = :id
    `;

    const articles = await sequelize.query(query, {
      replacements: { id },
      type: QueryTypes.SELECT
    });

    if (articles.length === 0) {
      return res.status(404).json({ message: 'Статья не найдена' });
    }

    // Увеличиваем счётчик просмотров
    await sequelize.query(
      'UPDATE kb_articles SET views = views + 1 WHERE id = :id',
      { replacements: { id }, type: QueryTypes.UPDATE }
    );

    res.json(articles[0]);
  } catch (error) {
    console.error('Ошибка получения статьи:', error);
    res.status(500).json({ 
      message: 'Ошибка получения статьи',
      error: error.message 
    });
  }
};

// Создание статьи (только менеджеры)
exports.createArticle = async (req, res) => {
  try {
    const { title, content, categoryId, keywords, isPublished } = req.body;
    const authorId = req.user.id;

    if (req.user.role !== 'manager' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }

    if (!title || !content) {
      return res.status(400).json({ 
        message: 'Необходимо указать заголовок и содержание' 
      });
    }

    // Преобразуем keywords в массив если это строка
    let keywordsArray = [];
    if (keywords) {
      if (Array.isArray(keywords)) {
        keywordsArray = keywords;
      } else if (typeof keywords === 'string') {
        keywordsArray = keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k);
      }
    }

    const query = `
      INSERT INTO kb_articles (
        title, content, "categoryId", keywords, "authorId", 
        "isPublished", "createdAt", "updatedAt"
      ) VALUES (
        :title, :content, :categoryId, :keywords, :authorId, 
        :isPublished, NOW(), NOW()
      ) RETURNING *
    `;

    const result = await sequelize.query(query, {
      replacements: {
        title,
        content,
        categoryId: categoryId || null,
        keywords: keywordsArray,
        authorId,
        isPublished: isPublished || false
      },
      type: QueryTypes.INSERT
    });

    res.status(201).json({
      message: 'Статья успешно создана',
      article: result[0][0]
    });
  } catch (error) {
    console.error('Ошибка создания статьи:', error);
    res.status(500).json({ 
      message: 'Ошибка создания статьи',
      error: error.message 
    });
  }
};

// Обновление статьи (только менеджеры)
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.user.role !== 'manager' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }

    const existing = await sequelize.query(
      'SELECT * FROM kb_articles WHERE id = :id',
      { replacements: { id }, type: QueryTypes.SELECT }
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Статья не найдена' });
    }

    const allowedFields = ['title', 'content', 'categoryId', 'keywords', 'isPublished'];
    const updateFields = [];
    const replacements = { id };

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        if (key === 'keywords') {
          // Обработка keywords
          let keywordsArray = [];
          if (Array.isArray(updates[key])) {
            keywordsArray = updates[key];
          } else if (typeof updates[key] === 'string') {
            keywordsArray = updates[key].split(',').map(k => k.trim().toLowerCase()).filter(k => k);
          }
          updateFields.push(`"${key}" = :${key}`);
          replacements[key] = keywordsArray;
        } else {
          updateFields.push(`"${key}" = :${key}`);
          replacements[key] = updates[key];
        }
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'Нет полей для обновления' });
    }

    updateFields.push('"updatedAt" = NOW()');

    const query = `UPDATE kb_articles SET ${updateFields.join(', ')} WHERE id = :id RETURNING *`;

    const result = await sequelize.query(query, {
      replacements,
      type: QueryTypes.UPDATE
    });

    res.json({
      message: 'Статья успешно обновлена',
      article: result[0][0]
    });
  } catch (error) {
    console.error('Ошибка обновления статьи:', error);
    res.status(500).json({ 
      message: 'Ошибка обновления статьи',
      error: error.message 
    });
  }
};

// Удаление статьи (только менеджеры)
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'manager' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }

    const existing = await sequelize.query(
      'SELECT * FROM kb_articles WHERE id = :id',
      { replacements: { id }, type: QueryTypes.SELECT }
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Статья не найдена' });
    }

    await sequelize.query('DELETE FROM kb_articles WHERE id = :id', {
      replacements: { id },
      type: QueryTypes.DELETE
    });

    res.json({ message: 'Статья успешно удалена' });
  } catch (error) {
    console.error('Ошибка удаления статьи:', error);
    res.status(500).json({ 
      message: 'Ошибка удаления статьи',
      error: error.message 
    });
  }
};

// Оценка полезности статьи
exports.rateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { helpful } = req.body; // true или false

    const field = helpful ? 'helpfulCount' : 'notHelpfulCount';

    await sequelize.query(
      `UPDATE kb_articles SET "${field}" = "${field}" + 1 WHERE id = :id`,
      { replacements: { id }, type: QueryTypes.UPDATE }
    );

    res.json({ message: 'Спасибо за оценку!' });
  } catch (error) {
    console.error('Ошибка оценки статьи:', error);
    res.status(500).json({ 
      message: 'Ошибка оценки статьи',
      error: error.message 
    });
  }
};

// Популярные статьи
exports.getPopularArticles = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const query = `
      SELECT 
        a.id, a.title, a.views, 
        c.name as "categoryName"
      FROM kb_articles a
      LEFT JOIN service_categories c ON a."categoryId" = c.id
      WHERE a."isPublished" = true
      ORDER BY a.views DESC
      LIMIT :limit
    `;

    const articles = await sequelize.query(query, {
      replacements: { limit },
      type: QueryTypes.SELECT
    });

    res.json({ articles });
  } catch (error) {
    console.error('Ошибка получения популярных статей:', error);
    res.status(500).json({ 
      message: 'Ошибка получения популярных статей',
      error: error.message 
    });
  }
};

module.exports = {
  getArticles: exports.getArticles,
  getArticleById: exports.getArticleById,
  createArticle: exports.createArticle,
  updateArticle: exports.updateArticle,
  deleteArticle: exports.deleteArticle,
  rateArticle: exports.rateArticle,
  getPopularArticles: exports.getPopularArticles
};