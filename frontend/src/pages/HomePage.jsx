import React from 'react';
import Products from '../components/Products'; // Import Products

const Home = ({ allProducts, filteredProducts, addToCart }) => {
  // Nếu có sản phẩm được lọc, sử dụng chúng, nếu không sử dụng allProducts
  const displayProducts = filteredProducts.length > 0 ? filteredProducts : allProducts;
  return (
    <div>
      <div style={{ padding: '80px', color: 'black' }}>
        <h1>Chào mừng đến với StyleHub!</h1>
        <p>Khám phá những sản phẩm thời trang hàng hiệu từ Nike, Adidas và nhiều thương hiệu nổi tiếng khác!</p>
      </div>
      <h2>TẤT CẢ SẢN PHẨM</h2>
      <Products allProducts={displayProducts} addToCart={addToCart} /> 
    </div>
  );
};

export default Home;
