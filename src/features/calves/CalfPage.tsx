// src/features/cows/CowPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../../components/DataTable";
import { Calf } from "../../../shared/interfaces";
import { Info, Edit, Trash2 } from "lucide-react";

export default function CalfPage() {
    const [calves, setCalves] = useState<Calf[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
    const [trashData, setTrashData] = useState({
		Id: -1,
        DeathDate: new Date().toISOString().split("T")[0],
        Reason: "",
    });
    const navigate = useNavigate();

    const fetchCalves = async () => {
        try {
            const data = await window.api.getCalves();
            setCalves(data);
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
        fetchCalves();

        // Refresh listener
        const unsubscribe = window.api.onRefreshData(() => {
            fetchCalves();
        });

        return unsubscribe;
    }, []);

    const calfColumns = [
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
            key: "AnimalBreed" as any,
            render: (item: Calf) => <span>{item.Animals?.Breed || "-"}</span>,
        },
        {
            header: "Cinsiyeti",
            key: "Gender" as const,
            render: (item: Calf) => {
                if (item.Gender) return "Dişi";
                return "Erkek";
            },
        },
        {
            header: "Doğum Tar.",
            key: "BirthDate" as const,
            render: (item: Calf) => {
                return new Date(item.BirthDate).toLocaleDateString("tr-TR");
            },
        },
        {
            header: "Kaç Günlük",
            key: "AgeDay" as const,
            sortValue: (item: Calf) => item.BirthDate,
            render: (item: Calf) => {
                let date = new Date(item.BirthDate);
                let today = new Date();

                return Math.ceil(
                    (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
                );
            },
        },
        {
            header: "Sütten Kesme Tar.",
            key: "CutMilkDate" as const,
            sortValue: (item: Calf) => item.BirthDate,
            render: (item: Calf) => {
                let date = new Date(item.BirthDate);

                date.setDate(date.getDate() + 90);
                return date.toLocaleDateString("tr-TR");
            },
        },
        {
            header: "Sütten Kesmeye Kal. Gün",
            key: "CutMilkDay" as const,
            sortValue: (item: Calf) => item.BirthDate,
            render: (item: Calf) => {
                let date = new Date(item.BirthDate);
                date.setDate(date.getDate() + 90);
                let today = new Date();

                return Math.ceil(
                    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
                ) < 0
                    ? "-"
                    : Math.ceil(
                          (date.getTime() - today.getTime()) /
                              (1000 * 60 * 60 * 24),
                      );
            },
        },
        {
            header: "Anne Küpe No.",
            key: "MotherEarringNo" as const,
            sortValue: (item: Calf) => item.Animals?.MotherEarringNo,
            render: (item: Calf) => item.Animals?.MotherEarringNo,
        },
        {
            header: "Anne Adı",
            key: "MotherName" as any,
            sortValue: (item: Calf) => item.Animals?.MotherName,
            render: (item: Calf) => item.Animals?.MotherName,
        },
        {
            header: "Not",
            key: "Note" as any,
            sortable: false,
            render: (item: Calf) => item.Animals?.Note,
        },
        {
            header: "İşlemler",
            key: "actions" as const,
            sortable: false,
            render: (item: Calf) => (
                <div className="flex flex-wrap gap-2">
                    {/* Bilgi Butonu */}
                    <button
                        onClick={() =>
                            window.api.openAnimalDetailWindow(item.Id)
                        }
                        className="text-blue-600 hover:cursor-pointer hover:text-blue-300 transition-colors p-1 hover:bg-blue-400/10 rounded"
                        title="Bilgi"
                    >
                        <Info size={24} />
                    </button>

                    {/* Düzenleme Butonu */}
                    <button
                        onClick={() => window.api.openUpdateAnimalWindow(item.Id)}
                        className="text-amber-400 hover:cursor-pointer hover:text-amber-300 transition-colors p-1 hover:bg-amber-400/10 rounded"
                        title="Düzenle"
                    >
                        <Edit size={24} />
                    </button>

                    {/* Sil Butonu */}
                    <button
                        onClick={() => {(trashData.Id = item.Id); setIsTrashModalOpen(true)}}
                        className="text-red-500 hover:cursor-pointer hover:text-red-300 transition-colors p-1 hover:bg-red-400/10 rounded"
                        title="Çöp Kutusuna Taşı"
                    >
                        <Trash2 size={24} />
                    </button>
                </div>
            ),
        },
    ];

    console.log("Tanımlanan Kolon Sayısı:", calfColumns.length);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <div className="text-white animate-pulse">
                    Buzağı verileri yükleniyor...
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
                    Toplam {calves.length} buzağı var.
                </h1>
            </header>

            <div className="flex-1 min-h-0">
                {" "}
                {/* Tablonun sığması için flex-1 önemli */}
                <DataTable
                    data={calves}
                    columns={calfColumns}
                    maxHeight="calc(100vh - 160px)"
                    rowClassName={(item: Calf) => {
                        if (item.Gender) return "bg-pink-400";
                        return "bg-blue-400";
                    }}
                />
            </div>

            <footer className="mt-4 text-slate-500 text-xs text-right">
                <button
                    onClick={() => window.api.openAddAnimalWindow("calf")}
                    className="bg-green-600 hover:cursor-pointer hover:bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                    Yeni Buzağı Ekle
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
                                className="flex-1 py-3 font-bold hover:cursor-pointer text-slate-400 hover:bg-slate-300 rounded-xl transition-all"
                            >
                                İptal
                            </button>
                            <button
                                className="flex-1 py-3 bg-red-600 hover:cursor-pointer text-white font-bold rounded-xl shadow-lg shadow-red-100 hover:bg-red-700 transition-all"
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
        </div>
    );
}
