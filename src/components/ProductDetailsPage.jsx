import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, RefreshCcw, ChevronRight } from 'lucide-react';
import './ProductDetailsPage.css';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    fetchProductDetails();
    checkWishlistStatus();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`http://127.0.0.1/ecommerce_project2/backend/get_products.php?id=${id}`);
      const data = await response.json();
      if (data.success && data.products.length > 0) {
        const prod = data.products[0];
        // Parse JSON fields
        if (typeof prod.sub_images === 'string') prod.sub_images = JSON.parse(prod.sub_images);
        if (typeof prod.specifications === 'string') prod.specifications = JSON.parse(prod.specifications);
        
        setProduct(prod);
        setActiveImg(prod.image_url);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://127.0.0.1/ecommerce_project2/backend/wishlist.php?user_id=${user.id}`);
      const data = await response.json();
      if (data.success) {
        const found = data.items.some(item => item.id == id);
        setIsWishlisted(found);
      }
    } catch (error) {
      console.error('Wishlist check error:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const method = isWishlisted ? 'DELETE' : 'POST';
    const body = { user_id: user.id, product_id: id };

    try {
      const url = isWishlisted 
        ? `http://127.0.0.1/ecommerce_project2/backend/wishlist.php?user_id=${user.id}&product_id=${id}&action=remove`
        : `http://127.0.0.1/ecommerce_project2/backend/wishlist.php`;

      const response = await fetch(url, {
        method: isWishlisted ? 'GET' : 'POST', // Simplified for local PHP
        headers: { 'Content-Type': 'application/json' },
        body: isWishlisted ? null : JSON.stringify(body)
      });
      const data = await response.json();
      if (data.success) {
        setIsWishlisted(!isWishlisted);
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
    }
  };

  const handleBuyNow = () => {
    // Add current item to a mock cart in local storage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    navigate('/cart');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="error">Product not found</div>;

  const subImages = Array.isArray(product.sub_images) ? product.sub_images : [];
  const specs = product.specifications || {};

  const reviews = [
    { name: "Anjali S.", rating: 5, comment: "Amazing palette! The concealer blends like a dream.", date: "2 days ago" },
    { name: "Rahul M.", rating: 4, comment: "Very travel-friendly. The blush is a bit light but buildable.", date: "1 week ago" },
    { name: "Priya K.", rating: 5, comment: "Best 3-in-1 kit I've ever used. Worth every penny.", date: "2 weeks ago" }
  ];

  return (
    <div className="product-details-page fade-in">
      <div className="breadcrumb">
        <span>Home</span> <ChevronRight size={14} /> 
        <span>{product.category}</span> <ChevronRight size={14} /> 
        <span className="current">{product.name}</span>
      </div>

      <div className="details-container">
        {/* Left: Image Gallery */}
        <div className="image-gallery">
          <div className="main-image">
            <img src={activeImg} alt={product.name} />
            <button className={`wishlist-btn ${isWishlisted ? 'active' : ''}`} onClick={toggleWishlist}>
              <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="thumbnail-list">
            <div 
              className={`thumb ${activeImg === product.image_url ? 'active' : ''}`}
              onClick={() => setActiveImg(product.image_url)}
            >
              <img src={product.image_url} alt="Main" />
            </div>
            {subImages.map((img, i) => (
              <div 
                key={i} 
                className={`thumb ${activeImg === img ? 'active' : ''}`}
                onClick={() => setActiveImg(img)}
              >
                <img src={img} alt={`Angle ${i+1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="product-info-panel">
          <span className="brand-tag">{product.brand}</span>
          <h1 className="product-title">{product.name}</h1>
          
          <div className="rating-row">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < Math.floor(product.rating) ? "#fbbf24" : "none"} color="#fbbf24" />
              ))}
              <span className="rating-val">{product.rating}</span>
            </div>
            <span className="review-count">{product.review_count} Reviews</span>
          </div>

          <div className="price-box">
            <span className="current-price">₹{product.price}</span>
            {product.original_price && (
              <>
                <span className="original-price">₹{product.original_price}</span>
                <span className="discount">-{Math.round((1 - product.price / product.original_price) * 100)}%</span>
              </>
            )}
          </div>

          <p className="description">{product.description}</p>

          <div className="action-buttons">
            <button className="btn-cart">
              <ShoppingCart size={20} />
              <span>Add to Cart</span>
            </button>
            <button className="btn-buy" onClick={handleBuyNow}>Buy Now</button>
          </div>

          <div className="trust-badges">
            <div className="badge"><ShieldCheck size={20} /> 1 Year Warranty</div>
            <div className="badge"><Truck size={20} /> Free Delivery</div>
            <div className="badge"><RefreshCcw size={20} /> 7 Days Replacement</div>
          </div>

          <div className="specifications-section">
            <h3>Technical Details</h3>
            <div className="specs-grid">
              {Object.entries(specs).map(([key, val]) => (
                <div key={key} className="spec-item">
                  <span className="spec-key">{key}</span>
                  <span className="spec-val">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="reviews-section">
        <h2>Customer Reviews</h2>
        <div className="reviews-list">
          {reviews.map((rev, i) => (
            <div key={i} className="review-card">
              <div className="review-header">
                <span className="user-name">{rev.name}</span>
                <span className="review-date">{rev.date}</span>
              </div>
              <div className="stars">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} fill={j < rev.rating ? "#fbbf24" : "none"} color="#fbbf24" />
                ))}
              </div>
              <p className="comment">{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsPage;
