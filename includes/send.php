<?php
// Importuj klasy PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Ścieżka do biblioteki PHPMailer (zaktualizowana)
require_once __DIR__ . '/PHPMailer/src/Exception.php';
require_once __DIR__ . '/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/src/SMTP.php';

// Załaduj konfigurację
$config = include __DIR__ . '/config.php';

// Odbierz dane z formularza
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$event = $_POST['event'] ?? '';
$date = $_POST['date'] ?? '';
$message = $_POST['message'] ?? '';

// Treść wiadomości
$email_content = "Imię: $name\n";
$email_content .= "Email: $email\n";
$email_content .= "Telefon: $phone\n";
$email_content .= "Rodzaj wydarzenia: $event\n";
$email_content .= "Data wydarzenia: $date\n\n";
$email_content .= "Wiadomość:\n$message\n";

// Utwórz instancję
$mail = new PHPMailer(true);

try {
    // Ustawienia serwera
    $mail->SMTPDebug = 0;
    $mail->isSMTP();
    $mail->Host       = $config['smtp_host'];
    $mail->SMTPAuth   = true;    
    $mail->Username   = $config['smtp_username'];         
    $mail->Password   = $config['smtp_password'];                 
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = $config['smtp_port'];                            
    $mail->CharSet    = 'UTF-8';

    // Odbiorcy
    $mail->setFrom($config['email_from'], 'Formularz kontaktowy');
    $mail->addAddress($config['email_to']);
    $mail->addReplyTo($email, $name);

    // Treść
    $mail->isHTML(false);
    $mail->Subject = 'Nowa wiadomość ze strony testystrony.pl';
    $mail->Body    = $email_content;

    $mail->send();
    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "Wiadomość została wysłana"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Nie udało się wysłać wiadomości: {$mail->ErrorInfo}"]);
}
?>