import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create product types
  const foodType = await prisma.productType.upsert({
    where: { name: 'Food' },
    update: {},
    create: {
      name: 'Food',
      description: 'Food and beverages',
    },
  });

  const apparelType = await prisma.productType.upsert({
    where: { name: 'Apparel' },
    update: {},
    create: {
      name: 'Apparel',
      description: 'Clothing and accessories',
    },
  });

  const electronicsType = await prisma.productType.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: {
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
    },
  });

  console.log('✅ Product types created');

  // Create food products
  const pizza = await prisma.product.create({
    data: {
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
      productTypeId: foodType.id,
      images: [
        'https://i0.wp.com/cookingitalians.com/wp-content/uploads/2024/11/Margherita-Pizza.jpg?fit=1344%2C768&ssl=1',
        'https://simplyhomecooked.com/wp-content/uploads/2023/04/Margherita-Pizza-2.jpg',
      ],
    },
  });

  const burger = await prisma.product.create({
    data: {
      name: 'Classic Cheeseburger',
      description: 'Juicy beef patty with cheese, lettuce, tomato, and special sauce',
      productTypeId: foodType.id,
      images: [
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
        'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500',
      ],
    },
  });

  // Create apparel products
  const tshirt = await prisma.product.create({
    data: {
      name: 'Cotton T-Shirt',
      description: 'Comfortable 100% cotton t-shirt, perfect for everyday wear',
      productTypeId: apparelType.id,
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500',
      ],
    },
  });

  const jeans = await prisma.product.create({
    data: {
      name: 'Denim Jeans',
      description: 'Classic blue denim jeans with a comfortable fit',
      productTypeId: apparelType.id,
      images: [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
        'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=500',
      ],
    },
  });

  // Create electronics products
  const smartphone = await prisma.product.create({
    data: {
      name: 'Smartphone Pro',
      description: 'Latest smartphone with advanced camera and fast processor',
      productTypeId: electronicsType.id,
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=500',
      ],
    },
  });

  const laptop = await prisma.product.create({
    data: {
      name: 'Gaming Laptop',
      description: 'High-performance laptop for gaming and professional work',
      productTypeId: electronicsType.id,
      images: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500',
      ],
    },
  });

  const desktop = await prisma.product.create({
    data: {
      name: 'Gaming Desktop PC',
      description: 'Custom built gaming desktop with high-end components',
      productTypeId: electronicsType.id,
      images: [
        'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500',
        'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500',
      ],
    },
  });

  const tablet = await prisma.product.create({
    data: {
      name: 'Pro Tablet',
      description: 'Professional tablet for work and creativity',
      productTypeId: electronicsType.id,
      images: [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500',
      ],
    },
  });

  const smartwatch = await prisma.product.create({
    data: {
      name: 'Smart Watch Pro',
      description: 'Advanced smartwatch with health monitoring and GPS',
      productTypeId: electronicsType.id,
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500',
      ],
    },
  });

  console.log('✅ Products created');

  // Create variants for food items
  await prisma.variant.createMany({
    data: [
      // Pizza variants (prices in USD for conversion to INR on frontend)
      { size: 'Small', price: 3.99, stock: 10, sku: 'PIZZA-MAR-S', productId: pizza.id },
      { size: 'Medium', price: 5.99, stock: 8, sku: 'PIZZA-MAR-M', productId: pizza.id },
      { size: 'Large', price: 7.99, stock: 5, sku: 'PIZZA-MAR-L', productId: pizza.id },
      
      // Burger variants
      { size: 'Regular', price: 2.99, stock: 15, sku: 'BURGER-CLASSIC-R', productId: burger.id },
      { size: 'Large', price: 4.99, stock: 12, sku: 'BURGER-CLASSIC-L', productId: burger.id },
    ],
  });

  // Create variants for apparel
  await prisma.variant.createMany({
    data: [
      // T-shirt variants
      { size: 'S', color: 'White', price: 8.99, stock: 20, sku: 'TSHIRT-COT-S-WHT', productId: tshirt.id },
      { size: 'M', color: 'White', price: 8.99, stock: 25, sku: 'TSHIRT-COT-M-WHT', productId: tshirt.id },
      { size: 'L', color: 'White', price: 8.99, stock: 15, sku: 'TSHIRT-COT-L-WHT', productId: tshirt.id },
      { size: 'S', color: 'Black', price: 9.99, stock: 18, sku: 'TSHIRT-COT-S-BLK', productId: tshirt.id },
      { size: 'M', color: 'Black', price: 9.99, stock: 22, sku: 'TSHIRT-COT-M-BLK', productId: tshirt.id },
      { size: 'L', color: 'Black', price: 9.99, stock: 12, sku: 'TSHIRT-COT-L-BLK', productId: tshirt.id },
      
      // Jeans variants
      { size: '30', color: 'Blue', price: 24.99, stock: 8, sku: 'JEANS-DEN-30-BLU', productId: jeans.id },
      { size: '32', color: 'Blue', price: 24.99, stock: 12, sku: 'JEANS-DEN-32-BLU', productId: jeans.id },
      { size: '34', color: 'Blue', price: 24.99, stock: 10, sku: 'JEANS-DEN-34-BLU', productId: jeans.id },
      { size: '36', color: 'Blue', price: 24.99, stock: 6, sku: 'JEANS-DEN-36-BLU', productId: jeans.id },
    ],
  });

  // Create variants for electronics
  await prisma.variant.createMany({
    data: [
      // Smartphone variants (using size for storage, color for model)
      { size: '128GB', color: 'Black', price: 299.99, stock: 25, sku: 'PHONE-PRO-128-BLK', productId: smartphone.id },
      { size: '128GB', color: 'White', price: 299.99, stock: 20, sku: 'PHONE-PRO-128-WHT', productId: smartphone.id },
      { size: '128GB', color: 'Blue', price: 299.99, stock: 18, sku: 'PHONE-PRO-128-BLU', productId: smartphone.id },
      { size: '256GB', color: 'Black', price: 349.99, stock: 15, sku: 'PHONE-PRO-256-BLK', productId: smartphone.id },
      { size: '256GB', color: 'White', price: 349.99, stock: 12, sku: 'PHONE-PRO-256-WHT', productId: smartphone.id },
      { size: '256GB', color: 'Blue', price: 349.99, stock: 10, sku: 'PHONE-PRO-256-BLU', productId: smartphone.id },
      { size: '512GB', color: 'Black', price: 449.99, stock: 8, sku: 'PHONE-PRO-512-BLK', productId: smartphone.id },
      { size: '512GB', color: 'White', price: 449.99, stock: 6, sku: 'PHONE-PRO-512-WHT', productId: smartphone.id },
      
      // Gaming Laptop variants (using size for RAM+Storage, color for processor)
      { size: '8GB+512GB', color: 'Intel i5', price: 599.99, stock: 12, sku: 'LAPTOP-GAM-8GB-I5', productId: laptop.id },
      { size: '16GB+512GB', color: 'Intel i5', price: 699.99, stock: 10, sku: 'LAPTOP-GAM-16GB-I5', productId: laptop.id },
      { size: '16GB+1TB', color: 'Intel i5', price: 799.99, stock: 8, sku: 'LAPTOP-GAM-16GB-1TB-I5', productId: laptop.id },
      { size: '16GB+512GB', color: 'Intel i7', price: 899.99, stock: 6, sku: 'LAPTOP-GAM-16GB-I7', productId: laptop.id },
      { size: '32GB+1TB', color: 'Intel i7', price: 1199.99, stock: 4, sku: 'LAPTOP-GAM-32GB-I7', productId: laptop.id },
      { size: '32GB+2TB', color: 'Intel i9', price: 1599.99, stock: 2, sku: 'LAPTOP-GAM-32GB-I9', productId: laptop.id },
      
      // Gaming Desktop variants (using size for RAM+Storage, color for processor+GPU)
      { size: '16GB+1TB', color: 'Intel i5+RTX3060', price: 899.99, stock: 8, sku: 'DESKTOP-GAM-16GB-I5-3060', productId: desktop.id },
      { size: '32GB+1TB', color: 'Intel i7+RTX3070', price: 1299.99, stock: 6, sku: 'DESKTOP-GAM-32GB-I7-3070', productId: desktop.id },
      { size: '32GB+2TB', color: 'Intel i7+RTX3080', price: 1699.99, stock: 4, sku: 'DESKTOP-GAM-32GB-I7-3080', productId: desktop.id },
      { size: '64GB+2TB', color: 'Intel i9+RTX4080', price: 2299.99, stock: 2, sku: 'DESKTOP-GAM-64GB-I9-4080', productId: desktop.id },
      { size: '64GB+4TB', color: 'Intel i9+RTX4090', price: 2999.99, stock: 1, sku: 'DESKTOP-GAM-64GB-I9-4090', productId: desktop.id },
      
      // Tablet variants (using size for storage+RAM, color for model)
      { size: '64GB+4GB', color: 'WiFi', price: 199.99, stock: 20, sku: 'TABLET-PRO-64GB-WIFI', productId: tablet.id },
      { size: '128GB+6GB', color: 'WiFi', price: 299.99, stock: 15, sku: 'TABLET-PRO-128GB-WIFI', productId: tablet.id },
      { size: '256GB+8GB', color: 'WiFi', price: 399.99, stock: 12, sku: 'TABLET-PRO-256GB-WIFI', productId: tablet.id },
      { size: '128GB+6GB', color: 'Cellular', price: 399.99, stock: 10, sku: 'TABLET-PRO-128GB-CELL', productId: tablet.id },
      { size: '256GB+8GB', color: 'Cellular', price: 499.99, stock: 8, sku: 'TABLET-PRO-256GB-CELL', productId: tablet.id },
      { size: '512GB+12GB', color: 'Cellular', price: 699.99, stock: 5, sku: 'TABLET-PRO-512GB-CELL', productId: tablet.id },
      
      // Smartwatch variants (using size for storage, color for connectivity)
      { size: '32GB', color: 'GPS', price: 199.99, stock: 25, sku: 'WATCH-PRO-32GB-GPS', productId: smartwatch.id },
      { size: '32GB', color: 'GPS+Cellular', price: 299.99, stock: 20, sku: 'WATCH-PRO-32GB-CELL', productId: smartwatch.id },
      { size: '64GB', color: 'GPS', price: 249.99, stock: 15, sku: 'WATCH-PRO-64GB-GPS', productId: smartwatch.id },
      { size: '64GB', color: 'GPS+Cellular', price: 349.99, stock: 12, sku: 'WATCH-PRO-64GB-CELL', productId: smartwatch.id },
    ],
  });

  console.log('✅ Variants created');

  // Create add-ons for food items only
  await prisma.addOn.createMany({
    data: [
      // Pizza add-ons
      { name: 'Extra Cheese', description: 'Additional mozzarella cheese', price: 0.99, productId: pizza.id },
      { name: 'Pepperoni', description: 'Premium pepperoni slices', price: 1.49, productId: pizza.id },
      { name: 'Mushrooms', description: 'Fresh mushrooms', price: 0.79, productId: pizza.id },
      { name: 'Bell Peppers', description: 'Colorful bell peppers', price: 0.59, productId: pizza.id },
      { name: 'Olives', description: 'Mediterranean olives', price: 0.89, productId: pizza.id },
      
      // Burger add-ons
      { name: 'Extra Patty', description: 'Additional beef patty', price: 1.99, productId: burger.id },
      { name: 'Bacon', description: 'Crispy bacon strips', price: 1.29, productId: burger.id },
      { name: 'Avocado', description: 'Fresh avocado slices', price: 0.99, productId: burger.id },
      { name: 'Onion Rings', description: 'Crispy onion rings', price: 0.89, productId: burger.id },
      { name: 'Spicy Mayo', description: 'House special spicy mayo', price: 0.39, productId: burger.id },
    ],
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
