import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/HomePage'; 
import About from './pages/AboutPage'; 
import Footer from './components/Footer'; 
import Navbar from './components/Navbar'; 
import Products from './components/Products';
import AuthPopup from './components/AuthPopup'; 
import CheckoutPage from './components/CheckoutPage'; 

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

  const addToCart = async (productId, quantity = 1) => {
    try {
      const acc_id = localStorage.getItem('acc_id'); // Lấy acc_id từ localStorage 
      console.log('acc_id:', acc_id); // Log acc_id để kiểm tra
      if (!acc_id) { 
        console.error('User not logged in'); 
        return; 
      }
      console.log('Sending request to add product to cart with product_id:', productId, 'quantity:', quantity, 'acc_id:', acc_id);
      const response = await fetch('http://localhost:5000/api/addcart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_id: productId,  
                quantity,
                acc_id: acc_id, // Thêm acc_id vào body của yêu cầu
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Response from server:', data);
            // Nếu muốn cập nhật lại giỏ hàng trong state
            setCartItems(prevItems => {
                const existingProduct = prevItems.find(item => item.product_id === productId);

                if (existingProduct) {
                    // Cập nhật số lượng nếu sản phẩm đã có
                    return prevItems.map(item => 
                        item.product_id === productId 
                            ? { ...item, quantity: existingProduct.quantity + quantity } 
                            : item
                    );
                } else {
                    // Thêm sản phẩm mới nếu chưa có
                    return [...prevItems, { product_id: productId, quantity }];
                }
            });
        } else {
            console.error('Failed to add/update product in cart');
            const errorData = await response.json(); 
            console.error('Error response from server:', errorData);
        }
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
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
          addToCart={addToCart}
          allProducts={allProducts} 
          setFilteredProducts={setFilteredProducts} 
          onOpenPopup={handleOpenPopup} // Thêm props để mở Popup
        />
        <Routes>
          <Route path="/" element={<Home allProducts={allProducts} filteredProducts={filteredProducts} addToCart={addToCart} />} /> 
          <Route path="/about" element={<About />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/products" element={<Products allProducts={allProducts} filteredProducts={filteredProducts} addToCart={addToCart} />} />
        </Routes>
        <Footer />
        <AuthPopup isOpen={isPopupOpen} onClose={handleClosePopup} /> {/* Thêm AuthPopup */}
      </div>
    </Router>
  );
}

export default App;
