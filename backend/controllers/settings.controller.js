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