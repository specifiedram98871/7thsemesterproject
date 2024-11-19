import React from 'react';
import '../CSSForFooter/returnPolicy.css'

const ReturnPolicy = () => {
  return (
    <div className="return-policy-container">
      <br></br>
      <h1 className="title">Return Policy</h1>
      <p className="description">
        Thank you for shopping with us. If you are not entirely satisfied with your purchase, we're here to help.
      </p>
      <h2 className="section-title">Returns</h2>
      <p className="text">
        You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it.
      </p>
      <h2 className="section-title">Refunds</h2>
      <p className="text">
        Once we receive your item, we will inspect it and notify you that we have received your returned item. If your return is approved, we will initiate a refund to your original method of payment.
      </p>
      <h2 className="section-title">Shipping</h2>
      <p className="text">
        You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.
      </p>
    </div>
  );
}

export default ReturnPolicy;
