import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import './CartPopup.css';

const images = require.context('../assets', false, /\.(png|jpe?g|svg)$/);

const CartPopup = ({ isOpen, onClose, cartItems, setCartItems }) => {
    const navigate = useNavigate();
    const acc_id = localStorage.getItem('acc_id');  // Lấy acc_id từ localStorage
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [userCart, setUserCart] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]); 

    // Kiểm tra nếu đã đăng nhập
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (user && user.acc_id) {
            // Gọi API để lấy giỏ hàng của người dùng
            fetch(`http://localhost:5000/api/cart?acc_id=${user.acc_id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        if (data.cart) {
                            // Nếu giỏ hàng đã tồn tại, cập nhật giỏ hàng
                            setUserCart(data.cart);  
                            setCartItems(data.cart);  
                        } else {
                            // Nếu giỏ hàng chưa tồn tại, tạo mới giỏ hàng
                            fetch(`http://localhost:5000/api/cart/create?acc_id=${user.acc_id}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ acc_id: user.acc_id }),
                            })
                            .then(res => res.json())
                            .then(newCartData => {
                                if (newCartData.success) {
                                    setUserCart(newCartData.cart);
                                    setCartItems(newCartData.cart);  
                                } else {
                                    console.error("Không thể tạo giỏ hàng.");
                                }
                            })
                            .catch(error => console.error("Lỗi khi tạo giỏ hàng:", error));
                        }
                    } else {
                        console.error("Không thể tải giỏ hàng.");
                    }
                })
                .catch(error => console.error("Lỗi khi gọi API:", error));
        }
    }, [user, setCartItems]);

    if (loading) return <div>Đang tải...</div>;

    if (!isOpen) return null;

    const handleQuantityChange = (id, change) => {
        if (!user) {
            alert('Bạn cần đăng nhập để thực hiện hành động này.');
            return;
        }

        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.product_id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            )
        );
    };

    const handleRemoveItem = (id) => {
        if (!user) {
            alert('Bạn cần đăng nhập để thực hiện hành động này.');
            return;
        }

        setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== id));
    };

    const handleCheckboxChange = (id) => {
        setSelectedItems((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter(itemId => itemId !== id);  
            } else {
                return [...prevSelected, id];  
            }
        });
    };

    const calculateTotal = () => {
        return selectedItems.reduce((total, id) => {
            const selectedItem = cartItems.find(item => item.product_id === id);
            if (selectedItem) {
                return total + (selectedItem.cost * selectedItem.quantity); 
            }
            return total;
        }, 0);
    };

    const handleOrder = () => {
        if (!user) {
            alert('Bạn cần đăng nhập để đặt hàng.');
            return;
        }

        if (selectedItems.length > 0) {
            navigate('/checkout');
            onClose();
        } else {
            alert('Bạn chưa chọn sản phẩm để đặt hàng.');
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
                                <img
                                    src={images(`./${item.imageUrl}`)}
                                    alt={item.product_name}
                                    className="cart-item-image"
                                />
                                <div className="cart-item-info">
                                    <h4>{item.product_name}</h4>
                                    <p>
                                        Giá: {item.cost !== undefined ? item.cost.toLocaleString('vi-VN') : 'Chưa có giá'} VND
                                    </p>
                                </div>
                                <div className="quantity-controls">
                                    <button
                                        onClick={() => handleQuantityChange(item.product_id, -1)}
                                        disabled={item.quantity <= 1} 
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleQuantityChange(item.product_id, 1)}>+</button>
                                    <button onClick={() => handleRemoveItem(item.product_id)} className="remove-button">
                                        Xóa
                                    </button>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.product_id)} 
                                        onChange={() => handleCheckboxChange(item.product_id)} 
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {selectedItems.length > 0 && (
                    <div className="total-price">
                        <p>Tổng: {calculateTotal().toLocaleString('vi-VN')} VND</p>
                    </div>
                )}
                {selectedItems.length > 0 && (
                    <button className="order-button" onClick={handleOrder}>
                        Đặt hàng
                    </button>
                )}
            </div>
        </div>
    );
};

export default CartPopup;
