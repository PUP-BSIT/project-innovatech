<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db_connection.php';

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$page_size = isset($_GET['page_size']) ? intval($_GET['page_size']) : 3;

if ($user_id === 0) {
    echo json_encode(["error" => "Invalid user ID"]);
    exit;
}

$offset = ($page - 1) * $page_size;

$total_count_sql = "SELECT COUNT(*) as total FROM saved_recipes
     WHERE user_id = ?";
$total_stmt = $conn->prepare($total_count_sql);
$total_stmt->bind_param("i", $user_id);
$total_stmt->execute();
$total_result = $total_stmt->get_result();
$total_row = $total_result->fetch_assoc();
$total_recipes = $total_row['total'];

$sql = "SELECT r.recipe_id, r.name, r.picture 
        FROM saved_recipes sr
        JOIN recipes r ON sr.recipe_id = r.recipe_id
        WHERE sr.user_id = ?
        LIMIT ?, ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["error" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("iii", $user_id, $offset, $page_size);
if (!$stmt->execute()) {
    echo json_encode(["error" => "Execute failed: " . $stmt->error]);
    $stmt->close();
    $conn->close();
    exit;
}

$result = $stmt->get_result();
$saved_recipes = [];
while ($row = $result->fetch_assoc()) {
    $row['picture'] = base64_encode($row['picture']);
    $saved_recipes[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode([
    "recipes" => $saved_recipes,
    "total" => $total_recipes
]);
?>