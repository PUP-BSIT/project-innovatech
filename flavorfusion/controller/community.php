<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

include 'db_connection.php';

$user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : null;
$caption = isset($_POST['caption']) ? $_POST['caption'] : null;
$image = isset($_FILES['image']['tmp_name']) ? file_get_contents
($_FILES['image']['tmp_name']) : null;
$image_src = isset($_POST['image_src']) ? $_POST['image_src'] : null;
$recipe_id = isset($_POST['recipeId']) ? intval($_POST['recipeId']) : null;

if (is_null($user_id) || is_null($caption)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid data received'
    ]);
    exit();
}

if ($image_src && !$image) {
    if (strpos($image_src, 'base64,') !== false) {
        $image_src = substr($image_src, strpos($image_src, 'base64,') + 7);
    }
    $image = base64_decode($image_src);
}

if ($recipe_id && $recipe_id > 0) {
    $sql_check_recipe = "SELECT recipe_id FROM recipes WHERE recipe_id = ?";
    $stmt_check_recipe = $conn->prepare($sql_check_recipe);
    $stmt_check_recipe->bind_param('i', $recipe_id);
    $stmt_check_recipe->execute();
    $result_check_recipe = $stmt_check_recipe->get_result();

    if ($result_check_recipe->num_rows == 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid recipe ID'
        ]);
        exit();
    }
    $stmt_check_recipe->close();
}

try {
    $sql = "INSERT INTO community_recipes (user_id, recipe_id, caption, image)
         VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iiss", $user_id, $recipe_id, $caption, $image);

    if ($stmt->execute()) {
        $response = ['success' => true, 'message' => 'Post added successfully'];
    } else {
        $response = [
            'success' => false,
            'message' => 'Error adding post: ' . $stmt->error
        ];
    }

    $stmt->close();
    $conn->close();
} catch (mysqli_sql_exception $e) {
    $response = [
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ];
}

echo json_encode($response);
?>