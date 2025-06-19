<?php
// filepath: d:\ewajakubas\website\public\process.php

// Sprawdzenie czy formularz został wysłany metodą POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["status" => "error", "message" => "Nieprawidłowa metoda żądania."]);
    exit;
}

// Sprawdzenie czy żądanie pochodzi z Twojej domeny (zabezpieczenie CSRF)
$allowed_origins = ['https://ewajakubas.pl', 'http://localhost', 'http://127.0.0.1'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (!in_array($origin, $allowed_origins) && !empty($origin)) {
    http_response_code(403); // Forbidden
    echo json_encode(["status" => "error", "message" => "Niedozwolone źródło żądania."]);
    exit;
}

// Podstawowa walidacja danych formularza
$errors = [];

// Sprawdzenie wymaganych pól
$required_fields = ['name', 'email', 'message'];
foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        $errors[] = "Pole '$field' jest wymagane.";
    }
}

// Walidacja adresu email
if (!empty($_POST['email']) && !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Podany adres email jest nieprawidłowy.";
}

// Jeśli są błędy walidacji, zwróć je
if (!empty($errors)) {
    http_response_code(422); // Unprocessable Entity
    echo json_encode(["status" => "error", "message" => "Błędy walidacji formularza.", "errors" => $errors]);
    exit;
}

// Sanityzacja danych wejściowych
$name = htmlspecialchars(trim($_POST['name']));
$email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
$phone = !empty($_POST['phone']) ? htmlspecialchars(trim($_POST['phone'])) : '';
$event = !empty($_POST['event']) ? htmlspecialchars(trim($_POST['event'])) : '';
$date = !empty($_POST['date']) ? htmlspecialchars(trim($_POST['date'])) : '';
$message = htmlspecialchars(trim($_POST['message']));

// Opcjonalnie: dodanie zabezpieczeń antyspamowych
// Np. sprawdzenie ukrytego pola, które boty zazwyczaj wypełniają
if (!empty($_POST['website'])) { // Pole-pułapka - powinno być puste (dla ludzi ukryte przez CSS)
    http_response_code(200); // Udajemy, że wszystko jest OK
    echo json_encode(["status" => "success", "message" => "Wiadomość została wysłana"]);
    exit; // Ale nie wysyłamy wiadomości
}

// Jeśli wszystko OK, przekaż dane do właściwego skryptu obsługującego wysyłkę
try {
    // Przekazujemy oczyszczone dane
    $_POST['name'] = $name;
    $_POST['email'] = $email;
    $_POST['phone'] = $phone;
    $_POST['event'] = $event;
    $_POST['date'] = $date;
    $_POST['message'] = $message;
    
    // Dołączamy i wykonujemy główny skrypt wysyłający
    require_once dirname(__DIR__) . '/includes/send.php';
    
} catch (Exception $e) {
    // Obsługa błędów na wyższym poziomie
    error_log("Błąd formularza kontaktowego: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Wystąpił problem z przetwarzaniem formularza. Prosimy spróbować później."]);
}
?>