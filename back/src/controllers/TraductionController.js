import fs from 'fs/promises';
import path from 'path';

const locals = path.join(process.cwd("src/locals"), '');

async function getTranslations(req, res) {
    try {
        const { lang } = req.params;
        const filePath = path.join(process.cwd(), "src/locals", `${lang}.json`);
        const content = await fs.readFile(filePath, 'utf-8');
        res.json(JSON.parse(content));
    } catch (err) {
        res.status(500).json({ message: "Error fetching translations" });
    }
}

// Helper function to set nested object property
function setNestedProperty(obj, path, value) {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key] || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }

    current[keys[keys.length - 1]] = value;
}

async function updateTranslation(req, res) {
    try {
        const { lang } = req.params;
        const { key, value } = req.body;

        if (!key || value === undefined) return res.status(400).json({ message: "Key and value are required" });

        const filePath = path.join(process.cwd(), "src/locals", `${lang}.json`);
        const content = await fs.readFile(filePath, 'utf-8');
        const json = JSON.parse(content);

        setNestedProperty(json, key, value);

        await fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8');

        res.json({ success: true, message: `Clé ${key} mise à jour` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating translation" });
    }
}

async function updateBulkTranslations(req, res) {
    try {
        const { lang } = req.params;
        const { translations } = req.body;

        if (!translations || typeof translations !== 'object') {
            return res.status(400).json({ message: "Translations object is required" });
        }

        const filePath = path.join(process.cwd(), "src/locals", `${lang}.json`);

        await fs.writeFile(filePath, JSON.stringify(translations, null, 2), 'utf-8');

        res.json({ success: true, message: `${lang}.json updated successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating translations" });
    }
}

export { getTranslations, updateTranslation, updateBulkTranslations };