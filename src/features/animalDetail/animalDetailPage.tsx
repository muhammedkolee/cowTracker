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
        window.animalDetailAPI.receiveData(
            (data: { animal: any; vaccines: any[]; calves: any[] }) => {
                console.log(data)
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
                    <h2 className="text-xl font-bold text-gray-600">Veriler Getiriliyor...</h2>
                </div>
            </div>
        );
    }

    // --- Yardımcı Fonksiyonlar ---
    const dayDiff = (from: string, to?: string) => {
        const f = new Date(from).getTime();
        const t = to ? new Date(to).getTime() : Date.now();
        return Math.ceil((t - f) / (1000 * 60 * 60 * 24));
    };

    const addDays = (dateStr: string, days: number) => {
        const d = new Date(dateStr);
        d.setDate(d.getDate() + days);
        return d.toLocaleDateString("tr-TR");
    };

    const fmt = (dateStr: string) =>
        dateStr ? new Date(dateStr).toLocaleDateString("tr-TR") : "-";

    // --- Tüm Hayvanlar için Ortak Satır ---
    const InfoRow = ({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) => (
        <p className="flex justify-between items-center">
            <span className="font-bold">{label}:</span>
            <span className={highlight ? "font-black text-red-600" : ""}>{value}</span>
        </p>
    );

    // --- Türe Özel Ek Bilgiler ---
    const renderTypeSpecific = () => {
        switch (animal.Type) {
            case "cow": {
                const daysPregnant = animal.InseminationDate ? dayDiff(animal.InseminationDate) : null;
                const daysLeft = animal.InseminationDate ? 280 - (daysPregnant ?? 0) : null;
                const emptyDays = animal.InseminationDate && animal.LastBirthDate
                    ? dayDiff(animal.LastBirthDate, animal.InseminationDate)
                    : null;

                return (
                    <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 space-y-2">
                        <p className="text-blue-800 font-bold text-xs uppercase mb-2">Gebelik Durumu</p>
                        <InfoRow label="Tohumlama Tarihi" value={fmt(animal.InseminationDate)} />
                        <InfoRow
                            label="Doğurmaya Kalan"
                            value={daysLeft !== null ? `${daysLeft} Gün` : "-"}
                            highlight={daysLeft !== null && daysLeft < 30}
                        />
                        <InfoRow
                            label="Kaç Günlük Hamile"
                            value={daysPregnant !== null ? `${daysPregnant} Gün` : "-"}
                        />
                        <InfoRow label="Tahmini Doğum" value={animal.InseminationDate ? addDays(animal.InseminationDate, 280) : "-"} />
                        <InfoRow label="Gebelik Kontrol" value={fmt(animal.CheckedDate)} />
                        <hr className="border-blue-200" />
                        <InfoRow label="Son Doğurduğu" value={fmt(animal.LastBirthDate)} />
                        <InfoRow
                            label="Boş Gün Sayısı"
                            value={emptyDays !== null ? `${emptyDays} Gün` : "-"}
                        />
                    </div>
                );
            }

            case "heifer": {
                const emptyDays = animal.LastBirthDate ? dayDiff(animal.LastBirthDate) : null;

                return (
                    <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-100 space-y-2">
                        <p className="text-orange-800 font-bold text-xs uppercase mb-2">Düve Bilgisi</p>
                        <InfoRow label="Son Doğurduğu" value={fmt(animal.LastBirthDate)} />
                        <InfoRow
                            label="Boş Gün Sayısı"
                            value={emptyDays !== null ? `${emptyDays} Gün` : "-"}
                            highlight={emptyDays !== null && emptyDays > 120}
                        />
                    </div>
                );
            }

            case "calf": {
                const ageDays = animal.BirthDate ? dayDiff(animal.BirthDate) : null;
                const weaningDaysLeft = animal.BirthDate ? 90 - (ageDays ?? 0) : null;
                const genderLabel = animal.Gender === true || animal.Gender === "true"
                    ? "Dişi"
                    : animal.Gender === false || animal.Gender === "false"
                        ? "Erkek"
                        : "-";

                return (
                    <div className="mt-4 p-3 bg-purple-50 rounded-xl border border-purple-100 space-y-2">
                        <p className="text-purple-800 font-bold text-xs uppercase mb-2">Buzağı Bilgisi</p>
                        <InfoRow label="Cinsiyet" value={genderLabel} />
                        <InfoRow
                            label="Kaç Günlük"
                            value={ageDays !== null ? `${ageDays} Gün` : "-"}
                        />
                        <InfoRow
                            label="Sütten Kesilme"
                            value={animal.BirthDate ? addDays(animal.BirthDate, 90) : "-"}
                        />
                        <InfoRow
                            label="Sütten Kesmeye Kalan"
                            value={weaningDaysLeft !== null ? `${weaningDaysLeft < 0 ? 'Sütten Kesildi' : `${weaningDaysLeft} Gün`}` : "-"}
                            highlight={weaningDaysLeft !== null && weaningDaysLeft < 10}
                        />
                    </div>
                );
            }

            default:
                return null;
        }
    };

    const typeLabels: Record<string, string> = {
        cow: "İnek Bilgisi",
        heifer: "Düve Bilgisi",
        bull: "Boğa Bilgisi",
        calf: "Buzağı Bilgisi",
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 font-sans">
            <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl p-8 border border-gray-100">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase">
                        {animal.EarringNo || animal.Name || "İsimsiz"}
                    </h1>
                    <div className="h-1 w-20 bg-blue-600 mx-auto mt-2 rounded-full" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 1. SÜTUN: GENEL BİLGİLER */}
                    <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2 border-b pb-2">
                            <InfoIcon size={20} className="text-blue-600" />
                            {typeLabels[animal.Type] || "Hayvan Bilgisi"}
                        </h2>

                        <div className="space-y-4 text-sm text-slate-600">
                            <InfoRow label="İsim" value={animal.Name || "-"} />
                            <InfoRow label="Doğum Tarihi" value={fmt(animal.BirthDate)} />
                            <InfoRow label="Cins" value={animal.Breed || "-"} />
                            <hr className="border-slate-200" />
                            <InfoRow label="Anne Küpe" value={animal.MotherEarringNo || "-"} />
                            <InfoRow label="Anne İsim" value={animal.MotherName || "-"} />

                            {/* Türe özel ek bilgiler */}
                            {renderTypeSpecific()}

                            <hr className="border-slate-200" />
                            <div className="bg-white p-3 rounded-lg border border-slate-200">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Notlar</p>
                                <p className="text-slate-700 italic">{animal.Note || "Not bulunmuyor."}</p>
                            </div>
                        </div>
                    </div>

                    {/* 2. SÜTUN: AŞI GEÇMİŞİ */}
                    <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2 border-b pb-2">
                            <Calendar size={20} className="text-green-600" /> Aşılar
                        </h2>
                        <div className="space-y-3 overflow-y-auto max-h-112.5 pr-2">
                            {vaccines.length > 0 ? vaccines.map((v, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all"
                                >
                                    <span className="font-bold text-slate-700 text-xs">{v.VaccineName}</span>
                                    <span className="text-slate-700 text-[13px] font-mono">
                                        {fmt(v.VaccineDate)}
                                    </span>
                                </div>
                            )) : (
                                <div className="text-center py-10 text-slate-400 italic text-sm">
                                    Henüz aşı kaydı girilmemiş.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3. SÜTUN: BUZAĞILAR */}
                    <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2 border-b pb-2">
                            <Hash size={20} className="text-purple-600" /> Buzağı Bilgisi
                        </h2>
                        <div className="space-y-3 overflow-y-auto max-h-112.5 pr-2">
                            {calves.length > 0 ? calves.map((c, i) => (
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
                                            <span className="font-bold text-slate-500 uppercase text-[10px]">Küpe: </span>
                                            <span className="font-bold">{c.EarringNo || "-"}</span>
                                        </p>
                                        <p>
                                            <span className="font-bold text-slate-500 uppercase text-[10px]">İsim: </span>
                                            {c.Name || "-"}
                                        </p>
                                        <p>
                                            <span className="font-bold text-slate-500 uppercase text-[10px]">Doğum: </span>
                                            {fmt(c.BirthDate)}
                                        </p>
                                        {c.DeathDate && (
                                            <div className="mt-2 pt-2 border-t border-red-200">
                                                <p className="text-red-700 font-bold uppercase text-[9px]">Sürüden Ayrıldı</p>
                                                <p className="text-red-600 italic">"{c.Reason || "Sebep Girilmemiş"}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10 text-slate-400 italic text-sm">
                                    Doğum kaydı bulunmuyor.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* AKSİYON BUTONLARI */}
                <div className="flex justify-end gap-3 mt-10 pt-6">
                    <button
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                        onClick={() => {}}
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

            {/* SİLME MODALI */}
            {isTrashModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
                        <h3 className="text-xl font-black text-slate-800 mb-2">Sürüden Ayrılma Formu</h3>
                        <p className="text-sm text-slate-500 mb-6">Bu hayvanı kayıtlardan çıkarmak üzeresiniz.</p>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Ayrılma Tarihi</label>
                                <input
                                    type="date"
                                    value={trashData.deathDate}
                                    onChange={(e) => setTrashData({ ...trashData, deathDate: e.target.value })}
                                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Neden / Açıklama</label>
                                <input
                                    type="text"
                                    placeholder="Örn: Satıldı, Öldü, Kurban..."
                                    value={trashData.reason}
                                    onChange={(e) => setTrashData({ ...trashData, reason: e.target.value })}
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
                                    if (!trashData.reason) return alert("Lütfen neden girin");
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