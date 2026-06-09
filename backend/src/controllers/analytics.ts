import { Request, Response } from 'express';
import prisma from '../config/db';

export const getDashboardAnalytics = async (req: Request, res: Response) => {
  try {
    // 1. Basic counts
    const totalProperties = await prisma.property.count();
    const totalInquiries = await prisma.inquiry.count();
    const totalBlogs = await prisma.blog.count();
    const totalTestimonials = await prisma.testimonial.count();

    // 2. Lead/Inquiry status breakdown
    const newInquiries = await prisma.inquiry.count({ where: { status: 'New' } });
    const contactedInquiries = await prisma.inquiry.count({ where: { status: 'Contacted' } });
    const resolvedInquiries = await prisma.inquiry.count({ where: { status: 'Resolved' } });

    // 3. Property type breakdown
    const propertiesGroup = await prisma.property.groupBy({
      by: ['type'],
      _count: {
        id: true,
      },
    });

    const propertyTypes = propertiesGroup.reduce((acc: any, item) => {
      acc[item.type] = item._count.id;
      return acc;
    }, {});

    // 4. Property status breakdown
    const propertiesStatusGroup = await prisma.property.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const propertyStatuses = propertiesStatusGroup.reduce((acc: any, item) => {
      acc[item.status] = item._count.id;
      return acc;
    }, {});

    // 5. Recent items
    const recentInquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const recentProperties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        price: true,
        type: true,
        status: true,
        city: true,
      },
    });

    res.json({
      summary: {
        properties: totalProperties,
        inquiries: totalInquiries,
        blogs: totalBlogs,
        testimonials: totalTestimonials,
      },
      leadsBreakdown: {
        new: newInquiries,
        contacted: contactedInquiries,
        resolved: resolvedInquiries,
      },
      propertyTypes,
      propertyStatuses,
      recentInquiries,
      recentProperties,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching analytics dashboard data', error: error.message });
  }
};
