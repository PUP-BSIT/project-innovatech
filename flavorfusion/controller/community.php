<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

include 'db_connection.php';

$user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : null;
$recipe_id = isset($_POST['recipe_id']) ? intval($_POST['recipe_id']) : null;
$caption = isset($_POST['caption']) ? $_POST['caption'] : null;
$image = isset($_FILES['image']['tmp_name']) ?
    file_get_contents($_FILES['image']['tmp_name']) : null;

if (is_null($user_id) || is_null($recipe_id) || is_null($caption)) {
    echo json_encode([
        'success' => false,
        'message' =>
            'Invalid data received'
    ]);
    exit;
}

error_log("Received data: user_id=$user_id, recipe_id=$recipe_id, 
    caption=$caption, image length=" . ($image ? strlen($image) : 'null'));

try {
    $sql = "INSERT INTO community_recipes (user_id, recipe_id, caption, image)
         VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $image_param = $image ? $image : null;
    $stmt->bind_param("iiss", $user_id, $recipe_id, $caption, $image_param);

    if ($stmt->execute()) {
        $response = ['success' => true, 'message' => 'Post added successfully'];
    } else {
        $response = [
            'success' => false,
            'message' => 'Error adding post: '
                . $stmt->error
        ];
    }

    $stmt->close();
    $conn->close();
} catch (mysqli_sql_exception $e) {
    $response = [
        'success' => false,
        'message' => 'Database error: '
            . $e->getMessage()
    ];
}

echo json_encode($response);
?>