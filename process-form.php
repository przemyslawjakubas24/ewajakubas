<?php
// Importuj bibliotekę PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Ręczne dołączanie potrzebnych plików
require 'PHPMailer-master/src/Exception.php';
require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';

// Odbierz dane z formularza
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$event = $_POST['event'] ?? '';
$date = $_POST['date'] ?? '';
$message = $_POST['message'] ?? '';

// Treść wiadomości
$email_content = "Imię i nazwisko: $name\n";
$email_content .= "Email: $email\n";
$email_content .= "Telefon: $phone\n";
$email_content .= "Rodzaj wydarzenia: $event\n";
$email_content .= "Data wydarzenia: $date\n\n";
$email_content .= "Wiadomość:\n$message\n";

// Utworzenie nowego obiektu PHPMailer
$mail = new PHPMailer(true);

try {
    // Ustawienia serwera
    $mail->isSMTP();                                      // Użyj SMTP
    $mail->Host       = 'mail.testystrony.pl';           // Serwer SMTP
    $mail->SMTPAuth   = true;                             // Włącz uwierzytelnianie SMTP
    $mail->Username   = 'kontakt@testystrony.pl';           // Nazwa użytkownika SMTP
    $mail->Password   = 'nkrbdF4aDgD78uve3bMg';                    // Hasło SMTP
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;   // Włącz szyfrowanie TLS
    $mail->Port       = 465;                              // Port TCP do połączenia

    // Odbiorcy
    $mail->setFrom('kontakt@testystrony.pl', 'Formularz kontaktowy');
    $mail->addAddress('jakubas.tbg@gmail.com');            // Dodaj odbiorcę
    $mail->addReplyTo($email, $name);                     // Odpowiedź na adres nadawcy

    // Treść
    $mail->isHTML(false);                                 // Format emaila jako zwykły tekst
    $mail->Subject = "Nowa wiadomość ze strony ewajakubas.pl";
    $mail->Body    = $email_content;

    $mail->send();
    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "Wiadomość została wysłana"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Nie udało się wysłać wiadomości: {$mail->ErrorInfo}"]);
}
?>