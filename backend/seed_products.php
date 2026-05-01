<?php
require_once 'db.php';

$products = [
    ['Apple iPhone 15 Pro', 'Apple', 'Latest iPhone with Titanium design.', 999.00, 1099.00, 'Electronics', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800', 50, 4.8, 120],
    ['Samsung Galaxy S24 Ultra', 'Samsung', 'Powerful Android with AI features.', 1199.00, 1299.00, 'Electronics', 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?q=80&w=800', 30, 4.7, 85],
    ['Sony WH-1000XM5', 'Sony', 'Industry-leading noise canceling headphones.', 349.00, 399.00, 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800', 100, 4.9, 210],
    ['MacBook Air M3', 'Apple', 'Thin, light, and powerful laptop.', 1299.00, 1399.00, 'Electronics', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800', 20, 4.9, 45],
    ['Nike Air Max', 'Nike', 'Comfortable and stylish running shoes.', 120.00, 150.00, 'Fashion', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800', 200, 4.5, 320],
    ['Levi\'s 501 Jeans', 'Levi\'s', 'Classic straight leg denim.', 60.00, 80.00, 'Fashion', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800', 150, 4.4, 180],
    ['The Great Gatsby', 'F. Scott Fitzgerald', 'A classic novel of the Jazz Age.', 15.00, 20.00, 'Books', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800', 300, 4.8, 500],
    ['Kindle Paperwhite', 'Amazon', 'The best e-reader for book lovers.', 139.00, 159.00, 'Electronics', 'https://images.unsplash.com/photo-1594980596225-b3ef23976997?q=80&w=800', 80, 4.7, 150],
];

try {
    $pdo->exec("DELETE FROM products"); // Clear existing
    $stmt = $pdo->prepare("INSERT INTO products (name, brand, description, price, original_price, category, image_url, stock, rating, review_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    foreach ($products as $p) {
        $stmt->execute($p);
    }
    echo "8 demo products added successfully.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
