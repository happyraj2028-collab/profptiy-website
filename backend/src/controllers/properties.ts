import { Request, Response } from 'express';
import prisma from '../config/db';

// Helper to map DB string representation to frontend array representation
const mapPropertyResponse = (prop: any) => {
  if (!prop) return null;
  return {
    ...prop,
    images: prop.images ? prop.images.split(',') : [],
    amenities: prop.amenities ? prop.amenities.split(',') : [],
    nearby: prop.nearby ? JSON.parse(prop.nearby) : null,
  };
};

// Get properties with advanced search filters
export const getProperties = async (req: Request, res: Response) => {
  try {
    const {
      keyword,
      type,
      status,
      city,
      area,
      priceMin,
      priceMax,
      bedrooms,
      bathrooms,
      featured,
      limit,
    } = req.query;

    const whereClause: any = {};

    if (keyword) {
      whereClause.OR = [
        { title: { contains: String(keyword) } },
        { description: { contains: String(keyword) } },
      ];
    }

    if (type) {
      whereClause.type = { equals: String(type) };
    }
    if (status) {
      whereClause.status = { equals: String(status) };
    }
    if (city) {
      whereClause.city = { equals: String(city) };
    }
    if (area) {
      whereClause.area = { equals: String(area) };
    }

    if (priceMin || priceMax) {
      whereClause.price = {};
      if (priceMin) {
        whereClause.price.gte = parseFloat(String(priceMin));
      }
      if (priceMax) {
        whereClause.price.lte = parseFloat(String(priceMax));
      }
    }

    if (bedrooms) {
      whereClause.bedrooms = { gte: parseInt(String(bedrooms)) };
    }
    if (bathrooms) {
      whereClause.bathrooms = { gte: parseInt(String(bathrooms)) };
    }

    if (featured !== undefined) {
      whereClause.featured = featured === 'true';
    }

    const properties = await prisma.property.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(String(limit)) : undefined,
    });

    res.json(properties.map(mapPropertyResponse));
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving properties', error: error.message });
  }
};

// Get single property details
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(mapPropertyResponse(property));
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving property details', error: error.message });
  }
};

// Create a new property listing (Admin/Agent)
export const createProperty = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      price,
      type,
      status,
      city,
      area,
      address,
      bedrooms,
      bathrooms,
      sqft,
      featured,
      images,
      videoUrl,
      latitude,
      longitude,
      amenities,
      nearby,
      agentName,
      agentEmail,
      agentPhone,
      agentImage,
    } = req.body;

    if (!title || !price || !type || !status || !city || !area || !address) {
      return res.status(400).json({ message: 'Missing required property information fields' });
    }

    // Convert arrays/objects to strings for SQLite storage
    const imagesStr = Array.isArray(images) ? images.join(',') : '';
    const amenitiesStr = Array.isArray(amenities) ? amenities.join(',') : '';
    const nearbyStr = nearby ? JSON.stringify(nearby) : null;

    const property = await prisma.property.create({
      data: {
        title,
        description: description || '',
        price: parseFloat(price),
        type,
        status,
        city,
        area,
        address,
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
        sqft: parseInt(sqft) || 0,
        featured: featured === true || featured === 'true',
        images: imagesStr,
        videoUrl,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        amenities: amenitiesStr,
        nearby: nearbyStr,
        agentName: agentName || 'Profptiy Luxury Real Estate',
        agentEmail: agentEmail || 'info@profptiy.com',
        agentPhone: agentPhone || '+91 99999 99999',
        agentImage: agentImage || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      },
    });

    res.status(201).json(mapPropertyResponse(property));
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating property listing', error: error.message });
  }
};

// Update an existing property listing (Admin/Agent)
export const updateProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const propertyExists = await prisma.property.findUnique({ where: { id } });
    if (!propertyExists) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Cast properties correctly if passed
    if (updateData.price !== undefined) updateData.price = parseFloat(updateData.price);
    if (updateData.bedrooms !== undefined) updateData.bedrooms = parseInt(updateData.bedrooms);
    if (updateData.bathrooms !== undefined) updateData.bathrooms = parseInt(updateData.bathrooms);
    if (updateData.sqft !== undefined) updateData.sqft = parseInt(updateData.sqft);
    if (updateData.latitude !== undefined) updateData.latitude = updateData.latitude ? parseFloat(updateData.latitude) : null;
    if (updateData.longitude !== undefined) updateData.longitude = updateData.longitude ? parseFloat(updateData.longitude) : null;
    if (updateData.featured !== undefined) updateData.featured = updateData.featured === true || updateData.featured === 'true';

    // Handle array serialization
    if (updateData.images !== undefined) {
      updateData.images = Array.isArray(updateData.images) ? updateData.images.join(',') : '';
    }
    if (updateData.amenities !== undefined) {
      updateData.amenities = Array.isArray(updateData.amenities) ? updateData.amenities.join(',') : '';
    }
    if (updateData.nearby !== undefined) {
      updateData.nearby = updateData.nearby ? JSON.stringify(updateData.nearby) : null;
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: updateData,
    });

    res.json(mapPropertyResponse(updatedProperty));
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating property listing', error: error.message });
  }
};

// Delete a property listing (Admin/Agent)
export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const propertyExists = await prisma.property.findUnique({ where: { id } });
    if (!propertyExists) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await prisma.property.delete({ where: { id } });

    res.json({ message: 'Property listing deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting property listing', error: error.message });
  }
};
