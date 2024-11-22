import React, { useState, useEffect } from 'react';
import './ManageProducts.css';
import axios from 'axios';


const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    product_name: '',
    cost: '',
    description: '',
    quantity: '',
    size_id: '',
    cate_id: '',
    brand_id: '',
    imageUrl: '',
  });

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Gọi API:', 'http://localhost:5000/admin/products'); 
        const response = await axios.get('http://localhost:5000/admin/products');
        console.log('Dữ liệu nhận được:', response.data); // Thêm dòng này
        setProducts(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error); // Thay đổi thông báo lỗi
      }
    };
    fetchProducts();
  }, []);

  // Handle input changes for form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Thêm sp
  const addProduct = async () => {
    try {
      const response = await axios.post('http://localhost:5000/admin/products', newProduct);
      setProducts([...products, response.data]); // Thêm sp
      resetForm();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Sửa sp
  const editProduct = (product) => {
    setEditingProduct(product);
    setNewProduct(product);
    setIsPopupOpen(true);
  };

  // Cập nhật sp
  const updateProduct = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/admin/products/${editingProduct.product_id}`, newProduct);
      setProducts(products.map((product) =>
        product.product_id === editingProduct.product_id ? response.data : product
      ));
      resetForm();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // Xóa sp
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/products/${id}`);
      setProducts(products.filter((product) => product.product_id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setNewProduct({
      product_name: '',
      cost: '',
      description: '',
      quantity: '',
      size_id: '',
      cate_id: '',
      brand_id: '',
      imageUrl: '',
    });
    setEditingProduct(null);
    setIsPopupOpen(false);
  };

  return (
    <div className="manage-products-container">
      <h2>Quản lý sản phẩm</h2>
      <button className="add-button" onClick={() => setIsPopupOpen(true)}>Thêm sản phẩm</button>

      <div className="product-list">
        <table>
        <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Mô tả</th>
                <th>Số lượng</th>
                <th>Size ID</th>
                <th>Category ID</th>
                <th>Brand ID</th>
                <th>Hình ảnh</th>
                <th>Hành động</th>
              </tr>
          </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.product_id}>
                  <td>{product.product_name}</td>
                  <td>{product.cost}</td>
                  <td>{product.description}</td>
                  <td>{product.quantity}</td>
                  <td>{product.size_id || ' '}</td>
                  <td>{product.cate_name || 'Không rõ'}</td> {/* Hiển thị tên danh mục */}
                  <td>{product.brand_name || 'Không rõ'}</td> {/* Hiển thị tên thương hiệu */}
                  <td>
                    {product.imageUrl ? (
                      <img src={`/uploads/${product.imageUrl}`} alt={product.product_name} className="product-image" />
                    ) : (
                      'Không có'
                    )}
                  </td>
                  <td>
                    <button onClick={() => editProduct(product)}>Sửa</button>
                    <button onClick={() => deleteProduct(product.product_id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>

      {isPopupOpen && (
        <div className="popup-content">
          <h3>{editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h3>
          <input
            type="text"
            name="product_name"
            value={newProduct.product_name}
            onChange={handleInputChange}
            placeholder="Tên sản phẩm"
          />
          <input
            type="number"
            name="cost"
            value={newProduct.cost}
            onChange={handleInputChange}
            placeholder="Giá sản phẩm"
          />
          <input
            type="text"
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
            placeholder="Mô tả sản phẩm"
          />
          <input
            type="number"
            name="quantity"
            value={newProduct.quantity}
            onChange={handleInputChange}
            placeholder="Số lượng"
          />
          <input
            type="text"
            name="size_id"
            value={newProduct.size_id}
            onChange={handleInputChange}
            placeholder="Size ID"
          />
          <input
            type="text"
            name="cate_id"
            value={newProduct.cate_id}
            onChange={handleInputChange}
            placeholder="Category ID"
          />
          <input
            type="text"
            name="brand_id"
            value={newProduct.brand_id}
            onChange={handleInputChange}
            placeholder="Brand ID"
          />
          <input
            type="file"
            onChange={handleImageChange}
          />
          {newProduct.imageUrl && <img src={newProduct.imageUrl} alt="Preview" className="image-preview" />}
          <button onClick={editingProduct ? updateProduct : addProduct}>
            {editingProduct ? 'Cập nhật' : 'Thêm'}
          </button>
          <button onClick={resetForm}>Đóng</button>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
