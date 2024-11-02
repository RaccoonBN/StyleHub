const db = require('../config/db');

// Tạo đơn hàng mới
exports.createOrder = (req, res) => {
    const { address, phone_number, total, pay_status, acc_id, items } = req.body;

    // Tạo order trong bảng `order`
    const order_id = `ORD-${Date.now()}`; // ID tạm cho đơn hàng
    const sqlOrder = `INSERT INTO \`order\` (order_id, address, phone_number, total, pay_status, acc_id) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sqlOrder, [order_id, address, phone_number, total, pay_status, acc_id], (err, result) => {
        if (err) return res.status(500).send(err);

        // Thêm từng sản phẩm vào bảng order_items
        const sqlOrderItems = `INSERT INTO order_items (order_id, product_id, quantity_items, price) VALUES ?`;
        const orderItemsData = items.map(item => [order_id, item.product_id, item.quantity, item.price]);

        db.query(sqlOrderItems, [orderItemsData], (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(201).json({ message: 'Order created successfully', order_id });
        });
    });
};

// Lấy chi tiết đơn hàng
exports.getOrderDetails = (req, res) => {
    const { order_id } = req.params;
    const sql = `
        SELECT o.order_id, o.address, o.phone_number, o.total, o.pay_status, oi.product_id, oi.quantity_items, oi.price
        FROM \`order\` o
        JOIN order_items oi ON o.order_id = oi.order_id
        WHERE o.order_id = ?`;

    db.query(sql, [order_id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};
