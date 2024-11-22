const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const util = require('util'); 

const queryAsync = util.promisify(db.query).bind(db);

// API lấy dữ liệu tất cả sản phẩm
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

// API lấy sản phẩm theo danh mục
router.get('/products/category/:categoryName', async (req, res) => {
    const { categoryName } = req.params;

    try {
        // Sử dụng JOIN để lấy tên danh mục và sản phẩm
        const query = `
            SELECT p.*, c.categ_name 
            FROM products p 
            JOIN categories c ON p.cate_id = c.cate_id
            WHERE c.cate_name = ?`;

        const results = await queryAsync(query, [categoryName]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Không có sản phẩm trong danh mục này' });
        }

        res.json(results);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ error: 'Failed to fetch products by category', details: error.message });
    }
});

// API lấy sản phẩm theo thương hiệu
router.get('/products/brand/:brandName', async (req, res) => {
    const { brandName } = req.params;

    try {
        // Sử dụng JOIN để lấy tên thương hiệu và sản phẩm
        const query = `
            SELECT p.*, b.brand_name 
            FROM products p 
            JOIN brands b ON p.brand_id = b.brand_id
            WHERE b.brand_name = ?`;

        const results = await queryAsync(query, [brandName]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Không có sản phẩm của thương hiệu này' });
        }

        res.json(results);
    } catch (error) {
        console.error('Error fetching products by brand:', error);
        res.status(500).json({ error: 'Failed to fetch products by brand', details: error.message });
    }
});

module.exports = router;
