<?php
require_once 'db.php';

$products = [
    ['Staze Triple Treat Stacked 3-in-1 Face Palette', 'Staze', 'A 3-in-1 face palette with blush, highlighter, and contour.', 399.00, 499.00, 'Beauty & Health', 'backend/uploads/products/staze_palette.png', 100, 4.2, 45],
    ['Nourish Mantra Vitamin C Serum', 'Nourish Mantra', 'Vitamin C serum for glowing and bright skin.', 327.00, 450.00, 'Beauty & Health', 'backend/uploads/products/vitamin_c_serum.png', 150, 4.4, 62],
    ['RENEE Lumi Glow Highlighting Moisturizer', 'RENEE', 'Moisturizer with highlighting effect for a radiant look.', 407.00, 550.00, 'Beauty & Health', 'backend/uploads/products/renee_moisturizer.png', 80, 4.0, 38],
    ['Urban Yog MakeMeeBold Hot Air Brush', 'Urban Yog', 'Versatile hot air brush for styling and drying hair.', 1899.00, 2499.00, 'Beauty & Health', 'backend/uploads/products/hot_air_brush.png', 40, 4.0, 25],
    ['Makeup Organizer (Clear)', 'Generic', 'Transparent makeup organizer for better accessibility.', 334.00, 499.00, 'Beauty & Health', 'backend/uploads/products/organizer_1.png', 120, 4.0, 15],
    ['Makeup Organizer (Multi-section)', 'Generic', 'Sectioned makeup organizer for all your beauty products.', 334.00, 499.00, 'Beauty & Health', 'backend/uploads/products/organizer_2.png', 90, 4.0, 18],
];

try {
    // Clear existing beauty products to avoid duplicates
    $pdo->exec("DELETE FROM products WHERE category = 'Beauty & Health'");
    
    $stmt = $pdo->prepare("INSERT INTO products (name, brand, description, price, original_price, category, image_url, stock, rating, review_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    foreach ($products as $p) {
        $stmt->execute($p);
    }
    echo count($products) . " beauty products updated successfully.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
