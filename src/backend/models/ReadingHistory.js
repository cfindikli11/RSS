import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ReadingHistory = sequelize.define('ReadingHistory', {
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
    timeSpent: {
        type: DataTypes.INTEGER, // in seconds
        defaultValue: 0,
    },
    scrollDepth: {
        type: DataTypes.FLOAT, // 0 to 1
        defaultValue: 0,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'reading_history',
    timestamps: true,
    indexes: [
        {
            fields: ['userId', 'createdAt'],
        },
    ],
});

export default ReadingHistory;
