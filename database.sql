-- Database: kiit_kaffe_db
CREATE DATABASE IF NOT EXISTS kiit_kaffe_db;
USE kiit_kaffe_db;

-- Reset Tables for Fresh Setup
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS stock;
DROP TABLE IF EXISTS foods;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Foods Table
CREATE TABLE foods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Stock Table
CREATE TABLE stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    food_id INT NOT NULL,
    quantity INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Cart Items Table
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    food_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Orders Table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('Pending', 'Preparing', 'Completed', 'Failed', 'Invalid') DEFAULT 'Pending',
    payment_method ENUM('Cash', 'UPI') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Order Items Table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    food_id INT,
    item_name VARCHAR(150) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Default Admin account will be handled by setup_db.php or manual SQL
-- Sample Food Data
INSERT INTO foods (name, description, price, category, image_url) VALUES
-- Original Items
('Coca Cola', '400ml Cold Bottle', 40.00, 'Beverages', 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&q=80'),
('Cold Coffee', 'Creamy Iced Coffee', 89.00, 'Coffee & Drinks', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&q=80'),
('Matcha Latte', 'Organic Green Tea', 99.00, 'Coffee & Drinks', 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300&q=80'),
('Signature Cold Brew', '12-hour Steeped', 89.00, 'Coffee & Drinks', 'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=300&q=80'),
('Amul Cool', '200ml Pista/Badam', 30.00, 'Beverages', 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=300&q=80'),
('Club Sandwich', 'Veg Grilled Sandwich', 120.00, 'Snacks', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&q=80'),
('Pizza', '7-inch Cheese Pizza', 199.00, 'Snacks', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80'),
-- Additional Beverages
('Pepsi', '400ml Cold Bottle', 40.00, 'Beverages', 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=300&q=80'),
('Sprite', '400ml Cold Bottle', 40.00, 'Beverages', 'https://images.unsplash.com/photo-1629203851122-3726ec73a02f?w=300&q=80'),
('Fanta', '400ml Cold Bottle', 40.00, 'Beverages', 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=300&q=80'),
('Mineral Water', '1L Bisleri', 20.00, 'Beverages', 'https://images.unsplash.com/photo-1560023907-5f339617ea30?w=300&q=80'),
('Fresh Lime Soda', 'Sweet & Tangy', 50.00, 'Beverages', 'https://images.unsplash.com/photo-1513558161099-b9096474a08b?w=300&q=80'),
('Mango Lassi', 'Traditional Yogurt Drink', 60.00, 'Beverages', 'https://images.unsplash.com/photo-1546173159-315724a31696?w=300&q=80'),
-- Additional Coffee & Drinks
('Espresso', 'Single Shot', 70.00, 'Coffee & Drinks', 'https://unsplash.com/photos/selective-focus-photography-of-latte-in-teacup-jn-HaGWe4yw?w=300&q=80'),
('Cappuccino', 'Espresso with Steamed Milk', 100.00, 'Coffee & Drinks', 'https://unsplash.com/photos/white-ceramic-cup-with-latte-cafe-art-on-desk-JpQGEArmG0I?w=300&q=80'),
('Americano', 'Black Coffee', 80.00, 'Coffee & Drinks', 'https://unsplash.com/photos/clear-glass-mug-with-brown-liquid-on-brown-wooden-table-MXXTl3Cj2Og?w=300&q=80'),
('Mocha', 'Chocolate Coffee Blend', 110.00, 'Coffee & Drinks', 'https://unsplash.com/photos/a-cappuccino-on-a-saucer-with-a-spoon-C_vE8ZIHJ3Y?w=300&q=80'),
('Caramel Macchiato', 'Vanilla & Caramel', 120.00, 'Coffee & Drinks', 'https://unsplash.com/photos/a-glass-with-a-drink-in-it-1EV6hDgDpFM?w=300&q=80'),
('Green Tea', 'Organic Herbal', 50.00, 'Coffee & Drinks', 'https://unsplash.com/photos/clear-glass-mug-with-green-leaves-9T5FvfnmH_k?w=300&q=80'),
('Hot Chocolate', 'Rich Cocoa Drink', 90.00, 'Coffee & Drinks', 'https://unsplash.com/photos/photo-of-mug-with-hot-choco-RtHw0PWCLhw?w=300&q=80'),
-- Additional Snacks
('French Fries', 'Crispy Salted Fries', 80.00, 'Snacks', 'https://images.unsplash.com/photo-1573080496987-a199f8cd4054?w=300&q=80'),
('Veg Burger', 'Classic Veg Patty', 100.00, 'Snacks', 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=300&q=80'),
('Cheese Burger', 'Double Cheese Patty', 130.00, 'Snacks', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80'),
('Veg Momos', 'Steamed Dumplings (8pcs)', 90.00, 'Snacks', 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=300&q=80'),
('Chicken Momos', 'Steamed Dumplings (8pcs)', 120.00, 'Snacks', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300&q=80'),
('Garlic Bread', 'Toasted with Butter', 70.00, 'Snacks', 'https://images.unsplash.com/photo-1573140247631-fa9115d713fb?w=300&q=80'),
('Nachos', 'Tortilla Chips with Salsa', 100.00, 'Snacks', 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&q=80'),
('Spring Rolls', 'Crispy Veg Rolls', 90.00, 'Snacks', 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=300&q=80'),
('Pasta', 'Italian White Sauce', 150.00, 'Snacks', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=300&q=80'),
('Chicken Pasta', 'Creamy Alfredo', 180.00, 'Snacks', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&q=80'),
-- Desserts
('Chocolate Brownie', 'Warm with Ice Cream', 120.00, 'Desserts', 'https://unsplash.com/photos/chocolate-cake-on-white-ceramic-plate-TIctev58ij8?w=300&q=80'),
('Gulab Jamun', 'Traditional Sweet (3pcs)', 60.00, 'Desserts', 'https://unsplash.com/photos/a-plate-of-food-2oJ4eGRPqrE?w=300&q=80'),
('Ice Cream Sundae', 'Chocolate/Strawberry', 100.00, 'Desserts', 'https://unsplash.com/photos/a-plate-of-food-7YhrOw6Kngo?w=300&q=80'),
('Choco Lava Cake', 'Molten Chocolate Cake', 110.00, 'Desserts', 'https://unsplash.com/photos/chocolate-cake-on-white-ceramic-plate-Pzjez86SsvQ?w=300&q=80'),
('Fruit Salad', 'Fresh Seasonal Fruits', 80.00, 'Desserts', 'https://unsplash.com/photos/a-plate-of-food-2cXZQ862gws?w=300&q=80'),
-- Meals
('Veg Thali', 'Complete Indian Meal', 180.00, 'Meals', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80'),
('Chicken Biryani', 'Hyderabadi Style', 200.00, 'Meals', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=80'),
('Veg Fried Rice', 'Indo-Chinese Style', 140.00, 'Meals', 'https://images.unsplash.com/photo-1603133832894-0267195e09b5?w=300&q=80'),
('Egg Fried Rice', 'With Scrambled Eggs', 150.00, 'Meals', 'https://images.unsplash.com/photo-1603133832894-0267195e09b5?w=300&q=80'),
('Chicken Fried Rice', 'Classic Chinese', 170.00, 'Meals', 'https://images.unsplash.com/photo-1603133832894-0267195e09b5?w=300&q=80'),
('Paneer Butter Masala', 'With Naan', 180.00, 'Meals', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&q=80'),
('Butter Chicken', 'With Naan', 200.00, 'Meals', 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300&q=80');

-- Initial Stock Levels
INSERT INTO stock (food_id, quantity) VALUES
(1, 20), (2, 15), (3, 10), (4, 12), (5, 30), (6, 5), (7, 18),
(8, 15), (9, 15), (10, 15), (11, 25), (12, 20), (13, 15),
(14, 20), (15, 15), (16, 15), (17, 15), (18, 15), (19, 20), (20, 15),
(21, 20), (22, 15), (23, 15), (24, 15), (25, 12), (26, 20), (27, 15), (28, 15), (29, 12), (30, 10),
(31, 15), (32, 20), (33, 15), (34, 12), (35, 15),
(36, 10), (37, 10), (38, 12), (39, 10), (40, 10), (41, 10), (42, 10);


