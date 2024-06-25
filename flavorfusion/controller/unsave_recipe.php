<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once 'db_connection.php';

$data = json_decode(file_get_contents("php://input"));

$user_id = $data->user_id;
$recipe_id = $data->recipe_id;

$stmt = $conn->prepare("DELETE FROM saved_recipes WHERE user_id = ? 
    AND recipe_id = ?");
$stmt->bind_param("ii", $user_id, $recipe_id);

if ($stmt->execute()) {
    echo json_encode(array('success' => true));
} else {
    http_response_code(500);
    echo json_encode(array('success' => false, 'error' => 'Database error'));
}

$stmt->close();
$conn->close();

?>