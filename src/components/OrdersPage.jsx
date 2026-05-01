import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowLeft, Clock, CheckCircle, CheckCheck, Truck, ShoppingBag, Tag, XCircle } from 'lucide-react';
import './OrdersPage.css';

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'Pending': return <Clock size={18} />;
    case 'Confirmed': return <CheckCircle size={18} />;
    case 'Processing': return <Package size={18} />;
    case 'Shipped': return <Truck size={18} />;
    case 'Delivered': return <CheckCheck size={18} />;
    case 'Cancelled': return <XCircle size={18} />;
    default: return <Clock size={18} />;
  }
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user) fetchOrders();
    else setLoading(false);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://127.0.0.1/ecommerce_project2/backend/orders.php?user_id=${user.id}`);
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelReason('');
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
        body: JSON.stringify({ order_id: selectedOrderId, cancel_reason: cancelReason })
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
        setShowCancelModal(false);
      } else {
        alert(data.message || 'Failed to cancel order');
      }
    } catch (err) {
      console.error('Cancel error:', err);
      alert('Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const fmt = (n) => parseFloat(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  const statusIndex = (status) => ORDER_STATUSES.indexOf(status);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) return (
    <div className="orders-page fade-in">
      <div className="orders-container">
        <div className="loading-orders">Loading your orders...</div>
      </div>
    </div>
  );

  return (
    <div className="orders-page fade-in">
      <div className="orders-container">
        <Link to="/" className="btn-back-link">
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </Link>

        <h1 className="orders-title">My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-orders-card">
            <div className="icon-container">
              <Package size={80} strokeWidth={1.5} />
            </div>
            <h2>No orders yet</h2>
            <p>Start shopping to see your orders here</p>
            <Link to="/products" className="btn-browse">Explore Collections</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => {
              const currentStatusIdx = statusIndex(order.status);
              const isExpanded = expandedOrder === order.id;
              const payLabel = order.payment_method === 'cod' ? 'Cash on Delivery'
                : order.payment_method === 'card' ? 'Credit / Debit Card' : 'UPI';

              return (
                <div key={order.id} className="order-card">
                  {/* Order Header */}
                  <div className="order-card-header" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                    <div className="order-meta">
                      <span className="order-num">Order #{order.id}</span>
                      <span className="order-date">{formatDate(order.created_at)}</span>
                    </div>
                    <div className="order-header-right">
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        <StatusIcon status={order.status} /> {order.status}
                      </span>
                      <span className="order-total-amount">₹{fmt(order.total)}</span>
                      <span className="expand-toggle">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* Quick item preview */}
                  {!isExpanded && (
                    <div className="order-items-preview">
                      {order.items.slice(0, 3).map(item => (
                        <div key={item.id} className="preview-item">
                          <img src={item.image_url} alt={item.name} />
                          <span>{item.name}</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <span className="more-items">+{order.items.length - 3} more</span>
                      )}
                    </div>
                  )}

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="order-details fade-in">
                      {/* Progress Tracker */}
                      <div className="track-section">
                        <h4>Order Progress</h4>
                        <div className="track-steps">
                          {ORDER_STATUSES.map((s, i) => (
                            <React.Fragment key={s}>
                              <div className={`track-step ${i <= currentStatusIdx ? 'done' : ''}`}>
                                <div className="track-circle">
                                  <StatusIcon status={s} />
                                </div>
                                <span>{s}</span>
                              </div>
                              {i < ORDER_STATUSES.length - 1 && (
                                <div className={`track-line ${i < currentStatusIdx ? 'done' : ''}`} />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="detail-section">
                        <h4>Items Ordered</h4>
                        {order.items.map(item => (
                          <div key={item.id} className="detail-item">
                            <img src={item.image_url} alt={item.name} />
                            <div className="detail-item-info">
                              <p>{item.name}</p>
                              <span>Qty: {item.quantity}</span>
                            </div>
                            <span className="detail-price">₹{fmt(parseFloat(item.price) * item.quantity)}</span>
                          </div>
                        ))}

                        <div className="detail-totals">
                          <div className="total-row"><span>Subtotal</span><span>₹{fmt(order.subtotal)}</span></div>
                          {parseFloat(order.discount) > 0 && (
                            <div className="total-row green">
                              <span><Tag size={13} /> {order.coupon_code}</span>
                              <span>-₹{fmt(order.discount)}</span>
                            </div>
                          )}
                          {parseFloat(order.cod_fee) > 0 && (
                            <div className="total-row yellow"><span>COD Fee</span><span>+₹{fmt(order.cod_fee)}</span></div>
                          )}
                          <div className="total-row shipping-row"><span>Shipping</span><span className="green-text">Free</span></div>
                          <div className="total-row grand-total"><span>Total</span><span className="blue-text">₹{fmt(order.total)}</span></div>
                        </div>
                      </div>

                      {/* Bottom Info Grid */}
                      <div className="detail-bottom-grid">
                        <div className="detail-info-box">
                          <h4>Shipping Address</h4>
                          <p className="bold">{order.shipping.fullName}</p>
                          <p>{order.shipping.street}</p>
                          <p>{order.shipping.city}, {order.shipping.state} {order.shipping.pin}</p>
                          <p>{order.shipping.country}</p>
                          <p>{order.shipping.phone}</p>
                        </div>
                        <div className="detail-info-box">
                          <h4>Payment</h4>
                          <p className="bold">{payLabel}</p>
                          <p>Status: <span className="yellow-text">{order.status}</span></p>
                          {order.coupon_code && <p className="green-text">Coupon: {order.coupon_code}</p>}
                        </div>
                      </div>

                      {/* Cancel Button for Pending/Confirmed orders */}
                      {(order.status === 'Pending' || order.status === 'Confirmed') && (
                        <div className="cancel-order-section">
                          <button 
                            className="btn-cancel-order" 
                            onClick={(e) => { e.stopPropagation(); handleCancelClick(order.id); }}
                          >
                            <XCircle size={16} /> Cancel Order
                          </button>
                        </div>
                      )}

                      {/* Cancel Reason Display */}
                      {order.status === 'Cancelled' && order.cancel_reason && (
                        <div className="cancel-reason-display">
                          <h4><XCircle size={16} /> Cancellation Reason</h4>
                          <p>{order.cancel_reason}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="cancel-modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="cancel-modal" onClick={e => e.stopPropagation()}>
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
      )}
    </div>
  );
};

export default OrdersPage;
