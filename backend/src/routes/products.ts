import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// Create a new product
router.post('/', async (req: any, res) => {
  try {
    const { name, description, productTypeId, images = [] } = req.body;
    
    if (!name || !productTypeId) {
      return res.status(400).json({ error: 'Name and productTypeId are required' });
    }

    // Verify product type exists
    const productType = await req.prisma.productType.findUnique({
      where: { id: productTypeId },
    });

    if (!productType) {
      return res.status(400).json({ error: 'Invalid product type ID' });
    }

    const product = await req.prisma.product.create({
      data: {
        name,
        description,
        productTypeId,
        images,
      },
      include: {
        productType: true,
        variants: true,
        addOns: true,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Get all products
router.get('/', async (req: any, res) => {
  try {
    const { type } = req.query;
    
    const whereClause = type 
      ? { productType: { name: { equals: type as string, mode: 'insensitive' as const } } }
      : {};

    const products = await req.prisma.product.findMany({
      where: whereClause,
      include: {
        productType: true,
        variants: {
          orderBy: { price: 'asc' },
        },
        addOns: {
          orderBy: { price: 'asc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get products by type
router.get('/by-type/:typeName', async (req: any, res) => {
  try {
    const { typeName } = req.params;

    const products = await req.prisma.product.findMany({
      where: {
        productType: {
          name: {
            equals: typeName,
            mode: 'insensitive',
          },
        },
      },
      include: {
        productType: true,
        variants: {
          orderBy: { price: 'asc' },
        },
        addOns: {
          orderBy: { price: 'asc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products by type:', error);
    res.status(500).json({ error: 'Failed to fetch products by type' });
  }
});

// Get a specific product
router.get('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    
    const product = await req.prisma.product.findUnique({
      where: { id },
      include: {
        productType: true,
        variants: {
          orderBy: { price: 'asc' },
        },
        addOns: {
          orderBy: { price: 'asc' },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Update a product
router.put('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const { name, description, productTypeId, images } = req.body;

    // If productTypeId is provided, verify it exists
    if (productTypeId) {
      const productType = await req.prisma.productType.findUnique({
        where: { id: productTypeId },
      });

      if (!productType) {
        return res.status(400).json({ error: 'Invalid product type ID' });
      }
    }

    const product = await req.prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(productTypeId && { productTypeId }),
        ...(images && { images }),
      },
      include: {
        productType: true,
        variants: true,
        addOns: true,
      },
    });

    res.json(product);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Product not found' });
    } else {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  }
});

// Delete a product
router.delete('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;

    await req.prisma.product.delete({
      where: { id },
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Product not found' });
    } else {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }
});

export default router;
