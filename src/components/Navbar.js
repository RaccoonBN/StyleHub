// src/components/Navbar.js
import React from 'react';

const Navbar = ({ cartItems, setCartItems, allProducts, setFilteredProducts, onOpenPopup }) => {
  return (
    <nav>
      <h1>StyleHub</h1>
      <button onClick={onOpenPopup}>Đăng Nhập/Đăng Ký</button> {/* Nút để mở Popup */}
      {/* Các phần tử khác trong Navbar */}
    </nav>
  );
};

export default Navbar;
