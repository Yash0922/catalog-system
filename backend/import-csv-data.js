const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Helper function to parse CSV
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  const rows = lines.slice(1).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    
    while (i < line.length) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"' && !inQuotes) {
        inQuotes = true;
      } else if (char === '"' && inQuotes) {
        if (nextChar === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = false;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
      i++;
    }
    values.push(current.trim()); // Add last value
    
    return headers.reduce((obj, header, index) => {
      let value = values[index] || '';
      
      // Handle special conversions
      if (value === '') {
        value = null;
      } else if (header === 'price' || header === 'stock') {
        value = parseFloat(value);
      } else if (header === 'images' && value.startsWith('{')) {
        // Parse PostgreSQL array format
        value = value.slice(1, -1).split(',').map(img => 
          img.replace(/"/g, '').trim()
        );
      }
      
      obj[header] = value;
      return obj;
    }, {});
  });
  
  return rows;
}

async function importData() {
  try {
    console.log('🌱 Starting CSV import to Supabase...');
    
    // Clear existing data in correct order (due to foreign key constraints)
    console.log('🧹 Clearing existing data...');
    await prisma.addOn.deleteMany({});
    await prisma.variant.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.productType.deleteMany({});
    
    // Import Product Types
    console.log('📥 Importing product types...');
    const productTypesCSV = fs.readFileSync(path.join(__dirname, '../csv-data/product_types.csv'), 'utf8');
    const productTypes = parseCSV(productTypesCSV);
    
    for (const productType of productTypes) {
      await prisma.productType.create({
        data: {
          id: productType.id,
          name: productType.name,
          description: productType.description,
          createdAt: new Date(productType.createdAt),
          updatedAt: new Date(productType.updatedAt),
        }
      });
    }
    console.log(`✅ Imported ${productTypes.length} product types`);
    
    // Import Products
    console.log('📥 Importing products...');
    const productsCSV = fs.readFileSync(path.join(__dirname, '../csv-data/products.csv'), 'utf8');
    const products = parseCSV(productsCSV);
    
    for (const product of products) {
      await prisma.product.create({
        data: {
          id: product.id,
          name: product.name,
          description: product.description,
          images: product.images,
          productTypeId: product.productTypeId,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt),
        }
      });
    }
    console.log(`✅ Imported ${products.length} products`);
    
    // Import Variants
    console.log('📥 Importing variants...');
    const variantsCSV = fs.readFileSync(path.join(__dirname, '../csv-data/variants.csv'), 'utf8');
    const variants = parseCSV(variantsCSV);
    
    for (const variant of variants) {
      await prisma.variant.create({
        data: {
          id: variant.id,
          size: variant.size,
          color: variant.color,
          price: variant.price,
          stock: variant.stock,
          sku: variant.sku,
          productId: variant.productId,
          createdAt: new Date(variant.createdAt),
          updatedAt: new Date(variant.updatedAt),
        }
      });
    }
    console.log(`✅ Imported ${variants.length} variants`);
    
    // Import Add-ons
    console.log('📥 Importing add-ons...');
    const addOnsCSV = fs.readFileSync(path.join(__dirname, '../csv-data/add_ons.csv'), 'utf8');
    const addOns = parseCSV(addOnsCSV);
    
    for (const addOn of addOns) {
      await prisma.addOn.create({
        data: {
          id: addOn.id,
          name: addOn.name,
          description: addOn.description,
          price: addOn.price,
          productId: addOn.productId,
          createdAt: new Date(addOn.createdAt),
          updatedAt: new Date(addOn.updatedAt),
        }
      });
    }
    console.log(`✅ Imported ${addOns.length} add-ons`);
    
    console.log('🎉 CSV import completed successfully!');
    
    // Verify data
    console.log('\n📊 Verification:');
    const counts = await Promise.all([
      prisma.productType.count(),
      prisma.product.count(),
      prisma.variant.count(),
      prisma.addOn.count(),
    ]);
    
    console.log(`- Product Types: ${counts[0]}`);
    console.log(`- Products: ${counts[1]}`);
    console.log(`- Variants: ${counts[2]}`);
    console.log(`- Add-ons: ${counts[3]}`);
    
  } catch (error) {
    console.error('❌ Error importing CSV data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importData()
  .then(() => {
    console.log('✨ Import process completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Import process failed:', error);
    process.exit(1);
  });
