import React, { useState } from 'react';
import '../CSSForFooter/faq.css';

const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    {
      question: "What is your return policy?",
      answer: "You can return any item within 30 days of purchase for a full refund."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you will receive a tracking number via email."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we offer international shipping to select countries."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept Khalti"
    },
    {
      question: "Can I cancel or modify my order?",
      answer: "You can cancel or modify your order within 24 hours of placing it."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can contact customer support through the contact us section"
    },
    {
      question: "What should I do if I receive a damaged item?",
      answer: "If you receive a damaged item, please contact us within 7 days for a replacement."
    },
    {
      question: "Is there a warranty on your products?",
      answer: "No, But damaged goods can be returned within 7 days"
    },
    {
      question: "Do you offer gift cards?",
      answer: "No, we don't offer gift cards"
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping usually takes less than 24 hours for most orders."
    },
    {
      question: "Do you offer bulk purchase discounts?",
      answer: "Yes, we offer discounts for bulk purchases. Please contact us for more details."
    }
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1>Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div
              className="faq-question"
              onClick={() => toggleExpand(index)}
            >
              <h2>{faq.question}</h2>
              <span>{expandedIndex === index ? '-' : '+'}</span>
            </div>
            {expandedIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
