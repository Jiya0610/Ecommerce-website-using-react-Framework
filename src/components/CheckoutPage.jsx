import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, MapPin, CreditCard, Smartphone, Clock, CheckCheck } from 'lucide-react';
import './CheckoutPage.css';

// --- QR Code placeholder (data URL for a sample QR) ---
const SAMPLE_QR = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/220px-QR_code_for_mobile_English_Wikipedia.svg.png';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=Shipping, 2=Payment, 3=Review, 4=Confirmed
  const [cartItems, setCartItems] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  // Shipping fields
  const [shipping, setShipping] = useState({
    fullName: '', phone: '', country: 'India',
    street: '', city: '', state: '', pin: ''
  });
  const [errors, setErrors] = useState({});

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(stored);
    const coupon = JSON.parse(localStorage.getItem('appliedCoupon'));
    if (coupon) setAppliedCoupon(coupon);
  }, []);

  // --- Price Calculations ---
  const subtotal = cartItems.reduce((a, i) => a + parseFloat(i.price) * i.quantity, 0);
  const discount = appliedCoupon ? subtotal * appliedCoupon.discount : 0;
  const codFee = paymentMethod === 'cod' ? 10 : 0;
  const total = subtotal - discount + codFee;

  const fmt = (n) => n.toLocaleString('en-IN', { minimumFractionDigits: 2 });

  // --- Validation ---
  const validate = () => {
    const e = {};
    if (!shipping.fullName.trim()) e.fullName = 'Full name is required';
    if (!/^\d{10}$/.test(shipping.phone)) e.phone = 'Enter a valid 10-digit phone number';
    if (!shipping.country.trim()) e.country = 'Country is required';
    if (!shipping.street.trim()) e.street = 'Street address is required';
    if (!shipping.city.trim()) e.city = 'City is required';
    if (!shipping.state.trim()) e.state = 'State is required';
    if (!/^\d{6}$/.test(shipping.pin)) e.pin = 'Enter a valid 6-digit PIN code';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleShippingChange = (field, val) => {
    setShipping(prev => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleContinueToPayment = () => {
    if (validate()) setStep(2);
  };

  const handlePlaceOrder = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
      const payload = {
        user_id: user.id,
        items: cartItems,
        shipping,
        payment_method: paymentMethod,
        subtotal,
        discount,
        cod_fee: codFee,
        total,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        status: 'Confirmed'
      };

      const res = await fetch('http://127.0.0.1/ecommerce_project2/backend/orders.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setOrderId(data.order_id);
      }
    } catch (err) {
      console.error('Order save error:', err);
    }

    localStorage.removeItem('cartItems');
    localStorage.removeItem('appliedCoupon');
    setStep(4);
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert('Please select a reason for cancellation');
      return;
    }

    setCancelling(true);
    try {
      const res = await fetch('http://127.0.0.1/ecommerce_project2/backend/orders.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, cancel_reason: cancelReason })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.removeItem('cartItems');
        localStorage.removeItem('appliedCoupon');
        navigate('/orders');
      } else {
        alert(data.message || 'Failed to cancel order');
      }
    } catch (err) {
      console.error('Cancel error:', err);
      alert('Failed to cancel order');
    } finally {
      setCancelling(false);
      setShowCancelModal(false);
    }
  };

  // --- Step progress indicator ---
  const StepBar = () => (
    <div className="step-bar">
      <div className={`step-item ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
        <div className="step-circle">{step > 1 ? <CheckCheck size={14} /> : '1'}</div>
        <span>Shipping</span>
      </div>
      <div className={`step-line ${step > 1 ? 'done' : ''}`} />
      <div className={`step-item ${step >= 2 ? 'active' : ''} ${step > 2 ? 'done' : ''}`}>
        <div className="step-circle">{step > 2 ? <CheckCheck size={14} /> : '2'}</div>
        <span>Payment</span>
      </div>
      <div className={`step-line ${step > 2 ? 'done' : ''}`} />
      <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
        <div className="step-circle">3</div>
        <span>Review</span>
      </div>
    </div>
  );

  // --- Order Summary Sidebar ---
  const OrderSummary = () => (
    <div className="checkout-summary-card">
      <h3>Order Summary</h3>
      <div className="summary-items">
        {cartItems.map(item => (
          <div key={item.id} className="summary-item-row">
            <span className="summary-item-name">{item.name} x{item.quantity}</span>
            <span className="summary-item-price">₹{fmt(parseFloat(item.price) * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="summary-divider" />
      <div className="summary-row"><span>Subtotal</span><span>₹{fmt(subtotal)}</span></div>
      {discount > 0 && (
        <div className="summary-row discount"><span>Discount</span><span>-₹{fmt(discount)}</span></div>
      )}
      {codFee > 0 && (
        <div className="summary-row cod-fee"><span>COD Fee</span><span>+₹{fmt(codFee)}</span></div>
      )}
      <div className="summary-row"><span>Shipping</span><span className="text-green">Free</span></div>
      <div className="summary-divider" />
      <div className="summary-total"><span>Total</span><span className="total-blue">₹{fmt(total)}</span></div>
    </div>
  );

  // ======================== STEP 1 ========================
  if (step === 1) return (
    <div className="checkout-page fade-in">
      <div className="checkout-inner">
        <h1 className="checkout-title">Checkout</h1>
        <StepBar />
        <div className="checkout-grid">
          <div className="checkout-main">
            <div className="checkout-card">
              <h2>Shipping Address</h2>
              <div className="form-group full">
                <label>Full Name <span className="req">*</span></label>
                <input placeholder="Enter Full Name" value={shipping.fullName} onChange={e => handleShippingChange('fullName', e.target.value)} className={errors.fullName ? 'error' : ''} />
                {errors.fullName && <p className="err-msg">{errors.fullName}</p>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number <span className="req">*</span></label>
                  <input placeholder="Enter Phone Number" value={shipping.phone} onChange={e => handleShippingChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} className={errors.phone ? 'error' : ''} />
                  {errors.phone && <p className="err-msg">{errors.phone}</p>}
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input placeholder="Enter Country" value={shipping.country} onChange={e => handleShippingChange('country', e.target.value)} />
                </div>
              </div>
              <div className="form-group full">
                <label>Street Address <span className="req">*</span></label>
                <input placeholder="Enter Street Address" value={shipping.street} onChange={e => handleShippingChange('street', e.target.value)} className={errors.street ? 'error' : ''} />
                {errors.street && <p className="err-msg">{errors.street}</p>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City <span className="req">*</span></label>
                  <input placeholder="Enter City" value={shipping.city} onChange={e => handleShippingChange('city', e.target.value)} className={errors.city ? 'error' : ''} />
                  {errors.city && <p className="err-msg">{errors.city}</p>}
                </div>
                <div className="form-group">
                  <label>State <span className="req">*</span></label>
                  <input placeholder="Enter State" value={shipping.state} onChange={e => handleShippingChange('state', e.target.value)} className={errors.state ? 'error' : ''} />
                  {errors.state && <p className="err-msg">{errors.state}</p>}
                </div>
              </div>
              <div className="form-group half">
                <label>PIN Code <span className="req">*</span></label>
                <input placeholder="Enter PIN Code" value={shipping.pin} onChange={e => handleShippingChange('pin', e.target.value.replace(/\D/g, '').slice(0, 6))} className={errors.pin ? 'error' : ''} />
                {errors.pin && <p className="err-msg">{errors.pin}</p>}
              </div>
              <button className="btn-continue" onClick={handleContinueToPayment}>Continue to Payment</button>
            </div>
          </div>
          <OrderSummary />
        </div>
      </div>
    </div>
  );

  // ======================== STEP 2 ========================
  if (step === 2) return (
    <div className="checkout-page fade-in">
      <div className="checkout-inner">
        <h1 className="checkout-title">Checkout</h1>
        <StepBar />
        <div className="checkout-grid">
          <div className="checkout-main">
            <div className="checkout-card">
              <h2>Payment Method</h2>
              {/* COD */}
              <div className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`} onClick={() => setPaymentMethod('cod')}>
                <div className="pay-icon-wrap"><Package size={22} /></div>
                <div className="pay-info"><strong>Cash on Delivery</strong><span>Pay when your order arrives (+₹10 fee)</span></div>
                <div className={`pay-radio ${paymentMethod === 'cod' ? 'checked' : ''}`} />
              </div>
              {/* Card */}
              <div className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`} onClick={() => setPaymentMethod('card')}>
                <div className="pay-icon-wrap"><CreditCard size={22} /></div>
                <div className="pay-info"><strong>Credit / Debit Card</strong><span>Visa, Mastercard, RuPay accepted</span></div>
                <div className={`pay-radio ${paymentMethod === 'card' ? 'checked' : ''}`} />
              </div>
              {paymentMethod === 'card' && (
                <div className="card-form fade-in">
                  <div className="form-group full">
                    <label>Card Number</label>
                    <input placeholder="1234 5678 9012 3456" value={cardDetails.number} onChange={e => setCardDetails(p => ({ ...p, number: e.target.value }))} maxLength={19} />
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Expiry Date</label><input placeholder="MM/YY" value={cardDetails.expiry} onChange={e => setCardDetails(p => ({ ...p, expiry: e.target.value }))} maxLength={5} /></div>
                    <div className="form-group"><label>CVV</label><input placeholder="123" type="password" value={cardDetails.cvv} onChange={e => setCardDetails(p => ({ ...p, cvv: e.target.value }))} maxLength={3} /></div>
                  </div>
                </div>
              )}
              {/* UPI */}
              <div className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`} onClick={() => setPaymentMethod('upi')}>
                <div className="pay-icon-wrap"><Smartphone size={22} /></div>
                <div className="pay-info"><strong>UPI</strong><span>Google Pay, PhonePe, Paytm</span></div>
                <div className={`pay-radio ${paymentMethod === 'upi' ? 'checked' : ''}`} />
              </div>
              {paymentMethod === 'upi' && (
                <div className="upi-qr fade-in">
                  <p>Scan QR to pay ₹{fmt(total)}</p>
                  <img src={SAMPLE_QR} alt="UPI QR Code" />
                  <span>Open any UPI app and scan this code</span>
                </div>
              )}

              <div className="btn-row">
                <button className="btn-back" onClick={() => setStep(1)}>Back</button>
                <button className="btn-review" onClick={() => setStep(3)}>Review Order</button>
              </div>
            </div>
          </div>
          <OrderSummary />
        </div>
      </div>
    </div>
  );

  // ======================== STEP 3 ========================
  if (step === 3) return (
    <div className="checkout-page fade-in">
      <div className="checkout-inner">
        <h1 className="checkout-title">Checkout</h1>
        <StepBar />
        <div className="checkout-grid">
          <div className="checkout-main">
            <div className="checkout-card">
              <h2>Review Your Order</h2>
              <div className="review-block">
                <p className="review-label">Shipping to:</p>
                <p className="review-val bold">{shipping.fullName}</p>
                <p className="review-val">{shipping.street}, {shipping.city}, {shipping.state} {shipping.pin}</p>
                <p className="review-val">{shipping.phone}</p>
              </div>
              <div className="review-block">
                <p className="review-label">Payment:</p>
                <p className="review-val">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'card' ? 'Credit / Debit Card' : 'UPI'}</p>
              </div>
              <div className="review-items">
                {cartItems.map(item => (
                  <div key={item.id} className="review-item">
                    <img src={item.image_url} alt={item.name} />
                    <div className="review-item-info">
                      <p>{item.name}</p>
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <span className="review-item-price">₹{fmt(parseFloat(item.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="btn-row">
                <button className="btn-back" onClick={() => setStep(2)}>Back</button>
                <button className="btn-place-order" onClick={handlePlaceOrder}>
                  Place Order · ₹{fmt(total)}
                </button>
              </div>
            </div>
          </div>
          <OrderSummary />
        </div>
      </div>
    </div>
  );

  // ======================== STEP 4 — CONFIRMED ========================
  return (
    <div className="checkout-page fade-in">
      <div className="checkout-inner confirmed-page">
        <div className="confirmed-header">
          <h1>Order #{orderId}</h1>
          <div className="confirmed-badge"><CheckCircle size={16} /> Confirmed</div>
        </div>
        <p className="confirmed-date">Placed on {today}</p>

        {/* Progress Bar */}
        <div className="order-progress-card">
          <h3>Order Progress</h3>
          <div className="progress-steps">
            {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((s, i) => (
              <div key={s} className={`progress-step ${i <= 1 ? 'done' : ''}`}>
                <div className="progress-circle">
                  {i === 0 ? <Clock size={18} /> : i === 1 ? <CheckCircle size={18} /> : i === 2 ? <Package size={18} /> : i === 3 ? <Truck size={18} /> : <CheckCheck size={18} />}
                </div>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="confirmed-card">
          <h3>Items Ordered</h3>
          {cartItems.map(item => (
            <div key={item.id} className="review-item">
              <img src={item.image_url} alt={item.name} />
              <div className="review-item-info">
                <p>{item.name}</p>
                <span>Qty: {item.quantity}</span>
              </div>
              <span className="review-item-price">₹{fmt(parseFloat(item.price) * item.quantity)}</span>
            </div>
          ))}
          <div className="confirmed-totals">
            <div className="summary-row"><span>Subtotal</span><span>₹{fmt(subtotal)}</span></div>
            {discount > 0 && <div className="summary-row discount"><span>Discount</span><span>-₹{fmt(discount)}</span></div>}
            {codFee > 0 && <div className="summary-row cod-fee"><span>COD Fee</span><span>+₹{fmt(codFee)}</span></div>}
            <div className="summary-total confirmed-total-row"><span>Total</span><span className="total-blue">₹{fmt(total)}</span></div>
          </div>
        </div>

        {/* Address + Payment */}
        <div className="confirmed-bottom-grid">
          <div className="confirmed-card">
            <h3><MapPin size={16} /> Shipping Address</h3>
            <p className="bold">{shipping.fullName}</p>
            <p>{shipping.street}</p>
            <p>{shipping.city}, {shipping.state} {shipping.pin}</p>
            <p>{shipping.country}</p>
          </div>
          <div className="confirmed-card">
            <h3>Payment</h3>
            <div className="pay-method-display">
              {paymentMethod === 'cod' ? <Package size={20} /> : paymentMethod === 'card' ? <CreditCard size={20} /> : <Smartphone size={20} />}
              <span>{paymentMethod === 'cod' ? 'Cash On Delivery' : paymentMethod === 'card' ? 'Credit / Debit Card' : 'UPI'}</span>
            </div>
            <p className="status-pending">Status: <span>Confirmed</span></p>
            {appliedCoupon && <p className="coupon-tag">Coupon: {appliedCoupon.code}</p>}
          </div>
        </div>

        <button className="btn-continue" onClick={() => navigate('/products')}>Continue Shopping</button>
        <button className="btn-cancel-order" onClick={handleCancelClick}>Cancel Order</button>
      </div>
    </div>
  );

  // Cancel Modal
  if (showCancelModal) {
    return (
      <div className="checkout-page fade-in">
        <div className="cancel-modal-overlay">
          <div className="cancel-modal">
            <h2>Cancel Order</h2>
            <p>Please select a reason for cancelling your order:</p>
            <div className="cancel-reasons">
              {[
                'Ordered by mistake',
                'Found a better price elsewhere',
                'Changed my mind',
                'Delivery time too long',
                'Product no longer needed',
                'Other reason'
              ].map((reason) => (
                <label key={reason} className={`cancel-reason-option ${cancelReason === reason ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={cancelReason === reason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
            {cancelReason === 'Other reason' && (
              <textarea
                className="cancel-other-reason"
                placeholder="Please specify your reason..."
                value={cancelReason === 'Other reason' ? '' : ''}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            )}
            <div className="cancel-modal-actions">
              <button className="btn-back" onClick={() => setShowCancelModal(false)} disabled={cancelling}>
                Keep Order
              </button>
              <button className="btn-place-order" onClick={handleCancelOrder} disabled={cancelling}>
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default CheckoutPage;
