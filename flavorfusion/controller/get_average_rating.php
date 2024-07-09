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
    $recipe_id = $_GET['recipe_id'];

    $sql = "SELECT AVG(rating) as averageRating 
            FROM ratings 
            WHERE recipe_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $recipe_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    $averageRating = $row['averageRating'] ? (float)$row['averageRating'] : 0;

    echo json_encode(['averageRating' => $averageRating]);

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['averageRating' => 0]);
}
?>
