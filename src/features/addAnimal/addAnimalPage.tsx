import { useEffect, useState } from "react";

type AnimalType = "cow" | "heifer" | "calf" | "bull" | "";

interface MotherAnimal {
    EarringNo: string;
    Name: string;
}

interface BullAnimal {
    Name: string;
}

export default function AddAnimalPage() {
    const [animalType, setAnimalType] = useState<AnimalType>("");
    const [loading, setLoading] = useState(false);
    const [mothers, setMothers] = useState<MotherAnimal[]>([]);
    const [bulls, setBulls] = useState<BullAnimal[]>([]);

    const [animalName, setAnimalName] = useState("");
    const [earringNo, setEarringNo] = useState("");
    const [breed, setBreed] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [motherEarringNo, setMotherEarringNo] = useState("");
    const [motherName, setMotherName] = useState("");

    const [inseminationDate, setInseminationDate] = useState("");
    const [bullName, setBullName] = useState("");
    const [checkedDate, setCheckedDate] = useState("");

    const [lastBirthDate, setLastBirthDate] = useState("");

    const [gender, setGender] = useState("");

    useEffect(() => {
        window.addAnimalAPI.receiveAnimalType((type: string) => {
            if (["cow", "heifer", "calf", "bull"].includes(type)) {
                setAnimalType(type as AnimalType);
            }
        });

        window.addAnimalAPI.getMothersEarringNo().then(setMothers);
        window.addAnimalAPI.getBullsName().then(setBulls);
    }, []);

    const handleMotherEarringChange = (value: string) => {
        setMotherEarringNo(value);
        const found = mothers.find((m) => m.EarringNo === value);
        setMotherName(found ? found.Name : "");
    };

    const handleSubmit = async () => {
        const newAnimalDatas: any = {
            animalDatas: {
                EarringNo: earringNo,
                Name: animalName,
                BirthDate: birthDate || null,
                MotherEarringNo: motherEarringNo,
                MotherName: motherName,
                Breed: breed,
                Type: animalType,
            },
        };

        if (animalType === "cow") {
            newAnimalDatas.cowDatas = {
                EarringNo: earringNo,
                Name: animalName,
                InseminationDate: inseminationDate || null,
                BullName: bullName,
                CheckedDate: checkedDate || null,
            };
        } else if (animalType === "heifer") {
            newAnimalDatas.heiferDatas = {
                EarringNo: earringNo,
                Name: animalName,
                LastBirthDate: lastBirthDate || null,
            };
        } else if (animalType === "calf") {
            newAnimalDatas.calfDatas = {
                EarringNo: earringNo,
                Name: animalName,
                BirthDate: birthDate || null,
                Gender: gender === "girl",
            };
        }

        setLoading(true);
        if (await window.addAnimalAPI.addAnimal(newAnimalDatas)) {
            alert("Hayvan başarıyla eklendi!");
        } else {
            alert("Bir sorun oluştu!");
        }
        await window.api.closeWindow();
        
    };

    const inputClass =
        "w-full px-3 py-2 placeholder:text-gray-100 text-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200";
    const labelClass = "block text-sm font-bold text-black";

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-700">
                        Hayvan Ekleniyor...
                    </h2>
                    <p className="text-gray-500 mt-2">Lütfen bekleyiniz</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
                        Yeni Hayvan Ekle
                    </h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <div className="space-y-6">
                            {/* Tür Seçimi */}
                            <div className="space-y-2">
                                <label className={labelClass}>Türü</label>
                                <select
                                    className={inputClass}
                                    value={animalType}
                                    onChange={(e) =>
                                        setAnimalType(
                                            e.target.value as AnimalType,
                                        )
                                    }
                                >
                                    <option value="">Seçiniz</option>
                                    <option value="cow">İnek</option>
                                    <option value="heifer">Düve</option>
                                    <option value="calf">Buzağı</option>
                                    <option value="bull">Dana</option>
                                </select>
                            </div>

                            {/* Ortak Alanlar */}
                            {animalType !== "" && (
                                <>
                                    <div className="space-y-2">
                                        <label className={labelClass}>
                                            Hayvan Adı
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Sarı Kız"
                                            className={inputClass}
                                            value={animalName}
                                            onChange={(e) =>
                                                setAnimalName(e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className={labelClass}>
                                            Küpe Numarası
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="TR1818 (Küpesi olmayan buzağılar için boş bırakın)"
                                            className={inputClass}
                                            value={earringNo}
                                            onChange={(e) =>
                                                setEarringNo(e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className={labelClass}>
                                            Hayvan Cinsi
                                        </label>
                                        <input
                                            list="breeds"
                                            type="text"
                                            placeholder="Simental"
                                            className={inputClass}
                                            value={breed}
                                            onChange={(e) =>
                                                setBreed(e.target.value)
                                            }
                                            required
                                        />
                                        <datalist id="breeds">
                                            <option value="Simental" />
                                            <option value="Angus" />
                                        </datalist>
                                    </div>

                                    <div className="space-y-2">
                                        <label className={labelClass}>
                                            Doğum Tarihi
                                        </label>
                                        <input
                                            type="date"
                                            className={inputClass}
                                            value={birthDate}
                                            onChange={(e) =>
                                                setBirthDate(e.target.value)
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className={labelClass}>
                                            Anne Küpe Numarası
                                        </label>
                                        <input
                                            type="text"
                                            list="motherEarringNumbers"
                                            placeholder="Küpe numarası yazın veya seçin"
                                            className={inputClass}
                                            value={motherEarringNo}
                                            onChange={(e) =>
                                                handleMotherEarringChange(
                                                    e.target.value,
                                                )
                                            }
                                            autoComplete="off"
                                        />
                                        <datalist id="motherEarringNumbers">
                                            {mothers.map((m) => (
                                                <option
                                                    key={m.EarringNo}
                                                    value={m.EarringNo}
                                                >
                                                    {m.EarringNo} - {m.Name}
                                                </option>
                                            ))}
                                        </datalist>
                                    </div>

                                    <div className="space-y-2">
                                        <label className={labelClass}>
                                            Anne Adı
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Küpe numarası seçildiğinde otomatik doldurulur"
                                            className={`${inputClass} ${motherName ? "bg-white" : "bg-gray-50"}`}
                                            value={motherName}
                                        />
                                    </div>

                                    {/* İnek */}
                                    {animalType === "cow" && (
                                        <>
                                            <div className="space-y-2">
                                                <label className={labelClass}>
                                                    Tohumlama Tarihi
                                                </label>
                                                <input
                                                    type="date"
                                                    className={inputClass}
                                                    value={inseminationDate}
                                                    onChange={(e) =>
                                                        setInseminationDate(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className={labelClass}>
                                                    Dana Adı
                                                </label>
                                                <input
                                                    type="text"
                                                    list="bullDatalist"
                                                    className={inputClass}
                                                    value={bullName}
                                                    onChange={(e) =>
                                                        setBullName(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <datalist id="bullDatalist">
                                                    {bulls.map((b) => (
                                                        <option
                                                            key={b.Name}
                                                            value={b.Name}
                                                        />
                                                    ))}
                                                </datalist>
                                            </div>

                                            <div className="space-y-2">
                                                <label className={labelClass}>
                                                    Gebelik Kontrol
                                                </label>
                                                <input
                                                    type="date"
                                                    className={inputClass}
                                                    value={checkedDate}
                                                    onChange={(e) =>
                                                        setCheckedDate(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </>
                                    )}

                                    {/* Düve */}
                                    {animalType === "heifer" && (
                                        <div className="space-y-2">
                                            <label className={labelClass}>
                                                Son Doğurduğu Tarih
                                            </label>
                                            <input
                                                type="date"
                                                className={inputClass}
                                                value={lastBirthDate}
                                                onChange={(e) =>
                                                    setLastBirthDate(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    )}

                                    {/* Buzağı */}
                                    {animalType === "calf" && (
                                        <div className="space-y-2">
                                            <label className={labelClass}>
                                                Cinsiyet
                                            </label>
                                            <select
                                                className={inputClass}
                                                value={gender}
                                                onChange={(e) =>
                                                    setGender(e.target.value)
                                                }
                                            >
                                                <option value="">
                                                    Seçiniz
                                                </option>
                                                <option value="girl">
                                                    Dişi
                                                </option>
                                                <option value="boy">
                                                    Erkek
                                                </option>
                                                required
                                            </select>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="flex justify-center mt-8">
                            <button
                                type="submit"
                                // onClick={handleSubmit}
                                className="cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow-md hover:shadow-lg transform hover:scale-105 duration-200 ease-in-out transition-colors"
                            >
                                Ekle
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
