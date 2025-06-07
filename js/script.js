// Пример за форма за контакт
document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Съобщението ви беше изпратено успешно!');
});

const form = document.getElementById("contact-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const response = await fetch("contact.php", {
    method: "POST",
    body: formData,
  });

  const result = await response.text();
  alert(result);
  if (response.ok) form.reset();
});

document.getElementById("contact-form").addEventListener("submit", function (e) {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const recaptcha = grecaptcha.getResponse();

  if (!name || !email || !message) {
    e.preventDefault();
    alert("Моля, попълнете всички полета.");
    return;
  }

  if (recaptcha.length === 0) {
    e.preventDefault();
    alert("Моля, потвърдете, че не сте робот.");
    return;
  }
});


