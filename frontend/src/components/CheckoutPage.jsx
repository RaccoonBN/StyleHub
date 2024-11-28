import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkoutpage.css';

const CheckoutPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [orderDetails, setOrderDetails] = useState(state?.orderDetails || []);

    useEffect(() => {
        if (!orderDetails || orderDetails.length === 0) {
            navigate('/cart');
        }
    }, [orderDetails, navigate]);

    const calculateTotal = () => {
        // Chuyển đổi dữ liệu đầu vào thành số 
        return orderDetails.reduce((total, item) => {
            const cost = parseFloat(item.cost) || 0;
            const quantity = parseInt(item.quantity) || 0;
            return total + cost * quantity;
        }, 0);
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
    
        // Kiểm tra thông tin đầu vào
        if (!fullName || !phoneNumber || !email || !address) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }
    
        const totalAmount = calculateTotal();
        if (isNaN(totalAmount) || totalAmount <= 0) {
            alert('Tổng tiền không hợp lệ.');
            return;
        }
    
        console.log("Dữ liệu đơn hàng:", orderDetails);
        console.log("Tổng tiền:", totalAmount);
    
        if (paymentMethod === 'VNPAY') {
            try {
                const requestBody = {
                    products: orderDetails,
                    totalAmount,
                    bankCode: null, 
                    language: 'vn',
                    fullName,
                    phoneNumber,
                    address,
                    acc_id: localStorage.getItem('acc_id'),
                };
    
                const response = await fetch('http://localhost:5000/api/vnpay/create_payment_url', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody),
                });
    
                const data = await response.json();
                console.log("Response data:", data); 
                if (data.paymentUrl) {
                    window.location.href = data.paymentUrl;
                } else {
                    alert('Không thể tạo URL thanh toán.');
                }
            } catch (error) {
                console.error('Error khi thanh toán qua VNPAY:', error);
                alert('Đã xảy ra lỗi khi kết nối với VNPAY.');
            }
        } else {
            try {
                const requestBody = {
                    address,
                    phone_number: phoneNumber,
                    total: totalAmount,
                    pay_status: 'pending',
                    acc_id: localStorage.getItem('acc_id'),
                    full_name: fullName,
                };

                console.log("Gửi dữ liệu đơn hàng:", requestBody);

                const response = await fetch('http://localhost:5000/api/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Đặt hàng thành công!');
                    navigate('/');
                } else {
                    alert(data.message || 'Lỗi khi tạo đơn hàng');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Đã xảy ra lỗi khi gửi yêu cầu đặt hàng.');
            }
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
                            {item.name} x {item.quantity} - {parseFloat(item.cost).toLocaleString('vi-VN')} VND
                            <strong> - {(parseFloat(item.cost) * parseInt(item.quantity)).toLocaleString('vi-VN')} VND</strong>
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
