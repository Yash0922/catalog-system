import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// Create a new product type
router.post('/', async (req: any, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const productType = await req.prisma.productType.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json(productType);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Product type with this name already exists' });
    } else {
      console.error('Error creating product type:', error);
      res.status(500).json({ error: 'Failed to create product type' });
    }
  }
});

// Get all product types
router.get('/', async (req: any, res) => {
  try {
    const productTypes = await req.prisma.productType.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(productTypes);
  } catch (error) {
    console.error('Error fetching product types:', error);
    res.status(500).json({ error: 'Failed to fetch product types' });
  }
});

// Get a specific product type
router.get('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    
    const productType = await req.prisma.productType.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            variants: true,
            addOns: true,
          },
        },
      },
    });

    if (!productType) {
      return res.status(404).json({ error: 'Product type not found' });
    }

    res.json(productType);
  } catch (error) {
    console.error('Error fetching product type:', error);
    res.status(500).json({ error: 'Failed to fetch product type' });
  }
});

// Update a product type
router.put('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const productType = await req.prisma.productType.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    res.json(productType);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Product type not found' });
    } else if (error.code === 'P2002') {
      res.status(400).json({ error: 'Product type with this name already exists' });
    } else {
      console.error('Error updating product type:', error);
      res.status(500).json({ error: 'Failed to update product type' });
    }
  }
});

// Delete a product type
router.delete('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;

    await req.prisma.productType.delete({
      where: { id },
    });

    res.json({ message: 'Product type deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Product type not found' });
    } else {
      console.error('Error deleting product type:', error);
      res.status(500).json({ error: 'Failed to delete product type' });
    }
  }
});

export default router;
