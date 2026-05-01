import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Info } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-heading slide-in-left">
            Everything You Love, <br />
            <span>In One Place.</span>
          </h1>
          <p className="hero-para fade-in">
            Discover trending products at unbeatable prices, all in one platform. 
            With fast shipping, simple returns, and dedicated customer service, 
            we make online shopping easier than ever.
          </p>
          <div className="hero-btns fade-in">
            <Link to="/products" className="btn-shop">
              <ShoppingBag size={20} />
              <span>  Shop Now</span>
            </Link>
            <button className="btn-details">
              <Info size={20} />
              <span>Feature Details</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
