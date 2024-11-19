import React from 'react';
import '../CSSForFooter/shopeaseWholesale.css';

const Shopeasewholesale = () => {
  return (
    <div className="wholesale-container">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum impedit consequuntur voluptatem et at praesentium corrupti ipsa obcaecati nesciunt illum?</p>
      <header className="wholesale-header">
        <h1>Welcome to Shopease Wholesale</h1>
        <p>Your trusted partner for bulk purchasing and business solutions.</p>
      </header>

      <section className="wholesale-benefits">
        <h2>Why Choose Shopease Wholesale?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <h3>Competitive Pricing</h3>
            <p>We offer exclusive wholesale prices to ensure you get the best deals on bulk purchases.</p>
          </div>
          <div className="benefit-card">
            <h3>High-Quality Products</h3>
            <p>All products are sourced directly from trusted manufacturers to ensure top-tier quality.</p>
          </div>
          <div className="benefit-card">
            <h3>Custom Orders</h3>
            <p>Looking for something specific? We offer custom orders tailored to your business needs.</p>
          </div>
          <div className="benefit-card">
            <h3>Fast & Reliable Shipping</h3>
            <p>Our logistics network ensures timely delivery so you can keep your business running smoothly.</p>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Shopeasewholesale;
