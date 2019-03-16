<?php
    namespace App\Models;

    class Category {
        private $conn;
        private $table = 'category';

        private $id;
        private $name;
        private $parent_id;
        private $icon;

        public function __construct($db) {
            $this->conn = $db;
        }

        public function fetchAll() {
            $query = 'SELECT * FROM ' . $this->table . '';
            
            $stmt = $this->conn->prepare($query);

            $stmt->execute();
            
            return $stmt;
        }
    }