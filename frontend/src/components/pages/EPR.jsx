import React, { useState } from 'react';
import '../CSSForFooter/epr.css'


const EPR = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [complaint, setComplaint] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle form submission, such as sending the data to an API.
    setSubmitted(true);
  };

  return (
    <div className="epr-complaints-container">
      <br></br>
      <h1 className="title">EPR Complaints</h1>
      <p className="description">
        We are committed to resolving any complaints related to our Extended Producer Responsibility (EPR) program. Please use the form below to submit your complaint.
      </p>
      
      {submitted ? (
        <div className="thank-you-message">
          <h2>Thank you for your submission!</h2>
          <p>We will review your complaint and get back to you shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="complaint-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="complaint">Complaint:</label>
            <textarea
              id="complaint"
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="submit-button">Submit Complaint</button>
        </form>
      )}
    </div>
  );
}

export default EPR;
