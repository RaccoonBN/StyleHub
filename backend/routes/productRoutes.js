const express = require('express');
const router = express.Router();
const db = require('../config/db');
const util = require('util');

const queryAsync = util.promisify(db.query).bind(db);

// API lấy tất cả sản phẩm, hỗ trợ lọc theo danh mục và thương hiệu
router.get('/products', async (req, res) => {
    const { category, brand } = req.query; // Nhận các tham số lọc từ query string
    let query = 'SELECT * FROM products';
    const conditions = [];
    const params = [];

    if (category) {
        conditions.push(`cate_id IN (SELECT cate_id FROM categories WHERE cate_name = ?)`); // Lọc theo danh mục
        params.push(category);
    }

    if (brand) {
        conditions.push(`brand_id IN (SELECT brand_id FROM brands WHERE brand_name = ?)`); // Lọc theo thương hiệu
        params.push(brand);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    try {
        const results = await queryAsync(query, params);
        res.json(results);
    } catch (error) {
        console.error('Error fetching filtered products:', error);
        res.status(500).json({ error: 'Failed to fetch products', details: error.message });
    }
});

// API tìm kiếm sản phẩm theo tên
router.get('/search', async (req, res) => {
    const searchQuery = req.query.query || '';
    try {
        const results = await queryAsync(
            `SELECT * FROM products WHERE LOWER(product_name) LIKE LOWER(?)`,
            [`%${searchQuery}%`]
        );

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
        const query = `
            SELECT p.*, c.cate_name 
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
        const query = `
            SELECT p.*, b.brand_name, p.cost
            FROM products p 
            JOIN brands b ON p.brand_id = b.brand_id
            WHERE b.brand_name = ?`;

        const results = await queryAsync(query, [brandName]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Không có sản phẩm của thương hiệu này' });
        }

        res.json(results); // Trả về kết quả sản phẩm
    } catch (error) {
        console.error('Error fetching products by brand:', error);
        res.status(500).json({ error: 'Failed to fetch products by brand', details: error.message });
    }
});

// Lấy tất cả sản phẩm theo danh mục
router.get('/products/:categoryId', (req, res) => {
    const cateId = req.params.categoryId; // Lấy ID danh mục từ URL

    // Truy vấn sản phẩm theo danh mục
    const query = 'SELECT * FROM products WHERE cate_id = ?';
    
    db.query(query, [cateId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Không có sản phẩm nào trong danh mục này' });
        }
        res.json(results); // Trả về danh sách sản phẩm
    });
});

module.exports = router;
