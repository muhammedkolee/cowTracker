import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../../components/DataTable";
import { Undo2, Trash2 } from "lucide-react";
import ConfirmModal from "../../components/ConfirmModal";

interface DeletedAnimal {
    Id: number;
    EarringNo: string;
    Name: string;
    MotherEarringNo: string;
    MotherName: string;
    Reason: string;
    BirthDate: string;
    DeathDate: string;
    Type: string;
    Breed: string;
    Note: string;
}

const typeTranslations: Record<string, string> = {
    cow: "İnek",
    heifer: "Düve",
    bull: "Dana",
    calf: "Buzağı",
};

export default function DeletedAnimalsPage() {
    const [data, setData] = useState<DeletedAnimal[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [modal, setModal] = useState<{
        isOpen: boolean;
        variant: "restore" | "permanentDelete";
        animal: DeletedAnimal | null;
    }>({ isOpen: false, variant: "restore", animal: null });

    const handleRestore = (animal: DeletedAnimal) => {
        setModal({ isOpen: true, variant: "restore", animal });
    };

    const handlePermanentDelete = (animal: DeletedAnimal) => {
        setModal({ isOpen: true, variant: "permanentDelete", animal });
    };

    const handleModalConfirm = async () => {
        if (!modal.animal) return;
        setModal((m) => ({ ...m, isOpen: false }));
        if (modal.variant === "restore") {
            await window.deathAnimalsAPI.restoreAnimal(modal.animal.Id);
        } else {
            await window.deathAnimalsAPI.permanentDelete({ id: modal.animal.Id, type: modal.animal.Type });
        }
        fetchData();
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await window.deathAnimalsAPI.getDeletedAnimals();
            setData(Array.isArray(result) ? result : []);
        } catch (err) {
            console.error("Silinen hayvanlar yüklenemedi:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns: any[] = [
        {
            header: "Id",
            key: "Id",
            noTruncate: true,
            sortable: true,
        },
        {
            header: "Küpe Numarası",
            key: "EarringNo",
            render: (item: DeletedAnimal) => item.EarringNo || <span className="italic text-gray-400">-</span>,
        },
        {
            header: "İsim",
            key: "Name",
            render: (item: DeletedAnimal) => item.Name || <span className="italic text-gray-400">-</span>,
        },
        {
            header: "Anne Küpe No",
            key: "MotherEarringNo",
            render: (item: DeletedAnimal) => item.MotherEarringNo || <span className="italic text-gray-400">-</span>,
        },
        {
            header: "Anne Adı",
            key: "MotherName",
            render: (item: DeletedAnimal) => item.MotherName || <span className="italic text-gray-400">-</span>,
        },
        {
            header: "Doğum Tarihi",
            key: "BirthDate",
            sortValue: (item: DeletedAnimal) => new Date(item.BirthDate).getTime(),
            render: (item: DeletedAnimal) =>
                item.BirthDate
                    ? new Date(item.BirthDate).toLocaleDateString("tr-TR")
                    : "-",
        },
        {
            header: "Tür",
            key: "Type",
            render: (item: DeletedAnimal) => typeTranslations[item.Type] || item.Type || "-",
        },
        {
            header: "Cinsi",
            key: "Breed",
            render: (item: DeletedAnimal) => item.Breed || "-",
        },
        {
            header: "Silinme Tarihi",
            key: "DeathDate",
            sortValue: (item: DeletedAnimal) => new Date(item.DeathDate).getTime(),
            render: (item: DeletedAnimal) =>
                item.DeathDate
                    ? new Date(item.DeathDate).toLocaleDateString("tr-TR")
                    : "-",
        },
        {
            header: "Silinme Nedeni",
            key: "Reason",
            wrap: true,
            render: (item: DeletedAnimal) => item.Reason || <span className="italic text-gray-400">-</span>,
        },
        {
            header: "İşlemler",
            key: "actions",
            sortable: false,
            render: (item: DeletedAnimal) => {
                const buttons = [
                    <button
                        onClick={() => handleRestore(item)}
                        className="text-green-600 hover:text-green-500 transition-colors p-1 hover:bg-green-400/10 rounded cursor-pointer"
                        title="Geri Al"
                    >
                        <Undo2 size={20} />
                    </button>,
                    <button
                        onClick={() => handlePermanentDelete(item)}
                        className="text-red-500 hover:text-red-400 transition-colors p-1 hover:bg-red-400/10 rounded cursor-pointer"
                        title="Kalıcı Sil"
                    >
                        <Trash2 size={20} />
                    </button>,
                ];
                return (
                    <div className={`grid gap-1 grid-cols-${buttons.length}`}>
                        {buttons}
                    </div>
                );
            },
        },
    ];

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <div className="text-white animate-pulse">Veriler yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="p-4 w-full h-screen flex flex-col bg-slate-200">
            <header className="flex justify-center items-center mb-6">
                <h1 className="text-red-600 text-xl font-bold">
                    Arşivde toplam {data.length} silinmiş kayıt var.
                </h1>
            </header>

            <div className="flex-1 min-h-0">
                <DataTable
                    data={data}
                    columns={columns}
                    maxHeight="calc(100vh - 130px)"
                    rowClassName={() => "bg-green-100"}
                />
            </div>

            <footer className="mt-4 text-right">
                <button
                    onClick={() => navigate("/")}
                    className="bg-blue-600 hover:bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                    Ana Menü
                </button>
            </footer>
            <ConfirmModal
                isOpen={modal.isOpen}
                variant={modal.variant}
                earringNo={modal.animal?.EarringNo}
                name={modal.animal?.Name}
                onConfirm={handleModalConfirm}
                onCancel={() => setModal((m) => ({ ...m, isOpen: false }))}
            />
        </div>
    );
}