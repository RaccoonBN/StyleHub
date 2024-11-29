import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Để lấy `acc_id` từ URL
import axios from 'axios';
import { FaHistory } from 'react-icons/fa';
import './OrderHistory.css'; // File CSS để styling

const OrderHistory = () => {
  const { acc_id } = useParams(); // Lấy acc_id từ URL
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu lịch sử đơn hàng từ backend
    axios.get(`/api/order-history/${acc_id}`)
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Lỗi khi tải lịch sử đơn hàng', error);
      });
  }, [acc_id]);

  return (
    <div className="order-history-container">
      <h2><FaHistory /> Lịch sử đặt hàng</h2>
      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        <ul className="order-list">
          {orders.map(order => (
            <li key={order.order_id} className="order-item">
              <div className="order-header">
                <h3>Đơn hàng ID: {order.order_id}</h3>
                <p>Địa chỉ: {order.address}</p>
                <p>Số điện thoại: {order.phone_number}</p>
                <p>Tình trạng thanh toán: {order.pay_status}</p>
                <p>Tổng tiền: {order.total} VND</p>
              </div>
              <div className="order-details">
                <img src={order.product_img} alt={order.product_name} />
                <p>Sản phẩm: {order.product_name}</p>
                <p>Số lượng: {order.quantity_items}</p>
                <p>Giá: {order.price} VND</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistory;
