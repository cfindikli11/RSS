import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Bookmark = sequelize.define('Bookmark', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'articles',
            key: 'id',
        },
    },
    tags: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    collection: {
        type: DataTypes.STRING,
        defaultValue: 'default',
    },
}, {
    tableName: 'bookmarks',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['userId', 'articleId'],
        },
    ],
});

export default Bookmark;
