<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

include 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);

$userId = $data['user_id'] ?? null;
$recipeId = $data['community_recipe_id'] ?? null;
$comment = $data['text'] ?? null;

if ($userId && $recipeId && $comment) {
    try {
        $stmt = $conn->prepare("INSERT INTO comments (user_id, 
        community_recipe_id, comment, commented_at) VALUES (?, ?, ?, NOW())");
        $stmt->bind_param("iis", $userId, $recipeId, $comment);

        if ($stmt->execute()) {
            $response = 
                ['success' => true, 'message' => 'Comment added successfully.'];
        } else {
            $response = 
                ['success' => false, 'message' => 'Failed to add comment.'];
        }
        $stmt->close();
    } catch (mysqli_sql_exception $e) {
        $response = ['success' => false, 'message' => 'Database error: ' 
            . $e->getMessage()];
    }
} else {
    $response = ['success' => false, 'message' => 'Invalid input.'];
}

$conn->close();
echo json_encode($response);
?>
