import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/HomePage'; 
import About from './pages/AboutPage'; 
import Footer from './components/Footer'; 
import Navbar from './components/Navbar'; 
import Products from './components/Products';
import AuthPopup from './components/AuthPopup'; // Thêm AuthPopup vào import

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Quản lý trạng thái Popup

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
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

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <Router>
      <div>
        <Navbar 
          cartItems={cartItems} 
          setCartItems={setCartItems} 
          allProducts={allProducts} 
          setFilteredProducts={setFilteredProducts} 
          onOpenPopup={handleOpenPopup} // Thêm props để mở Popup
        />
        <Routes>
          <Route path="/" element={<Home allProducts={allProducts} filteredProducts={filteredProducts} addToCart={addToCart} />} /> 
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products allProducts={allProducts} filteredProducts={filteredProducts} addToCart={addToCart} />} />
        </Routes>
        <Footer />
        <AuthPopup isOpen={isPopupOpen} onClose={handleClosePopup} /> {/* Thêm AuthPopup */}
      </div>
    </Router>
  );
}

export default App;
