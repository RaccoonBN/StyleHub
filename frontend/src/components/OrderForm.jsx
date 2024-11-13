import React, { useState, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import './OrderForm.css';

function OrderForm() {
    const { cart, setCart } = useContext(CartContext);
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');

    const handleOrder = () => {
        const orderData = {
            address,
            phone_number: phone,
            total: cart.reduce((total, item) => total + item.price * item.quantity, 0),
            pay_status: 'Pending',
            acc_id: 1, // Giả định người dùng đã đăng nhập với acc_id = 1
            items: cart.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
            })),
        };

        axios.post('http://localhost:5000/api/order', orderData)
            .then(response => {
                alert('Order placed successfully!');
                setCart([]); // Xóa giỏ hàng sau khi đặt hàng thành công
            })
            .catch(error => console.error('Order failed:', error));
    };

    return (
        <div className="order-form">
            <h2>Shipping Information</h2>
            <input 
                type="text" 
                placeholder="Address" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                className="order-input"
            />
            <input 
                type="text" 
                placeholder="Phone Number" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="order-input"
            />
            <button onClick={handleOrder} className="order-button">Place Order</button>
        </div>
    );
}

export default OrderForm;
