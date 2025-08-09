import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Product, ProductType } from '../types';
import { productService, productTypeService } from '../services/api';

export const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, typesData] = await Promise.all([
          productService.getAll(),
          productTypeService.getAll(),
        ]);
        
        setProducts(productsData);
        setProductTypes(typesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load catalog data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTypeFilter = async (typeName: string) => {
    try {
      setSelectedType(typeName);
      setLoading(true);
      
      if (typeName === 'all') {
        const productsData = await productService.getAll();
        setProducts(productsData);
      } else {
        const productsData = await productService.getByType(typeName);
        setProducts(productsData);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error filtering products:', err);
      setError('Failed to filter products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const groupProductsByType = () => {
    const grouped: { [key: string]: Product[] } = {};
    
    products.forEach(product => {
      const typeName = product.productType.name;
      if (!grouped[typeName]) {
        grouped[typeName] = [];
      }
      grouped[typeName].push(product);
    });
    
    return grouped;
  };

  const renderProductsByType = () => {
    if (selectedType !== 'all') {
      return (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      );
    }

    const groupedProducts = groupProductsByType();
    
    return (
      <div>
        {Object.entries(groupedProducts).map(([typeName, typeProducts]) => (
          <div key={typeName} className="product-type-section">
            <div className="section-header">
              <h2 className="section-title">{typeName}</h2>
              <span className="section-count">
                {typeProducts.length} product{typeProducts.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="products-grid">
              {typeProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading catalog...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <div className="filter-bar">
        <h2 className="filter-title">Filter by Type:</h2>
        <button
          className={`filter-button ${selectedType === 'all' ? 'active' : ''}`}
          onClick={() => handleTypeFilter('all')}
        >
          All Products ({products.length})
        </button>
        {productTypes.map(type => {
          const typeProductCount = products.filter(p => p.productType.name === type.name).length;
          return (
            <button
              key={type.id}
              className={`filter-button ${selectedType === type.name ? 'active' : ''}`}
              onClick={() => handleTypeFilter(type.name)}
            >
              {type.name} ({typeProductCount})
            </button>
          );
        })}
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>There are no products available for the selected category.</p>
        </div>
      ) : (
        renderProductsByType()
      )}
    </div>
  );
};
