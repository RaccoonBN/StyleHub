const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/productRoutes'); 
const brandRoutes = require('./routes/brand');
const categoryRoutes = require('./routes/category');
const cartRoutes = require('./routes/cartRoutes');
const vnpayRoutes = require('./routes/vnpay')
const app = express();
const port = 5000;

// Cấu hình middleware express-session
app.use(session({
    secret: 'YJaRa4uuKD',   
    resave: false,               // Không lưu lại session nếu không thay đổi
    saveUninitialized: false,     // Chỉ lưu session nếu có gì thay đổi
    cookie: { secure: false },  
  }));
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'assets')));
app.use(cors({
    origin: 'http://localhost:3000',  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
}));

app.use(express.json()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Sử dụng route cho auth
app.use('/api/auth', authRoutes);
app.use('/api', brandRoutes);
app.use('/api', cartRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api/vnpay', vnpayRoutes);


app.listen(port, () => {
    console.log(`Server đang chạy trên http://localhost:${port}`);
});
