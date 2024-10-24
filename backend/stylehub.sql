-- Tạo bảng account
CREATE TABLE account (
    acc_id INT AUTO_INCREMENT PRIMARY KEY,  -- Mã số ID tự động tăng
    first_name VARCHAR(50) NOT NULL,        -- Tên người dùng
    last_name VARCHAR(50) NOT NULL,         -- Họ người dùng
    email VARCHAR(100) NOT NULL UNIQUE,     -- Email, không được trùng lặp
    password VARCHAR(255) NOT NULL          -- Mật khẩu đã mã hóa
);

-- Tạo bảng categories
CREATE TABLE categories (
  cate_id VARCHAR(10) NOT NULL PRIMARY KEY, -- Khóa chính
  cate_name VARCHAR(100) NOT NULL -- Tên của danh mục loại sản phẩm
);

-- Tạo bảng brands
CREATE TABLE brands (
  brand_id VARCHAR(10) NOT NULL PRIMARY KEY, -- Khóa chính
  brand_name VARCHAR(100) NOT NULL -- Tên của nhãn hàng cung cấp sản phẩm
);

-- Tạo bảng size
CREATE TABLE size (
  size_id VARCHAR(10) NOT NULL PRIMARY KEY,  -- Khóa chính
  size VARCHAR(10) NOT NULL                   -- Tên của mỗi loại size (ví dụ như S, M, L, XL)
);

-- Tạo bảng products
CREATE TABLE products (
  product_id VARCHAR(10) NOT NULL PRIMARY KEY,  -- Khóa chính
  product_name VARCHAR(100) NOT NULL,            -- Tên sản phẩm
  product_img VARCHAR(255),						-- Hình ảnh sản phẩm
  cost DECIMAL(10, 2) NOT NULL,                   -- Giá tiền của mỗi sản phẩm (hỗ trợ hai chữ số thập phân)
  description TEXT,                               -- Mô tả của mỗi sản phẩm
  quantity INT NOT NULL,                          -- Số lượng hàng tồn kho
  size_id VARCHAR(10),                            -- Khóa ngoại tham chiếu từ bảng size
  cate_id VARCHAR(10),                           -- Khóa ngoại tham chiếu từ bảng categories
  brand_id VARCHAR(10),                           -- Khóa ngoại tham chiếu từ bảng brands
  FOREIGN KEY (size_id) REFERENCES size(size_id), -- Ràng buộc khóa ngoại cho size_id
  FOREIGN KEY (cate_id) REFERENCES categories(cate_id), -- Ràng buộc khóa ngoại cho cate_id
  FOREIGN KEY (brand_id) REFERENCES brands(brand_id)  -- Ràng buộc khóa ngoại cho brand_id
);

-- Tạo bảng cart
CREATE TABLE cart (
  cart_id INT AUTO_INCREMENT PRIMARY KEY,     -- Mã số ID của giỏ hàng, tự động tăng
  acc_id INT NOT NULL,                        -- Khóa ngoại tham chiếu đến bảng account
  product_id VARCHAR(10) NOT NULL,            -- Khóa ngoại tham chiếu đến bảng products
  quantity INT NOT NULL,                      -- Số lượng sản phẩm trong giỏ hàng
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Thời gian tạo giỏ hàng
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Thời gian cập nhật
  FOREIGN KEY (acc_id) REFERENCES account(acc_id),    -- Khóa ngoại tham chiếu đến bảng account
  FOREIGN KEY (product_id) REFERENCES products(product_id) -- Khóa ngoại tham chiếu đến bảng products
);

-- Tạo bảng order
CREATE TABLE `order` (
  order_id VARCHAR(10) NOT NULL PRIMARY KEY,  -- Khóa chính
  address VARCHAR(255) NOT NULL,              -- Địa chỉ nhận hàng
  phone_number VARCHAR(15) NOT NULL,          -- Số điện thoại của người nhận hàng
  total DECIMAL(10, 2) NOT NULL,              -- Tổng giá tiền đơn hàng
  pay_status VARCHAR(50) NOT NULL,            -- Tình trạng thanh toán
  acc_id INT NOT NULL,                        -- Khóa ngoại tham chiếu từ bảng account
  FOREIGN KEY (acc_id) REFERENCES account(acc_id) -- Khóa ngoại tham chiếu đến bảng account
);

-- Tạo bảng order_items
CREATE TABLE order_items (
  order_id VARCHAR(10) NOT NULL,              -- Khóa ngoại từ bảng orders
  product_id VARCHAR(10) NOT NULL,            -- Khóa ngoại từ bảng products
  quantity_items INT NOT NULL,                -- Số lượng sản phẩm trong đơn hàng
  price DECIMAL(10, 2) NOT NULL,              -- Giá của mỗi sản phẩm tại thời điểm mua
  PRIMARY KEY (order_id, product_id),         -- Khóa chính kết hợp từ order_id và product_id
  FOREIGN KEY (order_id) REFERENCES `order`(order_id), -- Khóa ngoại tham chiếu đến bảng order
  FOREIGN KEY (product_id) REFERENCES products(product_id) -- Khóa ngoại tham chiếu đến bảng products
);

-- Tạo bảng follow_order
CREATE TABLE follow_order (
  follow_id INT AUTO_INCREMENT PRIMARY KEY,       -- Mã số ID theo dõi đơn hàng, tự động tăng
  order_status VARCHAR(50) NOT NULL,              -- Tình trạng giao hàng của đơn hàng
  order_id VARCHAR(10) NOT NULL,                  -- Khóa ngoại từ bảng order
  FOREIGN KEY (order_id) REFERENCES `order`(order_id) -- Khóa ngoại tham chiếu đến bảng order
);

-- Tạo bảng admin
CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,      -- Email, không được trùng lặp
    password VARCHAR(255) NOT NULL           -- Mật khẩu đã mã hóa
);

-- Thêm dữ liệu mẫu cho bảng admin
INSERT INTO admin (email, password) VALUES
('2254810194@vaa.edu.vn', 'baongoc'),
('2254810195@vaa.edu.vn', 'quynhanh');
