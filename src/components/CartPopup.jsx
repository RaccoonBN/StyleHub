// src/components/CartPopup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Sử dụng useNavigate thay cho useHistory
import './CartPopup.css'; // Nhập CSS cho pop-up
import spdemo2 from '../assets/spdemo2.jpg';
import spdemo3 from '../assets/spdemo3.jpg';
import { FaTimes } from 'react-icons/fa'; // Import icon đóng

const CartPopup = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Sản phẩm 1', price: 100000, quantity: 1, image: spdemo2 },
    { id: 2, name: 'Sản phẩm 2', price: 200000, quantity: 1, image: spdemo3 },
    { id: 3, name: 'Sản phẩm 3', price: 100000, quantity: 1, image: spdemo2 },
    { id: 4, name: 'Sản phẩm 4', price: 200000, quantity: 1, image: spdemo3 },
    // Thêm sản phẩm vào giỏ hàng ở đây
  ]);

  const navigate = useNavigate(); // Khởi tạo navigate

  if (!isOpen) return null;

  const handleQuantityChange = (id, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleOrder = () => {
    // Chuyển hướng đến trang đặt hàng
    navigate('/checkout'); // Đường dẫn đến trang đặt hàng
    onClose(); 
  };

  return (
    <div className="cart-popup-overlay">
      <div className="cart-popup">
        <div className="popup-header">
          <h2>Giỏ hàng</h2>
          <FaTimes className="close-icon" onClick={onClose} />
        </div>
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p>Giỏ hàng của bạn đang trống.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>Giá: {item.price.toLocaleString('vi-VN')} VND</p>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                  <button onClick={() => handleRemoveItem(item.id)} className="remove-button">Xóa</button>
                </div>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <button className="order-button" onClick={handleOrder}>Đặt hàng</button>
        )}
      </div>
    </div>
  );
};

export default CartPopup;
