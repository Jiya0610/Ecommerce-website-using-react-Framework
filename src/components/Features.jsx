import React from 'react';
import { Truck, ShieldCheck, RotateCcw, TrendingUp } from 'lucide-react';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: <Truck size={30} />,
      title: 'Free Shipping',
      desc: 'On orders over $50'
    },
    {
      icon: <ShieldCheck size={30} />,
      title: 'Secure Payment',
      desc: '100% secure checkout'
    },
    {
      icon: <RotateCcw size={30} />,
      title: 'Easy Returns',
      desc: '30-day return policy'
    },
    {
      icon: <TrendingUp size={30} />,
      title: 'Best Deals',
      desc: 'Price match guarantee'
    }
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        {features.map((feature, index) => (
          <div key={index} className="feature-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="feature-icon-wrapper">
              {feature.icon}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
