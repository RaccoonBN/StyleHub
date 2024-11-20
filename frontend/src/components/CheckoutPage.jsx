import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkoutpage.css';  

const CheckoutPage = () => {
    const { state } = useLocation();  // Lấy dữ liệu từ CartPopup (orderDetails)
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [orderDetails, setOrderDetails] = useState(state?.orderDetails || []);  // Dữ liệu đơn hàng từ CartPopup

    useEffect(() => {
        if (!orderDetails || orderDetails.length === 0) {
            // Nếu không có dữ liệu đơn hàng, điều hướng về giỏ hàng
            navigate('/cart');
        }
    }, [orderDetails, navigate]);

    const calculateTotal = () => {
        return orderDetails.reduce((total, item) => total + item.cost * item.quantity, 0);
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
    
        // Kiểm tra các trường nhập liệu
        if (!fullName || !phoneNumber || !email || !address) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        if (paymentMethod === 'VNPAY') {
            try {
                const response = await fetch('http://localhost:5000/api/vnpay/create_payment_url', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        products: orderDetails,
                        totalAmount: calculateTotal,
                        bankCode: null,
                        language: "vn",
                    }),
                });

                const data = await response.json();
    
                if (data.url) {
                    window.location.href = data.url;  // Chuyển hướng đến trang thanh toán VNPAY
                } else {
                    alert('Lỗi khi tạo yêu cầu thanh toán VNPAY.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Đã xảy ra lỗi khi thanh toán.');
            }
        } else {
            alert('Đặt hàng thành công. Chúng tôi sẽ giao hàng theo địa chỉ bạn cung cấp.');
            navigate('/');
        }
    };
    

    return (
        <div className="checkout-container">
            <h2 className="checkout-header">Thông tin đơn hàng</h2>
            <div className="order-details">
                <h3>Chi tiết đơn hàng</h3>
                <ul>
                    {orderDetails.map((item) => (
                        <li key={item.id}>
                            {item.name} x {item.quantity} - {item.cost.toLocaleString('vi-VN')} VND
                            <strong> - {(item.cost * item.quantity).toLocaleString('vi-VN')} VND</strong>
                        </li>
                    ))}
                </ul>
                <div className="total-price">
                    <strong>Tổng: {calculateTotal().toLocaleString('vi-VN')} VND</strong>
                </div>
            </div>

            <form className="checkout-form" onSubmit={handleSubmitOrder}>
                <div className="form-group">
                    <label htmlFor="fullName" className="form-label">Họ và tên</label>
                    <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
                    <input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address" className="form-label">Địa chỉ nhận hàng</label>
                    <input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="paymentMethod" className="form-label">Phương thức thanh toán</label>
                    <select
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="form-select"
                    >
                        <option value="COD">Thanh toán khi nhận hàng</option>
                        <option value="VNPAY">Thanh toán qua VNPAY</option>
                    </select>
                </div>

                <button type="submit" className="checkout-button">
                    Đặt hàng
                </button>
            </form>
        </div>
    );
};

export default CheckoutPage;
