import { Request, Response } from 'express';
import prisma from '../config/db';

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const { approvedOnly } = req.query;

    const whereClause: any = {};
    if (approvedOnly === 'true' || req.headers.authorization === undefined) {
      whereClause.approved = true;
    }

    const testimonials = await prisma.testimonial.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    res.json(testimonials);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving testimonials', error: error.message });
  }
};

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const { name, role, company, content, rating, avatar, approved } = req.body;

    if (!name || !content) {
      return res.status(400).json({ message: 'Name and content are required' });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role: role || 'Client',
        company: company || 'Homeowner',
        content,
        rating: rating !== undefined ? parseInt(rating) : 5,
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        approved: approved === true || approved === 'true', // Allows admins to pre-approve when creating
      },
    });

    res.status(201).json({
      message: 'Testimonial created successfully.',
      testimonial,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating testimonial', error: error.message });
  }
};

export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const exists = await prisma.testimonial.findUnique({ where: { id } });
    if (!exists) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    if (updateData.rating !== undefined) {
      updateData.rating = parseInt(updateData.rating);
    }
    if (updateData.approved !== undefined) {
      updateData.approved = updateData.approved === true || updateData.approved === 'true';
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: updateData,
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating testimonial', error: error.message });
  }
};

export const toggleApproveTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    if (approved === undefined) {
      return res.status(400).json({ message: 'Approved status is required' });
    }

    const testimonialExists = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonialExists) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: { approved: approved === true || approved === 'true' },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating testimonial status', error: error.message });
  }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const testimonialExists = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonialExists) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    await prisma.testimonial.delete({ where: { id } });

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting testimonial', error: error.message });
  }
};
