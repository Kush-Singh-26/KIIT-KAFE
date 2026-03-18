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
('Pepsi', '400ml Cold Bottle', 40.00, 'Beverages', 'https://unsplash.com/photos/blue-and-red-pepsi-can-eEumkKjg7Jo?w=300&q=80'),
('Sprite', '400ml Cold Bottle', 40.00, 'Beverages', 'https://unsplash.com/photos/a-can-of-sprite-on-a-wooden-stand-with-limes-RH2ZA73kHiA?w=300&q=80'),
('Fanta', '400ml Cold Bottle', 40.00, 'Beverages', 'https://unsplash.com/photos/fanta-orange-can-on-brown-wooden-table-aKYu-H5pHJY?w=300&q=80'),
('Mineral Water', '1L Kinley', 20.00, 'Beverages', 'https://unsplash.com/photos/a-close-up-of-a-bottle-of-water-0_he2akLhyA?w=300&q=80'),
('Fresh Lime Soda', 'Sweet & Tangy', 50.00, 'Beverages', 'https://unsplash.com/photos/glass-of-cucumber-soda-drink-on-wooden-table-summer-healthy-detox-infused-water-lemonade-or-cocktail-background-low-alcohol-nonalcoholic-drinks-super-food-vegetarian-or-healthy-diet-concept-8sttKwOr6wE?w=300&q=80'),
('Mango Lassi', 'Traditional Yogurt Drink', 60.00, 'Beverages', 'https://unsplash.com/photos/mango-and-lemon-juice-lw8GflbJwLc?w=300&q=80'),
-- Additional Coffee & Drinks
('Espresso', 'Single Shot', 70.00, 'Coffee & Drinks', 'https://images.unsplash.com/photo-1510591509098-f4fdc816d704?w=300&q=80'),
('Cappuccino', 'Espresso with Steamed Milk', 100.00, 'Coffee & Drinks', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&q=80'),
('Americano', 'Black Coffee', 80.00, 'Coffee & Drinks', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&q=80'),
('Mocha', 'Chocolate Coffee Blend', 110.00, 'Coffee & Drinks', 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=300&q=80'),
('Caramel Macchiato', 'Vanilla & Caramel', 120.00, 'Coffee & Drinks', 'https://images.unsplash.com/photo-1485808191679-5f8c7c8f37e9?w=300&q=80'),
('Green Tea', 'Organic Herbal', 50.00, 'Coffee & Drinks', 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=300&q=80'),
('Hot Chocolate', 'Rich Cocoa Drink', 90.00, 'Coffee & Drinks', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&q=80'),
-- Additional Snacks
('French Fries', 'Crispy Salted Fries', 80.00, 'Snacks', 'https://unsplash.com/photos/potato-fries-and-sliced-potato-on-white-ceramic-plate-H2RzlOijhlQ?w=300&q=80'),
('Veg Burger', 'Classic Veg Patty', 100.00, 'Snacks', 'https://unsplash.com/photos/selective-focus-photography-of-burger-on-top-of-table-rbcvIrxw6KA?w=300&q=80'),
('Cheese Burger', 'Double Cheese Patty', 130.00, 'Snacks', 'https://unsplash.com/photos/a-stack-of-hamburgers-sitting-next-to-a-pile-of-fries-Tu2I04j4Alw?w=300&q=80'),
('Veg Momos', 'Steamed Dumplings (8pcs)', 90.00, 'Snacks', 'https://unsplash.com/photos/a-white-plate-topped-with-dumplings-covered-in-sauce-ew_iyRmIpxw?w=300&q=80'),
('Chicken Momos', 'Steamed Dumplings (8pcs)', 120.00, 'Snacks', 'https://unsplash.com/photos/a-white-plate-topped-with-dumplings-next-to-a-cup-of-sauce-90SXZzJpySc?w=300&q=80'),
('Garlic Bread', 'Toasted with Butter', 70.00, 'Snacks', 'https://unsplash.com/photos/ginger-bread-on-brown-baskets-BRMvT4sw-4c?w=300&q=80'),
('Nachos', 'Tortilla Chips with Salsa', 100.00, 'Snacks', 'https://unsplash.com/photos/nachos-on-oval-tray-WjBp05j8LXI?w=300&q=80'),
('Spring Rolls', 'Crispy Veg Rolls', 90.00, 'Snacks', 'https://unsplash.com/photos/a-plate-of-food-on-a-table-next-to-a-glass-of-orange-juice-VeK39ynd3Ac?w=300&q=80'),
('Pasta', 'Italian White Sauce', 150.00, 'Snacks', 'https://unsplash.com/photos/potato-fries-on-white-ceramic-plate-flFd8L7_B3g?w=300&q=80'),
('Chicken Pasta', 'Creamy Alfredo', 180.00, 'Snacks', 'https://unsplash.com/photos/a-white-plate-topped-with-pasta-and-sauce-Irmhzq1icko?w=300&q=80'),
-- Desserts
('Chocolate Brownie', 'Warm with Ice Cream', 120.00, 'Desserts', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476d?w=300&q=80'),
('Gulab Jamun', 'Traditional Sweet (3pcs)', 60.00, 'Desserts', 'https://images.unsplash.com/photo-1593251445173-168940875873?w=300&q=80'),
('Ice Cream Sundae', 'Chocolate/Strawberry', 100.00, 'Desserts', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&q=80'),
('Choco Lava Cake', 'Molten Chocolate Cake', 110.00, 'Desserts', 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=300&q=80'),
('Fruit Salad', 'Fresh Seasonal Fruits', 80.00, 'Desserts', 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=300&q=80'),
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


