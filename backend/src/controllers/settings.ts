import { Request, Response } from 'express';
import prisma from '../config/db';

// Get all site settings (Public)
export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.setting.findMany();
    // Convert array to a key-value dictionary for easier consumption on frontend
    const settingsMap = settings.reduce((acc: any, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    res.json(settingsMap);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving settings', error: error.message });
  }
};

// Update or create a single setting (Admin Only)
export const updateSetting = async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;

    if (!key) {
      return res.status(400).json({ message: 'Setting key is required' });
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });

    res.json(setting);
  } catch (error: any) {
    res.status(500).json({ message: 'Error saving setting', error: error.message });
  }
};

// Bulk update multiple settings at once (Admin Only)
export const bulkUpdateSettings = async (req: Request, res: Response) => {
  try {
    const { settings } = req.body; // Expecting { "siteName": "Luxury Props", "phone": "+91..." }

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ message: 'Settings object is required' });
    }

    const promises = Object.entries(settings).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    });

    await Promise.all(promises);

    const allSettings = await prisma.setting.findMany();
    const settingsMap = allSettings.reduce((acc: any, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    res.json({ message: 'Settings updated successfully', settings: settingsMap });
  } catch (error: any) {
    res.status(500).json({ message: 'Error bulk updating settings', error: error.message });
  }
};
