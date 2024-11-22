import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import './CartPopup.css';

const images = require.context('../assets', false, /\.(png|jpe?g|svg)$/);

const CartPopup = ({ isOpen, onClose, cartItems = [], setCartItems }) => {
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState([]); // Danh sách các sản phẩm đã chọn

    // Đổ danh sách sản phẩm ra giỏ hàng
    useEffect(() => {
        if (isOpen) {
            const fetchCartItems = async () => {
                try {
                    const acc_id = localStorage.getItem('acc_id');
                    console.log('Fetching cart items for acc_id:', acc_id); // Debug log
                    const response = await fetch(`http://localhost:5000/api/cart?acc_id=${acc_id}`, {
                        method: 'GET',
                        credentials: 'include', // Đảm bảo cookie được gửi cùng yêu cầu
                    });
                    const data = await response.json();

                    if (Array.isArray(data)) {
                        setCartItems(data);
                    } else {
                        console.error('Lỗi: Dữ liệu giỏ hàng không phải là mảng', data);
                    }
                } catch (error) {
                    console.error('Lỗi khi lấy giỏ hàng:', error);
                }
            };

            fetchCartItems();
        }
    }, [isOpen, setCartItems]);

    // Hàm thay đổi số lượng sản phẩm trong giỏ hàng
    const handleQuantityChange = async (id, change) => {
        try {
            const acc_id = localStorage.getItem('acc_id');
            const updatedItems = cartItems.map((item) =>
                item.product_id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            );

            const updatedItem = updatedItems.find(item => item.product_id === id);

            console.log("Updated Item: ", updatedItem); // Debug log

            const response = await fetch('http://localhost:5000/api/updatecart', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Đảm bảo cookie được gửi cùng yêu cầu
                body: JSON.stringify({
                    product_id: updatedItem.product_id,
                    quantity: updatedItem.quantity,
                    acc_id // Thêm acc_id vào body của yêu cầu
                })
            });

            if (response.ok) {
                setCartItems(updatedItems);  // Cập nhật state sau khi thành công
            } else {
                console.error('Lỗi khi cập nhật số lượng sản phẩm');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật số lượng sản phẩm:', error);
        }
    };

    // Hàm xóa sản phẩm khỏi giỏ hàng
    const handleRemoveItem = async (productId) => {
        try {
            const acc_id = localStorage.getItem('acc_id');

            const response = await fetch('http://localhost:5000/api/deletecart', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Đảm bảo cookie được gửi cùng yêu cầu
                body: JSON.stringify({
                    product_id: productId,
                    acc_id // Thêm acc_id vào body của yêu cầu
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
            } else {
                console.error('Lỗi khi xóa sản phẩm:', data.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
        }
    };

    // Xử lý thay đổi trạng thái checkbox của sản phẩm
    const handleCheckboxChange = (id) => {
        setSelectedItems((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter(itemId => itemId !== id);  // Nếu đã chọn thì bỏ chọn
            } else {
                return [...prevSelected, id];  // Nếu chưa chọn thì chọn
            }
        });
    };

    // Tính tổng giá trị giỏ hàng cho các sản phẩm đã chọn
    const calculateTotal = () => {
        return selectedItems.reduce((total, id) => {
            const selectedItem = cartItems.find(item => item.product_id === id);
            if (selectedItem) {
                return total + (selectedItem.cost * selectedItem.quantity);
            }
            return total;
        }, 0);
    };

    // Hàm handleOrder với tính năng mở rộng
    const handleOrder = () => {
        if (selectedItems.length > 0) {
            // Tính toán chi tiết đơn hàng hoặc các sản phẩm đã chọn
            const orderDetails = selectedItems.map(id => {
                const selectedItem = cartItems.find(item => item.product_id === id);
                return {
                    id: selectedItem.product_id,
                    name: selectedItem.product_name,
                    quantity: selectedItem.quantity,
                    cost: selectedItem.cost
                };
            });

            // Điều hướng đến trang checkout và truyền dữ liệu đơn hàng
            navigate('/checkout', { state: { orderDetails } });  // Truyền chi tiết đơn hàng sang trang checkout

            // Đóng popup giỏ hàng
            onClose();
        } else {
            alert('Bạn chưa chọn sản phẩm để đặt hàng.');
        }
    };

    if (!isOpen) return null;  // Nếu popup không mở thì không hiển thị gì

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
                                        disabled={item.quantity <= 1} // Không giảm nếu số lượng là 1
                                        className="cart-item-quantity-btn cart-item-btn-decrease"
                                    >
                                        -
                                    </button>
                                    <span className="cart-item-quantity">{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(item.product_id, 1)}
                                        className="cart-item-quantity-btn cart-item-btn-increase"  // Nút tăng số lượng
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => handleRemoveItem(item.product_id)}
                                        className="cart-item-btn cart-item-btn-remove"  // Nút xóa sản phẩm
                                    >
                                        Xóa
                                    </button>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.product_id)}  // Kiểm tra xem item có được chọn không
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
