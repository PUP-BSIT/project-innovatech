<?php
session_start();

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Credentials: true');

require_once 'db_connection.php';
  
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset(
        $data['recipe_id'], 
        $data['name'], 
        $data['description'], 
        $data['prep_time'], 
        $data['servings'], 
        $data['ingredients'], 
        $data['procedures'], 
        $data['meal_type'], 
        $data['dietary_preference']
    )
) {
    echo json_encode(['error' => 'Invalid data']);
    exit;
}

$recipe_id = $data['recipe_id'];
$name = $data['name'];
$description = $data['description'];
$prep_time = $data['prep_time'];
$servings = $data['servings'];
$ingredients = $data['ingredients'];
$procedures = $data['procedures'];
$meal_type = $data['meal_type'];
$dietary_preference = $data['dietary_preference'];
$picture = isset($data['picture']) ? base64_decode($data['picture']) : null;

$sql = "UPDATE recipes SET 
            name = ?, 
            description = ?, 
            time = ?, 
            servings = ?";
$params = [$name, $description, $prep_time, $servings];

if ($picture) {
    $sql .= ", picture = ?";
    $params[] = $picture;
}

$sql .= " WHERE recipe_id = ? AND user_id = ?";
$params[] = $recipe_id;
$params[] = $user_id;

$stmt = $conn->prepare($sql);
$stmt->bind_param(str_repeat('s', count($params)), ...$params);

if ($stmt->execute()) {
    $stmt->close();

    $conn->query("DELETE FROM recipe_meal_types WHERE recipe_id = $recipe_id");
    $meal_type_sql = "
        INSERT INTO recipe_meal_types 
        (recipe_id, meal_type) 
        VALUES (?, ?)
    ";
    $meal_type_stmt = $conn->prepare($meal_type_sql);
    $meal_type_stmt->bind_param('is', $recipe_id, $meal_type);
    $meal_type_stmt->execute();
    $meal_type_stmt->close();

    $conn->query(
        "DELETE FROM recipe_dietary_prefs WHERE recipe_id = $recipe_id"
    );
    $dietary_pref_sql = "
        INSERT INTO recipe_dietary_prefs 
        (recipe_id, dietary_pref) 
        VALUES (?, ?)
    ";
    $dietary_pref_stmt = $conn->prepare($dietary_pref_sql);
    $dietary_pref_stmt->bind_param('is', $recipe_id, $dietary_preference);
    $dietary_pref_stmt->execute();
    $dietary_pref_stmt->close();

    $conn->query("DELETE FROM recipe_ingredients WHERE recipe_id = $recipe_id");
    foreach ($ingredients as $ingredient) {
        $ingredient_sql = "
            INSERT INTO recipe_ingredients 
            (recipe_id, ingredient, quantity) 
            VALUES (?, ?, ?)
        ";
        $ingredient_stmt = $conn->prepare($ingredient_sql);
        $ingredient_stmt->bind_param(
            'iss', 
            $recipe_id, 
            $ingredient['ingredient'], 
            $ingredient['quantity']
        );
        $ingredient_stmt->execute();
        $ingredient_stmt->close();
    }

    $conn->query("DELETE FROM procedures WHERE recipe_id = $recipe_id");
    foreach ($procedures as $procedure) {
        $procedure_sql = "
            INSERT INTO procedures 
            (recipe_id, step_number, instruction) 
            VALUES (?, ?, ?)
        ";
        $procedure_stmt = $conn->prepare($procedure_sql);
        $procedure_stmt->bind_param(
            'iis', 
            $recipe_id, 
            $procedure['step_number'], 
            $procedure['instruction']
        );
        $procedure_stmt->execute();
        $procedure_stmt->close();
    }

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Failed to update recipe']);
}

$conn->close();
?>