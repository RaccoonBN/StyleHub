import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import './CartPopup.css';

const CartPopup = ({ isOpen, onClose, cartItems, setCartItems }) => {
    const navigate = useNavigate();

    // Nếu pop-up không mở thì không render
    if (!isOpen) return null;

    // Hàm thay đổi số lượng sản phẩm trong giỏ hàng
    const handleQuantityChange = (id, change) => {
        setCartItems((prevItems) => 
            prevItems.map((item) => 
                item.product_id === id 
                ? { ...item, quantity: Math.max(1, item.quantity + change) } 
                : item
            )
        );
    };

    // Hàm xóa sản phẩm khỏi giỏ hàng
    const handleRemoveItem = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== id));
    };

    // Hàm xử lý đặt hàng, điều hướng đến trang checkout
    const handleOrder = () => {
        if (cartItems.length > 0) {
            navigate('/checkout');
            onClose();
        } else {
            alert('Giỏ hàng của bạn đang trống.');
        }
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
                            <div key={item.product_id} className="cart-item">
                              <img src={require(`../assets/${item.images}`)} alt={item.product_name} className="cart-item-image" />
                              <div className="cart-item-info">
                                <h4>{item.product_name}</h4>
                                <p>
                                  Giá: {item.cost !== undefined ? item.cost.toLocaleString('vi-VN') : 'Chưa có giá'} VND
                                </p>
                              </div>
                              <div className="quantity-controls">
                                <button 
                                  onClick={() => handleQuantityChange(item.product_id, -1)} 
                                  disabled={item.quantity <= 1} // Vô hiệu hóa nếu số lượng <= 1
                                >
                                  -
                                </button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleQuantityChange(item.product_id, 1)}>+</button>
                                <button onClick={() => handleRemoveItem(item.product_id)} className="remove-button">
                                  Xóa
                                </button>
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
