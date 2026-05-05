import { useState } from "react";

type Mode = "login" | "signup";

interface LoginForm {
    email: string;
    password: string;
}

interface SignupForm {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
}

export default function AuthPage() {
    const [mode, setMode] = useState<Mode>("login");
    const [loginForm, setLoginForm] = useState<LoginForm>({ email: "", password: "" });
    const [signupForm, setSignupForm] = useState<SignupForm>({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    const switchMode = (newMode: Mode) => {
        setMode(newMode);
        setErrors({});
    };

    const validateLogin = (): boolean => {
        const newErrors: FormErrors = {};
        if (!loginForm.email.trim()) newErrors.email = "E-posta adresi gereklidir.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email))
            newErrors.email = "Geçerli bir e-posta adresi giriniz.";
        if (!loginForm.password) newErrors.password = "Şifre gereklidir.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateSignup = (): boolean => {
        const newErrors: FormErrors = {};
        if (!signupForm.fullName.trim()) newErrors.fullName = "İsim Soyisim gereklidir.";
        if (!signupForm.email.trim()) newErrors.email = "E-posta adresi gereklidir.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupForm.email))
            newErrors.email = "Geçerli bir e-posta adresi giriniz.";
        if (!signupForm.password) newErrors.password = "Şifre gereklidir.";
        else if (signupForm.password.length < 6)
            newErrors.password = "Şifre en az 6 karakter olmalıdır.";
        if (!signupForm.confirmPassword)
            newErrors.confirmPassword = "Şifre onayı gereklidir.";
        else if (signupForm.password !== signupForm.confirmPassword)
            newErrors.confirmPassword = "Şifreler birbiriyle eşleşmiyor.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateLogin()) return;
        setLoading(true);
        setErrors({});
        try {
            const result = await window.authAPI.login({
                email: loginForm.email,
                password: loginForm.password,
            });
            window.location.reload();
        } catch {
            setErrors({ general: "E-posta adresi veya şifre yanlış, tekrar deneyiniz." });
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async () => {
        if (!validateSignup()) return;
        setLoading(true);
        setErrors({});
        try {
            const result = await window.authAPI.signup({
                fullName: signupForm.fullName,
                email: signupForm.email,
                password: signupForm.password,
            });
            if (!result.success) {
                setErrors({ general: result.message || "Kayıt oluşturulamadı." });
            }
        } catch {
            setErrors({ general: "Bir hata oluştu. Tekrar deneyiniz." });
        } finally {
            setLoading(false);
        }
    };

    const inputBase =
        "w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none transition-all duration-200 focus:bg-white/10";
    const inputNormal = `${inputBase} border-white/10 focus:border-emerald-400/60`;
    const inputError = `${inputBase} border-red-400/60 focus:border-red-400`;

    return (
        <div className="min-h-screen bg-slate-600 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Arka plan dekorasyon */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[120px]" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
                        backgroundSize: "32px 32px",
                    }}
                />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo / Başlık */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Hoş Geldiniz
                    </h1>
                    <p className="text-white/40 text-sm mt-1">Hayvan Yönetim Uygulaması</p>
                </div>

                {/* Kart */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    {/* Tab Switcher */}
                    <div className="flex bg-white/5 rounded-2xl p-1 mb-8 border border-white/5">
                        {(["login", "signup"] as Mode[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => switchMode(m)}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                                    mode === m
                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                                        : "text-white/40 hover:text-white/70"
                                }`}
                            >
                                {m === "login" ? "Giriş Yap" : "Kayıt Ol"}
                            </button>
                        ))}
                    </div>

                    {/* Genel hata */}
                    {errors.general && (
                        <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                            {errors.general}
                        </div>
                    )}

                    {/* LOGIN FORMU */}
                    {mode === "login" && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-white/50 text-xs font-semibold uppercase tracking-widest ml-1 mb-1.5 block">
                                    E-Posta
                                </label>
                                <input
                                    type="email"
                                    placeholder="ornek@mail.com"
                                    className={errors.email ? inputError : inputNormal}
                                    value={loginForm.email}
                                    onChange={(e) => {
                                        setLoginForm({ ...loginForm, email: e.target.value });
                                        if (errors.email) setErrors({ ...errors, email: undefined });
                                    }}
                                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                />
                                {errors.email && (
                                    <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-white/50 text-xs font-semibold uppercase tracking-widest ml-1 mb-1.5 block">
                                    Şifre
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className={errors.password ? inputError : inputNormal}
                                    value={loginForm.password}
                                    onChange={(e) => {
                                        setLoginForm({ ...loginForm, password: e.target.value });
                                        if (errors.password) setErrors({ ...errors, password: undefined });
                                    }}
                                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                />
                                {errors.password && (
                                    <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password}</p>
                                )}
                            </div>

                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="w-full mt-2 py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Giriş yapılıyor...
                                    </span>
                                ) : (
                                    "Giriş Yap"
                                )}
                            </button>
                        </div>
                    )}

                    {/* SIGNUP FORMU */}
                    {mode === "signup" && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-white/50 text-xs font-semibold uppercase tracking-widest ml-1 mb-1.5 block">
                                    İsim Soyisim
                                </label>
                                <input
                                    type="text"
                                    placeholder="Örnek İsim"
                                    className={errors.fullName ? inputError : inputNormal}
                                    value={signupForm.fullName}
                                    onChange={(e) => {
                                        setSignupForm({ ...signupForm, fullName: e.target.value });
                                        if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                                    }}
                                />
                                {errors.fullName && (
                                    <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.fullName}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-white/50 text-xs font-semibold uppercase tracking-widest ml-1 mb-1.5 block">
                                    E-Posta
                                </label>
                                <input
                                    type="email"
                                    placeholder="ornek@mail.com"
                                    className={errors.email ? inputError : inputNormal}
                                    value={signupForm.email}
                                    onChange={(e) => {
                                        setSignupForm({ ...signupForm, email: e.target.value });
                                        if (errors.email) setErrors({ ...errors, email: undefined });
                                    }}
                                />
                                {errors.email && (
                                    <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-white/50 text-xs font-semibold uppercase tracking-widest ml-1 mb-1.5 block">
                                    Şifre
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className={errors.password ? inputError : inputNormal}
                                    value={signupForm.password}
                                    onChange={(e) => {
                                        setSignupForm({ ...signupForm, password: e.target.value });
                                        if (errors.password) setErrors({ ...errors, password: undefined });
                                    }}
                                />
                                {errors.password && (
                                    <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-white/50 text-xs font-semibold uppercase tracking-widest ml-1 mb-1.5 block">
                                    Şifre Onayı
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className={errors.confirmPassword ? inputError : inputNormal}
                                    value={signupForm.confirmPassword}
                                    onChange={(e) => {
                                        setSignupForm({ ...signupForm, confirmPassword: e.target.value });
                                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                                    }}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.confirmPassword}</p>
                                )}
                            </div>

                            <button
                                onClick={handleSignup}
                                disabled={loading}
                                className="w-full mt-2 py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Kayıt oluşturuluyor...
                                    </span>
                                ) : (
                                    "Kayıt Ol"
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}