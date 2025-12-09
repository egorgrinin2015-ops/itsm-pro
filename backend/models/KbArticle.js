module.exports = (sequelize, DataTypes) => {
  const KbArticle = sequelize.define('KbArticle', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'categoryId'
    },
    keywords: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: []
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'authorId'
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    helpfulCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'helpfulCount'
    },
    notHelpfulCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'notHelpfulCount'
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'isPublished'
    }
  }, {
    tableName: 'kb_articles',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  return KbArticle;
};