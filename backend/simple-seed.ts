import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting simple database seed...');

  // Clear existing data
  await prisma.addOn.deleteMany({});
  await prisma.variant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.productType.deleteMany({});

  console.log('✅ Cleared existing data');

  // Create product types
  const foodType = await prisma.productType.create({
    data: {
      name: 'Food',
      description: 'Food and beverages',
    },
  });

  const apparelType = await prisma.productType.create({
    data: {
      name: 'Apparel',
      description: 'Clothing and accessories',
    },
  });

  console.log('✅ Product types created');

  // Create a simple food product
  const pizza = await prisma.product.create({
    data: {
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
      productTypeId: foodType.id,
      images: [
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500',
      ],
    },
  });

  // Create a simple apparel product
  const tshirt = await prisma.product.create({
    data: {
      name: 'Cotton T-Shirt',
      description: 'Comfortable 100% cotton t-shirt',
      productTypeId: apparelType.id,
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
      ],
    },
  });

  console.log('✅ Products created');

  // Create variants
  await prisma.variant.create({
    data: {
      size: 'Small',
      price: 12.99,
      stock: 10,
      sku: 'PIZZA-S-001',
      productId: pizza.id,
    },
  });

  await prisma.variant.create({
    data: {
      size: 'Large',
      price: 18.99,
      stock: 5,
      sku: 'PIZZA-L-001',
      productId: pizza.id,
    },
  });

  await prisma.variant.create({
    data: {
      size: 'M',
      color: 'White',
      price: 19.99,
      stock: 20,
      sku: 'TSHIRT-M-WHT-001',
      productId: tshirt.id,
    },
  });

  console.log('✅ Variants created');

  // Create add-ons for pizza
  await prisma.addOn.create({
    data: {
      name: 'Extra Cheese',
      description: 'Additional mozzarella cheese',
      price: 2.50,
      productId: pizza.id,
    },
  });

  await prisma.addOn.create({
    data: {
      name: 'Pepperoni',
      description: 'Premium pepperoni slices',
      price: 3.00,
      productId: pizza.id,
    },
  });

  console.log('✅ Add-ons created');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
