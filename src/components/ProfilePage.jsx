import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Settings, Package, Save, Loader2, ShoppingBag, ArrowLeft, Heart } from 'lucide-react';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setFormData({
        fullName: parsedUser.full_name || parsedUser.username,
        email: parsedUser.email
      });
      setPreview(parsedUser.profile_image ? `http://127.0.0.1/ecommerce_project2/${parsedUser.profile_image}` : null);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    submitData.append('userId', user.id);
    submitData.append('fullName', formData.fullName);
    if (selectedFile) {
      submitData.append('profileImage', selectedFile);
    }

    try {
      const response = await fetch('http://127.0.0.1/ecommerce_project2/backend/update_profile.php', {
        method: 'POST',
        body: submitData,
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        alert('Profile updated successfully!');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="profile-loading">Loading...</div>;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
  };

  return (
    <div className="profile-page fade-in">
      <div className="profile-container">
        <Link to="/" className="btn-back">
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="profile-title">My Profile</h1>
        
        <div className="profile-grid">
          {/* Left Sidebar Card */}
          <div className="profile-card sidebar-card">
            <div className="profile-avatar-container" onClick={() => fileInputRef.current.click()}>
              {preview ? (
                <img src={preview} alt="Avatar" className="main-avatar" />
              ) : (
                <div className="avatar-placeholder-large">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="avatar-edit-badge">
                <Camera size={24} />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                accept="image/*"
              />
            </div>
            
            <h2 className="profile-name">{formData.fullName}</h2>
            <p className="profile-email">{user.email}</p>
            <span className="profile-role-badge">{user.role}</span>
            <p className="profile-member-since">Member since {formatDate(user.created_at)}</p>
          </div>

          {/* Right Edit Form Card */}
          <div className="profile-card edit-card">
            <div className="card-header">
              <Settings size={20} />
              <h3>Edit Profile</h3>
            </div>

            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleChange} 
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label>Email (read-only)</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  readOnly 
                  className="readonly-input"
                />
              </div>

              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                <span>Save Changes</span>
              </button>
            </form>
          </div>
        </div>

        {/* Recent Orders Section */}
        {/* Recent Orders Section */}
        <div className="profile-card orders-card">
          <div className="card-header">
            <div className="header-left">
              <Package size={22} />
              <h3>Recent Orders</h3>
            </div>
            <Link to="/orders" className="btn-view-all">View All Orders</Link>
          </div>
          
          <div className="orders-content">
            <Link to="/" className="no-orders-link">
              <ShoppingBag size={40} />
              <span>No orders yet.</span>
              <span className="start-shopping-text">Start shopping!</span>
            </Link>
          </div>
        </div>

        {/* Wishlist Section */}
        <div className="profile-card wishlist-preview-card">
          <div className="card-header">
            <div className="header-left">
              <Heart size={22} className="heart-icon" />
              <h3>My Wishlist</h3>
            </div>
            <Link to="/wishlist" className="btn-view-all">View Full Wishlist</Link>
          </div>
          
          <div className="wishlist-preview-content">
             <Link to="/wishlist" className="wishlist-empty-link">
                <Heart size={40} />
                <span>Manage your saved items</span>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

