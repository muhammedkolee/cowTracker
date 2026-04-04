window.electronAPI.receiveSignUpResult((result) => {
    if (result) {
        console.log("Başarıyla kayıt olundu.");
    }
    else {
        console.log("Kayıt olma sırasında hata meydana geldi, tekrar deneyiniz.");
    }
});

document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!checkPassword()) showPasswordError("Şifreler birbirleriyle eşleşmiyor, kontrol ediniz!", "text-red-600");
    else document.getElementById("passwordError").classList.add("hidden");

    const displayName = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    window.electronAPI.signUp({ displayName, email, password });
});

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


const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
const confirmPassword = document.getElementById('confirmPassword');
const eyeIconConfirm = document.getElementById('eyeIconConfirm');
const eyeSlashIconConfirm = document.getElementById('eyeSlashIconConfirm');

toggleConfirmPassword.addEventListener('click', function() {
    const type = confirmPassword.type === 'password' ? 'text' : 'password';
    confirmPassword.type = type;
    
    eyeIconConfirm.classList.toggle('hidden');
    eyeSlashIconConfirm.classList.toggle('hidden');
});

function checkPassword() {
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    console.log(password.value)
    console.log(confirmPassword.value)
    console.log(password.value === confirmPassword.value)
    if (password.value === confirmPassword.value) return true;
    return false;
}

function showPasswordError(msg, color) {
    const err = document.getElementById("passwordError");
    
    if (err.classList.contains("text-red-600")) err.classList.remove("text-red-600");

    if (err.classList.contains("text-green-600")) err.classList.remove("text-green-600");

    err.classList.add(color);
    err.textContent = msg;
    err.classList.remove("hidden");
}