<?php
// ══════════════════════════════════════════════════════════
// Visual Data Structure — Configuración de base de datos
// ══════════════════════════════════════════════════════════
// ⚠ IMPORTANTE: Completar la contraseña MySQL antes de subir

define('DB_HOST', 'sql100.infinityfree.com');
define('DB_PORT', '3306');
define('DB_USER', 'if0_41630466');
define('DB_PASS', 'PONER_CONTRASEÑA_AQUI');   // ← cambiar esto
define('DB_NAME', 'if0_41630466_db_congreso');
define('DB_CHARSET', 'utf8mb4');

// Clave secreta para el panel de administración
// Cambiar por una clave segura antes de publicar
define('ADMIN_KEY', 'VDS_JIC2026_admin');

function getDB(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $dsn = sprintf(
        'mysql:host=%s;port=%s;dbname=%s;charset=%s',
        DB_HOST, DB_PORT, DB_NAME, DB_CHARSET
    );

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    return $pdo;
}
