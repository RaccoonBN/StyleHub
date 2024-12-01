import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';
import './products.css'; // Import CSS từ Product.jsx

// Cách yêu cầu hình ảnh từ thư mục assets
const images = require.context('../assets', false, /\.(png|jpe?g|svg)$/);

const BrandProducts = ({ addToCart }) => {
  const { brand_name } = useParams(); // Lấy tên thương hiệu từ URL params
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [brandName, setBrandName] = useState('');
  const [categoryName, setCategoryName] = useState('');

  // Hàm định dạng giá sản phẩm
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toLocaleString('vi-VN'); // Định dạng giá VND
    }
    return 'Không xác định'; // Giá trị mặc định nếu price không hợp lệ
  };

  // Hàm thêm sản phẩm vào giỏ hàng (giả sử)
  const handleAddToCart = (product) => {
    addToCart(product); // Thêm vào giỏ hàng qua props
    closePopup(); // Đóng popup sau khi thêm sản phẩm vào giỏ hàng
  };

  // Hàm mở popup chi tiết sản phẩm
  const openPopup = (product) => {
    setSelectedProduct(product);
    fetchBrandName(product.brand_id);
    fetchCategoryName(product.cate_id);
  };

  // Hàm đóng popup
  const closePopup = () => {
    setSelectedProduct(null);
    setBrandName('');
    setCategoryName('');
  };

  // Fetch sản phẩm theo thương hiệu
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/products/brand/${brand_name}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setError('Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại.');
      })
      .finally(() => setLoading(false));
  }, [brand_name]);

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

  if (loading) {
    return <div>Đang tải sản phẩm...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="products-container">
      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => {
            // Kiểm tra nếu product.imageUrl có giá trị hợp lệ
            const imageUrl = product.imageUrl ? `./${product.imageUrl}` : 'default_image.png'; // Hình ảnh mặc định nếu không có giá trị
            return (
              <div className="product-card" key={product.product_id}>
                <img
                  src={images(imageUrl)} // Đảm bảo đường dẫn hợp lệ
                  alt={product.product_name}
                  onClick={() => openPopup(product)} // Mở popup khi click vào ảnh sản phẩm
                />
                <h3>{product.product_name}</h3>
                <p>{formatPrice(product.cost)} VND</p>
                <div
                  className="add-to-cart-icon"
                  onClick={() => handleAddToCart(product)} // Thêm vào giỏ hàng
                >
                  <FontAwesomeIcon icon={faShoppingCart} />
                </div>
              </div>
            );
          })
        ) : (
          <p>Không có sản phẩm nào thuộc thương hiệu này.</p>
        )}
      </div>

      {/* Popup chi tiết sản phẩm */}
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

export default BrandProducts;
