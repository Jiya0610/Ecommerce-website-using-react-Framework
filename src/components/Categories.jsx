import React from 'react';
import { Link } from 'react-router-dom';
import './Categories.css';

const Categories = () => {
  const categories = [
    { name: 'Beauty & Health', img: 'https://i.pinimg.com/736x/1a/3c/44/1a3c446da379763ddd76ccee92133778.jpg' },
    { name: 'Books', img: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800' },
    { name: 'Electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800' },
    { name: 'Fashion', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800' },
    { name: 'Home & Kitchen', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800' },
    { name: 'Sports & Fitness', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800' },
  ];

  return (
    <section className="categories-section">
      <div className="container">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((cat, index) => (
            <Link 
              key={index} 
              to={`/products?category=${cat.name}`} 
              className="category-card fade-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="category-img-wrapper">
                <img src={cat.img} alt={cat.name} />
              </div>
              <div className="category-info">
                <h3>{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
