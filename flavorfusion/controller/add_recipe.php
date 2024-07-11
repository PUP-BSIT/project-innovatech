<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include (__DIR__ . '/db_connection.php');

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'php-error.log');

function validate_json($json_string)
{
    $data = json_decode($json_string, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("JSON decode error: " . json_last_error_msg());
        return null;
    }
    return $data;
}

function send_json_response($success, $message, $data = null)
{
    echo json_encode(["success" => $success, "message" => $message, "data" => $data]);
    exit;
}

$title = isset($_POST['title']) ? $_POST['title'] : '';
$description = isset($_POST['description']) ? $_POST['description'] : '';
$mealTypes = isset($_POST['mealTypes']) ? validate_json($_POST['mealTypes']) : [];
$dietaryPreferences = isset($_POST['dietaryPreferences']) ? $_POST['dietaryPreferences'] : '';
$minutes = isset($_POST['minutes']) ? $_POST['minutes'] : '';
$servings = isset($_POST['servings']) ? $_POST['servings'] : '';
$ingredients = isset($_POST['ingredients']) ? validate_json($_POST['ingredients']) : [];
$instructions = isset($_POST['instructions']) ? validate_json($_POST['instructions']) : [];
$userId = isset($_POST['user_id']) ? intval($_POST['user_id']) : 0;
$image = isset($_FILES['image']['tmp_name']) ? file_get_contents($_FILES['image']['tmp_name']) : null;

$missingFields = [];

if (empty($title))
    $missingFields[] = 'title';
if (empty($mealTypes))
    $missingFields[] = 'mealTypes';
if (empty($dietaryPreferences))
    $missingFields[] = 'dietaryPreferences';
if (empty($minutes))
    $missingFields[] = 'minutes';
if (empty($servings))
    $missingFields[] = 'servings';
if (empty($ingredients))
    $missingFields[] = 'ingredients';
if (empty($instructions))
    $missingFields[] = 'instructions';
if ($userId === 0)
    $missingFields[] = 'user_id';
if (is_null($image))
    $missingFields[] = 'image';

if (!empty($missingFields)) {
    $message = "Missing required data for fields: " . implode(', ', $missingFields);
    error_log("Error: $message");
    send_json_response(false, $message);
}

if (!is_array($mealTypes) || !is_array($ingredients) || !is_array($instructions)) {
    $message = "Invalid JSON data: mealTypes, ingredients, or instructions are not arrays.";
    error_log("Error: $message");
    send_json_response(false, $message);
}

$stmt = $conn->prepare("SELECT 1 FROM users WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    $message = "User ID does not exist";
    error_log("Error: $message");
    send_json_response(false, $message);
}

$conn->begin_transaction();
try {
    $time = $minutes . " minutes";

    $stmt = $conn->prepare("INSERT INTO recipes (user_id, name, description, time, servings, picture) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("isssis", $userId, $title, $description, $time, $servings, $image);
    if (!$stmt->execute()) {
        throw new Exception("Error inserting recipe: " . $stmt->error);
    }
    $recipe_id = $stmt->insert_id;

    foreach ($mealTypes as $mealType) {
        $stmt = $conn->prepare("INSERT INTO recipe_meal_types (recipe_id, meal_type) VALUES (?, ?)");
        $stmt->bind_param("is", $recipe_id, $mealType);
        if (!$stmt->execute()) {
            throw new Exception("Error inserting meal type: " . $stmt->error);
        }
    }

    $stmt = $conn->prepare("INSERT INTO recipe_dietary_prefs (recipe_id, dietary_pref) VALUES (?, ?)");
    $stmt->bind_param("is", $recipe_id, $dietaryPreferences);
    if (!$stmt->execute()) {
        throw new Exception("Error inserting dietary preferences: " . $stmt->error);
    }

    foreach ($ingredients as $ingredient) {
        $ingredient_name = isset($ingredient['name']) ? $ingredient['name'] : '';
        $quantity = isset($ingredient['quantity']) ? $ingredient['quantity'] : '';
        if (!empty($ingredient_name)) {
            $stmt = $conn->prepare("INSERT INTO recipe_ingredients (recipe_id, ingredient, quantity) VALUES (?, ?, ?)");
            $stmt->bind_param("iss", $recipe_id, $ingredient_name, $quantity);
            if (!$stmt->execute()) {
                throw new Exception("Error inserting ingredient: " . $stmt->error);
            }
        }
    }

    foreach ($instructions as $index => $instruction) {
        $step_number = $index + 1;
        $instruction_text = isset($instruction['step']) ? $instruction['step'] : '';
        if (!empty($instruction_text)) {
            error_log("Inserting instruction: recipe_id = $recipe_id, step_number = $step_number, instruction = $instruction_text");
            $stmt = $conn->prepare("INSERT INTO procedures (recipe_id, step_number, instruction) VALUES (?, ?, ?)");
            $stmt->bind_param("iis", $recipe_id, $step_number, $instruction_text);
            if (!$stmt->execute()) {
                throw new Exception("Error inserting instruction: " . $stmt->error);
            }
        }
    }

    $conn->commit();
    send_json_response(true, "Recipe added successfully");
} catch (Exception $e) {
    $conn->rollback();
    $message = "Transaction failed: " . $e->getMessage();
    error_log("Error: $message");
    send_json_response(false, $message);
}
$conn->close();
?>