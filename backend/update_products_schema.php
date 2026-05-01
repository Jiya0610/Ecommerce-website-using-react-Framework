<?php
require_once 'db.php';
try {
    // Update products table
    $pdo->exec("ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS brand VARCHAR(100) DEFAULT NULL AFTER name,
        ADD COLUMN IF NOT EXISTS original_price DECIMAL(10, 2) DEFAULT NULL AFTER price,
        ADD COLUMN IF NOT EXISTS rating DECIMAL(2, 1) DEFAULT 0.0,
        ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0,
        ADD COLUMN IF NOT EXISTS sub_images TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS specifications TEXT DEFAULT NULL");

    // Create wishlist table
    $pdo->exec("CREATE TABLE IF NOT EXISTS wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY user_product (user_id, product_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )");

    echo "Product table and Wishlist table updated successfully.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
