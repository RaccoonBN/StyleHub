import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/HomePage'; 
import About from './pages/AboutPage'; 
import Footer from './components/Footer'; 
import Navbar from './components/Navbar'; 
import Products from './components/Products';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/products');
        const data = await response.json();
        setAllProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const existingProduct = cartItems.find((item) => item.product_id === product.product_id);
    
    if (existingProduct) {
      setCartItems(cartItems.map((item) => 
        item.product_id === product.product_id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    
  };

  return (
    <Router>
      <div>
        <Navbar cartItems={cartItems} setCartItems={setCartItems} />
        <Routes>
          <Route path="/" element={<Home allProducts={allProducts} addToCart={addToCart} />} /> 
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products allProducts={allProducts} addToCart={addToCart} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
