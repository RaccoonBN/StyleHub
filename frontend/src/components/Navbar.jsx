import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './navbar.css';
import AuthPopup from './AuthPopup';
import CartPopup from './CartPopup';
import { FaShoppingCart, FaUserCircle, FaSearch } from 'react-icons/fa'; 
import logo from '../assets/logo.png';

const Navbar = ({ cartItems, setCartItems, allProducts, setFilteredProducts }) => {
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null); // State lưu thông tin người dùng

  // Kiểm tra người dùng đã đăng nhập chưa khi component được mount
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('user')); // Lấy thông tin người dùng từ localStorage
    console.log('User from localStorage:', loggedUser);  // Debug: Kiểm tra thông tin người dùng
    if (loggedUser) {
      setUser(loggedUser); // Nếu có, set thông tin người dùng vào state
    }
  }, []);

  const toggleProductDropdown = () => {
    setProductDropdownOpen(!productDropdownOpen);
    if (brandDropdownOpen) setBrandDropdownOpen(false);
  };

  const toggleBrandDropdown = () => {
    setBrandDropdownOpen(!brandDropdownOpen);
    if (productDropdownOpen) setProductDropdownOpen(false);
  };

  const openLoginPopup = () => {
    if (!user) {
      setIsLoginPopupOpen(true); // Mở popup đăng nhập chỉ khi người dùng chưa đăng nhập
    }
  };

  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };

  const openCartPopup = () => setIsCartPopupOpen(true);
  const closeCartPopup = () => setIsCartPopupOpen(false);

  const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/search?query=' + searchQuery);
      const data = await response.json();
      setFilteredProducts(data);
      console.log(`Tìm kiếm: ${searchQuery}`);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Xóa thông tin người dùng khỏi localStorage khi logout
    setUser(null); // Reset state người dùng về null
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo StyleHub" />
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          />
          <FaSearch className="search-icon" onClick={handleSearch} />
        </div>
        <ul className="nav-links">
          <li><Link to="/">TRANG CHỦ</Link></li>
          <li className="dropdown">
            <Link to="/products" onClick={toggleProductDropdown}>SẢN PHẨM</Link>
            {productDropdownOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/products/clothing">Quần Áo</Link></li>
                <li><Link to="/products/shoes">Giày/Dép</Link></li>
                <li><Link to="/products/accessories">Phụ Kiện</Link></li>
              </ul>
            )}
          </li>
          <li className="dropdown">
            <Link to="#" onClick={toggleBrandDropdown}>THƯƠNG HIỆU</Link>
            {brandDropdownOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/brands/nike">Nike</Link></li>
                <li><Link to="/brands/adidas">Adidas</Link></li>
                <li><Link to="/brands/puma">Puma</Link></li>
              </ul>
            )}
          </li>
          <li><Link to="/about">VỀ CHÚNG TÔI</Link></li>
        </ul>
        <div className="user-actions">
          <div className="cart-icon" onClick={openCartPopup}>
            <FaShoppingCart className="icon" />
            {cartItems.length > 0 && (
              <span className="cart-count">
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </div>
          {user ? (
            <div className="user-info">
              <span>Xin chào, {user.first_name}!</span>
              <button onClick={handleLogout}>Đăng Xuất</button>
            </div>
          ) : (
            <Link to="#" onClick={openLoginPopup} className="login-link">
              <FaUserCircle className="icon" /> ĐĂNG NHẬP
            </Link>
          )}
        </div>
      </nav>
      {isLoginPopupOpen && (
        <AuthPopup isOpen={isLoginPopupOpen} onClose={closeLoginPopup} />
      )}
      {isCartPopupOpen && (
        <CartPopup isOpen={isCartPopupOpen} onClose={closeCartPopup} cartItems={cartItems} setCartItems={setCartItems} />
      )}
    </header>
  );
};

export default Navbar;
