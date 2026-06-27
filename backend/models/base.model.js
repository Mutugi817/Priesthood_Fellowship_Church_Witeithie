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


// Instantiate Models
const eventModel = new EventModel();
const sermonModel = new SermonModel();
const portfolioModel = new PortfolioModel();
const userModel = new UserModel();

export {eventModel, sermonModel, portfolioModel, userModel}