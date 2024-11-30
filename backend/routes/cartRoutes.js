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

    // Kiểm tra nếu product_id, acc_id và quantity hợp lệ
    if (!product_id || !acc_id || quantity <= 0) {
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }

    const checkQuery = 'SELECT * FROM cart WHERE product_id = ? AND acc_id = ?';
    console.log('SQL Query:', checkQuery, 'Params:', [product_id, acc_id]); // In câu truy vấn và tham số ra console

    db.query(checkQuery, [product_id, acc_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi khi kiểm tra giỏ hàng', error: err });
        }

        if (results.length > 0) {
            // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
            const newQuantity = results[0].quantity + quantity;
            const updateQuery = 'UPDATE cart SET quantity = ? WHERE product_id = ? AND acc_id = ?';
            db.query(updateQuery, [newQuantity, product_id, acc_id], (error) => {
                if (error) {
                    return res.status(500).json({ message: 'Lỗi khi cập nhật số lượng', error });
                }
                res.status(200).json({ message: 'Cập nhật số lượng thành công' });
            });
        } else {
            // Nếu chưa có sản phẩm trong giỏ hàng, thêm mới
            const insertQuery = 'INSERT INTO cart (product_id, quantity, acc_id) VALUES (?, ?, ?)';
            db.query(insertQuery, [product_id, quantity, acc_id], (error, results) => {
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

    if (!acc_id || !product_id || quantity <= 0) {
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }

    // Lấy số lượng sản phẩm có sẵn từ bảng products (tồn kho)
    const stockQuery = 'SELECT quantity FROM products WHERE product_id = ?';
    db.query(stockQuery, [product_id], (err, stockResults) => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi khi kiểm tra số lượng', error: err });
        }

        if (stockResults.length === 0) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        const availableQuantity = stockResults[0].quantity; // Số lượng có sẵn trong kho

        // Kiểm tra xem số lượng người dùng yêu cầu có vượt quá số lượng tồn kho không
        if (quantity > availableQuantity) {
            return res.status(400).json({ message: 'Số lượng yêu cầu vượt quá số lượng tồn kho' });
        }

        // Tiếp theo, kiểm tra và cập nhật số lượng trong giỏ hàng
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
