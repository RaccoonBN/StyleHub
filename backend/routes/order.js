const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// 1. Route để tạo đơn hàng mới
router.post('/create', (req, res) => {
    const { address, phone_number, total, pay_status, acc_id, full_name } = req.body;
    const query = `
        INSERT INTO order (address, phone_number, total, pay_status, acc_id, full_name) 
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
    const query = `SELECT * FROM orders WHERE acc_id = ?`;
    
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
        UPDATE orders SET pay_status = ? WHERE id = ?
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

module.exports = router;
