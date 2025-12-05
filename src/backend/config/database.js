import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure data directory exists
const dataDir = join(__dirname, '../../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Database configuration
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DATABASE_URL?.replace('sqlite://', '') || join(dataDir, 'rss.db'),
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
        timestamps: true,
        underscored: true,
    },
});

// Test connection
export async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
        return true;
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        return false;
    }
}

// Sync database (create tables)
export async function syncDatabase(options = {}) {
    try {
        await sequelize.sync(options);
        console.log('✅ Database synchronized successfully.');
        return true;
    } catch (error) {
        console.error('❌ Database synchronization failed:', error);
        return false;
    }
}

export default sequelize;
