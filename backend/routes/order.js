const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder); // Tạo đơn hàng mới
router.get('/:order_id', orderController.getOrderDetails); // Lấy chi tiết đơn hàng

module.exports = router;
