<?php
// Odbierz dane z formularza
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$event = $_POST['event'] ?? '';
$date = $_POST['date'] ?? '';
$message = $_POST['message'] ?? '';

// Adres, na który ma być wysłana wiadomość
$to = "jakubas.tbg@gmail.com"; // Zmień na swój adres email

// Temat wiadomości
$subject = "Nowa wiadomość ze strony ewajakubas.pl";

// Treść wiadomości
$email_content = "Imię i nazwisko: $name\n";
$email_content .= "Email: $email\n";
$email_content .= "Telefon: $phone\n";
$email_content .= "Rodzaj wydarzenia: $event\n";
$email_content .= "Data wydarzenia: $date\n\n";
$email_content .= "Wiadomość:\n$message\n";

// Nagłówki wiadomości
$headers = "From: $email\n";
$headers .= "Reply-To: $email";

// Wyślij wiadomość
$success = mail($to, $subject, $email_content, $headers);

// Odpowiedź
if ($success) {
    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "Wiadomość została wysłana"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Nie udało się wysłać wiadomości"]);
}
?>