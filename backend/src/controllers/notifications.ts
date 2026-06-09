import { Request, Response } from 'express';
import prisma from '../config/db';

// Retrieve all notifications (Admin Only)
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50, // Keep list clean
    });
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving notifications registry', error: error.message });
  }
};

// Mark a single notification as read (Admin Only)
export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const exists = await prisma.notification.findUnique({ where: { id } });
    if (!exists) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating notification status', error: error.message });
  }
};

// Mark all notifications as read (Admin Only)
export const markAllNotificationsRead = async (req: Request, res: Response) => {
  try {
    await prisma.notification.updateMany({
      where: { read: false },
      data: { read: true },
    });
    res.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating notifications status', error: error.message });
  }
};

// Delete a notification record (Admin Only)
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const exists = await prisma.notification.findUnique({ where: { id } });
    if (!exists) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await prisma.notification.delete({ where: { id } });

    res.json({ message: 'Notification cleared from registry' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
};
