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