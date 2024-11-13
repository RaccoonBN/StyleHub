import React, { useState, useEffect } from 'react';
import './products.css';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

// Sử dụng require.context để lấy tất cả hình ảnh
const images = require.context('../assets', false, /\.(png|jpe?g|svg)$/);

const Products = ({ allProducts = [], filteredProducts = [], addToCart }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [brandName, setBrandName] = useState('');
  const [categoryName, setCategoryName] = useState('');

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : allProducts;

  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = displayProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayProducts.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openPopup = (product) => {
    setSelectedProduct(product);
    fetchBrandName(product.brand_id);
    fetchCategoryName(product.cate_id);
  };

  const closePopup = () => {
    setSelectedProduct(null);
    setBrandName('');
    setCategoryName('');
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    closePopup(); // Đóng popup sau khi thêm sản phẩm vào giỏ hàng
  };

  // Hàm xử lý định dạng giá tiền
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN'); // Định dạng theo chuẩn Việt Nam (dấu phẩy phân cách hàng nghìn)
  };

  // Fetch tên thương hiệu từ API
  const fetchBrandName = async (brandId) => {
    try {
        const response = await fetch(`http://localhost:5000/api/brands/${brandId}`);
        if (!response.ok) {
            throw new Error(`Lỗi khi lấy tên thương hiệu: ${response.statusText}`);
        }
        const data = await response.json();
        setBrandName(data.brand_name); // Lưu tên thương hiệu vào state
    } catch (error) {
        console.error('Lỗi khi lấy tên thương hiệu', error);
        setBrandName('Chưa có thương hiệu');
    }
  };

  // Fetch tên danh mục từ API
  const fetchCategoryName = async (cateId) => {
      try {
        const response = await fetch(`http://localhost:5000/api/category/${cateId}`);
        if (!response.ok) {
              throw new Error(`Lỗi khi lấy tên danh mục: ${response.statusText}`);
          }
          const data = await response.json();
          setCategoryName(data.cate_name); // Cập nhật tên danh mục vào state
      } catch (error) {
          console.error('Lỗi khi lấy tên danh mục', error);
          setCategoryName('Chưa có danh mục');
      }
    };

  return (
    <div>
      <div className="products-grid">
        {currentItems.length > 0 ? (
          currentItems.map(product => (
            <div key={product.product_id} className="product-card">
              <img 
                src={images(`./${product.imageUrl}`)} 
                alt={product.product_name} 
                onClick={() => openPopup(product)} 
              />
              <h3>{product.product_name}</h3>
              <p>{formatPrice(product.cost)} VND</p> {/* Hiển thị giá tiền đã định dạng */}
              
              <div className="add-to-cart-icon" onClick={() => handleAddToCart(product)}>
                <FontAwesomeIcon icon={faShoppingCart} />
              </div>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm nào.</p>
        )}
      </div>

      <div className="pagination">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
            disabled={totalPages === 1}
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
              <img 
                src={images(`./${selectedProduct.imageUrl}`)} 
                alt={selectedProduct.product_name} 
              />
            </div>
            <div className="popup-details">
              <h3>{selectedProduct.product_name}</h3>
              <p><strong>Thương hiệu:</strong> {brandName || 'Chưa có thương hiệu'}</p> {/* Tên thương hiệu */}
              <p><strong>Danh mục:</strong> {categoryName || 'Chưa có danh mục'}</p> {/* Tên danh mục */}
              <p><strong>Mô tả:</strong> {selectedProduct.description || 'Không có mô tả'}</p> {/* Mô tả sản phẩm nếu có */}
              <p><strong>Giá:</strong> {formatPrice(selectedProduct.cost)} VND</p>
              <p><strong>Số lượng tồn kho:</strong> {selectedProduct.quantity || 0}</p> {/* Hiển thị số lượng tồn kho */}
              <div className="popup-buttons">
                <button onClick={() => handleAddToCart(selectedProduct)}>
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
