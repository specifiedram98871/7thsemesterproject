import React from 'react';
import '../CSSForFooter/aboutus.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-banner">
        <h1>Welcome to Shopease</h1>
        <p>Your trusted online shopping destination</p>
      </div>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          At Shopease, our mission is to make online shopping simple, enjoyable, and accessible to everyone. We offer a seamless, personalized shopping experience, helping you find the best products without the hassle.
        </p>
      </section>

      <section className="about-section">
        <h2>Our Story</h2>
        <p>
          Shopease was founded with the vision to transform online shopping into a more intuitive, enjoyable, and customer-focused experience. We realized that customers deserve more than just an ordinary platform—they deserve a space that makes finding the right products easier.
        </p>
      </section>

      <section className="about-section">
        <h2>What We Offer</h2>
        <ul>
          <li>Carefully curated selection of products</li>
          <li>Quality and value from trusted brands</li>
          <li>Easy navigation for a hassle-free shopping experience</li>
          <li>Secure payments and fast shipping</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Why Shopease?</h2>
        <p>
          From our user-friendly interface to our strong customer support, we focus on delivering a superior shopping experience. We value trust, convenience, and satisfaction in every transaction.
        </p>
      </section>

      <section className="about-section">
        <h2>Join Our Community</h2>
        <p>
          At Shopease, you're not just a customer—you're part of a growing community that thrives on feedback and continuous improvement. We value every interaction and are here to support you.
        </p>
      </section>

      <footer className="about-footer">
        <p>Thank you for choosing Shopease—where shopping is made easy!</p>
      </footer>
    </div>
  );
};

export default AboutUs;
