import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// Create a new add-on
router.post('/', async (req: any, res) => {
  try {
    const { name, description, price, productId } = req.body;
    
    if (!name || !price || !productId) {
      return res.status(400).json({ error: 'Name, price, and productId are required' });
    }

    // Verify product exists and is a food item
    const product = await req.prisma.product.findUnique({
      where: { id: productId },
      include: {
        productType: true,
      },
    });

    if (!product) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    if (product.productType.name.toLowerCase() !== 'food') {
      return res.status(400).json({ error: 'Add-ons can only be created for food items' });
    }

    const addOn = await req.prisma.addOn.create({
      data: {
        name,
        description,
        price,
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

    res.status(201).json(addOn);
  } catch (error) {
    console.error('Error creating add-on:', error);
    res.status(500).json({ error: 'Failed to create add-on' });
  }
});

// Get all add-ons for a product
router.get('/product/:productId', async (req: any, res) => {
  try {
    const { productId } = req.params;

    // Verify product is a food item
    const product = await req.prisma.product.findUnique({
      where: { id: productId },
      include: {
        productType: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.productType.name.toLowerCase() !== 'food') {
      return res.json([]); // Return empty array for non-food items
    }

    const addOns = await req.prisma.addOn.findMany({
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

    res.json(addOns);
  } catch (error) {
    console.error('Error fetching add-ons:', error);
    res.status(500).json({ error: 'Failed to fetch add-ons' });
  }
});

// Get a specific add-on
router.get('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    
    const addOn = await req.prisma.addOn.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            productType: true,
          },
        },
      },
    });

    if (!addOn) {
      return res.status(404).json({ error: 'Add-on not found' });
    }

    res.json(addOn);
  } catch (error) {
    console.error('Error fetching add-on:', error);
    res.status(500).json({ error: 'Failed to fetch add-on' });
  }
});

// Update an add-on
router.put('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    const addOn = await req.prisma.addOn.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
      },
      include: {
        product: {
          include: {
            productType: true,
          },
        },
      },
    });

    res.json(addOn);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Add-on not found' });
    } else {
      console.error('Error updating add-on:', error);
      res.status(500).json({ error: 'Failed to update add-on' });
    }
  }
});

// Delete an add-on
router.delete('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;

    await req.prisma.addOn.delete({
      where: { id },
    });

    res.json({ message: 'Add-on deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Add-on not found' });
    } else {
      console.error('Error deleting add-on:', error);
      res.status(500).json({ error: 'Failed to delete add-on' });
    }
  }
});

export default router;
