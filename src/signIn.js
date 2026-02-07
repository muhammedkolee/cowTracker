window.electronAPI.receiveLoginResult( async (result) => {
    if (result) {
        console.log("Giriş başarılı!");

        loginButton.disabled = false;
        loginSpinner.classList.add('hidden');
        loginText.textContent = 'Giriş Yap';
        showPasswordError("Giriş başarılı, sayfaya yönlendiriliyorsunuz.", "text-green-600");
    }
    else {
        showPasswordError("Şifre yanlış, tekrar deneyiniz!", "text-red-600")
        console.log("Giriş Başarısız, bilgilerinizi kontrol ediniz.");
        
        loginButton.disabled = false;
        loginSpinner.classList.add('hidden');
        loginText.textContent = 'Giriş Yap';
    }
});


document.getElementById("loginButton").addEventListener("click", () => {
    const loginButton = document.getElementById('loginButton');
    const loginSpinner = document.getElementById('loginSpinner');
    const loginText = document.getElementById('loginText');
    
    loginButton.disabled = true;
    loginSpinner.classList.remove('hidden');
    loginText.textContent = 'Giriş yapılıyor...';

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    if (!email || !password) {
        showPasswordError("Lütfen tüm bilgileri girdiğinizden emin olunuz!", "text-red-600");

        loginButton.disabled = false;
        loginSpinner.classList.add('hidden');
        loginText.textContent = 'Giriş Yap';
    }

    else {
        window.electronAPI.login({email, password});
    }
});

function showPasswordError(msg, color) {
    const err = document.getElementById("passwordError");
    
    if (err.classList.contains("text-red-600")) err.classList.remove("text-red-600");

    if (err.classList.contains("text-green-600")) err.classList.remove("text-green-600");

    err.classList.add(color);
    err.textContent = msg;
    err.classList.remove("hidden");
}

const togglePassword = document.getElementById('togglePassword');
const password = document.getElementById('password');
const eyeIcon = document.getElementById('eyeIcon');
const eyeSlashIcon = document.getElementById('eyeSlashIcon');

togglePassword.addEventListener('click', function() {
    const type = password.type === 'password' ? 'text' : 'password';
    password.type = type;
    
    eyeIcon.classList.toggle('hidden');
    eyeSlashIcon.classList.toggle('hidden');
});