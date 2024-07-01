<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

include_once 'db_connection.php';

$recipe_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($recipe_id <= 0) {
    http_response_code(400);
    echo json_encode(array("error" => "Invalid recipe ID"));
    exit();
}

$sql = "SELECT r.recipe_id, 
               r.name, 
               r.description, 
               r.time AS prep_time, 
               r.servings, 
               r.picture,
               u.username AS chef_name,
               GROUP_CONCAT(DISTINCT mt.meal_type) AS meal_types,
               GROUP_CONCAT(DISTINCT dp.dietary_pref) AS dietary_prefs
        FROM recipes r
        LEFT JOIN user_profiles u ON r.user_id = u.user_id 
        LEFT JOIN recipe_meal_types mt ON r.recipe_id = mt.recipe_id
        LEFT JOIN recipe_dietary_prefs dp ON r.recipe_id = dp.recipe_id
        WHERE r.recipe_id = ?
        GROUP BY r.recipe_id";

$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param('i', $recipe_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $recipe = $result->fetch_assoc();

        $recipe['picture'] = base64_encode($recipe['picture']);

        $sql_ingredients = "SELECT ingredient, quantity 
                            FROM recipe_ingredients 
                            WHERE recipe_id = ?";
        $stmt_ingredients = $conn->prepare($sql_ingredients);
        $stmt_ingredients->bind_param('i', $recipe_id);
        $stmt_ingredients->execute();
        $result_ingredients = $stmt_ingredients->get_result();
        $ingredients = array();
        while ($row = $result_ingredients->fetch_assoc()) {
            $ingredients[] = array(
                'ingredient' => $row['ingredient'],
                'quantity' => $row['quantity']
            );
        }

        $sql_procedures = "SELECT step_number, instruction 
                           FROM procedures 
                           WHERE recipe_id = ? 
                           ORDER BY step_number";
        $stmt_procedures = $conn->prepare($sql_procedures);
        $stmt_procedures->bind_param('i', $recipe_id);
        $stmt_procedures->execute();
        $result_procedures = $stmt_procedures->get_result();
        $procedures = array();
        while ($row = $result_procedures->fetch_assoc()) {
            $procedures[] = array(
                'step_number' => $row['step_number'],
                'instruction' => $row['instruction']
            );
        }

        $recipe['ingredients'] = $ingredients;
        $recipe['procedures'] = $procedures;

        echo json_encode($recipe);
    } else {
        http_response_code(404);
        echo json_encode(array("error" => "Recipe not found"));
    }

    $stmt->close();
} else {
    http_response_code(500);
    echo json_encode(array("error" => "Internal server error"));
}

$conn->close();
?>