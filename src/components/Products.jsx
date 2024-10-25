import React, { useState } from 'react'; 
import './products.css';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Products = ({ allProducts = [], filteredProducts = [],addToCart }) => { 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');

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
    setSelectedSize('');
  };

  const closePopup = () => {
    setSelectedProduct(null);
  };

  const handleBuyNow = () => {
    if (selectedProduct && selectedSize) {
      console.log(`Mua ngay ${selectedProduct.product_name} với kích thước ${selectedSize}.`);
      closePopup();
    } else {
      alert('Vui lòng chọn kích thước trước khi mua.');
    }
  };

  return (
    <div>
      <div className="products-grid">
        {currentItems.length > 0 ? (
          currentItems.map(product => (
            <div key={product.product_id} className="product-card" onClick={() => openPopup(product)}>
              <img src={require(`../assets/${product.images}`)} alt={product.product_name} />
              <h3>{product.product_name}</h3>
              <p>{product.cost} VND</p>
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
              <img src={require(`../assets/${selectedProduct.images}`)} alt={selectedProduct.product_name} />
            </div>
            <div className="popup-details">
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
              <div className="popup-buttons">
                <button onClick={() => addToCart({ ...selectedProduct, size: selectedSize },closePopup())}>Thêm vào giỏ hàng</button>
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
