<?php
namespace App;
define('DB_PATH', $_SERVER['DOCUMENT_ROOT'] . '/php/db/categories');

class DBConnect {
    /**
     * @var type 
     */
    private $pdo;
 
    /**
     * @return \PDO
     */
    public function connect() {
        if ($this->pdo == null) {
            $this->pdo = new \PDO("sqlite:" . DB_PATH);
        }
    
        return $this->pdo;
    }

    
}
