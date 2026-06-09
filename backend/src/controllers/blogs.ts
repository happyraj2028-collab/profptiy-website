import { Request, Response } from 'express';
import prisma from '../config/db';

const mapBlogResponse = (blog: any) => {
  if (!blog) return null;
  return {
    ...blog,
    tags: blog.tags ? blog.tags.split(',') : [],
  };
};

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const { tag, limit } = req.query;

    const whereClause: any = {};
    if (tag) {
      whereClause.tags = { contains: String(tag) };
    }

    const blogs = await prisma.blog.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(String(limit)) : undefined,
    });

    res.json(blogs.map(mapBlogResponse));
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving blogs', error: error.message });
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const blog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog article not found' });
    }

    res.json(mapBlogResponse(blog));
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving blog details', error: error.message });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, excerpt, image, slug, tags, authorName } = req.body;

    if (!title || !content || !excerpt || !image || !slug) {
      return res.status(400).json({ message: 'Missing required blog fields' });
    }

    const existingBlog = await prisma.blog.findUnique({ where: { slug } });
    if (existingBlog) {
      return res.status(400).json({ message: 'A blog with this slug already exists' });
    }

    const tagsStr = Array.isArray(tags) ? tags.join(',') : '';

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        excerpt,
        image,
        slug,
        tags: tagsStr,
        authorName: authorName || 'Profptiy Luxury Editor',
      },
    });

    res.status(201).json(mapBlogResponse(blog));
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating blog post', error: error.message });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const blogExists = await prisma.blog.findUnique({ where: { id } });
    if (!blogExists) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (updateData.slug && updateData.slug !== blogExists.slug) {
      const existingSlug = await prisma.blog.findUnique({ where: { slug: updateData.slug } });
      if (existingSlug) {
        return res.status(400).json({ message: 'A blog with this slug already exists' });
      }
    }

    if (updateData.tags !== undefined) {
      updateData.tags = Array.isArray(updateData.tags) ? updateData.tags.join(',') : '';
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: updateData,
    });

    res.json(mapBlogResponse(updatedBlog));
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating blog post', error: error.message });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blogExists = await prisma.blog.findUnique({ where: { id } });
    if (!blogExists) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await prisma.blog.delete({ where: { id } });

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting blog post', error: error.message });
  }
};
