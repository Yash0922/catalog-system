import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { measureWebVitals } from './utils/performance';
import './styles/App.css';

function App() {
  useEffect(() => {
    // Initialize performance monitoring in development
    if (process.env.NODE_ENV === 'development') {
      measureWebVitals();
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="App">
        <Header />
        <main className="main-content">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<CatalogPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
