import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import './TopRated.css';

const TopRated = () => {
  const products = [
    {
      id: 1,
      name: 'Samsung Galaxy S25 Ultra',
      brand: 'Samsung',
      rating: 5,
      price: '1,25,999',
      img: '/products/samsung-s25.png'
    },
    {
      id: 2,
      name: 'MacBook Air M3',
      brand: 'apple',
      rating: 5,
      price: '67,900',
      img: '/products/macbook.png'
    },
    {
      id: 3,
      name: 'Instant Pot Duo 7-in-1',
      brand: 'instant pot',
      rating: 5,
      price: '7,909',
      img: '/products/instant-pot.png'
    },
    {
      id: 4,
      name: 'Nike Air Max 270',
      brand: 'nike',
      rating: 4,
      price: '1,299',
      img: '/products/nike-shoe.png'
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        size={16} 
        fill={i < rating ? "var(--primary)" : "none"} 
        color={i < rating ? "var(--primary)" : "var(--border)"} 
      />
    ));
  };

  return (
    <section className="top-rated-section">
      <div className="container">
        <h2 className="section-title">Top Rated Products</h2>
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card fade-in">
              <div className="product-img-container">
                <Link to={`/product/${product.id}`}>
                  <img src={product.img} alt={product.name} />
                </Link>
              </div>
              <button className="add-to-cart-btn" aria-label="Add to cart">
                <ShoppingCart size={20} />
              </button>
              <div className="product-details">
                <span className="product-brand">{product.brand}</span>
                <Link to={`/product/${product.id}`}>
                  <h3 className="product-name">{product.name}</h3>
                </Link>
                <div className="product-rating">
                  {renderStars(product.rating)}
                  <span className="rating-value">({product.rating}.0)</span>
                </div>
                <div className="product-price">
                  <span className="currency">₹</span>
                  <span className="amount">{product.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopRated;
