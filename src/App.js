import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/HomePage'; 
import About from './pages/AboutPage'; 
import Footer from './components/Footer'; 
import Navbar from './components/Navbar'; 
import Products from './components/Products';

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    const existingProduct = cartItems.find((item) => item.product_id === product.product_id);
    
    if (existingProduct) {
      // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
      setCartItems(cartItems.map((item) => 
        item.product_id === product.product_id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm với quantity là 1
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    
    console.log('Product added to cart:', product);
  };
  

  return (
    <Router>
      <div>
        {/* Truyền cartItems và setCartItems vào Navbar */}
        <Navbar cartItems={cartItems} setCartItems={setCartItems} />
        <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} /> 
        <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products addToCart={addToCart} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
