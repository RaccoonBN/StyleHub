import React, { useState, useEffect } from 'react';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.acc_id) {
          throw new Error('User chưa đăng nhập hoặc thiếu thông tin acc_id');
        }

        const response = await fetch(`http://localhost:5000/api/orders/${user.acc_id}`);
        if (!response.ok) {
          throw new Error(`Lỗi khi gọi API: ${response.statusText}`);
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="order-history">
      <h1>Lịch sử đặt hàng</h1>
      <div className="order-list">
        {orders.length === 0 ? (
          <p>Chưa có đơn hàng nào.</p>
        ) : (
          orders.map(order => (
            <div key={order.order_id} className="order-item">
              <h3>Đơn hàng #{order.order_id}</h3>
              <p>Ngày đặt: {new Date(order.created_at).toLocaleDateString()}</p>
              <p>Tổng tiền: {order.total} VND</p>
              <p>Trạng thái: {order.pay_status}</p>
              <p>Địa chỉ giao hàng: {order.address}</p>
              <div className="order-items">
                {order.order_items.map(item => (
                  <div key={item.product_id} className="order-item-details">
                    <p>Sản phẩm: {item.product_name}</p>
                    <p>Số lượng: {item.quantity_items}</p>
                    <p>Giá: {item.price} VND</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
