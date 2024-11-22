const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// Lấy thông tin giỏ hàng
router.get('/cart', (req, res) => {
    const { acc_id } = req.query;

    if (!acc_id) {
        return res.status(400).json({ message: 'Cần đăng nhập để xem giỏ hàng' });
    }

    const query = `
        SELECT cart.quantity, products.imageUrl, products.product_name, products.cost, products.product_id
        FROM cart 
        JOIN products ON cart.product_id = products.product_id
        WHERE cart.acc_id = ?`;

    db.query(query, [acc_id], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng', error });
        }
        res.json(results);
    });
});

// Thêm sản phẩm vào giỏ hàng
router.post('/addcart', (req, res) => {
    const { product_id, quantity, acc_id } = req.body;
    // Lấy giá trị thực của product_id
    const actualProductId = product_id?.product_id;

    if (!actualProductId || !acc_id || quantity <= 0) {
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }

    const checkQuery = 'SELECT * FROM cart WHERE product_id = ? AND acc_id = ?';

    db.query(checkQuery, [actualProductId, acc_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi khi kiểm tra giỏ hàng', error: err });
        }

        if (results.length > 0) {
            // Nếu có sp rồi thì cập nhật số lượng
            const newQuantity = results[0].quantity + quantity;
            const updateQuery = 'UPDATE cart SET quantity = ? WHERE product_id = ? AND acc_id = ?';
            db.query(updateQuery, [newQuantity, actualProductId, acc_id], (error) => {
                if (error) {
                    return res.status(500).json({ message: 'Lỗi khi cập nhật số lượng', error });
                }
                res.status(200).json({ message: 'Cập nhật số lượng thành công' });
            });
        } else {
            // Nếu chưa thì thêm sp vào giỏ hàng
            const insertQuery = 'INSERT INTO cart (product_id, quantity, acc_id) VALUES (?, ?, ?)';
            db.query(insertQuery, [actualProductId, quantity, acc_id], (error, results) => {
                if (error) {
                    return res.status(500).json({ message: 'Lỗi khi thêm sản phẩm vào giỏ hàng', error });
                }
                res.status(201).json({ message: 'Thêm sản phẩm vào giỏ hàng thành công', cart: results });
            });
        }
    });
});

// Cập nhật giỏ hàng
router.put('/updatecart', (req, res) => {
    const { product_id, quantity, acc_id } = req.body; 
    if (!acc_id) return res.status(400).json({ message: 'Cần đăng nhập để cập nhật giỏ hàng' });
    if (!product_id) return res.status(400).json({ message: 'Cần cung cấp product_id để cập nhật' });

    const query = `
        UPDATE cart
        SET quantity = ?
        WHERE product_id = ? AND acc_id = ?
    `;
    
    db.query(query, [quantity, product_id, acc_id], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Failed to update cart', error });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
        res.status(200).json({ message: 'Cart updated successfully' });
    });
});

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/deletecart', (req, res) => {
    const { product_id, acc_id } = req.body;
    if (!acc_id) return res.status(400).json({ message: 'Cần đăng nhập để xóa sản phẩm khỏi giỏ hàng' });
    if (!product_id) return res.status(400).json({ message: 'Cần cung cấp product_id để xóa' });

    const query = `
        DELETE FROM cart
        WHERE product_id = ? AND acc_id = ?
    `;

    db.query(query, [product_id, acc_id], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Failed to remove product', error });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
        res.status(200).json({ message: 'Product removed from cart' });
    });
});

module.exports = router;
