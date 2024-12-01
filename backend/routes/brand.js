const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Lấy tất cả thương hiệu
router.get('/brands', (req, res) => {
    db.query('SELECT * FROM brands', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Lấy tên thương hiệu dựa trên ID
router.get('/brands/:id', (req, res) => {
    const brandId = req.params.id;
    db.query('SELECT brand_name FROM brands WHERE brand_id = ?', [brandId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Thương hiệu không tìm thấy' });
        res.json(results[0]);
    });
});

module.exports = router;
