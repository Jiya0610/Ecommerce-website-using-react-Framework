<?php
require_once 'db.php';

$sub_images = [
    "https://m.media-amazon.com/images/I/71c6jgFUPrL._SL1200_.jpg",
    "https://m.media-amazon.com/images/I/61HNVGNCdbL._SL1200_.jpg",
    "https://m.media-amazon.com/images/I/61dbzv8hNoL._SL1200_.jpg",
    "https://m.media-amazon.com/images/I/713cpbP-PUL._SL1200_.jpg",
    "https://m.media-amazon.com/images/I/71S5urPYLjL._SL1200_.jpg"
];

$specifications = [
    "Product Dimensions" => "4.9 x 2.55 x 5.2 cm; 7.5 g",
    "Date First Available" => "13 May 2025",
    "Manufacturer" => "Kain Cosmeceuticals Private Limited",
    "ASIN" => "B0F8J9RZ3Y",
    "Item model number" => "8904417319606",
    "Country of Origin" => "India",
    "Item Weight" => "7.5 g",
    "Net Quantity" => "7.5 Grams",
    "Generic Name" => "Staze 9to9 Triple Treat Stacked Face Palette 01 Main Character | Blush, Concealer & Highlighter | 3-in-1 Makeup Kit for All Skin Types, Travel-Friendly"
];

$description = "Staze Triple Treat Stacked 3-in-1 Face Palette | Concealer, Blush & Highlighter | Cream Based Formula | Full Face Makeup Kit | Travel friendly | 01 Main Character";

try {
    $stmt = $pdo->prepare("UPDATE products SET 
        sub_images = ?, 
        specifications = ?, 
        description = ?,
        rating = 4.5,
        review_count = 124
        WHERE name = 'Staze Triple Treat Stacked 3-in-1 Face Palette'");
    
    $stmt->execute([
        json_encode($sub_images),
        json_encode($specifications),
        $description
    ]);

    if ($stmt->rowCount() > 0) {
        echo "Detailed product data for Staze Palette updated successfully.";
    } else {
        echo "Product not found or data already updated.";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
