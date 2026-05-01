import React from 'react';
import { Star, StarHalf, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: 'CD Player Portable',
      brand: 'feleman',
      rating: 4.0,
      price: '10,550',
      img: '/products/cd-player.png'
    },
    {
      id: 2,
      name: 'Headphones with Mic',
      brand: 'sony',
      rating: 4.3,
      price: '8,390',
      img: '/products/headphones.png'
    },
    {
      id: 3,
      name: 'Chair Cushion',
      brand: 'daddy cool store',
      rating: 4.2,
      price: '837',
      img: '/products/cushion.png'
    },
    {
      id: 4,
      name: "Women's Rayon Printed Anarkali Kurta Set",
      brand: 'KLOSIA',
      rating: 4.2,
      price: '799',
      img: '/products/anarkali.png'
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<Star key={i} size={16} fill="var(--primary)" color="var(--primary)" />);
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<StarHalf key={i} size={16} fill="var(--primary)" color="var(--primary)" />);
      } else {
        stars.push(<Star key={i} size={16} color="var(--border)" />);
      }
    }
    return stars;
  };

  return (
    <section className="featured-section">
      <div className="container">
        <h2 className="section-title">Featured Products</h2>
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
                  <span className="rating-value">({product.rating})</span>
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

export default FeaturedProducts;
