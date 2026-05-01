import React from 'react';
import { Mail, Phone, MapPin, ExternalLink, Contact } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/logo.png" alt="ShopSphere" />
              <span>ShopSphere</span>
            </div>
            <p className="brand-desc">
              Your ultimate destination for trending products at unbeatable prices. 
              We make online shopping easier, faster, and more reliable.
            </p>
            <div className="social-links">
              <a href="#" aria-label="External Link"><ExternalLink size={20} /></a>
              <a href="#" aria-label="Contact"><Contact size={20} /></a>
              <a href="#" aria-label="Mail"><Mail size={20} /></a>
              <a href="#" aria-label="Phone"><Phone size={20} /></a>
            </div>
          </div>

          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/shop">Shop</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h3>Customer Service</h3>
            <ul>
              <li><a href="/returns">Returns Policy</a></li>
              <li><a href="/shipping">Shipping Info</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms & Conditions</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h3>Contact Us</h3>
            <div className="contact-item">
              <MapPin size={18} />
              <span>123 Shopping St, Retail City, India</span>
            </div>
            <div className="contact-item">
              <Phone size={18} />
              <span>+91 98765 43210</span>
            </div>
            <div className="contact-item">
              <Mail size={18} />
              <span>support@shopsphere.com</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
