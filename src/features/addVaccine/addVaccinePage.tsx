import { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface AnimalData {
    Id: number;
    EarringNo: string;
    Name: string;
    Type: string;
    MotherEarringNo: string;
    MotherName: string;
}

type GroupFilter = "all" | "cow" | "heifer" | "bull" | "calf";

export default function AddVaccinePage() {
    const [animals, setAnimals] = useState<AnimalData[]>([]);
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [groupFilter, setGroupFilter] = useState<GroupFilter | null>(null);
    const [vaccineName, setVaccineName] = useState("");
    const [vaccineNames, setVaccineNames] = useState<string[]>([]);
    const [vaccineDate, setVaccineDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        window.vaccineAPI.getAnimalsData((data: AnimalData[], names: string[]) => {
            setAnimals(Array.isArray(data) ? data : []);
            setVaccineNames(Array.isArray(names) ? names : []);
        });
    }, []);

    const filteredAnimals = animals.filter((a) => {
        const q = search.toLowerCase();
        return (
            a.EarringNo?.toLowerCase().includes(q) ||
            a.Name?.toLowerCase().includes(q)
        );
    });

    const toggleAnimal = (id: number) => {
        // Grup seçimi varsa temizle, tekil seçime geç
        setGroupFilter(null);
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleGroupFilter = (filter: GroupFilter) => {
        setGroupFilter(filter);
        setSelectedIds(new Set()); // tekil seçimleri temizle
    };

    // Backend'e gönderilecek AnimalId listesini hesapla
    const getTargetIds = (): number[] => {
        if (groupFilter === "all") return animals.map((a) => a.Id);
        if (groupFilter) return animals.filter((a) => a.Type === groupFilter).map((a) => a.Id);
        return Array.from(selectedIds);
    };

    const handleSubmit = () => {
        if (!vaccineName.trim()) {
            alert("Aşı adını giriniz.");
            return;
        }
        const targetIds = getTargetIds();
        if (targetIds.length === 0) {
            alert("En az bir hayvan seçiniz.");
            return;
        }

        setLoading(true);
        window.vaccineAPI.addVaccine({
            animalIds: targetIds,
            vaccineName: vaccineName.trim(),
            vaccineDate,
        });

        window.api.closeWindow();
    };

    useEffect(() => {
        // window.vaccineAPI.addVaccineResult((result: boolean) => {
        //     setLoading(false);
        //     if (result) {
        //         window.confirm("Aşı kaydı başarıyla eklendi!");
        //         window.close();
        //     } else {
        //         alert("Bir hata oluştu, tekrar deneyiniz.");
        //     }
        // });
    }, []);

    const inputClass =
        "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200";
    const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-24 w-24 border-b-2 border-green-500 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700">Aşı Kaydediliyor...</h2>
                    <p className="text-gray-500 mt-2">Lütfen bekleyiniz</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">

                    {/* Hayvan Seçimi */}
                    <div>
                        <p className={labelClass}>Hayvan Seçimi</p>

                        {/* Arama */}
                        <div className="relative mb-2">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Hayvan ara..."
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Liste */}
                        <div className="border border-gray-200 rounded-lg max-h-52 overflow-y-auto">
                            {filteredAnimals.map((a) => (
                                <label
                                    key={a.Id}
                                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(a.Id)}
                                        onChange={() => toggleAnimal(a.Id)}
                                        className="w-4 h-4 accent-green-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                        {a.EarringNo 
                                            ? a.EarringNo 
                                            : <span className="italic text-gray-400">Küpesiz</span>
                                        } - {a.Name 
                                            ? a.Name 
                                            : <span className="italic text-gray-400">İsimsiz</span>
                                        }
                                        {(!a.EarringNo || !a.Name) && (a.MotherEarringNo || a.MotherName) && (
                                            <span className="italic text-gray-400 ml-1">
                                                (Anne: {a.MotherEarringNo || "Küpesiz"} - {a.MotherName || "İsimsiz"})
                                            </span>
                                        )}
                                    </span>
                                </label>
                            ))}
                            {filteredAnimals.length === 0 && (
                                <p className="text-center text-gray-400 text-sm py-4">Hayvan bulunamadı.</p>
                            )}
                        </div>
                    </div>

                    {/* Aşı Türü */}
                    <div>
                        <label className={labelClass}>Aşı Türü</label>
                        <input
                            type="text"
                            list="vaccineNameList"
                            placeholder="Aşı adını giriniz veya seçiniz"
                            className={inputClass}
                            value={vaccineName}
                            onChange={(e) => setVaccineName(e.target.value)}
                        />
                        <datalist id="vaccineNameList">
                            {vaccineNames.map((name) => (
                                <option key={name} value={name} />
                            ))}
                        </datalist>
                    </div>

                    {/* Aşı Tarihi */}
                    <div>
                        <label className={labelClass}>Aşı Tarihi</label>
                        <input
                            type="date"
                            className={inputClass}
                            value={vaccineDate}
                            onChange={(e) => setVaccineDate(e.target.value)}
                        />
                    </div>

                    {/* Hangi Hayvanlar */}
                    <div>
                        <p className={labelClass}>Hangi Hayvanlar</p>
                        <div className="space-y-2">
                            {/* Tüm Hayvanlar — radio gibi davranıyor */}
                            {(
                                [
                                    { value: "all", label: "Tüm Hayvanlar", radio: true },
                                    { value: "cow", label: "İnekler", radio: false },
                                    { value: "heifer", label: "Düveler", radio: false },
                                    { value: "bull", label: "Danalar", radio: false },
                                    { value: "calf", label: "Buzağılar", radio: false },
                                ] as { value: GroupFilter; label: string; radio: boolean }[]
                            ).map((item) => (
                                <label key={item.value} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type={item.radio ? "radio" : "checkbox"}
                                        name={item.radio ? "groupAll" : undefined}
                                        checked={groupFilter === item.value}
                                        onChange={() =>
                                            groupFilter === item.value
                                                ? setGroupFilter(null)
                                                : handleGroupFilter(item.value)
                                        }
                                        className="w-4 h-4 accent-green-500"
                                    />
                                    <span className="text-sm text-gray-700">{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Butonu */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-center">
                <button
                    onClick={handleSubmit}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition duration-200"
                >
                    Aşı Kaydını Ekle
                </button>
            </div>
        </div>
    );
}