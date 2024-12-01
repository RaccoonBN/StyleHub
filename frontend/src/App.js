import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/HomePage';
import About from './pages/AboutPage';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Products from './components/Products';
import AuthPopup from './components/AuthPopup';
import CheckoutPage from './components/CheckoutPage';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageUsers from './components/admin/ManageUsers';
import ManageProducts from './components/admin/ManageProducts';
import OrderHistory from './components/OrderHistory';
import BrandProducts from './components/BrandProducts'; // Đảm bảo đã nhập khẩu đúng

function App() {
  const [cartItems, setCartItems] = useState([]); // Quản lý giỏ hàng
  const [allProducts, setAllProducts] = useState([]); // Quản lý tất cả sản phẩm
  const [filteredProducts, setFilteredProducts] = useState([]); // Quản lý các sản phẩm đã lọc
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Quản lý trạng thái Popup

  // Lấy dữ liệu sản phẩm từ API khi component được render lần đầu
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

  // Hàm thêm sản phẩm vào giỏ hàng
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

  // Mở popup đăng nhập/đăng ký
  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  // Đóng popup đăng nhập/đăng ký
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <Router>
      <div>
        {/* Navbar với các tính năng liên quan đến giỏ hàng và popup */}
        <Navbar 
          cartItems={cartItems} 
          setCartItems={setCartItems} 
          allProducts={allProducts} 
          setFilteredProducts={setFilteredProducts} 
          onOpenPopup={handleOpenPopup} 
        />
        <Routes>
          {/* Trang chủ */}
          <Route path="/" element={<Home allProducts={allProducts} filteredProducts={filteredProducts} addToCart={addToCart} />} />
          {/* Trang giới thiệu */}
          <Route path="/about" element={<About />} />
          {/* Trang danh sách sản phẩm */}
          <Route path="/products" element={<Products allProducts={allProducts} filteredProducts={filteredProducts} addToCart={addToCart} />} />
          {/* Trang thanh toán */}
          <Route path="/checkout" element={<CheckoutPage />} />
          {/* Trang lịch sử đơn hàng */}
          <Route path="/order-history" element={<OrderHistory />} />
          {/* Các trang quản trị */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/products" element={<ManageProducts />} />
          {/* Trang sản phẩm theo thương hiệu */}
          <Route path="/brand-product/:brand_name" element={<BrandProducts />} />
        </Routes>
        {/* Footer */}
        <Footer />
        {/* Popup đăng nhập/đăng ký */}
        <AuthPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
      </div>
    </Router>
  );
}

export default App;
