<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

include 'db_connection.php';

$data = json_decode(file_get_contents("php://input"));

$response = [];

if (isset($data->user_id) && isset($data->community_recipe_id) && 
        isset($data->action)) {
    $userId = $data->user_id;
    $postId = $data->community_recipe_id;
    $action = $data->action;

    if ($action === 'like') {
        // Check if the user already liked the post
        $checkSql = "SELECT * FROM reactions WHERE user_id = ? 
          AND community_recipe_id = ?";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bind_param("ii", $userId, $postId);
        $checkStmt->execute();
        $result = $checkStmt->get_result();

        if ($result->num_rows > 0) {
            // User already liked the post
            $response['success'] = true;
            $response['message'] = 'Post already liked by the user';
        } else {
            // Add a like
            $sql = "INSERT INTO reactions (user_id, community_recipe_id) 
              VALUES (?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ii", $userId, $postId);
            if ($stmt->execute()) {
                $response['success'] = true;
            } else {
                $response['success'] = false;
                $response['message'] = 'Error liking post: ' . $stmt->error;
            }
            $stmt->close();
        }
    } else if ($action === 'unlike') {
        // Remove a like
        $sql = "DELETE FROM reactions WHERE user_id = ? 
          AND community_recipe_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $userId, $postId);
        if ($stmt->execute()) {
            $response['success'] = true;
        } else {
            $response['success'] = false;
            $response['message'] = 'Error unliking post: ' . $stmt->error;
        }
        $stmt->close();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Invalid input data';
}

$conn->close();

echo json_encode($response);
?>
