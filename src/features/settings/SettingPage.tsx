import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, LogOut, Save } from "lucide-react";
import { SettingsData } from "../../../shared/interfaces";

export default function SettingsPage() {
    const navigate = useNavigate();

    // State'i başlangıçta boş obje yerine interface ile tanımlıyoruz
    const [settings, setSettings] = useState<SettingsData>({
        gestationDays: 0,
        dryOffDays: 0,
        calfWeaningDays: 0,
        calfToAdultDays: 0,
        email: ''
    });

    // const [userEmail, setUserEmail] = useState("muhammed@mansurciftlik.com");

    useEffect(() => {
        // Veriyi asenkron olarak çekiyoruz
        const fetchSettings = async () => {
            try {
                const data = await window.settingsAPI.getSettingsData();
                console.log("Gelen Veri:", data);
                if (data) {
                    setSettings(data);
                }
            } catch (error) {
                console.error("Ayarlar yüklenirken hata oluştu:", error);
            }
        };

        fetchSettings();
    }, []);

    // Input değişikliklerini yakalayan fonksiyon
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setSettings((prev) => ({
            ...prev,
            [id]: parseInt(value) || 0, // NaN gelmesini önlemek için || 0
        }));
    };

    const handleSave = async () => {
        try {
            // Main process'e kaydetme isteği gönder
            console.log(settings);
            await window.settingsAPI.saveSettings(settings);
            console.log("Ayarlar Başarıyla Kaydedildi");
            navigate("/");
        } catch (error) {
            console.error("Kaydedilirken hata:", error);
        }
    };

    const handleLogout = () => {
        window.authAPI.logout();
        navigate("/");
        window.location.reload();
    };

    return (
        // İstediğin bg-slate-300 rengi burada uygulandı
        <div className="min-h-screen bg-slate-300 flex items-center justify-center p-6 text-slate-800">
            <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-8 border border-slate-200 flex flex-col justify-between">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/")}
                            className="p-2 hover:cursor-pointer hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-800"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <h1 className="text-2xl font-bold text-slate-800">Ayarlar</h1>
                    </div>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {[
                        { id: "gestationDays", label: "İnekler İçin Doğurma Gün Sayısı" },
                        { id: "dryOffDays", label: "Kuruya Çıkarma Gün Sayısı" },
                        { id: "calfWeaningDays", label: "Buzağı Sütten Kesme Gün Sayısı" },
                        { id: "calfToAdultDays", label: "Yetişkinlik Evresine Geçiş Günü" }
                    ].map((item) => (
                        <div key={item.id} className="flex flex-col gap-2">
                            <label
                                htmlFor={item.id}
                                className="text-slate-500 font-medium text-sm"
                            >
                                {item.label}
                            </label>
                            <input
                                type="number"
                                id={item.id}
                                value={settings[item.id as keyof SettingsData] || ""}
                                onChange={handleChange}
                                className="w-full bg-slate-50 font-bold rounded-lg border border-slate-200 p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-800"
                            />
                        </div>
                    ))}
                </div>

                <hr className="my-8 border-slate-100" />

                {/* Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-6">
                    {/* Session Info */}
                    <div className="flex items-center bg-slate-50 p-3 px-5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex flex-col mr-6">
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                                Aktif Oturum
                            </span>
                            <span className="text-sm text-blue-600 font-semibold italic">
                                {settings.email}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex hover:cursor-pointer items-center gap-2 px-4 py-2 bg-red-50 text-red-500 text-xs rounded-xl hover:bg-red-500 hover:text-white transition-all duration-200 font-bold border border-red-100"
                        >
                            <LogOut size={14} />
                            Çıkış Yap
                        </button>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className="flex hover:cursor-pointer items-center gap-3 px-10 py-4 bg-green-600 text-white rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 transform hover:scale-105 active:scale-95 transition duration-200 font-bold"
                    >
                        <Save size={20} />
                        Kaydet ve Çık
                    </button>
                </div>
            </div>
        </div>
    );
}