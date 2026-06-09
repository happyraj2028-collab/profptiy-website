import { Request, Response } from 'express';
import prisma from '../config/db';
import { sendInquiryNotification } from '../services/mail';

// Create a new inquiry (Public lead generation)
export const createInquiry = async (req: Request, res: Response) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: 'Name, email, phone, and message are required' });
    }

    let propertyTitle = null;
    let property = null;

    if (propertyId) {
      property = await prisma.property.findUnique({
        where: { id: propertyId },
      });
      if (property) {
        propertyTitle = property.title;
      }
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        propertyId,
        propertyTitle,
        name,
        email,
        phone,
        message,
        status: 'New',
      },
    });

    // Log database in-app notification alert
    await prisma.notification.create({
      data: {
        type: 'LEAD',
        title: 'New Lead Acquired',
        message: `Client ${name} submitted an inquiry for ${propertyTitle || 'General Advisory'}.`,
      },
    }).catch((err) => {
      console.error('Failed to write lead alert to notifications registry:', err);
    });

    // Send instant email notification in background
    sendInquiryNotification(inquiry, property).catch((err) => {
      console.error('Failed to send inquiry email notification:', err);
    });

    res.status(201).json({
      message: 'Inquiry submitted successfully. Our agent will contact you shortly.',
      inquiry,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error submitting inquiry', error: error.message });
  }
};

// Retrieve all inquiries (Admin Only)
export const getInquiries = async (req: Request, res: Response) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(inquiries);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving inquiries', error: error.message });
  }
};

// Update inquiry status (Admin Only: e.g., New -> Contacted -> Resolved)
export const updateInquiryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const inquiryExists = await prisma.inquiry.findUnique({ where: { id } });
    if (!inquiryExists) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: { status },
    });

    res.json(updatedInquiry);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating inquiry status', error: error.message });
  }
};

// Delete inquiry (Admin Only)
export const deleteInquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const inquiryExists = await prisma.inquiry.findUnique({ where: { id } });
    if (!inquiryExists) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    await prisma.inquiry.delete({ where: { id } });

    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting inquiry', error: error.message });
  }
};
