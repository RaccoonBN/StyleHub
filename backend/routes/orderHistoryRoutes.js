const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Đảm bảo bạn đã có cấu hình kết nối MySQL.

router.get('/order-history', (req, res) => {
    const accId = req.query.accId; // accId được gửi từ frontend

    // Truy vấn lấy tất cả đơn hàng của người dùng
    const query = `
        SELECT o.order_id, o.address, o.phone_number, o.total, o.pay_status, o.full_name, o.created_at
        FROM \`order\` o
        WHERE o.acc_id = ?
        ORDER BY o.created_at DESC
    `;

    db.query(query, [accId], (err, orders) => {
        if (err) {
            return res.status(500).json({ message: 'Server error', error: err });
        }

        // Duyệt qua từng đơn hàng để lấy chi tiết các sản phẩm
        const orderDetailsPromises = orders.map(order => {
            const orderId = order.order_id;
            const productQuery = `
                SELECT oi.quantity_items, oi.price, p.product_name
                FROM order_items oi
                JOIN products p ON oi.product_id = p.product_id
                WHERE oi.order_id = ?
            `;
            return new Promise((resolve, reject) => {
                db.query(productQuery, [orderId], (err, products) => {
                    if (err) {
                        return reject(err);
                    }
                    order.products = products; // Thêm thông tin sản phẩm vào đơn hàng
                    resolve(order);
                });
            });
        });

        // Sau khi lấy tất cả các chi tiết sản phẩm, trả về dữ liệu
        Promise.all(orderDetailsPromises)
            .then((ordersWithProducts) => {
                return res.status(200).json(ordersWithProducts);
            })
            .catch((err) => {
                return res.status(500).json({ message: 'Error fetching products for orders', error: err });
            });
    });
});

module.exports = router;
