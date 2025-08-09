import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// Create a new variant
router.post('/', async (req: any, res) => {
  try {
    const { size, color, price, stock = 0, sku, productId } = req.body;
    
    if (!price || !sku || !productId) {
      return res.status(400).json({ error: 'Price, SKU, and productId are required' });
    }

    // Verify product exists
    const product = await req.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const variant = await req.prisma.variant.create({
      data: {
        size,
        color,
        price,
        stock,
        sku,
        productId,
      },
      include: {
        product: {
          include: {
            productType: true,
          },
        },
      },
    });

    res.status(201).json(variant);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'SKU must be unique' });
    } else {
      console.error('Error creating variant:', error);
      res.status(500).json({ error: 'Failed to create variant' });
    }
  }
});

// Get all variants for a product
router.get('/product/:productId', async (req: any, res) => {
  try {
    const { productId } = req.params;

    const variants = await req.prisma.variant.findMany({
      where: { productId },
      include: {
        product: {
          include: {
            productType: true,
          },
        },
      },
      orderBy: {
        price: 'asc',
      },
    });

    res.json(variants);
  } catch (error) {
    console.error('Error fetching variants:', error);
    res.status(500).json({ error: 'Failed to fetch variants' });
  }
});

// Get a specific variant
router.get('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    
    const variant = await req.prisma.variant.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            productType: true,
          },
        },
      },
    });

    if (!variant) {
      return res.status(404).json({ error: 'Variant not found' });
    }

    res.json(variant);
  } catch (error) {
    console.error('Error fetching variant:', error);
    res.status(500).json({ error: 'Failed to fetch variant' });
  }
});

// Update a variant
router.put('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const { size, color, price, stock, sku } = req.body;

    const variant = await req.prisma.variant.update({
      where: { id },
      data: {
        ...(size !== undefined && { size }),
        ...(color !== undefined && { color }),
        ...(price !== undefined && { price }),
        ...(stock !== undefined && { stock }),
        ...(sku !== undefined && { sku }),
      },
      include: {
        product: {
          include: {
            productType: true,
          },
        },
      },
    });

    res.json(variant);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Variant not found' });
    } else if (error.code === 'P2002') {
      res.status(400).json({ error: 'SKU must be unique' });
    } else {
      console.error('Error updating variant:', error);
      res.status(500).json({ error: 'Failed to update variant' });
    }
  }
});

// Delete a variant
router.delete('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;

    await req.prisma.variant.delete({
      where: { id },
    });

    res.json({ message: 'Variant deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Variant not found' });
    } else {
      console.error('Error deleting variant:', error);
      res.status(500).json({ error: 'Failed to delete variant' });
    }
  }
});

export default router;
