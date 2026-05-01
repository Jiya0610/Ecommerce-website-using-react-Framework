import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, LogIn, UserPlus, User, Package, LogOut, ChevronDown, Heart, ShoppingCart } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isCartPage = location.pathname === '/cart' || location.pathname === '/checkout';
  const hideSearch = isAuthPage || isCartPage;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check for logged in user
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    navigate('/login');
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <img src="/logo.png" alt="ShopSphere" className="logo-img" />
            <span className="logo-text">ShopSphere</span>
          </Link>

          {!hideSearch && (
            <div className="nav-search">
              <Search className="search-icon" size={18} />
              <input type="text" placeholder="Search items..." />
            </div>
          )}

          <div className="nav-actions">
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            {!isAuthPage && (
              <div className="auth-section">
                {user ? (
                  <div className="user-profile-dropdown">
                    <div 
                      className="profile-trigger" 
                      onClick={() => setShowDropdown(!showDropdown)}
                      onMouseEnter={() => setShowDropdown(true)}
                    >
                      <div className="user-avatar">
                        {user.profile_image ? (
                          <img src={`http://127.0.0.1/ecommerce_project2/${user.profile_image}`} alt={user.username} />
                        ) : (
                          <div className="avatar-initial">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="username">{user.username}</span>
                      <ChevronDown size={16} className={`chevron ${showDropdown ? 'rotate' : ''}`} />
                    </div>

                    {showDropdown && (
                      <div 
                        className="dropdown-menu fade-in"
                        onMouseLeave={() => setShowDropdown(false)}
                      >
                        <Link to="/profile" onClick={() => setShowDropdown(false)} className="dropdown-item">
                          <User size={18} />
                          <span>Profile</span>
                        </Link>
                        <Link to="/orders" className="dropdown-item">
                          <Package size={18} />
                          <span>My Orders</span>
                        </Link>
                        <Link to="/wishlist" onClick={() => setShowDropdown(false)} className="dropdown-item">
                          <Heart size={18} />
                          <span>Wishlist</span>
                        </Link>
                        <Link to="/cart" onClick={() => setShowDropdown(false)} className="dropdown-item">
                          <ShoppingCart size={18} />
                          <span>My Cart</span>
                        </Link>
                        <div className="dropdown-divider"></div>
                        <button onClick={handleLogout} className="dropdown-item logout-item">
                          <LogOut size={18} />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="auth-buttons">
                    <Link to="/login" className="btn-login">
                      <LogIn size={18} />
                      <span>Login</span>
                    </Link>
                    <Link to="/register" className="btn-register">
                      <UserPlus size={18} />
                      <span>Register</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

