/**
 * Priesthood Fellowship Church (Witeithie Branch) - Backend API (MySQL Production-Ready with Advanced Controls)
 * 
 * RUN INSTRUCTIONS:
 * 1. Initialize project: `npm init -y`
 * 2. Install dependencies: `npm install express cors jsonwebtoken bcryptjs dotenv mysql2 multer`
 * 3. Set your MySQL configuration in a .env file:
 *    MYSQL_URL=mysql://root:password@localhost:3306/pfc_witeithie
 * 4. Run the server: `node server.js`
 */

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Environment Variables Configuration
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'pfc-witeithie-super-secret-key-2026';
const JWT_EXPIRES_IN = '24h';

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// Ensure dynamic uploads folder exists
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Serve uploads folder statically so frontend can access the uploaded hero images
app.use('/uploads', express.static(uploadDir));

// Multer Storage Configuration for dynamic image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow only image uploads
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

// ============================================================================
// DATABASE CONNECTION POOL SETUP
// ============================================================================

let pool;

async function connectDatabase() {
  try {
    const config = process.env.MYSQL_URL || {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'pfc_witeithie',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      waitForConnections: true,
      connectionLimit: 15,
      queueLimit: 0
    };

    pool = typeof config === 'string' ? mysql.createPool(config) : mysql.createPool(config);

    console.log('🔌 Securely initialized MySQL Connection Pool.');
    await initializeDatabase();
  } catch (err) {
    console.error('❌ MySQL Initialization Error:', err.message);
    process.exit(1);
  }
}

// ============================================================================
// SCHEMA & DATABASE INITIALIZATION (MIGRATED & EXPANDED FOR DYNAMIC CORE)
// ============================================================================

async function initializeDatabase() {
  const connection = await pool.getConnection();
  try {
    // 1. Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'head', 'treasurer', 'clerk', 'member') DEFAULT 'member',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Notices Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        message TEXT NOT NULL,
        active BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Sermons Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sermons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        preacher VARCHAR(255) NOT NULL,
        date VARCHAR(100) NOT NULL,
        duration VARCHAR(100) NOT NULL,
        link VARCHAR(255) DEFAULT '#',
        tags TEXT, -- Stored as JSON string
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Events Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date DATETIME NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. Contact Messages Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        \`read\` BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 6. Giving Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS giving (
        id INT AUTO_INCREMENT PRIMARY KEY,
        memberName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        purpose ENUM('Tithe', 'Thanksgiving', 'Building Fund', 'Offertory', 'General Ministry') NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 7. Prayer Requests Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS prayer_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        memberName VARCHAR(255) NOT NULL,
        request TEXT NOT NULL,
        status ENUM('Pending', 'Prayed For', 'Answered') DEFAULT 'Pending',
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 8. New: Hero Slides Table (Dynamic Hero Section)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS hero_slides (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(500) NOT NULL,
        imageUrl VARCHAR(500) NOT NULL,
        active BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 9. New: System Settings Config Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS system_configs (
        \`key\` VARCHAR(100) PRIMARY KEY,
        \`value\` TEXT NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('📋 All SQL relational tables verified/created successfully.');
    await seedDatabase(connection);

  } catch (error) {
    console.error('⚠️ Could not complete schema builds:', error.message);
  } finally {
    connection.release();
  }
}

// Seed Database Helper Function
async function seedDatabase(connection) {
  try {
    // Seed default administrative roles
    const rolesToSeed = [
      { name: 'System Admin', email: 'admin@pfc.org', role: 'admin' },
      { name: 'Head Pastor', email: 'head@pfc.org', role: 'head' },
      { name: 'Church Treasurer', email: 'treasurer@pfc.org', role: 'treasurer' },
      { name: 'Church Clerk', email: 'clerk@pfc.org', role: 'clerk' },
      { name: 'General Member', email: 'member@pfc.org', role: 'member' }
    ];

    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    for (const r of rolesToSeed) {
      const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [r.email]);
      if (existing.length === 0) {
        await connection.query(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          [r.name, r.email, defaultPassword, r.role]
        );
        console.log(`👤 Seeded role: ${r.role} (${r.email})`);
      }
    }

    // Seed System configs (If not exists)
    const [configs] = await connection.query('SELECT COUNT(*) as count FROM system_configs');
    if (configs[0].count === 0) {
      const defaultConfigs = [
        ['till_number', '5023910'],
        ['cooperative_bank_acc', '01129384910239'],
        ['church_phone', '+254 (0) 723 000 000'],
        ['church_email', 'info@pfcwiteithie.org'],
        ['office_hours_tuesday', 'Tuesday Office Hours: 7:00 AM — 10:00 AM'],
        ['location_desc', 'Witeithie, along Thika Super Highway, Juja District']
      ];
      await connection.query('INSERT INTO system_configs (\`key\`, \`value\`) VALUES ?', [defaultConfigs]);
      console.log('⚙️ Seeded system configurations.');
    }

    // Seed Hero Slides
    const [slides] = await connection.query('SELECT COUNT(*) as count FROM hero_slides');
    if (slides[0].count === 0) {
      const defaultSlides = [
        ['Walk in Devotion', 'Sunday Early Service starts 7:00 AM — 9:00 AM', 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1600&q=80'],
        ['Join the Family Service', 'Sunday Second Service 9:00 AM — 1:30 PM', 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=1600&q=80'],
        ['Wednesday Fellowship', 'Midweek Spiritual Recharge from 5:00 PM', 'https://images.unsplash.com/photo-1445445290350-18a3b86e0b5b?auto=format&fit=crop&w=1600&q=80']
      ];
      await connection.query('INSERT INTO hero_slides (title, subtitle, imageUrl) VALUES ?', [defaultSlides]);
      console.log('🖼️ Seeded dynamic initial hero slides.');
    }

    // Seed Notices
    const [notices] = await connection.query('SELECT COUNT(*) as count FROM notices');
    if (notices[0].count === 0) {
      const initialNotices = [
        ["Sunday 1st Service begins at 7:00 AM sharp. Join us for morning devotion!"],
        ["Registration for the upcoming youth crossover night is now officially open."],
        ["Special prayer request forms can now be managed directly from your Member dashboard."]
      ];
      await connection.query('INSERT INTO notices (message) VALUES ?', [initialNotices]);
      console.log('📢 Seeded initial Notices slider.');
    }

    // Seed Events
    const [events] = await connection.query('SELECT COUNT(*) as count FROM events');
    if (events[0].count === 0) {
      await connection.query(
        'INSERT INTO events (title, date, location, description) VALUES (?, ?, ?, ?)',
        ["Special Monthly Kesha", new Date("2026-07-03T21:00:00Z"), "Main Sanctuary", "Our powerful first Friday of the month night vigil service."]
      );
      await connection.query(
        'INSERT INTO events (title, date, location, description) VALUES (?, ?, ?, ?)',
        ["Midweek Fellowship", new Date("2026-06-24T17:00:00Z"), "Sanctuary Annex", "Deep interactive study of scriptures and community prayers."]
      );
      console.log('📅 Seeded initial Events.');
    }

    // Seed Sermons
    const [sermons] = await connection.query('SELECT COUNT(*) as count FROM sermons');
    if (sermons[0].count === 0) {
      await connection.query(
        'INSERT INTO sermons (title, preacher, date, duration, link, tags) VALUES (?, ?, ?, ?, ?, ?)',
        ["The Sovereign Covenant", "Head Pastor", "2026-06-14", "45 mins", "#", JSON.stringify(["Faith", "Kingdom"])]
      );
      await connection.query(
        'INSERT INTO sermons (title, preacher, date, duration, link, tags) VALUES (?, ?, ?, ?, ?, ?)',
        ["Sowing in Hope, Reaping in Joy", "Rev. Dr. James", "2026-06-07", "50 mins", "#", JSON.stringify(["Hope", "Abundance"])]
      );
      console.log('📖 Seeded initial Sermons.');
    }

  } catch (err) {
    console.error('⚠️ Database seeding encountered issues:', err.message);
  }
}

// Helper to sanitize database rows to support both MongoDB compatibility keys (`_id`) and SQL keys (`id`)
function sanitizeRecord(record) {
  if (!record) return null;
  const sanitized = { ...record };
  sanitized._id = record.id;
  
  if (sanitized.hasOwnProperty('tags') && typeof sanitized.tags === 'string') {
    try {
      sanitized.tags = JSON.parse(sanitized.tags);
    } catch (e) {
      sanitized.tags = [];
    }
  }
  return sanitized;
}

function sanitizeRecords(records) {
  return records.map(sanitizeRecord);
}

// ============================================================================
// MIDDLEWARE: AUTHENTICATION & MASTER ROLE OVERRIDE
// ============================================================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access Denied. Access Token Missing.' });

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired credentials session.' });
    req.user = decodedUser;
    next();
  });
};

// Modified: If req.user.role is 'admin', they bypass restriction loops and gain absolute command.
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: 'Access Denied: Unregistered session context.' });
    }
    
    // Admin Master Override permission logic
    if (req.user.role === 'admin' || allowedRoles.includes(req.user.role)) {
      return next();
    }
    
    return res.status(403).json({ message: 'Access Denied: Restricted Church Action.' });
  };
};

// ============================================================================
// CONTROLLERS & ROUTES
// ============================================================================

// Register Members
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Required validation fields missing.' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'This email account is already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'member']
    );

    res.status(201).json({ message: 'Church registration successful. Please log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
});

// Login Members and Staff
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid church email credentials.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid church email credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Internal Server Error: ', error);
    res.status(500).json({ message: 'Internal Server Error during session handshake.', error: error.message });
  }
});

// Get Self Info
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, role, createdAt FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User database record missing.' });
    }
    res.json({ user: sanitizeRecord(users[0]) });
  } catch (error) {
    res.status(500).json({ message: 'Server context validation failure.' });
  }
});

// ============================================================================
// DYNAMIC HOME CONFIGURATIONS & HERO SLIDES APIS (NEW / ENHANCED)
// ============================================================================

// Get Dynamic System Configurations
app.get('/api/configs', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM system_configs');
    const configsMap = {};
    rows.forEach(r => {
      configsMap[r.key] = r.value;
    });
    res.json(configsMap);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dynamic website settings.' });
  }
});

// Update System Configuration (Master Admin privilege)
app.put('/api/admin/configs', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ message: 'Config key and value must be supplied.' });
    }
    await pool.query(
      'INSERT INTO system_configs (\`key\`, \`value\`) VALUES (?, ?) ON DUPLICATE KEY UPDATE \`value\` = ?',
      [key, value, value]
    );
    res.json({ message: `System setting "${key}" updated successfully.` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update configuration parameter.' });
  }
});

// Get Dynamic Hero Slides
app.get('/api/slides', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM hero_slides WHERE active = TRUE ORDER BY id ASC');
    res.json(sanitizeRecords(rows));
  } catch (err) {
    res.status(500).json({ message: 'Failed to sync background slider slides.' });
  }
});

// Add New Dynamic Slide (Allows File Upload for imageUrl)
app.post('/api/admin/slides', authenticateToken, requireRole(['clerk', 'admin']), upload.single('heroImage'), async (req, res) => {
  try {
    const { title, subtitle, imageUrl } = req.body;
    let finalImageUrl = imageUrl || '';
    
    // If local file was uploaded via multi-part form
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    if (!title || !subtitle || !finalImageUrl) {
      return res.status(400).json({ message: 'Title, subtitle, and an image asset are required.' });
    }

    const [result] = await pool.query(
      'INSERT INTO hero_slides (title, subtitle, imageUrl) VALUES (?, ?, ?)',
      [title, subtitle, finalImageUrl]
    );

    res.status(201).json({ 
      message: 'Dynamic hero slide created.', 
      slide: { id: result.insertId, _id: result.insertId, title, subtitle, imageUrl: finalImageUrl, active: true } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to record slider configuration.', error: err.message });
  }
});

// Disable/Toggle Slide Action
app.put('/api/admin/slides/:id/toggle', authenticateToken, requireRole(['clerk', 'admin']), async (req, res) => {
  try {
    const { active } = req.body;
    await pool.query('UPDATE hero_slides SET active = ? WHERE id = ?', [active, req.params.id]);
    res.json({ message: 'Slider display setting modified.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to modify slider layout.' });
  }
});

// Delete Slide completely
app.delete('/api/admin/slides/:id', authenticateToken, requireRole(['clerk', 'admin']), async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM hero_slides WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Slide record not found.' });
    }
    res.json({ message: 'Hero slide removed from storage systems.' });
  } catch (err) {
    res.status(500).json({ message: 'Slide extraction failure.' });
  }
});

// ============================================================================
// SYSTEM GENERAL ADMIN & USER REGULATION (NEW / ENHANCED)
// ============================================================================

// Get All Platform Users
app.get('/api/admin/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role, createdAt FROM users ORDER BY createdAt DESC');
    res.json(sanitizeRecords(rows));
  } catch (err) {
    res.status(500).json({ message: 'Failed to load system user directories.' });
  }
});

// Update Role assignment (Admin exclusive control)
app.put('/api/admin/users/:id/role', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['admin', 'head', 'treasurer', 'clerk', 'member'];
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role configuration selected.' });
    }

    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    res.json({ message: `Access tier changed successfully to ${role}.` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to change user access privileges.' });
  }
});

// Delete User / Ban user
app.delete('/api/admin/users/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    if (parseInt(req.params.id, 10) === req.user.id) {
      return res.status(400).json({ message: 'Self-destruction safety mechanism triggered. Cannot delete self.' });
    }
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'Member profile removed securely from ecclesiastical registries.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to purge user record.' });
  }
});

// Get Contact message logs
app.get('/api/admin/contacts', authenticateToken, requireRole(['head', 'admin']), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY createdAt DESC');
    res.json(sanitizeRecords(rows));
  } catch (err) {
    res.status(500).json({ message: 'Could not access message files.' });
  }
});

// Toggle message read state
app.put('/api/admin/contacts/:id/read', authenticateToken, requireRole(['head', 'admin']), async (req, res) => {
  try {
    const { read } = req.body;
    await pool.query('UPDATE contact_messages SET \`read\` = ? WHERE id = ?', [read, req.params.id]);
    res.json({ message: 'Message filing status updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Filing changes failed.' });
  }
});

// ============================================================================
// PUBLIC RESOURCES APIS
// ============================================================================

app.get('/api/notices', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM notices WHERE active = TRUE ORDER BY createdAt DESC');
    res.json(sanitizeRecords(rows));
  } catch (err) {
    res.status(500).json({ message: 'Failed to synchronize live church notices slider.' });
  }
});

app.get('/api/sermons', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sermons ORDER BY createdAt DESC');
    res.json(sanitizeRecords(rows));
  } catch (err) {
    res.status(500).json({ message: 'Failed to access sermon archives.' });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events ORDER BY date ASC');
    res.json(sanitizeRecords(rows));
  } catch (err) {
    res.status(500).json({ message: 'Failed to synchronize liturgical events.' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All form submission fields are requested.' });
    }
    await pool.query(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );
    res.status(201).json({ message: 'Message securely submitted. The secretariat will follow up with you.' });
  } catch (err) {
    res.status(500).json({ message: 'Secretariat communication server failed.' });
  }
});

// ============================================================================
// PORTALS: ACTIONS & DATA APIS
// ============================================================================

// --- CLERK PORTAL ---
app.post('/api/clerk/events', authenticateToken, requireRole(['clerk', 'admin']), async (req, res) => {
  try {
    const { title, date, location, description, image } = req.body;
    const [result] = await pool.query(
      'INSERT INTO events (title, date, location, description, image) VALUES (?, ?, ?, ?, ?)',
      [title, new Date(date), location, description, image]
    );
    
    const newEvent = { id: result.insertId, _id: result.insertId, title, date, location, description, image };
    res.status(201).json({ message: 'Church calendar event successfully added.', newEvent });
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Failed to record event.' });
  }
});

app.post('/api/clerk/sermons', authenticateToken, requireRole(['clerk', 'admin']), async (req, res) => {
  try {
    const { title, preacher, date, duration, link, tags, video } = req.body;
    const stringifiedTags = Array.isArray(tags) ? JSON.stringify(tags) : JSON.stringify([]);
    const [result] = await pool.query(
      'INSERT INTO sermons (title, preacher, date, duration, link, tags, video) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, preacher, date, duration, link || '#', stringifiedTags, video]
    );

    const newSermon = { id: result.insertId, _id: result.insertId, title, preacher, date, duration, link, tags, video };
    res.status(201).json({ message: 'New sermon archived successfully.', newSermon });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to archive sermon.' });
  }
});

app.post('/api/clerk/notices', authenticateToken, requireRole(['clerk', 'admin']), async (req, res) => {
  try {
    const { message } = req.body;
    const [result] = await pool.query(
      'INSERT INTO notices (message) VALUES (?)',
      [message]
    );
    
    const newNotice = { id: result.insertId, _id: result.insertId, message, active: true };
    res.status(201).json({ message: 'Top slide announcement slider updated.', newNotice });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update announcements.' });
  }
});

// --- TREASURER PORTAL ---
app.get('/api/treasurer/giving', authenticateToken, requireRole(['treasurer', 'admin']), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM giving ORDER BY date DESC');
    res.json(sanitizeRecords(rows));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch financial audit trail.' });
  }
});

app.post('/api/treasurer/giving', authenticateToken, requireRole(['treasurer', 'admin']), async (req, res) => {
  try {
    const { memberName, email, amount, purpose } = req.body;
    const [result] = await pool.query(
      'INSERT INTO giving (memberName, email, amount, purpose) VALUES (?, ?, ?, ?)',
      [memberName, email, amount, purpose]
    );

    const log = { id: result.insertId, _id: result.insertId, memberName, email, amount, purpose, date: new Date() };
    res.status(201).json({ message: 'Giving transaction recorded successfully.', log });
  } catch (err) {
    res.status(500).json({ message: 'Financial ledger entry failed.' });
  }
});

// --- MEMBER PORTAL ---
app.post('/api/member/prayer', authenticateToken, requireRole(['member', 'admin']), async (req, res) => {
  try {
    const { request } = req.body;
    const [users] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User record missing.' });
    }

    const [result] = await pool.query(
      'INSERT INTO prayer_requests (memberName, request) VALUES (?, ?)',
      [users[0].name, request]
    );

    const newRequest = { id: result.insertId, _id: result.insertId, memberName: users[0].name, request, status: 'Pending', date: new Date() };
    res.status(201).json({ message: 'Prayer request placed on altar. Intercessory team is notified.', newRequest });
  } catch (err) {
    res.status(500).json({ message: 'Failed to register prayer request.' });
  }
});

app.get('/api/member/giving', authenticateToken, requireRole(['member', 'admin']), async (req, res) => {
  try {
    const [users] = await pool.query('SELECT email FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User record missing.' });
    }

    const [rows] = await pool.query('SELECT * FROM giving WHERE email = ? ORDER BY date DESC', [users[0].email]);
    res.json(sanitizeRecords(rows));
  } catch (err) {
    res.status(500).json({ message: 'Failed to load personal tithe receipts.' });
  }
});

// --- HEAD PASTOR PORTAL ---
app.get('/api/pastor/prayers', authenticateToken, requireRole(['head', 'admin']), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM prayer_requests ORDER BY date DESC');
    res.json(sanitizeRecords(rows));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pastoral prayer book.' });
  }
});

app.post('/api/pastor/prayers/:id/intercede', authenticateToken, requireRole(['head', 'admin']), async (req, res) => {
  try {
    const { status } = req.body;
    const [result] = await pool.query(
      'UPDATE prayer_requests SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Prayer request record not found.' });
    }

    res.json({ message: 'Altar petition status updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Petitions system updates failed.' });
  }
});

// --- ADMIN STATS ---
app.get('/api/admin/metrics', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const [userQuery] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [messageQuery] = await pool.query('SELECT COUNT(*) as count FROM contact_messages');
    const [sermonQuery] = await pool.query('SELECT COUNT(*) as count FROM sermons');
    const [eventQuery] = await pool.query('SELECT COUNT(*) as count FROM events');

    res.json({
      metrics: {
        totalRegisteredMembers: userQuery[0].count,
        unreadInteractions: messageQuery[0].count,
        archivedSermons: sermonQuery[0].count,
        upcomingEvents: eventQuery[0].count
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Metrics reporting subsystem error.' });
  }
});

// ============================================================================
// SERVER INITIALIZATION
// ============================================================================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Ecclesiastical server execution fault.', error: err.message });
});

// Start listening and initialize relational DB
app.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(`⛪ PFC Witeithie Branch Production Backend On Port ${PORT}`);
  console.log(`Mode: MySQL Secured Database Engine`);
  console.log(`=======================================================`);
  await connectDatabase();
});