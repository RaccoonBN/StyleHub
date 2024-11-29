const express = require('express');
const router = express.Router();
const db = require('../config/db');  // Giả sử bạn có một file config/db.js kết nối với cơ sở dữ liệu

// 1. Route để tạo đơn hàng mới
router.post('/create', (req, res) => {
    const { address, phone_number, total, pay_status, acc_id, full_name } = req.body;
    const query = `
        INSERT INTO \`order\` (address, phone_number, total, pay_status, acc_id, full_name) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.query(query, [address, phone_number, total, pay_status, acc_id, full_name], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Lỗi khi tạo đơn hàng' });
        }
        return res.status(201).json({ message: 'Đơn hàng đã được tạo thành công', orderId: result.insertId });
    });
});

// 2. Route để lấy tất cả đơn hàng của người dùng
router.get('/:acc_id', (req, res) => {
    const { acc_id } = req.params;
    const query = `SELECT * FROM \`order\` WHERE acc_id = ?`;
    
    db.query(query, [acc_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Lỗi khi lấy đơn hàng' });
        }
        return res.status(200).json(result);
    });
});

// 3. Route để cập nhật trạng thái thanh toán của đơn hàng
router.put('/update/:orderId', (req, res) => {
    const { orderId } = req.params;
    const { pay_status } = req.body;  // Trạng thái thanh toán, có thể là 'paid' hoặc 'failed'

    const query = `
        UPDATE \`order\` SET pay_status = ? WHERE order_id = ?
    `;
    
    db.query(query, [pay_status, orderId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái thanh toán' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
        return res.status(200).json({ message: 'Trạng thái thanh toán đã được cập nhật' });
    });
});

// 4. Route để lấy lịch sử đặt hàng chi tiết của người dùng
router.get('/order-history/:acc_id', (req, res) => {
    const { acc_id } = req.params;
    
    // Truy vấn lấy các đơn hàng của người dùng cùng với chi tiết sản phẩm trong mỗi đơn hàng
    const query = `
        SELECT o.order_id, o.address, o.phone_number, o.total, o.pay_status, oi.product_id, oi.quantity_items, oi.price, p.product_name, p.product_img
        FROM \`order\` o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN products p ON oi.product_id = p.product_id
        WHERE o.acc_id = ?
        ORDER BY o.order_id DESC
    `;
    
    db.query(query, [acc_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Lỗi khi lấy lịch sử đơn hàng' });
        }
        return res.status(200).json(results);
    });
});

module.exports = router;
