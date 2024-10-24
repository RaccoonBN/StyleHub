// src/components/Home.js
import React from 'react';
import Products from '../components/Products'; // Import Products


const Home = () => {
  return (
    <div>
      {/* Nội dung trang chủ */}
      <div style={{ padding: '80px', color: 'black' }}>
        <h1>Chào mừng đến với StyleHub!</h1>
        <p>Khám phá những sản phẩm thời trang hàng hiệu từ Nike, Adidas và nhiều thương hiệu nổi tiếng khác!</p>
      </div>
    {/* Hiển thị sản phẩm */}
    <h2>TẤT CẢ SẢN PHẨM</h2>
    <Products />
    </div>
  );
};



export default Home;
