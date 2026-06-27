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

export {authCtrl}