// src/features/cows/CowPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../../components/DataTable";
import { Animal } from "../../../shared/interfaces";
import { Info, Edit, Trash2 } from "lucide-react";

const typeTranslations: Record<string, string> = {
    cow: "İnek",
    heifer: "Düve",
    bull: "Boğa",
    calf: "Buzağı",
};

export default function AnimalPage() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
    const [trashData, setTrashData] = useState({
		Id: -1,
        DeathDate: new Date().toISOString().split("T")[0],
        Reason: "",
    });
    const navigate = useNavigate();

    const fetchAnimals = async () => {
        try {
            
            const data = await window.api.getAnimals();
            setAnimals(data);
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
        fetchAnimals();

        // Refresh listener
        const unsubscribe = window.api.onRefreshData(() => {
            fetchAnimals();
        });

        return unsubscribe;
    }, []);

    const animalColumns = [
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
            header: "Doğum Tar.",
            key: "BirthDate" as const,
            render: (item: Animal) => {
                return new Date(item.BirthDate).toLocaleDateString("tr-TR");
            },
        },
        { header: "Anne Küpe No.", key: "MotherEarringNo" as const },
        { header: "Anne İsim", key: "MotherName" as const },
        {
            header: "Türü",
            key: "Type" as const,
            render: (item: Animal) => {
                return typeTranslations[item.Type || "-"];
            },
        },
        { header: "Cinsi", key: "Breed" as const },
        { header: "Not", key: "Note" as const, sortable: false },
        {
            header: "İşlemler",
            key: "actions" as const,
            sortable: false,
            render: (item: Animal) => (
                <div className="flex items-center justify-center gap-3">
                    {/* Bilgi Butonu */}
                    <button
                        onClick={() =>
                            window.api.openAnimalDetailWindow(item.Id)
                        }
                        className="text-blue-400 hover:cursor-pointer hover:text-blue-300 transition-colors p-1 hover:bg-blue-400/10 rounded"
                        title="Bilgi"
                    >
                        <Info size={24} />
                    </button>

                    {/* Düzenleme Butonu */}
                    <button
					    onClick={() => window.api.openUpdateAnimalWindow(item.Id)}
                        className="text-yellow-300 hover:cursor-pointer hover:text-amber-300 transition-colors p-1 hover:bg-amber-400/10 rounded"
                        title="Düzenle"
                    >
                        <Edit size={24} />
                    </button>

                    {/* Sil Butonu */}
                    <button
						onClick={() => {(trashData.Id = item.Id); setIsTrashModalOpen(true)}}
                        className="text-rose-600 hover:cursor-pointer hover:text-red-500 transition-colors p-1 hover:bg-red-400/10 rounded"
                        title="Çöp Kutusuna Taşı"
                    >
                        <Trash2 size={24} />
                    </button>
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <div className="text-white animate-pulse">
                    Hayvan verileri yükleniyor...
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
                    Toplam {animals.length} hayvan var.
                </h1>
            </header>

            <div className="flex-1 min-h-0">
                {" "}
                {/* Tablonun sığması için flex-1 önemli */}
                <DataTable
                    data={animals}
                    columns={animalColumns}
                    maxHeight="calc(100vh - 160px)"
                    rowClassName={(item: Animal) => {
                        if (item.Type == "bull") return "bg-red-400";
                        if (item.Type == "calf") return "bg-yellow-400";
                        if (item.Type == "cow") return "bg-green-400";
                        return "bg-blue-600";
                    }}
                />
            </div>

            <footer className="mt-4 text-slate-500 text-xs text-right">
                <button
                    onClick={() => window.api.openAddAnimalWindow("")}
                    className="bg-green-600 hover:cursor-pointer hover:bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                    Yeni Hayvan Ekle
                </button>
                <button
                    onClick={() => navigate("/")}
                    className="ml-3 bg-blue-600 hover:cursor-pointer hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                    Ana Menü
                </button>
            </footer>
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
                                className="flex-1 py-3 font-bold hover:bg-slate-300 text-slate-400 hover:cursor-pointer rounded-xl transition-all"
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
                                    fetchAnimals();
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
