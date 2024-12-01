const express = require('express');
const router = express.Router();
const db = require('../config/db');  // Giả sử bạn có một file db.js để kết nối cơ sở dữ liệu

// 1. Route để tạo đơn hàng mới
router.post('/create', (req, res) => {
    const { address, phone_number, total, acc_id, orderItems, full_name } = req.body;

    console.log("Thông tin đơn hàng nhận được:", req.body);

    db.beginTransaction((err) => {
        if (err) {
            console.error('Lỗi khi bắt đầu transaction:', err);
            return res.status(500).json({ message: 'Lỗi khi bắt đầu transaction' });
        }

        const orderQuery = `
            INSERT INTO \`order\` (address, phone_number, total, pay_status, acc_id, full_name)
            VALUES (?, ?, ?, 'pending', ?, ?)
        `;
        db.query(orderQuery, [address, phone_number, total, acc_id, full_name], (err, orderResult) => {
            if (err) {
                console.error('Lỗi khi tạo đơn hàng:', err);
                return db.rollback(() => {
                    res.status(500).json({ message: 'Lỗi khi tạo đơn hàng' });
                });
            }

            const orderId = orderResult.insertId;
            console.log("Đơn hàng đã được tạo, orderId:", orderId);

            // Thêm sản phẩm vào order_items và giảm số lượng sản phẩm
            const itemPromises = orderItems.map((item) => {
                const { product_id, quantity_items, price } = item;

                console.log(`Thêm sản phẩm vào order_items, product_id: ${product_id}, quantity_items: ${quantity_items}, price: ${price}`);

                const orderItemQuery = `
                    INSERT INTO order_items (order_id, product_id, quantity_items, price)
                    VALUES (?, ?, ?, ?)
                `;
                return new Promise((resolve, reject) => {
                    db.query(orderItemQuery, [orderId, product_id, quantity_items, price], (err) => {
                        if (err) {
                            console.error('Lỗi khi thêm sản phẩm vào order_items:', err);
                            return reject(err);
                        }

                        const updateProductQuery = `
                            UPDATE products
                            SET quantity = quantity - ?
                            WHERE product_id = ? AND quantity >= ?
                        `;
                        db.query(updateProductQuery, [quantity_items, product_id, quantity_items], (err, result) => {
                            if (err) {
                                console.error('Lỗi khi cập nhật số lượng sản phẩm:', err);
                                return reject(err);
                            }

                            if (result.affectedRows === 0) {
                                console.error(`Sản phẩm ${product_id} không đủ số lượng`);
                                return reject(new Error(`Sản phẩm ${product_id} không đủ số lượng`));
                            }
                            resolve();
                        });
                    });
                });
            });

            // Sau khi tất cả các sản phẩm đã được xử lý, xóa giỏ hàng của người dùng
            const clearCartQuery = `
                DELETE FROM cart WHERE acc_id = ?
            `;
            const deleteCartPromise = new Promise((resolve, reject) => {
                db.query(clearCartQuery, [acc_id], (err) => {
                    if (err) {
                        console.error('Lỗi khi xóa giỏ hàng:', err);
                        return reject(err);
                    }
                    resolve();
                });
            });

            // Đợi cho tất cả các sản phẩm được thêm vào và giỏ hàng bị xóa
            Promise.all([...itemPromises, deleteCartPromise])
                .then(() => {
                    db.commit((err) => {
                        if (err) {
                            console.error('Lỗi khi commit transaction:', err);
                            return db.rollback(() => {
                                res.status(500).json({ message: 'Lỗi khi commit transaction' });
                            });
                        }
                        res.status(201).json({ message: 'Đơn hàng đã được tạo thành công', orderId });
                    });
                })
                .catch((err) => {
                    console.error('Lỗi khi xử lý sản phẩm trong đơn hàng hoặc xóa giỏ hàng:', err);
                    db.rollback(() => {
                        res.status(500).json({ message: 'Lỗi khi xử lý sản phẩm trong đơn hàng hoặc xóa giỏ hàng', error: err.message });
                    });
                });
        });
    });
});

// 2. Route để lấy tất cả đơn hàng của người dùng
router.get('/:acc_id', (req, res) => {
    const { acc_id } = req.params;
    const query = `SELECT * FROM \`order\` WHERE acc_id = ?`;

    db.query(query, [acc_id], (err, result) => {
        if (err) {
            console.error('Lỗi khi lấy đơn hàng:', err);
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
            console.error('Lỗi khi cập nhật trạng thái thanh toán:', err);
            return res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái thanh toán' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
        return res.status(200).json({ message: 'Trạng thái thanh toán đã được cập nhật' });
    });
});

// 4. Route để lấy lịch sử đơn hàng chi tiết của người dùng
router.get('/order-history/:acc_id', (req, res) => {
    const { acc_id } = req.params;

    // Truy vấn lấy đơn hàng và chi tiết sản phẩm trong mỗi đơn hàng
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
            console.error('Lỗi khi lấy lịch sử đơn hàng:', err);
            return res.status(500).json({ message: 'Lỗi khi lấy lịch sử đơn hàng' });
        }
        return res.status(200).json(results);
    });
});

module.exports = router;
