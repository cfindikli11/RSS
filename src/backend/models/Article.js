import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Article = sequelize.define('Article', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    feedId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'feeds',
            key: 'id',
        },
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    summary: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    source: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    publishedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fetchedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    sentiment: {
        type: DataTypes.ENUM('positive', 'neutral', 'negative'),
        allowNull: true,
    },
    aiSummary: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    keywords: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    readingTime: {
        type: DataTypes.INTEGER, // in seconds
        allowNull: true,
    },
    viewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    tableName: 'articles',
    timestamps: true,
    indexes: [
        {
            fields: ['publishedAt'],
        },
        {
            fields: ['category'],
        },
        {
            fields: ['feedId'],
        },
    ],
});

export default Article;
