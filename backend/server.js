const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/productRoutes');
const brandRoutes = require('./routes/brand');
const categoryRoutes = require('./routes/category');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/order');

const app = express();
const port = 5000;

// Cung cấp các tập tin tĩnh
app.use(express.static(path.join(__dirname, 'assets')));

// Cấu hình CORS nâng cao
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware để phân tích dữ liệu JSON và URL-encoded
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Định nghĩa các route API
app.use('/api', authRoutes);
app.use('/api', brandRoutes);
app.use('/api', cartRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api/order', orderRoutes);

// Xử lý khi endpoint không tồn tại
app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint không tồn tại' });
});

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
    console.error('Lỗi trên server:', err.stack);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
