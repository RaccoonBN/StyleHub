const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import db.js
const path = require('path');
const bodyParser = require('body-parser');


const app = express();
const port = 5000;
app.use(express.static(path.join(__dirname, 'assets')));   
app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }));
app.use(express.json()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API lấy dữ liệu products
app.get('/products', (req, res) => {
    const query = 'SELECT * FROM products'; // Thay bằng tên bảng sách của bạn
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server đang chạy trên http://localhost:${port}`);
});
