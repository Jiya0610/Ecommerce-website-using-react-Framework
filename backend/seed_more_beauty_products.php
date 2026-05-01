<?php
require_once 'db.php';

$products = [
    [
        'name' => 'Suroskie Triple C Glow Capsule Cream',
        'category' => 'Beauty & Health',
        'price' => 852.00,
        'image_url' => 'https://rukminim1.flixcart.com/image/1536/1536/xif0q/skin-treatment/c/n/a/80-triple-c-glow-capsule-cream-5-vitamin-c-3-type-blend-0-3-original-imahmgprmghhhuhb.jpeg?q=90',
        'description' => 'Triple C Glow Capsule Cream for bright, glowing skin.',
        'brand' => 'Suroskie',
        'rating' => 4.6,
        'review_count' => rand(50, 300)
    ],
    [
        'name' => 'QERINKLE T3 Baby Collagen Glow Mask',
        'category' => 'Beauty & Health',
        'price' => 281.00,
        'image_url' => 'https://rukminim1.flixcart.com/image/1536/1536/xif0q/face-pack/o/r/t/70-t3-baby-collagen-glow-mask-korean-night-mask-for-radiant-original-imahekvptg9vmjzd.jpeg?q=90',
        'description' => 'T3 Baby Collagen Glow Mask. Korean night mask for radiant skin.',
        'brand' => 'QERINKLE',
        'rating' => 4.0,
        'review_count' => rand(50, 300)
    ],
    [
        'name' => 'mama earth urban face wash',
        'category' => 'Beauty & Health',
        'price' => 121.00,
        'image_url' => 'https://rukminim1.flixcart.com/image/1536/1536/xif0q/face-wash/w/9/u/ubtan-natural-for-dry-skin-with-turmeric-saffron-for-tan-removal-original-imags7fej2gem8va.jpeg?q=90',
        'description' => 'Ubtan natural face wash for dry skin with turmeric & saffron for tan removal.',
        'brand' => 'mama earth',
        'rating' => 4.1,
        'review_count' => rand(50, 300)
    ]
];

try {
    $stmt = $pdo->prepare("INSERT INTO products (name, category, price, image_url, description, brand, rating, review_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    
    $insertedCount = 0;
    foreach ($products as $p) {
        // Simple check to avoid duplicates if script is run multiple times
        $checkStmt = $pdo->prepare("SELECT id FROM products WHERE name = ?");
        $checkStmt->execute([$p['name']]);
        if ($checkStmt->rowCount() == 0) {
            $stmt->execute([
                $p['name'],
                $p['category'],
                $p['price'],
                $p['image_url'],
                $p['description'],
                $p['brand'],
                $p['rating'],
                $p['review_count']
            ]);
            $insertedCount++;
        }
    }
    
    echo "Successfully inserted $insertedCount new products into the Beauty & Health category.";
} catch (PDOException $e) {
    echo "Error inserting products: " . $e->getMessage();
}
?>
