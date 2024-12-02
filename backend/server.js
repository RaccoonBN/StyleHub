const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/productRoutes'); 
const brandRoutes = require('./routes/brand');
const categoryRouter = require('./routes/category');
const reviewRoutes = require('./routes/review');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/order');
const vnpayRoutes = require('./routes/vnpay');
const orderHistoryRoutes = require('./routes/orderHistoryRoutes');
const app = express();
const port = 5000;

// Cấu hình CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],  
  credentials: true,  
};

app.use(cors(corsOptions));  // Áp dụng middleware CORS với cấu hình
app.options('*', cors());  // Hỗ trợ OPTIONS requests (Preflight requests)

// Cấu hình middleware express-session
app.use(session({
  secret: 'YJaRa4uuKD',   
  resave: false,               // Không lưu lại session nếu không thay đổi
  saveUninitialized: false,     // Chỉ lưu session nếu có gì thay đổi
  cookie: { secure: false },    // Nếu sử dụng https, bạn cần set secure: true
}));

// Cấu hình body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình static file cho thư mục assets
app.use(express.static(path.join(__dirname, 'assets')));

// Sử dụng route cho auth và các routes khác
app.use('/api/auth', authRoutes);
app.use('/api', brandRoutes);
app.use('/api', cartRoutes);
app.use('/api/category', categoryRouter);
app.use('/api', productRoutes);
app.use('/api', reviewRoutes);
app.use('/api', orderRoutes);
app.use('/api', orderHistoryRoutes);

app.use('/api/vnpay', vnpayRoutes);

// Khởi chạy server
app.listen(port, () => {
  console.log(`Server đang chạy trên http://localhost:${port}`);
});
