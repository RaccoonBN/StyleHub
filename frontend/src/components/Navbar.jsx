import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './navbar.css';
import AuthPopup from './AuthPopup';
import CartPopup from './CartPopup';
import { FaShoppingCart, FaUserCircle, FaSearch, FaBars, FaSignOutAlt,FaHistory } from 'react-icons/fa'; 
import logo from '../assets/logo.png';

const Navbar = ({ cartItems, setCartItems, setFilteredProducts }) => {
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null); // State lưu thông tin người dùng
  const [categories, setCategories] = useState([]); // State lưu danh mục
  const [brands, setBrands] = useState([]); // State lưu thương hiệu

  // Fetch danh mục và thương hiệu từ API backend
  useEffect(() => {
    // Kiểm tra người dùng đã đăng nhập chưa khi component được mount
    const loggedUser = JSON.parse(localStorage.getItem('user')); 
    if (loggedUser) {
      setUser(loggedUser); // Nếu có, set thông tin người dùng vào state
    }

    // Lấy danh mục và thương hiệu từ API backend
    const fetchCategoriesAndBrands = async () => {
      try {
        const categoryResponse = await fetch('http://localhost:5000/api/category');
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);

        const brandResponse = await fetch('http://localhost:5000/api/brands');
        const brandData = await brandResponse.json();
        setBrands(brandData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu danh mục và thương hiệu:", error);
      }
    };

    fetchCategoriesAndBrands();
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
  const [menuOpen, setMenuOpen] = useState(false); // Quản lý trạng thái menu

  // Xử lý click bên ngoài menu để đóng
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.menu-container')) {
        setMenuOpen(false); // Đóng menu nếu click bên ngoài
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    sessionStorage.removeItem('user'); // Xóa thông tin người dùng khỏi sessionStorage khi logout
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
                {categories.map(category => (
                  <li key={category.cate_name}>
                    <Link to={`/products/${category.cate_name}`}>{category.cate_name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li className="dropdown">
            <Link to="#" onClick={toggleBrandDropdown}>THƯƠNG HIỆU</Link>
            {brandDropdownOpen && (
              <ul className="dropdown-menu">
                {brands.map(brand => (
                  <li key={brand.brand_name}>
                    <Link to={`/brands/${brand.brand_name}`}>{brand.brand_name}</Link>
                  </li>
                ))}
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
          <span className="welcome-text">Xin chào, {user.last_name}!</span>
          <div className="menu-container">
            <button
              className="menu-toggle"
              onClick={() => setMenuOpen((prev) => !prev)} // Chuyển trạng thái menu
            >
              <FaBars className="menu-icon" />
            </button>
            {menuOpen && (
              <ul className="menu-dropdown">
                <li>
                  <Link to="/order-history" className="menu-item">
                  <FaHistory className="menu-icon" /> {/* Biểu tượng lịch sử */}
                    Lịch sử đặt hàng
                  </Link>
                </li>
                <li>
                <button onClick={handleLogout} className="menu-item logout-btn">
                  <FaSignOutAlt className="menu-icon" />
                  Đăng xuất
                </button>
                </li>
              </ul>
            )}
          </div>
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
