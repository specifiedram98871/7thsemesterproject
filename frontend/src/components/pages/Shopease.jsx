
import React, { useState } from 'react';
import '../CSSForFooter/Shopease.css';


function Shopease() {
  const [cart, setCart] = useState([]);
  
  const products = [
    { id: 1, name: 'Product 1', price: 29.99, image: '/image/product1.png' },
    { id: 2, name: 'Product 2', price: 49.99, image: '/image/product2.png' },
    { id: 3, name: 'Product', price: 19.99, image: '/image/product.png' }
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productToRemove) => {
    setCart(cart.filter(product => product.id !== productToRemove.id));
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Shopease</h1>
        <div className="cart-summary">
          <h2>Cart ({cart.length})</h2>
          {cart.map((product, index) => (
            <div key={index} className="cart-item">
              <img src={product.image} alt={product.name} />
              <p>{product.name}</p>
              <button onClick={() => removeFromCart(product)}>Remove</button>
            </div>
          ))}
        </div>
      </header>

      <main className="product-list">
  <h2>Products</h2>
  <div className="products">
    {products.map(product => (
      <div key={product.id} className="product-card">
        {/* Use the product image URL */}
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p>${product.price}</p>
        <button onClick={() => addToCart(product)}>Add to Cart</button>
      </div>
    ))}
  </div>
</main>

    </div>
  );
}

export default Shopease;
