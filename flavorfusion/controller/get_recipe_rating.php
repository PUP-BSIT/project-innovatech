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

    $check_sql = "SELECT rating 
                FROM ratings 
                WHERE recipe_id = ? 
                AND user_id = ?";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param("ii", $recipe_id, $user_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();

    if ($check_result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 
                        'You have already rated this recipe']);
    } else {
        $sql = "INSERT INTO ratings (recipe_id, user_id, rating) 
                VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iii", $recipe_id, $user_id, $rating);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 
                            'Rating submitted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 
                            'Failed to submit rating']);
        }

        $stmt->close();
    }

    $check_stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 
                    'Invalid request method']);
}