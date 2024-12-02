// OrderHistory.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderHistory.css'; // Tạo file CSS cho giao diện

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')); // Lấy thông tin người dùng

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/order/history?acc_id=${user.acc_id}`)
        .then(response => {
          setOrders(response.data); // Lưu đơn hàng vào state
        })
        .catch(error => {
          console.error('Error fetching order history:', error);
        });
    }
  }, [user]);

  return (
    <div className="order-history">
      <h2>Lịch sử đặt hàng</h2>
      {orders.length > 0 ? (
        <table className="order-table">
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái thanh toán</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>{order.total} VND</td>
                <td>{order.pay_status}</td>
                <td>
                  <button className="view-details-btn">Xem chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Chưa có đơn hàng nào.</p>
      )}
    </div>
  );
};

export default OrderHistory;
