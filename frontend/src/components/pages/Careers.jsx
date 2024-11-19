import React from 'react';
import '../CSSForFooter/career.css';

const Careers = () => {
  return (
    <div className="careers-container">
      <div className="careers-banner">
        <h1>Join the Shopease Team</h1>
        <p>We're always looking for talented individuals to grow with us!</p>
      </div>

      <section className="careers-intro">
        <h2>Why Work With Us?</h2>
        <p>
          At Shopease, we’re on a mission to transform the online shopping experience for millions of customers around the globe. We believe in creating an innovative, inclusive, and growth-oriented work environment for our team. If you're passionate about e-commerce and are looking to make an impact, we’d love to have you on board!
        </p>
      </section>

      <section className="open-positions">
        <h2>Open Positions</h2>
        <div className="job-listing">
          <h3>Front-End Developer</h3>
          <p>Location: Remote</p>
          <p>
            We're looking for a skilled Front-End Developer with experience in React, JavaScript, and responsive web design. You will work closely with our development and design teams to create seamless, engaging user interfaces.
          </p>
          <button>Apply Now</button>
        </div>

        <div className="job-listing">
          <h3>Product Manager</h3>
          <p>Location: San Francisco, CA</p>
          <p>
            We're looking for a Product Manager with a passion for driving product innovation and cross-functional collaboration. You will oversee the product development lifecycle and ensure alignment with our customer needs.
          </p>
          <button>Apply Now</button>
        </div>

        <div className="job-listing">
          <h3>Customer Support Specialist</h3>
          <p>Location: Remote</p>
          <p>
            Join our growing customer service team! We're looking for someone who can handle customer inquiries with empathy, provide solutions efficiently, and ensure customer satisfaction.
          </p>
          <button>Apply Now</button>
        </div>
      </section>

      <section className="careers-footer">
        <h2>Don’t see the right role?</h2>
        <p>
          We’re always on the lookout for amazing talent! Send us your resume and tell us what you’d bring to the Shopease team at <a href="mailto:careers@shopease.com">careers@shopease.com</a>.
        </p>
      </section>
    </div>
  );
};

export default Careers;
