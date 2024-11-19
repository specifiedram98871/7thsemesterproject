import React, { useState } from 'react';
import '../CSSForFooter/contactus.css';
import axios from 'axios';



const Contactus = () => {
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [message, setMessage] = useState("");  

  let handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      name,
      email,
      message,
    };
    console.log(data); // Logs data to the console

   try {
     let result = await axios({
       url:`http://localhost:8000/contact`,   
       method:"POST",
       data:data,//it save all data in database(whatever we fill in form and click btn i.e Register )
     })
     console.log(result)
     
   } catch (error) {
    console.log(error)
   }
   setName("")
   setEmail("")
   setMessage("")
  };

  return (
    <div className="contact-container">
     
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, atqu</p>
      <h1>Contact Us</h1>
      <p>We would love to hear from you! Please fill out the form below and we will get in touch with you shortly.</p>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="4"
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button style={{color:"blue", border:"1px solid blue", backgroundColor:"white"}} type="submit" className="submit-button">Send Message</button>
      </form>
    </div>
  );
};

export default Contactus;
