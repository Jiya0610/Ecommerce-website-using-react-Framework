<?php
require_once 'db.php';

$product = [
    'name' => 'Mi 14 CIVI (Shadow Black, 256 GB) (8 GB RAM)',
    'category' => 'Electronics',
    'price' => 42999.00,
    'original_price' => 47999.00,
    'image_url' => 'https://rukminim1.flixcart.com/image/1536/1536/xif0q/mobile/5/8/w/-original-imahfpwvcfvxvqfh.jpeg?q=90',
    'description' => 'The Mi 14 CIVI comes with a stunning display, powerful processor, and excellent cameras for a top-tier smartphone experience.',
    'brand' => 'Mi',
    'rating' => 4.5,
    'review_count' => rand(200, 1000)
];

$sub_images = [
    "https://rukminim1.flixcart.com/image/1536/1536/xif0q/mobile/v/h/1/-original-imah4wyqdnmyvd3d.jpeg?q=90",
    "https://rukminim1.flixcart.com/image/1536/1536/xif0q/mobile/4/2/4/-original-imah4wyq9b8p4gfe.jpeg?q=90",
    "https://rukminim1.flixcart.com/image/1536/1536/xif0q/mobile/k/x/v/-original-imah4wyqd8jyvhrq.jpeg?q=90"
];

$specifications = [
    "Display" => "6.55 inch AMOLED",
    "Processor" => "Snapdragon 8s Gen 3",
    "RAM" => "8 GB",
    "Storage" => "256 GB",
    "Battery" => "4700 mAh",
    "Rear Camera" => "50MP + 50MP + 12MP",
    "Front Camera" => "32MP + 32MP",
    "OS" => "Android 14"
];

try {
    $stmt = $pdo->prepare("INSERT INTO products (name, category, price, original_price, image_url, description, brand, rating, review_count, sub_images, specifications) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $checkStmt = $pdo->prepare("SELECT id FROM products WHERE name = ?");
    $checkStmt->execute([$product['name']]);
    
    if ($checkStmt->rowCount() == 0) {
        $stmt->execute([
            $product['name'],
            $product['category'],
            $product['price'],
            $product['original_price'],
            $product['image_url'],
            $product['description'],
            $product['brand'],
            $product['rating'],
            $product['review_count'],
            json_encode($sub_images),
            json_encode($specifications)
        ]);
        echo "Successfully inserted " . $product['name'] . " into the Electronics category.";
    } else {
        echo "Product already exists.";
    }
} catch (PDOException $e) {
    echo "Error inserting product: " . $e->getMessage();
}
?>
