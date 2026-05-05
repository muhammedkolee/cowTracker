// src/features/cows/CowPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../../components/DataTable";
import GaveBirthModal  from "../../components/GaveBirthModal";
import { Cow } from "../../../shared/interfaces";
import { Info, Edit, Trash2, Baby } from "lucide-react";

export default function CowPage() {
    const [cows, setCows] = useState<Cow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
    const [trashData, setTrashData] = useState({
		Id: -1,
        DeathDate: new Date().toISOString().split("T")[0],
        Reason: "",
    });
    const [birthModal, setBirthModal] = useState<{
        isOpen: boolean;
        cow: Cow | null;
    }>({ isOpen: false, cow: null });
    const navigate = useNavigate();

    const fetchCows = async () => {
        try {
            const data = await window.api.getCows();
            setCows(data);
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
        fetchCows();

        // Refresh listener
        const unsubscribe = window.api.onRefreshData(() => {
            fetchCows();
        });

        return unsubscribe;
    }, []);

    const handleGaveBirth = async (motherId: number, calfData: any) => {
        await window.animalServiceAPI.gaveBirth({
            MotherId: motherId,
            CalfDatas: calfData,
        });
        setBirthModal({ isOpen: false, cow: null });
        fetchCows();
    };

    const cowColumns = [
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
            header: "Cinsi",
            key: "Animal" as any,
            render: (item: Cow) => <span>{item.Animals?.Breed || "-"}</span>,
        },
        {
            header: "Tohumlama T.",
            key: "InseminationDate" as const,
            render: (item: Cow) => {
                return new Date(item.InseminationDate).toLocaleDateString(
                    "tr-TR",
                );
            },
        },
        {
            header: "Doğuracağı T.",
            key: "ExpectedBirthDate" as const,
            sortValue: (item: Cow) => {
                return item.InseminationDate;
            },
            render: (item: Cow) => {
                let date = new Date(item.InseminationDate);
                date.setDate(date.getDate() + 280);
                return date.toLocaleDateString("tr-TR");
            },
        },
        {
            header: "Kalan G.",
            key: "LeftDay" as const,
            sortValue: (item: Cow) => {
                const date = new Date(item.InseminationDate);
                date.setDate(date.getDate() + 280);
                return Math.ceil(
                    (date.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
                );
            },
            render: (item: Cow) => {
                let date = new Date(item.InseminationDate);
                let today = new Date();

                date.setDate(date.getDate() + 280);
                return Math.ceil(
                    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
                );
            },
        },
        // {
        //     header: "Geçen Gün",
        //     key: "PassDay" as const,
        //     render: (item: Cow) => {
        //         let date = new Date(item.InseminationDate);
        //         let today = new Date();
        //         return Math.ceil(
        //             (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
        //         );
        //     },

        // },
        {
            header: "Kuruya Çık. T.",
            key: "DryOffDate" as const,
            sortValue: (item: Cow) => {
                return item.InseminationDate;
            },
            render: (item: Cow) => {
                let date = new Date(item.InseminationDate);
                date.setDate(date.getDate() + 210);
                return date.toLocaleDateString("tr-TR");
            },
        },
        { header: "Boğa Adı", key: "BullName" as const },
        {
            header: "Kontrol T.",
            key: "CheckedDate" as const,
            render: (item: Cow) => {
                return new Date(item.CheckedDate).toLocaleDateString("tr-TR") !=
                    "01.01.1970"
                    ? new Date(item.CheckedDate).toLocaleDateString("tr-TR")
                    : "-";
            },
        },
        {
            header: "Son Doğum T.",
            key: "LastBirthDate" as const,
            render: (item: Cow) => {
                return new Date(item.LastBirthDate).toLocaleDateString("tr-TR") !=
                    "01.01.1970"
                    ? new Date(item.LastBirthDate).toLocaleDateString("tr-TR")
                    : "-";
            },
        },
        {
            header: "Not",
            key: "AnimalNote" as any,
            sortable: false,
            render: (item: Cow) => <span>{item.Animals?.Note}</span>,
        },
        {
            header: "İşlemler",
            key: "actions" as const,
            sortable: false,
            render: (item: Cow) => {
                const buttons = [
                    <button
                        onClick={() =>
                            window.api.openAnimalDetailWindow(item.Id)
                        }
                        className="text-blue-400 hover:cursor-pointer hover:text-blue-300 transition-colors p-1 rounded"
                        title="Bilgi"
                    >
                        <Info size={24} />
                    </button>,

                    <button
                        onClick={() => window.api.openUpdateAnimalWindow(item.Id)}
                        className="text-purple-400 hover:cursor-pointer hover:text-purple-500 transition-colors p-1  rounded"
                        title="Düzenle"
                    >
                        <Edit size={24} />
                    </button>,

                    <button
                        onClick={() => setBirthModal({ isOpen: true, cow: item })}
                        className="text-green-400 hover:cursor-pointer hover:text-green-300 transition-colors p-1 rounded"
                        title="Doğurdu Olarak İşaretle"
                    >
                        <Baby size={24} />
                    </button>,

                    <button
                        onClick={() => {
                            trashData.Id = item.Id;
                            setIsTrashModalOpen(true);
                        }}
                        className="text-red-600 hover:cursor-pointer hover:text-red-700 transition-colors p-1 rounded"
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

    console.log("Tanımlanan Kolon Sayısı:", cowColumns.length);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <div className="text-white animate-pulse">
                    İnek verileri yükleniyor...
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
                    Toplam {cows.length} gebe inek var.
                </h1>
            </header>

            <div className="flex-1 min-h-0">
                <DataTable
                    data={cows}
                    columns={cowColumns}
                    maxHeight="calc(100vh - 160px)"
                    rowClassName={(item: Cow) => {
                        const daysLeft = Math.ceil(
                            (new Date(item.InseminationDate).setDate(
                                new Date(item.InseminationDate).getDate() + 280,
                            ) -
                                Date.now()) /
                                (1000 * 60 * 60 * 24),
                        );
                        if (daysLeft < 0) return "bg-red-400";
                        if (daysLeft < 20) return "bg-yellow-400";
                        if (daysLeft < 60) return "bg-green-400";
                        return "bg-blue-600";
                    }}
                />
            </div>

            <footer className="mt-4 text-slate-500 text-xs text-right">
                <button onClick={() => window.api.openAddAnimalWindow("cow")} className="bg-green-600 hover:cursor-pointer hover:bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium transition">
                    Yeni İnek Ekle
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
                                className="flex-1 py-3 font-bold text-slate-400 hover:cursor-pointer hover:bg-slate-300 rounded-xl transition-all"
                            >
                                İptal
                            </button>
                            <button
                                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:cursor-pointer shadow-lg shadow-red-100 hover:bg-red-700 transition-all"
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
            <GaveBirthModal
                isOpen={birthModal.isOpen}
                motherId={birthModal.cow?.Id ?? -1}
                motherName={birthModal.cow?.Name}
                motherEarringNo={birthModal.cow?.EarringNo}
                onConfirm={handleGaveBirth}
                onCancel={() => setBirthModal({ isOpen: false, cow: null })}
            />
        </div>
    );
}
