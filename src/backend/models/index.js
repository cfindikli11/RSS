import sequelize from '../config/database.js';
import User from './User.js';
import Feed from './Feed.js';
import Article from './Article.js';
import Bookmark from './Bookmark.js';
import ReadingHistory from './ReadingHistory.js';

// Define relationships
Feed.hasMany(Article, {
    foreignKey: 'feedId',
    as: 'articles',
    onDelete: 'CASCADE',
});

Article.belongsTo(Feed, {
    foreignKey: 'feedId',
    as: 'feed',
});

User.hasMany(Bookmark, {
    foreignKey: 'userId',
    as: 'bookmarks',
    onDelete: 'CASCADE',
});

Bookmark.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

Bookmark.belongsTo(Article, {
    foreignKey: 'articleId',
    as: 'article',
});

Article.hasMany(Bookmark, {
    foreignKey: 'articleId',
    as: 'bookmarks',
    onDelete: 'CASCADE',
});

User.hasMany(ReadingHistory, {
    foreignKey: 'userId',
    as: 'readingHistory',
    onDelete: 'CASCADE',
});

ReadingHistory.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

ReadingHistory.belongsTo(Article, {
    foreignKey: 'articleId',
    as: 'article',
});

Article.hasMany(ReadingHistory, {
    foreignKey: 'articleId',
    as: 'readingHistory',
    onDelete: 'CASCADE',
});

export {
    sequelize,
    User,
    Feed,
    Article,
    Bookmark,
    ReadingHistory,
};

export default {
    sequelize,
    User,
    Feed,
    Article,
    Bookmark,
    ReadingHistory,
};
