const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth'); // Import routes cho auth
const productRoutes = require('./routes/productRoutes'); 
const brandRoutes = require('./routes/brand');
const categoryRoutes = require('./routes/category');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
const port = 5000;

app.use(express.static(path.join(__dirname, 'assets')));
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Sử dụng route cho auth
app.use('/api', authRoutes);
app.use('/api', brandRoutes);
app.use('/api', cartRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api/order', require('./routes/order'));


app.listen(port, () => {
    console.log(`Server đang chạy trên http://localhost:${port}`);
});
