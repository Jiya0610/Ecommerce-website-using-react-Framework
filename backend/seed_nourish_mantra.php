<?php
require_once 'db.php';

$name = "Nourish Mantra Vitamin C Serum";
$heading = "Nourish Mantra Vitamin C Serum – facial serum with Vitamin C, Hyaluronic Acid, Niacinamide – Glowing Serum – Even Skin Tone, Fades the Appearance of Dark Spots, Fine Lines & Wrinkles, 30 ml";

$specifications = [
    "Product Dimensions" => "6 x 5 x 10 cm; 30 g",
    "Date First Available" => "9 December 2021",
    "ASIN" => "B09NC1LQGF",
    "Item model number" => "SE-03",
    "Item Weight" => "30 g",
    "Item Dimensions LxWxH" => "6 x 5 x 10 Centimeters",
    "Net Quantity" => "30.0 Milliliters",
    "Generic Name" => "serum",
    "Best Sellers Rank" => "#33,223 in Beauty"
];

$sub_images = [
    "https://m.media-amazon.com/images/I/718XFF2lOML._SL1500_.jpg",
    "https://m.media-amazon.com/images/I/71L2FnYGLIL._SL1500_.jpg",
    "https://m.media-amazon.com/images/I/71P8dgFRvjL._SL1500_.jpg",
    "https://m.media-amazon.com/images/I/71o-oSlYUbL._SL1500_.jpg",
    "https://m.media-amazon.com/images/I/71n9Ama4ZNL._SL1500_.jpg",
    "https://m.media-amazon.com/images/I/71n9Ama4ZNL._SL1500_.jpg",
    "https://m.media-amazon.com/images/I/81kglrtTl7L._SL1500_.jpg"
];

try {
    $stmt = $pdo->prepare("UPDATE products SET 
        name = ?, 
        specifications = ?, 
        sub_images = ?, 
        brand = 'Nourish Mantra',
        rating = 4.0,
        review_count = 62
        WHERE name LIKE '%Nourish Mantra%'");
    
    $success = $stmt->execute([
        $heading, 
        json_encode($specifications), 
        json_encode($sub_images)
    ]);

    if ($success && $stmt->rowCount() > 0) {
        echo "Product updated successfully!";
    } else {
        echo "Product not found or no changes made.";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
