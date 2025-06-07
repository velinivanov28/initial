<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Validate form fields
    $name    = strip_tags(trim($_POST["name"]));
    $email   = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);
    $captcha = $_POST["g-recaptcha-response"];

    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($captcha)) {
        http_response_code(400);
        echo "Моля, попълнете всички полета и потвърдете, че не сте робот.";
        exit;
    }

    // Validate reCAPTCHA
    $secretKey = "6LfnklgrAAAAALTdNdcY90gGWnsHzfuN1dxUpOPE"; // Replace with your secret key
    $verifyURL = "https://www.google.com/recaptcha/api/siteverify";
    
    $response = file_get_contents($verifyURL . "?secret=$secretKey&response=$captcha");
    $responseKeys = json_decode($response, true);

    if (!$responseKeys["success"]) {
        http_response_code(400);
        echo "reCAPTCHA не е преминал. Моля, опитайте отново.";
        exit;
    }

    // Proceed with sending email
    $recipient = "info@malkiremonti.bg"; // your email
    $subject = "Ново съобщение от $name";
    $email_content = "Име: $name\nИмейл: $email\n\nСъобщение:\n$message\n";
    $headers = "From: $name <$email>";

    if (mail($recipient, $subject, $email_content, $headers)) {
        echo "Съобщението беше изпратено успешно.";
    } else {
        http_response_code(500);
        echo "Грешка при изпращането. Моля, опитайте по-късно.";
    }
} else {
    http_response_code(403);
    echo "Недопустим метод на заявка.";
}
