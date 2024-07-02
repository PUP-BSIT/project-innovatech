<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, OPTIONS'); 
header('Access-Control-Allow-Headers: Content-Type, Authorization'); 

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

include 'db_connection.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user_id = $_GET['user_id'];
    $recipe_id = $_GET['recipe_id'];

    $sql = "SELECT rating 
            FROM ratings 
            WHERE user_id = ? 
            AND recipe_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $user_id, $recipe_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['hasRated' => true]);
    } else {
        echo json_encode(['hasRated' => false]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['hasRated' => false]);
}
?>
