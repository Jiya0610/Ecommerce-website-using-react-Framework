import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import './WishlistPage.css';

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://127.0.0.1/ecommerce_project2/backend/wishlist.php?user_id=${user.id}`);
      const data = await response.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await fetch(`http://127.0.0.1/ecommerce_project2/backend/wishlist.php?user_id=${user.id}&product_id=${productId}&action=remove`);
      const data = await response.json();
      if (data.success) {
        setItems(items.filter(item => item.id !== productId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (!user) return <div className="wishlist-error">Please login to see your wishlist.</div>;

  return (
    <div className="wishlist-page fade-in">
      <div className="container">
        <header className="wishlist-header">
          <h1>My Wishlist</h1>
          <p>{items.length} items saved for later</p>
        </header>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : items.length > 0 ? (
          <div className="wishlist-grid">
            {items.map((product) => (
              <div key={product.id} className="wishlist-card">
                <div className="card-img">
                  <img 
                    src={product.image_url.startsWith('http') ? product.image_url : `http://127.0.0.1/ecommerce_project2/${product.image_url.replace(/^\/+/, '')}`} 
                    alt={product.name} 
                  />
                  <button className="remove-btn" onClick={() => removeItem(product.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="card-content">
                  <h3>{product.name}</h3>
                  <p className="price">₹{product.price}</p>
                  <div className="card-actions">
                    <button className="btn-add-cart">
                      <ShoppingCart size={18} />
                      <span>Add to Cart</span>
                    </button>
                    <Link to={`/product/${product.id}`} className="btn-view">View Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-wishlist">
            <Heart size={64} className="empty-icon" />
            <h2>Your wishlist is empty</h2>
            <p>Save items you like in your wishlist to buy them later.</p>
            <Link to="/products" className="btn-shop">Shop Now</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
