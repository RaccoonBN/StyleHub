// src/components/Products.js
import React, { useState } from 'react';
import './products.css';
import 'react-toastify/dist/ReactToastify.css';

// Nhập hình ảnh từ thư mục src
import spdemo1 from '../assets/spdemo1.png';
import spdemo2 from '../assets/spdemo2.jpg';
import spdemo3 from '../assets/spdemo3.jpg';

// Nhập icon từ react-fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Products = () => {
  const products = [
    { id: 1, name: 'Nike Air Max', price: '3,500,000 VND', image: spdemo1 },
    { id: 2, name: 'Adidas Ultraboost', price: '4,200,000 VND', image: spdemo2 },
    { id: 3, name: 'Puma Suede', price: '2,800,000 VND', image: spdemo3 },
    // Thêm nhiều sản phẩm khác vào đây...
    { id: 4, name: 'Product 4', price: '1,000,000 VND', image: spdemo1 },
    { id: 5, name: 'Product 5', price: '1,500,000 VND', image: spdemo2 },
    { id: 6, name: 'Product 6', price: '2,000,000 VND', image: spdemo3 },
    { id: 7, name: 'Product 7', price: '2,200,000 VND', image: spdemo1 },
    { id: 8, name: 'Product 8', price: '2,500,000 VND', image: spdemo2 },
    { id: 9, name: 'Product 9', price: '2,800,000 VND', image: spdemo3 },
    { id: 10, name: 'Product 10', price: '3,000,000 VND', image: spdemo1 },
    { id: 11, name: 'Product 11', price: '3,200,000 VND', image: spdemo2 },
    { id: 12, name: 'Product 12', price: '3,400,000 VND', image: spdemo3 },
    { id: 13, name: 'Product 13', price: '3,600,000 VND', image: spdemo1 },
    { id: 14, name: 'Product 14', price: '3,800,000 VND', image: spdemo2 },
    { id: 15, name: 'Product 15', price: '4,000,000 VND', image: spdemo3 },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(''); // Trạng thái cho kích thước

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openPopup = (product) => {
    setSelectedProduct(product);
    setSelectedSize(''); // Đặt kích thước về mặc định khi mở popup
  };

  const closePopup = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = () => {
    if (selectedProduct && selectedSize) {
      console.log(`Đã thêm ${selectedProduct.name} với kích thước ${selectedSize} vào giỏ hàng.`);
      // Bạn có thể thêm logic thêm sản phẩm vào giỏ hàng ở đây
      closePopup(); // Đóng popup sau khi thêm vào giỏ hàng
    } else {
      alert('Vui lòng chọn kích thước trước khi thêm vào giỏ hàng.');
    }
  };

  const handleBuyNow = () => {
    if (selectedProduct && selectedSize) {
      console.log(`Mua ngay ${selectedProduct.name} với kích thước ${selectedSize}.`);
      // Thực hiện logic mua hàng ở đây
      closePopup(); // Đóng popup sau khi mua
    } else {
      alert('Vui lòng chọn kích thước trước khi mua.');
    }
  };

  return (
    <div>
      <div className="products-grid">
        {currentItems.map(product => (
          <div key={product.id} className="product-card" onClick={() => openPopup(product)}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {selectedProduct && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
            <div className="popup-image">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
              {/* Thêm nhiều hình ảnh nếu cần */}
            </div>
            <div className="popup-details">
              <h3>{selectedProduct.name}</h3>
              <p>{selectedProduct.price}</p>

              {/* Mô tả sản phẩm (Thêm nội dung mô tả ở đây) */}
              <p>Mô tả: Đây là một sản phẩm chất lượng cao, được sản xuất từ những nguyên liệu tốt nhất.</p>

              {/* Chọn kích thước */}
              <label htmlFor="size">Chọn kích thước:</label>
              <select 
                id="size" 
                value={selectedSize} 
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Chọn kích thước</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>

              {/* Nút thêm vào giỏ hàng và mua ngay */}
              <div className="popup-buttons">
                <button onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
                <button onClick={handleBuyNow}>Mua ngay</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
