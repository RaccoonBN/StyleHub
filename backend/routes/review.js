const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// Route để lấy tất cả đánh giá của một sản phẩm
router.get('/reviews/:productId', (req, res) => {
    const productId = req.params.productId;
    const query = `
    SELECT reviews.review_id, reviews.rating, reviews.comment, reviews.review_date, 
           CONCAT(account.first_name, ' ', account.last_name) AS full_name
    FROM reviews
    JOIN account ON reviews.acc_id = account.acc_id
    WHERE reviews.product_id = ? 
    ORDER BY reviews.review_date DESC  
    `;
  
    db.query(query, [productId], (err, results) => {
      if (err) {
        console.error('Lỗi khi lấy đánh giá:', err);
        return res.status(500).json({ error: 'Lỗi hệ thống' });
      }
      res.json(results);
    });
  });
  

// Route để thêm một đánh giá mới cho sản phẩm
router.post('/reviews', (req, res) => {
  const { acc_id, product_id, rating, comment } = req.body;
  const review_date = new Date();

  const query = 'INSERT INTO reviews (acc_id, product_id, rating, comment, review_date) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [acc_id, product_id, rating, comment, review_date], (err, results) => {
    if (err) {
      console.error('Lỗi khi thêm đánh giá:', err);
      return res.status(500).json({ error: 'Lỗi hệ thống' });
    }
    res.status(201).json({ message: 'Đánh giá đã được thêm thành công' });
  });
});

module.exports = router;
