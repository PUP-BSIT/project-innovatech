<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); 
header('Access-Control-Allow-Headers: Content-Type, Authorization'); 

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

include 'db_connection.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $recipe_id = $data['recipe_id'];
    $user_id = $data['user_id'];
    $rating = $data['rating'];

    if (!isset($recipe_id, $user_id, $rating) || $rating < 1 || $rating > 5) {
        echo json_encode(['success' => false, 'message' => 'Invalid data']);
        exit;
    }

    $sql = "INSERT INTO ratings (recipe_id, user_id, rating) 
            VALUES (?, ?, ?) 
            ON DUPLICATE 
            KEY UPDATE rating = VALUES(rating)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iii", $recipe_id, $user_id, $rating);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true, 'message' => 
            'Rating submitted successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false, 'message' => 
            'Failed to submit rating'
        ]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode([
        'success' => false, 'message' => 
        'Invalid request method'
    ]);
}
?>
