import mysql from 'mysql2/promise';
class Database {
    constructor() {
        if(!Database.instance) {
            this.pool = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                waitForConnections: true,
                queueLimit: 0
            })
            Database.instance = this;
            this.initDB();
        }
        return Database.instance;
    }

    async query(sql, params) {
        try {
            const [rows] = await this.pool.execute(sql, params);
            return rows;
        } catch (error) {
            console.error("[Database Error]: ", error.message);
            console.error('[SQL]:', sql);
            throw error;
        }
    }
    // Helper method to automatically setup tables if they don't exist
    async initDB() {
        console.log("Initializing database schema...");
        
        // Users Table
        await this.query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(36) PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(100) NOT NULL,
                role ENUM('admin', 'apostle', 'member') NOT NULL DEFAULT 'member',
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Events Table
        await this.query(`
            CREATE TABLE IF NOT EXISTS events (
                id VARCHAR(36) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                date DATE NOT NULL,
                description TEXT,
                img VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Sermons Table
        await this.query(`
            CREATE TABLE IF NOT EXISTS sermons (
                id VARCHAR(36) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                videoId VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Portfolio Table
        await this.query(`
            CREATE TABLE IF NOT EXISTS portfolio (
                id VARCHAR(36) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                img VARCHAR(500) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Settings Table (Key-Value pair approach for dynamic global settings)
        await this.query(`
            CREATE TABLE IF NOT EXISTS settings (
                setting_key VARCHAR(50) PRIMARY KEY,
                setting_value TEXT NOT NULL
            )
        `);

        // Seed default settings and test accounts if empty
        const users = await this.query(`SELECT id FROM users`);
        if (users.length === 0) {
            const hashedPass = await bcrypt.hash('password', 10);
            await this.query(`INSERT INTO users (id, username, password, name, role) VALUES (?, ?, ?, ?, ?)`, 
                [uuidv4(), 'admin', hashedPass, 'System Admin', 'admin']);
            await this.query(`INSERT INTO users (id, username, password, name, role) VALUES (?, ?, ?, ?, ?)`, 
                [uuidv4(), 'apostle', hashedPass, 'Apostle Consolata', 'apostle']);
            
            await this.query(`INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)`, 
                ['topBarMessage', 'Welcome to Priesthood Fellowship Church, Witeithie Branch. Join us this Sunday!']);
            console.log("Database seeded with default users and settings.");
        }
    }
}

const db = new Database()

export default db;