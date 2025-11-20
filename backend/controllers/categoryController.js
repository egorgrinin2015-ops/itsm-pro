const { ServiceCategory } = require('../models');

// Создание категории
exports.createCategory = async (req, res) => {
  try {
    const { name, description, slaTime } = req.body;
    const userRole = req.user.role;

    // Только менеджеры могут создавать категории
    if (userRole !== 'manager') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }

    const category = await ServiceCategory.create({
      name,
      description,
      slaTime: slaTime || 240 // по умолчанию 4 часа
    });

    res.status(201).json({
      message: 'Категория создана',
      category
    });

  } catch (error) {
    console.error('Ошибка создания категории:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получение всех категорий
exports.getCategories = async (req, res) => {
  try {
    const categories = await ServiceCategory.findAll({
      order: [['name', 'ASC']]
    });

    res.json({ categories });

  } catch (error) {
    console.error('Ошибка получения категорий:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получение одной категории
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await ServiceCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }

    res.json({ category });

  } catch (error) {
    console.error('Ошибка получения категории:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Обновление категории
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, slaTime } = req.body;
    const userRole = req.user.role;

    // Только менеджеры могут обновлять категории
    if (userRole !== 'manager') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }

    const category = await ServiceCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (slaTime) category.slaTime = slaTime;

    await category.save();

    res.json({
      message: 'Категория обновлена',
      category
    });

  } catch (error) {
    console.error('Ошибка обновления категории:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Удаление категории
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    // Только менеджеры могут удалять категории
    if (userRole !== 'manager') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }

    const category = await ServiceCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }

    await category.destroy();

    res.json({ message: 'Категория удалена' });

  } catch (error) {
    console.error('Ошибка удаления категории:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};