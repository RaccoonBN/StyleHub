import React, { useState } from 'react';
import './products.css';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import ProductDetail from './ProductDetail'; // Import ProductDetail component

// Sử dụng require.context để lấy tất cả hình ảnh
const images = require.context('../assets', false, /\.(png|jpe?g|svg)$/);

const Products = ({ allProducts = [], filteredProducts = [], addToCart, categories = [], brands = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [brandName, setBrandName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [showProductDetail, setShowProductDetail] = useState(false); 
  

  const onProductClick = (product) => {
    setSelectedProduct(product); // Cập nhật selectedProduct để hiển thị trong popup
    fetchBrandName(product.brand_id); // Fetch tên thương hiệu
    fetchCategoryName(product.cate_id); // Fetch tên danh mục
    setShowProductDetail(true); // Hiển thị popup chi tiết sản phẩm
  };

  // Lựa chọn sản phẩm hiển thị
  const displayProducts = filteredProducts.length > 0 ? filteredProducts : allProducts;

  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = displayProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayProducts.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const closePopup = () => {
    setSelectedProduct(null);
    setBrandName('');
    setCategoryName('');
    setShowProductDetail(false); // Đóng popup khi đóng
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
                onClick={() => onProductClick(product)} 
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

      {selectedProduct && showProductDetail && (
        <ProductDetail 
          selectedProduct={selectedProduct} 
          brandName={brandName} 
          categoryName={categoryName}
          closePopup={closePopup}
          handleAddToCart={handleAddToCart} 
          onProductClick={onProductClick} 
        />
      )}
    </div>
  );
};

export default Products;
