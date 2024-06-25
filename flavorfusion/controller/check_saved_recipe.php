<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once 'db_connection.php';

$user_id = $_GET['user_id'];
$recipe_id = $_GET['recipe_id'];

$stmt_check = $conn->prepare("SELECT COUNT(*) as count FROM 
    saved_recipes WHERE user_id = ? AND recipe_id = ?");
$stmt_check->bind_param("ii", $user_id, $recipe_id);
$stmt_check->execute();
$stmt_check->bind_result($count);
$stmt_check->fetch();
$stmt_check->close();

if ($count > 0) {
    echo json_encode(array('saved' => true));
} else {
    echo json_encode(array('saved' => false));
}

$conn->close();
?>