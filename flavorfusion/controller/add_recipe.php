<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include (__DIR__ . '/db_connection.php');

// Retrieve form data
$title = isset($_POST['title']) ? $_POST['title'] : '';
$description = isset($_POST['description']) ? $_POST['description'] : '';
$mealType = isset($_POST['mealType']) ? $_POST['mealType'] : '';
$dietaryPreferences = isset($_POST['dietaryPreferences'])
    ? $_POST['dietaryPreferences'] : '';
$hours = isset($_POST['hours']) ? $_POST['hours'] : '';
$minutes = isset($_POST['minutes']) ? $_POST['minutes'] : '';
$servings = isset($_POST['servings']) ? $_POST['servings'] : '';
$ingredients = isset($_POST['ingredients']) ?
    json_decode($_POST['ingredients'], true) : [];
$instructions = isset($_POST['instructions']) ?
    json_decode($_POST['instructions'], true) : [];

$missingFields = [];

if (empty($title))
    $missingFields[] = 'title';
if (empty($mealType))
    $missingFields[] = 'mealType';
if (empty($dietaryPreferences))
    $missingFields[] = 'dietaryPreferences';
if (empty($hours))
    $missingFields[] = 'hours';
if (empty($minutes))
    $missingFields[] = 'minutes';
if (empty($servings))
    $missingFields[] = 'servings';
if (empty($ingredients))
    $missingFields[] = 'ingredients';
if (empty($instructions))
    $missingFields[] = 'instructions';


if (empty($missingFields)) {

    $conn->begin_transaction();
    try {

        $userId = 1;
        $time = $hours . ":" . $minutes;
        $stmt = $conn->prepare("INSERT INTO recipes
             (user_id, name, description, time, servings)
              VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param
        ("isssi", $userId, $title, $description, $time, $servings);
        $stmt->execute();
        $recipe_id = $stmt->insert_id;

        $stmt = $conn->prepare("INSERT INTO recipe_meal_types 
            (recipe_id, meal_type) VALUES (?, ?)");
        $stmt->bind_param("is", $recipe_id, $mealType);
        $stmt->execute();

        $stmt = $conn->prepare("INSERT INTO recipe_dietary_prefs
             (recipe_id, dietary_pref) VALUES (?, ?)");
        $stmt->bind_param("is", $recipe_id, $dietaryPreferences);
        $stmt->execute();

        foreach ($ingredients as $ingredient) {
            $ingredient_name = isset($ingredient['name'])
                ? $ingredient['name'] : '';
            $quantity = isset($ingredient['quantity'])
                ? $ingredient['quantity'] : '';
            if (!empty($ingredient_name)) {
                $stmt = $conn->prepare("INSERT INTO recipe_ingredients
                 (recipe_id, ingredient, quantity) VALUES (?, ?, ?)");
                $stmt->bind_param(
                    "iss",
                    $recipe_id,
                    $ingredient_name,
                    $quantity
                );
                $stmt->execute();
            }
        }

        foreach ($instructions as $index => $instruction) {
            $step_number = $index + 1;
            $instruction_text = isset($instruction['step'])
                ? $instruction['step'] : '';
            if (!empty($instruction_text)) {
                $stmt = $conn->prepare("INSERT INTO procedures 
                    (recipe_id, step_number, instruction) VALUES (?, ?, ?)");
                $stmt->bind_param
                ("iis", $recipe_id, $step_number, $instruction_text);
                $stmt->execute();
            }
        }

        $conn->commit();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
} else {
    $message = "Missing required data for fields: " .
        implode(', ', $missingFields);
    echo json_encode(["success" => false, "message" => $message]);
}

// Close database connection
$conn->close();
?>