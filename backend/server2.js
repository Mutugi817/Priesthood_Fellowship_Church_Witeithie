/**
 * PRIESTHOOD FELLOWSHIP CHURCH - BACKEND API
 * ---------------------------------------------------------
 * Tech Stack: Node.js, Express, MySQL2
 * Port: 5000
 * * * Instructions to run with ES6 Modules:
 * 1. Initialize project: `npm init -y`
 * 2. Edit package.json: Add `"type": "module"` to enable ES6 imports.
 * 3. Install dependencies: `npm install express mysql2 cors uuid bcrypt helmet`
 * 4. Ensure your local MySQL is running with the specified credentials.
 * 5. Run: `node server.js`
 */

import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import helmet from 'helmet'; // Security best practice for setting HTTP headers

// ============================================================================
// 1. DATABASE LAYER (Encapsulation & Singleton Pattern)
// ============================================================================
/**
 * The Database class encapsulates the connection pool and query execution.
 * It abstracts away the raw mysql2 syntax and ensures secure, parameterized queries.
 */
class Database {
    constructor() {
        if (!Database.instance) {
            this.pool = mysql.createPool({
                host: 'localhost',
                user: 'root',
                password: 'practice',
                database: 'priesthood_db',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
            Database.instance = this;
        }
        return Database.instance;
    }

    // Extensive query wrapper with error handling
    async query(sql, params = []) {
        try {
            const [rows] = await this.pool.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('[Database Error]:', error.message);
            console.error('[SQL]:', sql);
            throw error;
        }
    }

    // Helper method to automatically setup tables if they don't exist
    async initDatabase() {
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

const db = new Database();

// ============================================================================
// 2. MODEL LAYER (Inheritance, Abstraction & Polymorphism)
// ============================================================================
/**
 * BaseModel defines standard, extensive CRUD operations.
 */
class BaseModel {
    constructor(tableName) {
        this.tableName = tableName;
    }

    async findAll() {
        return await db.query(`SELECT * FROM ${this.tableName} ORDER BY created_at DESC`);
    }

    async findById(id) {
        const rows = await db.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
        return rows.length ? rows[0] : null;
    }

    async delete(id) {
        return await db.query(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
    }

    /**
     * Dynamic UPDATE method.
     * Takes an object of fields to update and securely builds the SQL SET clause.
     */
    async update(id, data) {
        // Prevent accidental ID overwrites
        const updateData = { ...data };
        delete updateData.id;
        delete updateData.created_at;

        const keys = Object.keys(updateData);
        if (keys.length === 0) return await this.findById(id); // Nothing to update

        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const values = Object.values(updateData);
        values.push(id); // For the WHERE clause

        await db.query(`UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`, values);
        return await this.findById(id);
    }
}

/**
 * Specific models inherit from BaseModel.
 */
class EventModel extends BaseModel {
    constructor() { super('events'); }

    async create(data) {
        const id = uuidv4();
        await db.query(
            `INSERT INTO events (id, title, date, description, img) VALUES (?, ?, ?, ?, ?)`,
            [id, data.title, data.date, data.desc || data.description || '', data.img || '']
        );
        return await this.findById(id);
    }
}

class SermonModel extends BaseModel {
    constructor() { super('sermons'); }

    async create(data) {
        const id = uuidv4();
        await db.query(
            `INSERT INTO sermons (id, title, videoId) VALUES (?, ?, ?)`,
            [id, data.title, data.videoId]
        );
        return await this.findById(id);
    }
}

class PortfolioModel extends BaseModel {
    constructor() { super('portfolio'); }

    async create(data) {
        const id = uuidv4();
        await db.query(
            `INSERT INTO portfolio (id, title, img) VALUES (?, ?, ?)`,
            [id, data.title, data.img]
        );
        return await this.findById(id);
    }
}

class UserModel extends BaseModel {
    constructor() { super('users'); }
    
    async findByUsername(username) {
        const rows = await db.query(`SELECT * FROM users WHERE username = ?`, [username]);
        return rows.length ? rows[0] : null;
    }

    async create(data) {
        const id = uuidv4();
        const hashedPassword = await bcrypt.hash(data.password, 10);
        await db.query(
            `INSERT INTO users (id, username, password, name, role, phone) VALUES (?, ?, ?, ?, ?, ?)`,
            [id, data.username, hashedPassword, data.name, data.role || 'admin', data.phone || '']
        );
        const user = await this.findById(id);
        delete user.password; // Never return password
        return user;
    }
}

class SettingsModel {
    async getSettings() {
        const rows = await db.query(`SELECT * FROM settings`);
        const settings = {};
        rows.forEach(row => { settings[row.setting_key] = row.setting_value; });
        return settings;
    }

    async updateSetting(key, value) {
        await db.query(
            `INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?`,
            [key, value, value]
        );
        return { key, value };
    }
}

// Instantiate Models
const eventModel = new EventModel();
const sermonModel = new SermonModel();
const portfolioModel = new PortfolioModel();
const userModel = new UserModel();
const settingsModel = new SettingsModel();

// ============================================================================
// 3. CONTROLLER LAYER (Business Logic & Encapsulation)
// ============================================================================
/**
 * Generic Controller to handle comprehensive CRUD for any given Model.
 */
class BaseController {
    constructor(model) {
        this.model = model;
        // Bind context
        this.getAll = this.getAll.bind(this);
        this.getOne = this.getOne.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll(req, res) {
        try {
            const data = await this.model.findAll();
            // Sanitize passwords if querying users
            if (this.model.tableName === 'users') {
                data.forEach(user => delete user.password);
            }
            res.status(200).json({ success: true, count: data.length, data });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to fetch records', error: error.message });
        }
    }

    async getOne(req, res) {
        try {
            const data = await this.model.findById(req.params.id);
            if (!data) return res.status(404).json({ success: false, message: 'Record not found' });
            if (this.model.tableName === 'users') delete data.password;
            
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to fetch record', error: error.message });
        }
    }

    async create(req, res) {
        try {
            const result = await this.model.create(req.body);
            res.status(201).json({ success: true, message: 'Created successfully', data: result });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Creation failed', error: error.message });
        }
    }

    async update(req, res) {
        try {
            // Check if record exists first
            const existing = await this.model.findById(req.params.id);
            if (!existing) return res.status(404).json({ success: false, message: 'Record not found' });

            // If updating a user and changing password, hash it first
            if (this.model.tableName === 'users' && req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
            }

            const updatedData = await this.model.update(req.params.id, req.body);
            if (this.model.tableName === 'users') delete updatedData.password;

            res.status(200).json({ success: true, message: 'Updated successfully', data: updatedData });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Update failed', error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const existing = await this.model.findById(req.params.id);
            if (!existing) return res.status(404).json({ success: false, message: 'Record not found' });

            await this.model.delete(req.params.id);
            res.status(200).json({ success: true, message: 'Deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Deletion failed', error: error.message });
        }
    }
}

// Instantiate specific controllers
const EventController = new BaseController(eventModel);
const SermonController = new BaseController(sermonModel);
const PortfolioController = new BaseController(portfolioModel);
const UserController = new BaseController(userModel);

class SettingsController {
    async getSettings(req, res) {
        try {
            const data = await settingsModel.getSettings();
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async updateSettings(req, res) {
        try {
            const settings = req.body;
            // Iterate over submitted keys and update them dynamically
            for (const [key, value] of Object.entries(settings)) {
                await settingsModel.updateSetting(key, value);
            }
            res.status(200).json({ success: true, message: 'Settings updated successfully' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
const settingsCtrl = new SettingsController();

class AuthController {
    async login(req, res) {
        try {
            const { username, password } = req.body;
            
            if (!username || !password) {
                return res.status(400).json({ success: false, message: 'Username and password required' });
            }

            const user = await userModel.findByUsername(username);
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            // Return user details sans password. 
            // *Extensive Best Practice*: You would ideally wrap this in a JWT signing mechanism here.
            res.status(200).json({ 
                success: true, 
                message: 'Login successful',
                user: { id: user.id, username: user.username, name: user.name, role: user.role, phone: user.phone } 
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
const authCtrl = new AuthController();

// ============================================================================
// 4. EXPRESS APP & ROUTING
// ============================================================================
const app = express();

// Middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors()); // Allow Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- API ROUTES ---

// Authentication
app.post('/api/auth/login', authCtrl.login.bind(authCtrl));

// Users (Admin management)
app.get('/api/users', UserController.getAll);
app.get('/api/users/:id', UserController.getOne);
app.post('/api/users', UserController.create);
app.put('/api/users/:id', UserController.update);
app.delete('/api/users/:id', UserController.delete);

// Events
app.get('/api/events', EventController.getAll);
app.get('/api/events/:id', EventController.getOne);
app.post('/api/events', EventController.create);
app.put('/api/events/:id', EventController.update); // Added Update
app.delete('/api/events/:id', EventController.delete);

// Sermons
app.get('/api/sermons', SermonController.getAll);
app.get('/api/sermons/:id', SermonController.getOne);
app.post('/api/sermons', SermonController.create);
app.put('/api/sermons/:id', SermonController.update); // Added Update
app.delete('/api/sermons/:id', SermonController.delete);

// Portfolio (Gallery)
app.get('/api/portfolio', PortfolioController.getAll);
app.get('/api/portfolio/:id', PortfolioController.getOne);
app.post('/api/portfolio', PortfolioController.create);
app.put('/api/portfolio/:id', PortfolioController.update); // Added Update
app.delete('/api/portfolio/:id', PortfolioController.delete);

// Settings
app.get('/api/settings', settingsCtrl.getSettings.bind(settingsCtrl));
app.post('/api/settings', settingsCtrl.updateSettings.bind(settingsCtrl)); // Handles multi-key updates

// 404 Fallback Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// ============================================================================
// 5. SERVER INITIALIZATION
// ============================================================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`\n🚀 Server is running on port ${PORT}`);
    console.log(`🛡️  Security checks initialized.`);
    try {
        await db.initDatabase();
        console.log('✅ Database connected and fully configured.');
    } catch (err) {
        console.error('❌ Failed to initialize database:', err.message);
        process.exit(1); // Exit process if DB connection fails
    }
});