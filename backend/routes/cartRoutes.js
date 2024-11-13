const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Kết nối tới MySQL

// Thêm sản phẩm vào giỏ hàng
router.post('/add-to-cart', (req, res) => {
  const { acc_id, product_id, quantity } = req.body;

  if (!acc_id || !product_id || !quantity) {
    return res.status(400).json({ message: 'acc_id, product_id, và quantity là bắt buộc' });
  }

  // Kiểm tra xem người dùng đã có giỏ hàng chưa
  const checkCartQuery = 'SELECT * FROM cart WHERE acc_id = ?';
  db.query(checkCartQuery, [acc_id], (err, cartResults) => {
    if (err) {
      console.error('Lỗi khi kiểm tra giỏ hàng:', err);
      return res.status(500).json({ message: 'Lỗi khi kiểm tra giỏ hàng' });
    }

    // Nếu chưa có giỏ hàng, tạo giỏ hàng mới
    if (cartResults.length === 0) {
      const createCartQuery = 'INSERT INTO cart (acc_id) VALUES (?)';
      db.query(createCartQuery, [acc_id], (err, createResults) => {
        if (err) {
          console.error('Lỗi khi tạo giỏ hàng:', err);
          return res.status(500).json({ message: 'Lỗi khi tạo giỏ hàng' });
        }

        // Sau khi tạo giỏ hàng mới, thêm sản phẩm vào giỏ
        const insertQuery = 'INSERT INTO cart_items (acc_id, product_id, quantity) VALUES (?, ?, ?)';
        db.query(insertQuery, [acc_id, product_id, quantity], (err, insertResults) => {
          if (err) {
            console.error('Lỗi khi thêm sản phẩm vào giỏ:', err);
            return res.status(500).json({ message: 'Lỗi khi thêm sản phẩm vào giỏ' });
          }
          res.status(200).json({ success: true, message: 'Sản phẩm đã được thêm vào giỏ hàng mới' });
        });
      });
    } else {
      // Nếu giỏ hàng đã tồn tại, kiểm tra xem sản phẩm có trong giỏ không
      const checkProductQuery = 'SELECT * FROM cart_items WHERE acc_id = ? AND product_id = ?';
      db.query(checkProductQuery, [acc_id, product_id], (err, productResults) => {
        if (err) {
          console.error('Lỗi khi kiểm tra sản phẩm trong giỏ:', err);
          return res.status(500).json({ message: 'Lỗi khi kiểm tra sản phẩm trong giỏ' });
        }

        if (productResults.length > 0) {
          // Nếu sản phẩm đã có trong giỏ, cập nhật số lượng
          const updateQuery = 'UPDATE cart_items SET quantity = quantity + ? WHERE acc_id = ? AND product_id = ?';
          db.query(updateQuery, [quantity, acc_id, product_id], (err, updateResults) => {
            if (err) {
              console.error('Lỗi khi cập nhật giỏ hàng:', err);
              return res.status(500).json({ message: 'Lỗi khi cập nhật giỏ hàng' });
            }
            res.status(200).json({ success: true, message: 'Cập nhật số lượng sản phẩm' });
          });
        } else {
          // Nếu sản phẩm chưa có trong giỏ, thêm sản phẩm vào giỏ
          const insertQuery = 'INSERT INTO cart_items (acc_id, product_id, quantity) VALUES (?, ?, ?)';
          db.query(insertQuery, [acc_id, product_id, quantity], (err, insertResults) => {
            if (err) {
              console.error('Lỗi khi thêm sản phẩm vào giỏ:', err);
              return res.status(500).json({ message: 'Lỗi khi thêm sản phẩm vào giỏ' });
            }
            res.status(200).json({ success: true, message: 'Sản phẩm đã được thêm vào giỏ hàng' });
          });
        }
      });
    }
  });
});

module.exports = router;
