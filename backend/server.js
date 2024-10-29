const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import db.js
const path = require('path');
const bodyParser = require('body-parser');
const util = require('util'); // Thêm thư viện util để promisify
const mongoose = require('mongoose'); // Thêm mongoose để kết nối MongoDB
const authRoutes = require('./routes/auth'); // Import routes cho auth

const app = express();
const port = 5000;

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stylehubDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Kết nối MongoDB thành công!'))
.catch(err => console.error('Kết nối MongoDB thất bại:', err));

app.use(express.static(path.join(__dirname, 'assets')));
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const queryAsync = util.promisify(db.query).bind(db);

// API lấy dữ liệu products
app.get('/products', (req, res) => {
    const query = 'SELECT * FROM products'; 
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// API tìm kiếm
app.get('/search', async (req, res) => {
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

// Sử dụng route cho auth
app.use('/api', authRoutes);

app.listen(port, () => {
    console.log(`Server đang chạy trên http://localhost:${port}`);
});
