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

const settingsModel = new SettingsModel();

export {settingsModel}