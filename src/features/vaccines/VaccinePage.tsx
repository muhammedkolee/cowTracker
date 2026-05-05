import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { DataTable } from "../../components/DataTable";
import { Vaccine } from "../../../shared/interfaces";

var c = 0;

export default function VaccinePage() {
    const [data, setData] = useState<any[]>([]);
    const [vaccineNames, setVaccineNames] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    const filteredData = useMemo(() => {
        if (!search.trim()) return data;
        const q = search.toLowerCase();
        return data.filter(
            (row) =>
                row.Animals?.EarringNo?.toLowerCase().includes(q) ||
                row.Animals?.Name?.toLowerCase().includes(q),
        );
    }, [data, search]);

    const fetchAll = async () => {
        try {
            const allVaccines: Vaccine[] = await window.api.getVaccines();
            const names: string[] = await window.api.getVaccinesName();
            setVaccineNames(names);

            const uniqueAnimalIds = [
                ...new Set(allVaccines.map((v) => v.AnimalId)),
            ];

            const pivotedData = uniqueAnimalIds.map((animalId) => {
                const thisAnimalVaccines = allVaccines.filter(
                    (v) => v.AnimalId === animalId,
                );
                const row: any = {
                    AnimalId: animalId,
                    // Animals nesnesini de taşı
                    Animals: thisAnimalVaccines[0]?.Animals,
                };
                names.forEach((vName) => {
                    row[vName] = thisAnimalVaccines
                        .filter((v) => v.VaccineName === vName)
                        .map((v) => ({ id: v.Id, date: v.VaccineDate }));
                });
                return row;
            });

            setData(pivotedData);
        } catch (err) {
            console.error("Aşı listesi yüklenemedi:", err);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        setLoading(true);
        fetchAll();

        // Refresh listener
        const unsubscribe = window.api.onRefreshData(() => {
            fetchAll();
        });

        return unsubscribe;
    }, []);

    // Sabit kolonlar
    const staticColumns: any[] = [
        {
            header: "#",
            key: "index",
            sortable: false,
            noTruncate: true,
            render: (_: any, idx: number) => (
                <span className="text-slate-900">{idx + 1}-)</span>
            ),
        },
        {
            header: "Küpe No",
            key: "EarringNo",
            sortValue: (item: any) => item.Animals?.EarringNo ?? "",
            render: (item: any) => (
                <span>{item.Animals?.EarringNo ?? "-"}</span>
            ),
        },
        {
            header: "İsim",
            key: "Name",
            sortValue: (item: any) => item.Animals?.Name ?? "",
            render: (item: any) => <span>{item.Animals?.Name ?? "-"}</span>,
        },
    ];

    // Dinamik aşı kolonları
    const vaccineColumns: any[] = vaccineNames.map((name) => ({
        header: name,
        key: name,
        sortable: false,
        render: (item: any) => (
            <div className="flex flex-col gap-1 items-center">
                {item[name] && item[name].length > 0 ? (
                    item[name].map((v: any) => (
                        <button
                            onClick={() => { 
                                window.vaccineAPI.deleteVaccine(v.id)
                            }}
                            key={v.id}
                            className="hover:bg-green-600/60 px-2 py-1 rounded text-s font-bold flex items-center gap-2 transition"
                        >
                            {new Date(v.date).toLocaleDateString("tr-TR")}
                            <Trash2
                                size={12}
                                className="text-red-400 cursor-pointer hover:text-red-300"
                            />
                        </button>
                    ))
                ) : (
                    <span className="text-gray-500 text-xs">-</span>
                )}
            </div>
        ),
    }));

    const columns = [...staticColumns, ...vaccineColumns];

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <div className="text-white animate-pulse">
                    Aşı verileri yükleniyor...
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 w-full h-screen flex flex-col bg-slate-200">
            {/* Sol: Arama */}
            <header className="flex items-center mb-6">
                {/* Sol: Input */}
                <div className="flex-1">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Küpe No veya İsim ara..."
                        className="bg-white border border-slate-300 text-slate-800 text-sm px-3 py-2 rounded-md w-56 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Orta: Başlık */}
                <div className="text-center">
                    <h1 className="text-slate-900 text-xl font-bold">
                        Listede toplam {data.length} hayvan var
                    </h1>
                    <p className="text-sm text-slate-500">
                        (
                        {data.reduce(
                            (acc, row) =>
                                acc +
                                vaccineNames.reduce(
                                    (a, v) => a + (row[v]?.length || 0),
                                    0,
                                ),
                            0,
                        )}{" "}
                        aşı kaydı)
                    </p>
                </div>

                {/* Sağ: Boşluk dengeleyici */}
                <div className="flex-1" />
            </header>

            <div className="flex-1 min-h-0">
                <DataTable
                    data={filteredData}
                    columns={columns}
                    maxHeight="calc(100vh - 160px)"
                    rowClassName={() => {
                        if (c % 2) {
                            c++;
                            return "bg-mist-400";
                        }
                        c++;
                        return "bg-mist-500";
                    }}
                />
            </div>

            <footer className="mt-4 text-slate-500 text-xs text-right">
                <button onClick={() =>{ 
                    window.api.openAddVaccineWindow()
                    }} className="bg-green-600 hover:cursor-pointer hover:bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium transition">
                    Yeni Aşı Ekle
                </button>
                <button
                    onClick={() => navigate("/")}
                    className="ml-3 bg-blue-600 hover:cursor-pointer hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                    Ana Menü
                </button>
            </footer>
        </div>
    );
}
