<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db_connection.php';

$selected_filters = json_decode(file_get_contents("php://input"), true);

$dairy_ingredients = ['milk', 'cheese', 'butter', 'cream', 'yoghurt'];
$nut_ingredients = [
    'almonds', 'brazil nuts', 'cashew nuts', 'hazelnuts', 'macadamias', 
    'pecans', 'pine nuts', 'pistachios', 'walnuts', 'peanuts'
];
$fish_ingredients = [
    'fish', 'salmon', 'tuna', 'cod', 'trout', 'sardine', 'herring', 'anchovy'
];
$vegetable_ingredients = [
    'vegetable', 'lettuce', 'carrot', 'spinach', 'broccoli', 'cauliflower', 
    'pepper', 'tomato', 'cucumber'
];
$egg_ingredients = [
    'egg', 'egg whites', 'egg yolks'
];
$shrimp_ingredients = ['shrimp', 'prawn'];

$ingredient_conditions = [];

if (!empty($selected_filters)) {
    foreach ($selected_filters as $filter) {
        switch ($filter) {
            case 'eggs':
                foreach ($egg_ingredients as $egg) {
                    $ingredient_conditions[] = "ingredient LIKE '%$egg%'";
                }
                break;
            case 'dairy':
                foreach ($dairy_ingredients as $dairy) {
                    $ingredient_conditions[] = "ingredient LIKE '%$dairy%'";
                }
                break;
            case 'nuts':
                foreach ($nut_ingredients as $nut) {
                    $ingredient_conditions[] = "ingredient LIKE '%$nut%'";
                }
                break;
            case 'fish':
                foreach ($fish_ingredients as $fish) {
                    $ingredient_conditions[] = "ingredient LIKE '%$fish%'";
                }
                break;
            case 'shrimp':
                foreach ($shrimp_ingredients as $shrimp) {
                    $ingredient_conditions[] = "ingredient LIKE '%$shrimp%'";
                }
                break;
            case 'vegetables':
                foreach ($vegetable_ingredients as $vegetable) {
                    $ingredient_conditions[] = "ingredient LIKE '%$vegetable%'";
                }
                break;
        }
    }

    $conditions = implode(' OR ', $ingredient_conditions);
    $query = "SELECT r.recipe_id, r.name, r.picture 
              FROM recipes r
              WHERE r.recipe_id NOT IN (
                SELECT ri.recipe_id 
                FROM recipe_ingredients ri 
                WHERE $conditions
              )
              ORDER BY r.created_at DESC";
    
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();
    $recipes = $result->fetch_all(MYSQLI_ASSOC);

    foreach ($recipes as &$recipe) {
        $recipe['picture'] = base64_encode($recipe['picture']);
    }

    echo json_encode($recipes);
} else {
    echo json_encode([]);
}

$conn->close();
?>