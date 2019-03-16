<?php
require '../../vendor/autoload.php';

use App\DBConnect;
use App\Models\Category;

header('Access-Controll-Allow-Origin: *');
header('Content-Type: application/json');

$db = (new DBConnect())->connect();


$category = new Category($db);

$result = $category->fetchAll();

$categories = array();
$categories['data'] = array();

while($row = $result->fetch(PDO::FETCH_ASSOC)) {
    extract($row);

    $category_item = array(
        'id' => $id,
        'name' => $name,
        'parent_id' => $parent_id,
        'icon' => $icon
    );

    array_push($categories['data'], $category_item);
}

if (!empty($categories)) {
    echo json_encode($categories['data']);        
} else {
    echo json_encode(
        array('message' => 'No categories')
    );
}
