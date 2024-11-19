import React from 'react';
import '../CSSForFooter/security.css'

const Security = () => {
  return (
    <div className="security-container">
    <br></br>
      <h1 className="title">Security Information</h1>
      <p className="description">
        At our company, protecting your information is a top priority. We use industry-standard security measures to ensure your data is safe.
      </p>
      
      <h2 className="section-title">1. Data Encryption</h2>
      <p className="text">
        We use advanced encryption technologies to protect your personal information. This ensures that data transferred between your browser and our servers is encrypted and secure.
      </p>
      
      <h2 className="section-title">2. Secure Payments</h2>
      <p className="text">
        All payment transactions are processed securely through trusted payment gateways. We do not store any payment information on our servers.
      </p>

      <h2 className="section-title">3. Access Controls</h2>
      <p className="text">
        We implement strict access controls to ensure that only authorized personnel have access to sensitive information.
      </p>

      <h2 className="section-title">4. Regular Security Audits</h2>
      <p className="text">
        Our systems undergo regular security audits to identify potential vulnerabilities and ensure that our security practices are up-to-date.
      </p>

      <h2 className="section-title">5. Reporting Vulnerabilities</h2>
      <p className="text">
        If you believe you have discovered a security vulnerability, please report it to us immediately. We take all reports seriously and will take the necessary actions to resolve any issues.
      </p>
    </div>
  );
}

export default Security;
