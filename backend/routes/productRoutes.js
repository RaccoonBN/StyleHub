// routes/product_route.js
const express = require('express');
const router = express.Router();
const db = require('./db'); 
const util = require('util'); 


const queryAsync = util.promisify(db.query).bind(db);

// API lấy dữ liệu products
router.get('/products', (req, res) => {
    const query = 'SELECT * FROM products'; 
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// API tìm kiếm sản phẩm
router.get('/search', async (req, res) => {
    const searchQuery = req.query.query || '';
    try {
        const results = await queryAsync(
            `SELECT * FROM products WHERE LOWER(product_name) LIKE LOWER(?)`,
            [`%${searchQuery}%`]
        );

        if (!Array.isArray(results)) {
            throw new TypeError('Query did not return an array');
        }

        if (results.length === 0) {
            res.json({ message: 'Không tìm thấy sản phẩm' }); 
        } else {
            res.json(results);
        }
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to search products', details: error.message });
    }
});

module.exports = router;
