import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link từ react-router-dom
import './navbar.css';
import AuthPopup from './AuthPopup';
import CartPopup from './CartPopup';
import { FaShoppingCart, FaUserCircle, FaSearch } from 'react-icons/fa'; // Thêm FaSearch
import logo from '../assets/logo.png';

const Navbar = ({ cartItems, setCartItems }) => { // Nhận cartItems và setCartItems từ props
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State cho thanh tìm kiếm

  const toggleProductDropdown = () => {
    setProductDropdownOpen(!productDropdownOpen);
    if (brandDropdownOpen) setBrandDropdownOpen(false);
  };

  const toggleBrandDropdown = () => {
    setBrandDropdownOpen(!brandDropdownOpen);
    if (productDropdownOpen) setProductDropdownOpen(false);
  };

  const openLoginPopup = () => setIsLoginPopupOpen(true);
  const closeLoginPopup = () => setIsLoginPopupOpen(false);
  const openCartPopup = () => setIsCartPopupOpen(true);
  const closeCartPopup = () => setIsCartPopupOpen(false);
  const handleSearch = () => {
    /* Xử lý logic tìm kiếm sản phẩm
    const filteredProducts = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filteredProducts);
    console.log(`Tìm kiếm: ${searchQuery}`); */
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo StyleHub" />
        </div>
         {/* Thanh tìm kiếm */}
         <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật giá trị tìm kiếm
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }} // Kích hoạt tìm kiếm khi nhấn Enter
          />
          <FaSearch className="search-icon" onClick={handleSearch} /> {/* Thêm sự kiện onClick vào icon */}
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
          <Link to="#" onClick={openLoginPopup} className="login-link">
            <FaUserCircle className="icon" /> ĐĂNG NHẬP
          </Link>
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