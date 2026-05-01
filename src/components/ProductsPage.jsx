import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Filter, ChevronDown, LayoutGrid, List, ShoppingCart, Star } from 'lucide-react';
import './ProductsPage.css';

const ProductsPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  
  const allCategories = [
    'Beauty & Health',
    'Books',
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Sports & Fitness'
  ];

  const getInitialCategory = () => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    return cat || 'All';
  };

  const [filters, setFilters] = useState({
    category: getInitialCategory(),
    sort: 'newest',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    setFilters(prev => ({ ...prev, category: getInitialCategory() }));
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
  }, [filters.category, filters.sort]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        category: filters.category,
        sort: filters.sort,
        minPrice: filters.minPrice || 0,
        maxPrice: filters.maxPrice || 999999,
        t: Date.now() // Cache buster
      });
      const response = await fetch(`http://127.0.0.1/ecommerce_project2/backend/get_products.php?${query}`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
        setCategoryData(data.categories);
        console.log('Fetched products with images:', data.products.map(p => p.image_url));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceFilter = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="products-page fade-in">
      <div className="products-container">
        {/* Header Section */}
        <header className="products-header">
          <div className="header-info">
            <h1>All Products</h1>
            <p className="product-count">{products.length} products found</p>
          </div>

          <div className="header-controls">
            <div className="sort-dropdown">
              <select 
                value={filters.sort} 
                onChange={(e) => setFilters({...filters, sort: e.target.value})}
              >
                <option value="newest">Newest</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="dropdown-icon" size={16} />
            </div>

            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </header>

        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <div className="filter-section">
              <div className="filter-title">
                <Filter size={18} />
                <h3>Filters</h3>
              </div>
              
              <div className="filter-group">
                <h4>Category</h4>
                <div className="category-list">
                  <button 
                    className={`category-item ${filters.category === 'All' ? 'active' : ''}`}
                    onClick={() => setFilters({...filters, category: 'All'})}
                  >
                    <span>All Categories</span>
                  </button>
                  {allCategories.map((catName) => {
                    const catInfo = categoryData.find(c => c.category === catName);
                    return (
                      <button 
                        key={catName}
                        className={`category-item ${filters.category === catName ? 'active' : ''}`}
                        onClick={() => setFilters({...filters, category: catName})}
                      >
                        <span>{catName}</span>
                        <span className="cat-count">{catInfo ? catInfo.count : 0}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="filter-group">
                <h4>Price Range</h4>
                <form className="price-filter" onSubmit={handlePriceFilter}>
                  <div className="price-inputs">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    />
                    <span className="separator">-</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="btn-apply">Apply</button>
                </form>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className={`products-grid ${viewMode}`}>
            {loading ? (
              <div className="loading-state">Loading products...</div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <Link to={`/product/${product.id}`}>
                      <img 
                        src={product.image_url.startsWith('http') ? product.image_url : `http://127.0.0.1/ecommerce_project2/${product.image_url.replace(/^\/+/, '')}`} 
                        alt={product.name} 
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = 'https://images.unsplash.com/photo-1512496011931-d2b09f46d4b9?q=80&w=800'; 
                        }}
                      />
                    </Link>
                  </div>
                  <button className="btn-add-cart" aria-label="Add to cart">
                    <ShoppingCart size={18} />
                  </button>
                  <div className="product-info">
                    <span className="product-brand">{product.brand || 'ShopSphere'}</span>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="product-name">{product.name}</h3>
                    </Link>
                    <div className="product-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < Math.floor(product.rating) ? 'filled' : ''} 
                          />
                        ))}
                      </div>
                      <span className="review-count">({product.review_count})</span>
                    </div>
                    <div className="product-price">
                      <span className="current-price">₹{product.price}</span>
                      {product.original_price && (
                        <span className="original-price">₹{product.original_price}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products">No products found matching your criteria.</div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
