const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Lấy tất cả danh mục
router.get('/category', (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
// Lấy tên danh mục dựa trên ID
router.get('/category/:id', (req, res) => {
    const cateId = req.params.id; // Lấy id từ URL
    db.query('SELECT cate_name FROM categories WHERE cate_id = ?', [cateId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Danh mục không tìm thấy' });
        res.json(results[0]); 
    });
});
module.exports = router;
