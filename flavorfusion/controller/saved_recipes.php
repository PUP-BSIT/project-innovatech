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

if (!isset($data->user_id) || !isset($data->recipe_id)) {
    http_response_code(400);
    echo json_encode(array('success' => false, 'error' => 'Invalid input'));
    exit();
}

$user_id = $data->user_id;
$recipe_id = $data->recipe_id;

$stmt_check = $conn->prepare("SELECT COUNT(*) as count FROM
     saved_recipes WHERE user_id = ? AND recipe_id = ?");
$stmt_check->bind_param("ii", $user_id, $recipe_id);
$stmt_check->execute();
$stmt_check->bind_result($count);
$stmt_check->fetch();
$stmt_check->close();

if ($count > 0) {
    http_response_code(400);
    echo json_encode(
        array(
            'success' => false,
            'error' =>
                'Recipe already saved by this user',
            'saved' => true
        )
    );
    exit();
}

$stmt = $conn->prepare("INSERT INTO saved_recipes
     (user_id, recipe_id) VALUES (?, ?)");
$stmt->bind_param("ii", $user_id, $recipe_id);

if ($stmt->execute()) {
    echo json_encode(array('success' => true, 'saved' => false));
} else {
    http_response_code(500);
    echo json_encode(
        array(
            'success' => false,
            'error' =>
                'Database error',
            'saved' => false
        )
    );
}

$stmt->close();
$conn->close();
?>