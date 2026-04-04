// let isLogin = true;

// window.electronAPI.receiveLoginResult((result) => {
//     if (result) {
//         alert("Giriş başarılı!");
//     }
//     else {
//         alert("Giriş Başarısız, tekrar deneyin.");
//     }
// });

// window.electronAPI.receiveSignUpResult((result) => {
//     if (result) {
//         alert("Başarılı kayıt olundu.");
//         document.getElementById("signBody").innerHTML = mailVerification;
//     }
//     else {
//         alert("Kayıt olma sırasında hata meydana geldi, tekrar deneyiniz.");
//     }
// });


// // Toggle Password Visibility
// document
//     .getElementById("togglePassword")
//     .addEventListener("click", function () {
//         const passwordInput = document.getElementById("password");
//         const eyeIcon = document.getElementById("eyeIcon");

//         if (passwordInput.type === "password") {
//             passwordInput.type = "text";
//             eyeIcon.innerHTML = `
//                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
//                 `;
//         } else {
//             passwordInput.type = "password";
//             eyeIcon.innerHTML = `
//                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
//                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
//                 `;
//         }
//     });

// // Toggle between Login and Signup
// function toggleMode() {
//     isLogin = !isLogin;

//     const title = document.getElementById("title");
//     const subtitle = document.getElementById("subtitle");
//     const nameField = document.getElementById("nameField");
//     const forgotPassword = document.getElementById("forgotPassword");
//     const submitBtn = document.getElementById("submitBtn");
//     const toggleText = document.getElementById("toggleText");
//     const toggleModeBtn = document.getElementById("toggleModeBtn");

//     if (isLogin) {
//         title.textContent = "Hoş Geldiniz";
//         subtitle.textContent = "Hesabınıza giriş yapın";
//         nameField.classList.add("hidden");
//         forgotPassword.classList.remove("hidden");
//         submitBtn.textContent = "Giriş Yap";
//         submitBtn.className =
//             "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 shadow-lg shadow-blue-500/30";
//         toggleText.textContent = "Hesabınız yok mu?";
//         toggleModeBtn.textContent = "Kayıt Ol";
//     } else {
//         title.textContent = "Hesap Oluştur";
//         subtitle.textContent = "Yeni bir hesap oluşturun";
//         nameField.classList.remove("hidden");
//         forgotPassword.classList.add("hidden");
//         submitBtn.textContent = "Hesap Oluştur";
//         submitBtn.className =
//             "w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition duration-200 shadow-lg shadow-blue-500/30";
//         toggleText.textContent = "Zaten hesabınız var mı?";
//         toggleModeBtn.textContent = "Giriş Yap";
//     }

//     // Clear inputs
//     document.getElementById("name").value = "";
//     document.getElementById("email").value = "";
//     document.getElementById("password").value = "";
// }

// // Handle Submit
// function handleSubmit() {
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     if (!email || !password) {
//         alert("Lütfen tüm alanları doldurun!");
//         return;
//     }

//     if (isLogin) {
//         window.electronAPI.login({ email, password });
//     } else {
//         const displayName = document.getElementById("name").value;

//         window.electronAPI.signUp({ displayName, email, password });
//     }
// }

// document.getElementById("submitBtn").addEventListener("click", () => {
//     const btn = document.getElementById("submitBtn");
    
//     btn.disabled = true;
//     btn.textContent = "Yükleniyor...";
//     btn.style.opacity = "0.7";
//     btn.style.cursor = "not-allowed";

//     handleSubmit().finally(() => {
//         btn.disabled = false;
//         btn.textContent = "Gönder"; // orijinal buton metni ne ise onu yaz
//         btn.style.opacity = "1";
//         btn.style.cursor = "pointer";
//     });
// });

// // Enter key support
// document.addEventListener("keypress", function (e) {
//     if (e.key === "Enter") {
//         handleSubmit().finally(() => {
//             btn.disabled = false;
//             btn.textContent = "Gönder"; // orijinal buton metni ne ise onu yaz
//             btn.style.opacity = "1";
//             btn.style.cursor = "pointer";
//         });
//     }
// });

// document.getElementById("toggleModeBtn").addEventListener("click", () => {
//     toggleMode();
// });

// function backToLogin(){
//     document.getElementById("signBody").innerHTML = layout;
// }

// mailVerification = 
// `
//  <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
//         <!-- Icon -->
//         <div class="mb-6 flex justify-center">
//             <div class="bg-blue-100 rounded-full p-4">
//                 <svg class="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
//                 </svg>
//             </div>
//         </div>

//         <!-- Title -->
//         <h1 class="text-3xl font-bold text-gray-800 mb-3">
//             Email'inizi Kontrol Edin
//         </h1>

//         <!-- Subtitle -->
//         <p class="text-gray-600 mb-6">
//             Hesabınızı oluşturduk! Email adresinize bir doğrulama bağlantısı gönderdik.
//         </p>

//         <!-- Instructions -->
//         <div class="text-left bg-gray-50 rounded-lg p-4 mb-6">
//             <h3 class="font-semibold text-gray-800 mb-2">Sonraki Adımlar:</h3>
//             <ol class="text-sm text-gray-600 space-y-2">
//                 <li class="flex items-start">
//                     <span class="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 text-xs flex-shrink-0">1</span>
//                     <span>Email gelen kutunuzu kontrol edin</span>
//                 </li>
//                 <li class="flex items-start">
//                     <span class="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 text-xs flex-shrink-0">2</span>
//                     <a href:"https://mail.google.com/"><span>Doğrulama bağlantısına tıklayın</span></a>
//                 </li>
//                 <li class="flex items-start">
//                     <span class="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 text-xs flex-shrink-0">3</span>
//                     <span>Giriş yaparak hesabınızı kullanmaya başlayın</span>
//                 </li>
//             </ol>
//         </div>

//         <!-- Warning -->
//         <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
//             <p class="text-xs text-yellow-800">
//                 <strong>Not:</strong> Email gelmedi mi? Spam/gereksiz klasörünü kontrol edin.
//             </p>
//         </div>

//         <!-- Buttons -->
//         <div class="space-y-3">         
//             <button onclick="backToLogin()" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition duration-200">
//                 Giriş Sayfasına Dön
//             </button>
//         </div>
//     </div>
// `;

// layout = 
// `
//     <div class="w-full max-w-md">
//         <!-- Card -->
//         <div class="bg-white rounded-2xl shadow-xl p-8">
//             <!-- Header -->
//             <div class="text-center mb-8">
//                 <div class="w-16 h-16 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
//                     <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
//                     </svg>
//                 </div>
//                 <h1 id="title" class="text-2xl font-bold text-slate-800">Hoş Geldiniz</h1>
//                 <p id="subtitle" class="text-slate-500 mt-2">Hesabınıza giriş yapın</p>
//             </div>

//             <!-- Form Container -->
//             <div class="space-y-4">
//                 <!-- Name Field (Hidden by default) -->
//                 <div id="nameField" class="hidden">
//                     <label class="block text-sm font-medium text-slate-700 mb-2">Ad Soyad</label>
//                     <div class="relative">
//                         <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
//                         </svg>
//                         <input 
//                             type="text" 
//                             id="name" 
//                             placeholder="Adınızı girin"
//                             class="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                         />
//                     </div>
//                 </div>

//                 <!-- Email Field -->
//                 <div>
//                     <label class="block text-sm font-medium text-slate-700 mb-2">E-posta</label>
//                     <div class="relative">
//                         <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
//                         </svg>
//                         <input 
//                             type="email" 
//                             id="email" 
//                             placeholder="ornek@email.com"
//                             required
//                             class="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                         />
//                     </div>
//                 </div>

//                 <!-- Password Field -->
//                 <div>
//                     <label class="block text-sm font-medium text-slate-700 mb-2">Şifre</label>
//                     <div class="relative">
//                         <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
//                         </svg>
//                         <input 
//                             type="password" 
//                             id="password" 
//                             placeholder="••••••••"
//                             required
//                             class="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                         />
//                         <button 
//                             type="button" 
//                             id="togglePassword"
//                             class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
//                         >
//                             <svg id="eyeIcon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
//                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
//                             </svg>
//                         </button>
//                     </div>
//                 </div>

//                 <!-- Forgot Password (Only for Login) -->
//                 <div id="forgotPassword" class="text-right">
//                     <button 
//                         type="button"
//                         class="text-sm text-blue-600 hover:cursor-pointer hover:text-blue-700 font-medium"
//                         onclick="alert('Şifre sıfırlama özelliği yakında eklenecek')"
//                     >
//                         Şifremi unuttum?
//                     </button>
//                 </div>

//                 <!-- Submit Button -->
//                 <button 
//                     id="submitBtn"
//                     class="w-full bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white font-medium py-3 rounded-lg transition duration-200 shadow-lg shadow-blue-500/30"
//                 >
//                     Giriş Yap
//                 </button>
//             </div>

//             <!-- Toggle Mode -->
//             <div class="mt-6 text-center">
//                 <p class="text-slate-600">
//                     <span id="toggleText">Hesabınız yok mu?</span>
//                     <button 
//                         id="toggleModeBtn"
//                         class="text-green-600 hover:text-green-700 hover:cursor-pointer font-medium ml-1"
//                     >
//                         Kayıt Ol
//                     </button>
//                 </p>
//             </div>
//         </div>

//         <!-- Footer Text -->
//         <p class="text-center text-slate-500 text-sm mt-6">
//             Giriş yaparak kullanım şartlarını kabul etmiş olursunuz
//         </p>
//     </div>
// `;


        let isLogin = true;
        let isProcessing = false; // İşlem kontrol değişkeni

        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const btnSpinner = document.getElementById('btnSpinner');
        const errorMessage = document.getElementById('errorMessage');

        // Hata Mesajı Gösterme Fonksiyonu
        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.classList.remove('hidden');
            // 5 saniye sonra otomatik gizle
            setTimeout(() => errorMessage.classList.add('hidden'), 5000);
        }

        async function processForm() {
            if (isProcessing) return; // Zaten işlem yapılıyorsa durdur

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const name = document.getElementById("name").value;

            if (!email || !password || (!isLogin && !name)) {
                showError("Lütfen tüm alanları doldurun!");
                return;
            }

            // --- İŞLEM BAŞLIYOR ---
            isProcessing = true;
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
            btnText.textContent = isLogin ? "Giriş Yapılıyor..." : "Kaydediliyor...";
            btnSpinner.classList.remove('hidden');
            errorMessage.classList.add('hidden'); // Yeni denemede eski hatayı gizle

            try {
                let response;
                if (isLogin) {
                    // Electron tarafına gönder ve yanıt bekle
                    response = await window.electronAPI.login({ email, password });
                } else {
                    response = await window.electronAPI.signUp({ displayName: name, email, password });
                }
                console.log(response);
                // response.success olduğunu varsayıyoruz (Main process'ten gelen cevap)
                if (response && !response.success) {
                    showError(response.message || "Bir hata oluştu!");
                }

                if (isLogin && !response) {
                    showError("Şifre ve e-posta adresi yanlış. Tekrar deneyin.")
                }

            } catch (error) {
                // Şifre yanlışsa veya ağ hatası varsa buraya düşer
                showError("Şifre yanlış veya bir hata oluştu!");
                console.error("İşlem hatası:", error);
            } finally {
                // --- İŞLEM BİTTİ ---
                isProcessing = false;
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
                btnText.textContent = isLogin ? "Giriş Yap" : "Kayıt Ol";
                btnSpinner.classList.add('hidden');

                window.focus();
            }
        }

        // Event Listeners
        submitBtn.addEventListener("click", processForm);

        document.addEventListener("keypress", (e) => {
            if (e.key === "Enter") processForm();
        });

        document.getElementById('toggleBtn').addEventListener('click', () => {
            if (isProcessing) return;
            isLogin = !isLogin;
            errorMessage.classList.add('hidden');
            document.getElementById('formTitle').textContent = isLogin ? "Giriş Yap" : "Hesap Oluştur";
            document.getElementById('nameGroup').classList.toggle('hidden', isLogin);
            document.getElementById('toggleBtn').textContent = isLogin ? "Hesabınız yok mu? Kayıt Ol" : "Zaten hesabınız var mı? Giriş Yap";
            btnText.textContent = isLogin ? "Giriş Yap" : "Kayıt Ol";
        });