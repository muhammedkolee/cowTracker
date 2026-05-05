// src/features/cows/CowPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../../components/DataTable";
import InseminationModal from "../../components/InseminationModal";
import { Heifer } from "../../../shared/interfaces";
import { Info, Edit, Trash2, Baby } from "lucide-react";

export default function HeiferPage() {
    const [heifers, setHeifers] = useState<Heifer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
    const [trashData, setTrashData] = useState({
		Id: -1,
        DeathDate: new Date().toISOString().split("T")[0],
        Reason: "",
    });
    const [inseminationModal, setInseminationModal] = useState<{
        isOpen: boolean;
        heifer: Heifer | null;
    }>({ isOpen: false, heifer: null });
    const navigate = useNavigate();

    const fetchHeifers = async () => {
        try {  
            const data = await window.api.getHeifers();
            setHeifers(data);
        } catch (err: any) {
            console.error("Veri çekme hatası:", err);
            setError("Veriler yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // İlk yükleme
        setLoading(true);
        fetchHeifers();

        // Refresh listener
        const unsubscribe = window.api.onRefreshData(() => {
            fetchHeifers();
        });

        return unsubscribe;
    }, []);

    const handleApplyInsemination = async (data: any) => {
        await window.animalServiceAPI.applyInsemination(data);
        setInseminationModal({ isOpen: false, heifer: null });
        fetchHeifers();
    };

    const heiferColumns = [
        {
            header: "#",
            key: "index" as const,
            sortable: false,
            render: (_: any, idx: number) => (
                <span className="text-slate-900">{idx + 1}-)</span>
            ),
        },
        { header: "Küpe No", key: "EarringNo" as const },
        { header: "İsim", key: "Name" as const },
        {
            header: "Son Doğurduğu Tar.",
            key: "LastBirthDate" as const,
            render: (item: Heifer) => {
                return item.LastBirthDate
                    ? new Date(item.LastBirthDate).toLocaleDateString("tr-TR")
                    : "-";
            },
        },
        {
            header: "Boş Gün",
            key: "EmptyDay" as const,
            sortValue: (item: Heifer) => item.LastBirthDate,
            render: (item: Heifer) => {
                if (item.LastBirthDate) {
                    let date = new Date(item.LastBirthDate);
                    let today = new Date();

                    return Math.ceil(
                        (today.getTime() - date.getTime()) /
                            (1000 * 60 * 60 * 24),
                    );
                }
                return "-";
            },
        },
        {
            header: "Cinsi",
            key: "Breed" as any,
			sortValue: (item: Heifer) => (item.Animals.Breed),
            render: (item: Heifer) => item.Animals?.Breed,
        },
        {
            header: "Not",
            key: "Note" as any,
            sortable: false,
            render: (item: Heifer) => item.Animals?.Note,
        },
        {
            header: "İşlemler",
            sortable: false,
            key: "actions" as const,
            render: (item: Heifer) => {
                const buttons = [
                    <button
                        onClick={() =>
                            window.api.openAnimalDetailWindow(item.Id)
                        }
                        className="text-blue-700 hover:cursor-pointer hover:text-blue-300 transition-colors p-1 rounded"
                        title="Bilgi"
                    >
                        <Info size={24} />
                    </button>,

                    <button
                        onClick={() => window.api.openUpdateAnimalWindow(item.Id)}
                        className="text-purple-700 hover:cursor-pointer hover:text-purple-500 transition-colors p-1  rounded"
                        title="Düzenle"
                    >
                        <Edit size={24} />
                    </button>,

                    <button
                        onClick={() => setInseminationModal({ isOpen: true, heifer: item })}
                        className="text-green-700 hover:cursor-pointer hover:text-green-300 transition-colors p-1 rounded"
                        title="Doğurdu Olarak İşaretle"
                    >
                        <Baby size={24} />
                    </button>,

                    <button
                        onClick={() => {(trashData.Id = item.Id); setIsTrashModalOpen(true)}}
                        className="text-red-700 hover:cursor-pointer hover:text-red-900 transition-colors p-1 rounded"
                        title="Çöp Kutusuna Taşı"
                    >
                        <Trash2 size={24} />
                    </button>,
                ];

                return (
                    <div
                        className={`grid gap-1 ${buttons.length === 4 ? "grid-cols-2" : "grid-cols-3"}`}
                    >
                        {buttons}
                    </div>
                );
            },
        },
    ];

    console.log("Tanımlanan Kolon Sayısı:", heiferColumns.length);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <div className="text-white animate-pulse">
                    Düve ve boş inek verileri yükleniyor...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-red-500 bg-slate-950 h-screen">
                {error}
            </div>
        );
    }

    return (
        <div className="p-4 w-full h-screen flex flex-col bg-slate-200">
            <header className="flex justify-center items-center mb-6">
                <h1 className="text-slate-900 text-xl font-bold">
                    Toplam {heifers.length} boş inek/düve var.
                </h1>
            </header>

            <div className="flex-1 min-h-0">
                <DataTable
                    data={heifers}
                    columns={heiferColumns}
                    maxHeight="calc(100vh - 160px)"
                    rowClassName={(item: Heifer) => {
                        if (item.LastBirthDate) {
                            const daysLeft = Math.ceil(
                                (new Date(item.LastBirthDate).setDate(
                                    new Date(item.LastBirthDate).getDate() +
                                        280,
                                ) -
                                    Date.now()) /
                                    (1000 * 60 * 60 * 24),
                            );
                            if (daysLeft < 0) return "bg-purple-400";
                            if (daysLeft < 20) return "bg-yellow-400";
                            if (daysLeft < 60) return "bg-green-400";
                            return "bg-red-500";
                        }
                        return "bg-blue-400";
                    }}
                />
            </div>

            <footer className="mt-4 text-slate-500 text-xs text-right">
                <button onClick={() => window.api.openAddAnimalWindow("heifer")} className="bg-green-600 hover:cursor-pointer hover:bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium transition">
                    Yeni Düve Ekle
                </button>
                <button
                    onClick={() => navigate("/")}
                    className="ml-3 bg-blue-600 hover:cursor-pointer hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                    Ana Menü
                </button>
            </footer>
            {/* SİLME MODALI */}
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
                                    value={trashData.DeathDate}
                                    onChange={(e) =>
                                        setTrashData({
                                            ...trashData,
                                            DeathDate: e.target.value,
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
                                    value={trashData.Reason}
                                    onChange={(e) =>
                                        setTrashData({
                                            ...trashData,
                                            Reason: e.target.value,
                                        })
                                    }
                                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsTrashModalOpen(false)}
                                className="flex-1 py-3 hover:cursor-pointer font-bold text-slate-400 hover:bg-slate-300 rounded-xl transition-all"
                            >
                                İptal
                            </button>
                            <button
                                className="flex-1 py-3 hover:cursor-pointer bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-100 hover:bg-red-700 transition-all"
                                onClick={async () => {
                                    if (!trashData.Reason)
                                        return alert("Lütfen neden girin");
                                    await window.animalServiceAPI.removeAnimal(trashData);
                                    setIsTrashModalOpen(false);
                                }}
                            >
                                Çöp Kutusuna Taşı
                            </button>
                        </div>
                    </div>
                </div>               
            )}
            <InseminationModal
                isOpen={inseminationModal.isOpen}
                animal={inseminationModal.heifer ? {
                    Id: inseminationModal.heifer.Id,
                    Name: inseminationModal.heifer.Name,
                    EarringNo: inseminationModal.heifer.EarringNo,
                    LastBirthDate: inseminationModal.heifer.LastBirthDate,
                } : null}
                onConfirm={handleApplyInsemination}
                onCancel={() => setInseminationModal({ isOpen: false, heifer: null })}
            />
        </div>
    );
}
