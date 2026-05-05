import React, { useEffect, useState } from "react";
import { Edit, Trash2, Calendar, Hash, Info as InfoIcon } from "lucide-react";

export default function AnimalDetailPage() {
    const [animal, setAnimal] = useState<any>(null);
    const [vaccines, setVaccines] = useState<any[]>([]);
    const [calves, setCalves] = useState<any[]>([]);
    const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
    const [trashData, setTrashData] = useState({
        deathDate: new Date().toISOString().split("T")[0],
        reason: "",
    });

    useEffect(() => {
        // Backend'den (Main Process) gelen temiz objeyi yakalıyoruz
        window.animalDetailAPI.receiveData(
            (data: { animal: any; vaccines: any[]; calves: any[] }) => {
                setAnimal(data.animal);
                setVaccines(data.vaccines);
                setCalves(data.calves);
            },
        );
    }, []);

    if (!animal) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center animate-pulse">
                    <div className="inline-block rounded-full h-16 w-16 border-t-4 border-blue-600 mb-4 border-solid animate-spin" />
                    <h2 className="text-xl font-bold text-gray-600">
                        Veriler Getiriliyor...
                    </h2>
                </div>
            </div>
        );
    }

    // --- Senin Hesaplama Mantığın ---
    const calculateDays = (dateStr: string) => {
        if (!dateStr) return 0;
        return Math.ceil(
            (new Date().getTime() - new Date(dateStr).getTime()) /
                (1000 * 60 * 60 * 24),
        );
    };

    const getGestationStats = (inseminationDate: string) => {
        const start = new Date(inseminationDate);
        const today = new Date();
        const birth = new Date(start);
        birth.setDate(start.getDate() + 280);
        return {
            estBirth: birth.toLocaleDateString("tr-TR"),
            leftDay: Math.ceil(
                (birth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
            ),
        };
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 font-sans">
            <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl p-8 border border-gray-100">
                {/* Başlık: Küpe Numarası */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase">
                        {animal.EarringNo}
                    </h1>
                    <div className="h-1 w-20 bg-blue-600 mx-auto mt-2 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 1. SÜTUN: GENEL BİLGİLER */}
                    <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2 border-b pb-2">
                            <InfoIcon size={20} className="text-blue-600" />
                            {animal.Type === "cow"
                                ? "İnek Bilgisi"
                                : animal.Type === "heifer"
                                  ? "Düve Bilgisi"
                                  : "Hayvan Bilgisi"}
                        </h2>
                        {/* <hr></hr> */}
                        <div className="space-y-4 text-sm text-slate-600">
                            <p className="flex justify-between">
                                <span className="font-bold">İsim:</span>{" "}
                                <span>{animal.Name || "-"}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="font-bold">Doğum Tarihi:</span>{" "}
                                <span>
                                    {new Date(
                                        animal.BirthDate,
                                    ).toLocaleDateString("tr-TR")}
                                </span>
                            </p>
                            <p className="flex justify-between">
                                <span className="font-bold">Cins:</span>{" "}
                                <span>{animal.Breed || "-"}</span>
                            </p>
                            <hr className="border-slate-200" />
                            <p className="flex justify-between">
                                <span className="font-bold">Anne Küpe:</span>{" "}
                                <span>{animal.MotherEarringNo || "-"}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="font-bold">Anne İsim:</span>{" "}
                                <span>{animal.MotherName || "-"}</span>
                            </p>

                            {/* İnekler için Gebelik Detayları */}
                            {animal.Type === "cow" &&
                                animal.InseminationDate && (
                                    <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 space-y-2">
                                        <p className="text-blue-800 font-bold text-xs uppercase mb-1">
                                            Gebelik Durumu
                                        </p>
                                        <p className="flex justify-between text-xs font-semibold">
                                            <span>Doğuma Kalan:</span>
                                            <span
                                                className={
                                                    getGestationStats(
                                                        animal.InseminationDate,
                                                    ).leftDay < 30
                                                        ? "text-red-600"
                                                        : "text-blue-700"
                                                }
                                            >
                                                {
                                                    getGestationStats(
                                                        animal.InseminationDate,
                                                    ).leftDay
                                                }{" "}
                                                Gün
                                            </span>
                                        </p>
                                        <p className="flex justify-between text-xs font-semibold">
                                            <span>Tahmini Doğum:</span>{" "}
                                            <span>
                                                {
                                                    getGestationStats(
                                                        animal.InseminationDate,
                                                    ).estBirth
                                                }
                                            </span>
                                        </p>
                                    </div>
                                )}

                            {/* Düveler için Boş Gün */}
                            {animal.Type === "heifer" &&
                                animal.LastBirthDate && (
                                    <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-100">
                                        <p className="flex justify-between text-sm">
                                            <span className="font-bold text-orange-800">
                                                Boş Gün Sayısı:
                                            </span>
                                            <span className="font-black text-orange-600">
                                                {calculateDays(
                                                    animal.LastBirthDate,
                                                )}{" "}
                                                Gün
                                            </span>
                                        </p>
                                    </div>
                                )}

                            <hr className="border-slate-200" />
                            <div className="bg-white p-3 rounded-lg border border-slate-200">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                                    Notlar
                                </p>
                                <p className="text-slate-700 italic">
                                    {animal.Note || "Not bulunmuyor."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 2. SÜTUN: AŞI GEÇMİŞİ */}
                    <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2 border-b pb-2">
                            <Calendar size={20} className="text-green-600" />{" "}
                            Aşılar
                        </h2>
                        <div className="space-y-3 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
                            {vaccines.map((v, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all"
                                >
                                    <span className="font-bold text-slate-700 text-xs">
                                        {v.VaccineName}
                                    </span>
                                    <span className="text-slate-700 text-[13px] font-mono">
                                        {new Date(
                                            v.VaccineDate,
                                        ).toLocaleDateString("tr-TR")}
                                    </span>
                                </div>
                            ))}
                            {vaccines.length === 0 && (
                                <div className="text-center py-10 text-slate-400 italic text-sm">
                                    Henüz aşı kaydı girilmemiş.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3. SÜTUN: BUZAĞILAR */}
                    <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2 border-b pb-2">
                            <Hash size={20} className="text-purple-600" />{" "}
                            Buzağı Bilgisi
                        </h2>
                        <div className="space-y-3 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
                            {calves.map((c, i) => (
                                    <div
                                        key={i}
                                        className={`p-4 rounded-xl border shadow-sm transition-all duration-200
                                            hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5
                                            ${c.DeathDate 
                                                ? "bg-red-50 border-red-100 hover:border-red-300 hover:bg-red-100" 
                                                : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                            }`}
                                    >
                                    <div className="grid grid-cols-1 gap-1 text-xs">
                                        <p>
                                            <span className="font-bold text-slate-500 uppercase text-[10px]">
                                                Küpe:
                                            </span>{" "}
                                            <span className="font-bold">
                                                {c.EarringNo || "-"}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="font-bold text-slate-500 uppercase text-[10px]">
                                                İsim:
                                            </span>{" "}
                                            {c.Name || "-"}
                                        </p>
                                        <p>
                                            <span className="font-bold text-slate-500 uppercase text-[10px]">
                                                Doğum:
                                            </span>{" "}
                                            {new Date(
                                                c.BirthDate,
                                            ).toLocaleDateString("tr-TR")}
                                        </p>
                                        {c.DeathDate && (
                                            <div className="mt-2 pt-2 border-t border-red-200">
                                                <p className="text-red-700 font-bold uppercase text-[9px]">
                                                    Sürüden Ayrıldı
                                                </p>
                                                <p className="text-red-600 italic">
                                                    "{c.Reason || "Sebep Girilmemiş"}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {calves.length === 0 && (
                                <div className="text-center py-10 text-slate-400 italic text-sm">
                                    Doğum kaydı bulunmuyor.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* AKSİYON BUTONLARI */}
                <div className="flex justify-end gap-3 mt-10  pt-6">
                    <button
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                        onClick={() => {
                            //   window.electronAPI.openUpdateAnimal({ animalId: animal.Id, type: animal.Type });
                            //   window.close();
                        }}
                    >
                        <Edit size={18} /> Düzenle
                    </button>
                    <button
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-red-200 transition-all active:scale-95"
                        onClick={() => setIsTrashModalOpen(true)}
                    >
                        <Trash2 size={18} /> Sil
                    </button>
                </div>
            </div>

            {/* SİLME MODALI (Aynı senin istediğin gibi) */}
            {isTrashModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-black text-slate-800 mb-2">
                            Sürüden Ayrılma Formu
                        </h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Bu hayvanı kayıtlardan çıkarmak üzeresiniz.
                        </p>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                                    Ayrılma Tarihi
                                </label>
                                <input
                                    type="date"
                                    value={trashData.deathDate}
                                    onChange={(e) =>
                                        setTrashData({
                                            ...trashData,
                                            deathDate: e.target.value,
                                        })
                                    }
                                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                                    Neden / Açıklama
                                </label>
                                <input
                                    type="text"
                                    placeholder="Örn: Satıldı, Öldü, Kurban..."
                                    value={trashData.reason}
                                    onChange={(e) =>
                                        setTrashData({
                                            ...trashData,
                                            reason: e.target.value,
                                        })
                                    }
                                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsTrashModalOpen(false)}
                                className="flex-1 py-3 font-bold text-slate-400 hover:bg-slate-50 rounded-xl transition-all"
                            >
                                İptal
                            </button>
                            <button
                                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-100 hover:bg-red-700 transition-all"
                                onClick={async () => {
                                    if (!trashData.reason)
                                        return alert("Lütfen neden girin");
                                    //    await window.electronAPI.removeAnimal({ animalId: animal.Id, ...trashData });
                                    window.close();
                                }}
                            >
                                Onayla ve Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
