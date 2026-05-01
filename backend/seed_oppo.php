<?php
require_once 'db.php';

$product = [
    'name' => 'OPPO A5x (Laser White, 64 GB) (4 GB RAM)',
    'category' => 'Electronics',
    'price' => 12928.00,
    'original_price' => 14990.00,
    'image_url' => 'https://rukminim1.flixcart.com/image/1536/1536/xif0q/mobile/q/i/n/-original-imahfbysukcgmn6h.jpeg?q=90',
    'description' => 'The OPPO A5x offers an elegant Laser White finish with dependable performance, featuring 4GB RAM and 64GB storage for your daily needs.',
    'brand' => 'OPPO',
    'rating' => 4.0,
    'review_count' => rand(100, 800)
];

$sub_images = [
    "https://rukminim1.flixcart.com/image/1536/1536/xif0q/mobile/k/q/c/-original-imahchfjsbm9gpvg.jpeg?q=90",
    "https://rukminim1.flixcart.com/image/1536/1536/xif0q/mobile/o/v/k/-original-imahchfj5ptvmghn.jpeg?q=90",
    "https://rukminim1.flixcart.com/image/1536/1536/xif0q/mobile/g/c/z/-original-imahchfjqfaswuaz.jpeg?q=90",
    "https://rukminim1.flixcart.com/image/1536/1536/xif0q/mobile/l/h/w/-original-imahchfjbzewfht6.jpeg?q=90"
];

$specifications = [
    "Display" => "6.2 inch HD+",
    "Processor" => "Octa Core",
    "RAM" => "4 GB",
    "Storage" => "64 GB",
    "Battery" => "4230 mAh",
    "Rear Camera" => "13MP + 2MP",
    "Front Camera" => "8MP",
    "OS" => "Android"
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
