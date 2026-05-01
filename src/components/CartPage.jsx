import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingCart, Tag, CheckCircle } from 'lucide-react';
import './CartPage.css';

const COUPONS = {
  WELCOME10: { discount: 0.10, description: '10% off your order' }
};

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCart);
    // Restore previously applied coupon
    const saved = localStorage.getItem('appliedCoupon');
    if (saved) setAppliedCoupon(JSON.parse(saved));
  }, []);

  const updateQuantity = (id, delta) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const clearAll = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('cartItems');
    localStorage.removeItem('appliedCoupon');
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      const coupon = { code, ...COUPONS[code] };
      setAppliedCoupon(coupon);
      setCouponError('');
      localStorage.setItem('appliedCoupon', JSON.stringify(coupon));
    } else {
      setCouponError('Invalid coupon code. Please try again.');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    localStorage.removeItem('appliedCoupon');
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
  const discountAmount = appliedCoupon ? subtotal * appliedCoupon.discount : 0;
  const total = subtotal - discountAmount;

  return (
    <div className="cart-page-wrapper fade-in">
      <div className="cart-inner">
      <div className="cart-header">
        <h1>Shopping Cart <span className="cart-count">({cartItems.length} items)</span></h1>
        {cartItems.length > 0 && (
          <button className="clear-all-btn" onClick={clearAll}>
            <Trash2 size={15} /> Clear All
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-content">
            <ShoppingCart size={60} className="empty-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="start-shopping-btn">Start Shopping</Link>
          </div>
        </div>
      ) : (
        <div className="cart-content">
          {/* Left: Cart Items */}
          <div className="cart-items-section">
            {cartItems.map((item, index) => (
              <div key={item.id} className="cart-item" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="item-image-container">
                  <img src={item.image_url} alt={item.name} />
                </div>
                <div className="item-details-container">
                  <h3 className="item-title">{item.name}</h3>
                  <div className="item-unit-price">₹{parseFloat(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                  <div className="item-controls-row">
                    <div className="qty-selector">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                    <div className="item-total-wrapper">
                      <span className="item-total-price">
                        ₹{(parseFloat(item.price) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <button className="btn-remove" onClick={() => removeItem(item.id)} title="Remove Item">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Order Summary */}
          <div className="order-summary-wrapper">
            <div className="order-summary-card">
              <h2>Order Summary</h2>

              <div className="summary-calc">
                <div className="calc-row">
                  <span className="calc-label">Subtotal ({cartItems.length} items)</span>
                  <span className="calc-val">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                {appliedCoupon && (
                  <div className="calc-row discount-row">
                    <span className="discount-label">
                      <Tag size={14} /> {appliedCoupon.code}
                    </span>
                    <span className="discount-val">−₹{discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className="calc-row">
                  <span className="calc-label">Shipping</span>
                  <span className="calc-val text-green">Free</span>
                </div>
              </div>

              <div className="divider" />

              <div className="summary-total-row">
                <span className="total-label">Total</span>
                <span className="total-val">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              {/* Coupon Section */}
              {appliedCoupon ? (
                <div className="coupon-applied-box">
                  <CheckCircle size={18} className="check-icon" />
                  <span>Coupon <strong>"{appliedCoupon.code}"</strong> applied!</span>
                  <button className="btn-remove-coupon" onClick={removeCoupon}>✕</button>
                </div>
              ) : (
                <div className="coupon-box">
                  <label>Coupon Code</label>
                  <div className="coupon-input-group">
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={couponInput}
                      onChange={e => { setCouponInput(e.target.value); setCouponError(''); }}
                      onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                    />
                    <button className="btn-apply-coupon" onClick={applyCoupon}>Apply</button>
                  </div>
                  {couponError && <p className="coupon-error">{couponError}</p>}
                </div>
              )}

              <button className="btn-checkout" onClick={() => navigate('/checkout')}>
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <div className="continue-shopping-container">
                <Link to="/products" className="link-continue">Continue Shopping</Link>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default CartPage;
