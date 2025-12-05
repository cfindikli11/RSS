import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Feed = sequelize.define('Feed', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isUrl: true,
        },
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    language: {
        type: DataTypes.STRING,
        defaultValue: 'tr',
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Whether this feed is available to all users by default',
    },
    refreshInterval: {
        type: DataTypes.INTEGER,
        defaultValue: 900000, // 15 minutes
    },
    lastFetched: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    lastSuccess: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    errorCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    lastError: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'feeds',
    timestamps: true,
});

export default Feed;
