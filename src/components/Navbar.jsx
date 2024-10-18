// src/components/Navbar.js
import React, { useState } from 'react';
import './navbar.css';
import AuthPopup from './AuthPopup'; // Nhập component AuthPopup
import CartPopup from './CartPopup'; // Nhập component CartPopup
import { FaShoppingCart, FaUserCircle, FaTshirt, FaShoePrints, FaTag, FaHome, FaTrademark } from 'react-icons/fa';
import logo from '../assets/logo.png'; // Nhập logo
import spdemo2 from '../assets/spdemo2.jpg';
import spdemo3 from '../assets/spdemo3.jpg';
const Navbar = () => {
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false); // State cho pop-up đăng nhập
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false); // State cho pop-up giỏ hàng
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Sản phẩm 1', price: 100000, quantity: 1, image: spdemo2 },
    { id: 2, name: 'Sản phẩm 2', price: 200000, quantity: 1, image: spdemo3 },
    { id: 3, name: 'Sản phẩm 3', price: 100000, quantity: 1, image: spdemo2 },
    { id: 4, name: 'Sản phẩm 4', price: 200000, quantity: 1, image: spdemo3 },
    // Thêm sản phẩm vào giỏ hàng ở đây
  ]);
  const toggleProductDropdown = () => {
    setProductDropdownOpen(!productDropdownOpen);
    if (brandDropdownOpen) {
      setBrandDropdownOpen(false);
    }
  };

  const toggleBrandDropdown = () => {
    setBrandDropdownOpen(!brandDropdownOpen);
    if (productDropdownOpen) {
      setProductDropdownOpen(false);
    }
  };

  const openLoginPopup = () => {
    setIsLoginPopupOpen(true);
  };

  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };

  const openCartPopup = () => {
    setIsCartPopupOpen(true);
  };

  const closeCartPopup = () => {
    setIsCartPopupOpen(false);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo StyleHub" />
        </div>
        <ul className="nav-links">
          <li><a href="/"> TRANG CHỦ</a></li>
          <li className="dropdown">
            <a href="#" onClick={toggleProductDropdown}>SẢN PHẨM</a>
            {productDropdownOpen && (
              <ul className="dropdown-menu">
                <li><a href="/products/clothing"> Quần Áo</a></li>
                <li><a href="/products/shoes">Giày/Dép</a></li>
                <li><a href="/products/accessories">Phụ Kiện</a></li>
              </ul>
            )}
          </li>
          <li className="dropdown">
            <a href="#" onClick={toggleBrandDropdown}>THƯƠNG HIỆU</a>
            {brandDropdownOpen && (
              <ul className="dropdown-menu">
                <li><a href="/brands/nike">Nike</a></li>
                <li><a href="/brands/adidas">Adidas</a></li>
                <li><a href="/brands/puma">Puma</a></li>
              </ul>
            )}
          </li>
          <li><a href="/about"> VỀ CHÚNG TÔI</a></li>
        </ul>
        <div className="user-actions">
        <div className="cart-icon" onClick={openCartPopup}>
          <FaShoppingCart className="icon" />
          {cartItems.length > 0 && (
          <span className="cart-count">{cartItems.reduce((total, item) => total + item.quantity, 0)}</span> // Hiển thị tổng số lượng trong giỏ hàng
        )}
        </div>

          <a href="#" onClick={openLoginPopup} className="login-link">
            <FaUserCircle className="icon" /> ĐĂNG NHẬP
          </a>
        </div>
      </nav>
      {/* Gọi pop-up đăng nhập */}
      {isLoginPopupOpen && (
        <AuthPopup isOpen={isLoginPopupOpen} onClose={closeLoginPopup} />
      )}
      {/* Gọi pop-up giỏ hàng */}
      {isCartPopupOpen && (
        <CartPopup isOpen={isCartPopupOpen} onClose={closeCartPopup} cartItems={cartItems} />
      )}
    </header>
  );
};

export default Navbar;
