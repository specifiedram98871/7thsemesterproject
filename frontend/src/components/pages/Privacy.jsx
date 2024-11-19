import React from 'react';
import '../CSSForFooter/privacy.css'

const Privacy = () => {
  return (
    <div className="privacy-container">
      <br></br>
      <h1 className="title">Privacy Policy</h1>
      <p className="description">
        Your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your personal information.
      </p>
      
      <h2 className="section-title">1. Information Collection</h2>
      <p className="text">
        We collect personal information that you provide directly to us when you use our services, such as when you create an account, make a purchase, or contact customer support.
      </p>
      
      <h2 className="section-title">2. How We Use Your Information</h2>
      <p className="text">
        We use your personal information to provide and improve our services, process transactions, send notifications, and ensure the security of our platform.
      </p>

      <h2 className="section-title">3. Sharing of Information</h2>
      <p className="text">
        We do not share your personal information with third parties, except when required by law or to protect our legal rights.
      </p>

      <h2 className="section-title">4. Cookies and Tracking</h2>
      <p className="text">
        Our website uses cookies and similar tracking technologies to enhance your browsing experience and analyze site traffic. You can control cookies through your browser settings.
      </p>

      <h2 className="section-title">5. Data Security</h2>
      <p className="text">
        We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
      </p>

      <h2 className="section-title">6. Changes to This Policy</h2>
      <p className="text">
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
      </p>

      <h2 className="section-title">7. Contact Us</h2>
      <p className="text">
        If you have any questions about this Privacy Policy, please contact us at privacy@example.com.
      </p>
    </div>
  );
}

export default Privacy;
