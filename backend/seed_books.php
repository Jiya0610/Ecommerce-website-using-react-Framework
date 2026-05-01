<?php
require_once 'db.php';

$products = [
    [
        'name' => 'The Alchemist – Paulo Coelho',
        'category' => 'Books',
        'price' => 125.00,
        'image_url' => 'https://images.meesho.com/images/products/149573111/xn1wd_512.avif?width=512',
        'description' => 'The Alchemist follows the journey of an Andalusian shepherd boy named Santiago. Believing a recurring dream to be prophetic, he asks a Romani fortune teller in a nearby town about its meaning. She interprets the dream as a prophecy telling the boy that he will discover a treasure at the Egyptian pyramids.',
        'brand' => 'Paulo Coelho',
        'rating' => 4.1,
        'review_count' => rand(100, 500)
    ],
    [
        'name' => 'It Ends With Us – Colleen Hoover',
        'category' => 'Books',
        'price' => 140.00,
        'image_url' => 'https://rukminim1.flixcart.com/image/1536/1536/xif0q/book/f/y/0/it-ends-with-us-original-imahjug7mbjatafn.jpeg?q=90',
        'description' => 'It Ends with Us is a romance novel by Colleen Hoover. It tells the story of Lily Bloom and her doomed romance with Ryle Kincaid, which traces its history back to her parents abusive relationship.',
        'brand' => 'Colleen Hoover',
        'rating' => 4.4,
        'review_count' => rand(100, 500)
    ],
    [
        'name' => 'The Kite Runner – Khaled Hosseini',
        'category' => 'Books',
        'price' => 360.00,
        'image_url' => 'https://m.media-amazon.com/images/I/81YXfTztoZL._SL1500_.jpg',
        'description' => 'The Kite Runner tells the story of Amir, a young boy from the Wazir Akbar Khan district of Kabul. The story is set against a backdrop of tumultuous events, from the fall of Afghanistans monarchy through the Soviet invasion, the exodus of refugees to Pakistan and the United States, and the rise of the Taliban regime.',
        'brand' => 'Khaled Hosseini',
        'rating' => 4.8,
        'review_count' => rand(100, 500)
    ]
];

try {
    $stmt = $pdo->prepare("INSERT INTO products (name, category, price, image_url, description, brand, rating, review_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    
    $insertedCount = 0;
    foreach ($products as $p) {
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
    
    echo "Successfully inserted $insertedCount new products into the Books category.";
} catch (PDOException $e) {
    echo "Error inserting products: " . $e->getMessage();
}
?>
