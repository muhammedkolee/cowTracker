import { useEffect, useState } from "react";

type AnimalType = "cow" | "heifer" | "bull" | "calf";

interface AnimalFormData {
    Id: string;
    EarringNo: string;
    Name: string;
    Breed: string;
    BirthDate: string;
    Type: AnimalType;
    Gender: string;
    MotherEarringNo: string;
    MotherName: string;
    LastBirthDate: string;
    InseminationDate: string;
    BullName: string;
    CheckedDate: string;
    Note: string;
}

const typeLabels: Record<AnimalType, string> = {
    cow: "İnek",
    heifer: "Düve",
    bull: "Boğa",
    calf: "Dana",
};

const fieldConfig: {
    key: keyof AnimalFormData;
    label: string;
    enabledFor: AnimalType[] | "all" | "none";
    type?: "text" | "date" | "select" | "textarea";
    options?: { value: string; label: string }[];
}[] = [
    {
        key: "Id",
        label: "Hayvan ID Numarası",
        enabledFor: "none",
        type: "text",
    },
    {
        key: "EarringNo",
        label: "Küpe Numarası",
        enabledFor: ["cow", "heifer", "bull", "calf"],
        type: "text",
    },
    {
        key: "Name",
        label: "Hayvan Adı",
        enabledFor: ["cow", "heifer", "bull", "calf"],
        type: "text",
    },
    {
        key: "Breed",
        label: "Hayvan Cinsi",
        enabledFor: ["cow", "heifer", "bull", "calf"],
        type: "text",
    },
    {
        key: "BirthDate",
        label: "Doğum Tarihi",
        enabledFor: ["cow", "heifer", "bull", "calf"],
        type: "date",
    },
    {
        key: "Type",
        label: "Türü",
        enabledFor: ["cow", "heifer", "bull", "calf"],
        type: "select",
        options: [
            { value: "cow", label: "İnek" },
            { value: "heifer", label: "Düve" },
            { value: "bull", label: "Boğa" },
            { value: "calf", label: "Dana" },
        ],
    },
    {
        key: "Gender",
        label: "Cinsiyet",
        enabledFor: ["calf"],
        type: "select",
        options: [
            { value: "female", label: "Dişi" },
            { value: "male", label: "Erkek" },
        ],
    },
    {
        key: "MotherEarringNo",
        label: "Anne Küpe No",
        enabledFor: ["cow", "heifer", "bull", "calf"],
        type: "text",
    },
    {
        key: "MotherName",
        label: "Anne İsim",
        enabledFor: ["cow", "heifer", "bull", "calf"],
        type: "text",
    },
    {
        key: "LastBirthDate",
        label: "Son Doğurduğu Tarih",
        enabledFor: ["cow", "heifer"],
        type: "date",
    },
    {
        key: "InseminationDate",
        label: "Tohumlama Tarihi",
        enabledFor: ["cow"],
        type: "date",
    },
    { key: "BullName", label: "Dana Adı", enabledFor: ["cow"], type: "text" },
    {
        key: "CheckedDate",
        label: "Gebelik Kontrol Tarihi",
        enabledFor: ["cow"],
        type: "date",
    },
    {
        key: "Note",
        label: "Not",
        enabledFor: ["cow", "heifer", "bull", "calf"],
        type: "textarea",
    },
];

const initialData: AnimalFormData = {
    Id: "",
    EarringNo: "",
    Name: "",
    Breed: "",
    BirthDate: "",
    Type: "calf",
    Gender: "",
    MotherEarringNo: "",
    MotherName: "",
    LastBirthDate: "",
    InseminationDate: "",
    BullName: "",
    CheckedDate: "",
    Note: "",
};

function isEnabled(
    enabledFor: AnimalType[] | "all" | "none",
    currentType: AnimalType,
): boolean {
    if (enabledFor === "none") return false;
    if (enabledFor === "all") return true;
    return enabledFor.includes(currentType);
}

export default function UpdateAnimalPage() {
    const [formData, setFormData] = useState<AnimalFormData>(initialData);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.updateAnimalAPI.receiveData(
            (data: { animal: any; datasForType: any }) => {
                const newFormData: AnimalFormData = {
                    Id: data.animal.Id || "",
                    EarringNo: data.animal.EarringNo || "",
                    Name: data.animal.Name || "",
                    Breed: data.animal.Breed || "",
                    BirthDate: data.animal.BirthDate || "",
                    Type: data.animal.Type || "calf",
                    Gender:
                        data.animal.Type === "calf"
                            ? data.datasForType?.Gender
                                ? "female"
                                : "male"
                            : "",
                    MotherEarringNo: data.animal.MotherEarringNo || "",
                    MotherName: data.animal.MotherName || "",
                    LastBirthDate:
                        data.animal.Type === "cow" ||
                        data.animal.Type === "heifer"
                            ? data.datasForType?.LastBirthDate || ""
                            : "",
                    InseminationDate:
                        data.animal.Type === "cow"
                            ? data.datasForType?.InseminationDate || ""
                            : "",
                    BullName:
                        data.animal.Type === "cow"
                            ? data.datasForType?.BullName || ""
                            : "",
                    CheckedDate:
                        data.animal.Type === "cow"
                            ? data.datasForType?.CheckedDate || ""
                            : "",
                    Note: data.animal.Note || "",
                };
                setFormData(newFormData);
                setLoading(false);
            },
        );
    }, []);

    const handleChange = (key: keyof AnimalFormData, value: string) => {
        setSaved(false);
        setError(null);
        if (key === "Type") {
            setFormData((prev) => ({ ...prev, [key]: value as AnimalType }));
        } else {
            setFormData((prev) => ({ ...prev, [key]: value }));
        }
    };

    const handleSubmit = async () => {
        try {
            setError(null);
            setSaved(false);

            const updateData: any = {
                animalDatas: {
                    Id: formData.Id,
                    EarringNo: formData.EarringNo,
                    Name: formData.Name,
                    BirthDate: formData.BirthDate || null,
                    MotherEarringNo: formData.MotherEarringNo,
                    MotherName: formData.MotherName,
                    Breed: formData.Breed,
                    Type: formData.Type,
                    Note: formData.Note,
                },
            };

            if (formData.Type === "cow") {
                updateData.cowDatas = {
                    Id: formData.Id,
                    InseminationDate: formData.InseminationDate || null,
                    BullName: formData.BullName,
                    CheckedDate: formData.CheckedDate || null,
                };
            } else if (formData.Type === "heifer") {
                updateData.heiferDatas = {
                    Id: formData.Id,
                    LastBirthDate: formData.LastBirthDate || null,
                };
            } else if (formData.Type === "calf") {
                updateData.calfDatas = {
                    Id: formData.Id,
                    Gender: formData.Gender === "female",
                };
            }

            const success = await window.updateAnimalAPI.updateAnimal(
                updateData,
            );

            if (success) {
                setSaved(true);
                setTimeout(() => {
                    window.api.closeWindow();
                }, 1000);
            } else {
                setError("Güncelleme sırasında bir hata oluştu!");
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu",
            );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-500 mb-4"></div>
                    <h2 className="text-xl font-bold text-slate-600">
                        Hayvan Bilgileri Yükleniyor...
                    </h2>
                </div>
            </div>
        );
    }

    const currentType = formData.Type;

    // Split fields into two columns
    const leftFields = fieldConfig.filter((_, i) => i % 2 === 0);
    const rightFields = fieldConfig.filter((_, i) => i % 2 !== 0);

    const renderField = (field: (typeof fieldConfig)[number]) => {
        const enabled = isEnabled(field.enabledFor, currentType);
        const isId = field.key === "Id";

        const baseInputClass = `
      w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none transition-all duration-200
      ${
          enabled
              ? "border-slate-200 bg-white text-slate-800 placeholder-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              : "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
      }
      ${isId ? "border-red-200 bg-red-50 text-red-500 font-bold" : ""}
    `;

        return (
            <div key={field.key} className="flex flex-col gap-1.5">
                <label
                    className={`text-xs font-semibold uppercase tracking-wider ${
                        isId
                            ? "text-red-500"
                            : enabled
                              ? "text-slate-600"
                              : "text-slate-300"
                    }`}
                >
                    {field.label}
                </label>

                {field.type === "select" ? (
                    <select
                        value={formData[field.key]}
                        disabled={!enabled}
                        onChange={(e) =>
                            handleChange(field.key, e.target.value)
                        }
                        className={
                            baseInputClass +
                            " appearance-none bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")] bg-no-repeat bg-position[right_12px_center] pr-8"
                        }
                    >
                        {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                ) : field.type === "textarea" ? (
                    <textarea
                        value={formData[field.key]}
                        disabled={!enabled}
                        onChange={(e) =>
                            handleChange(field.key, e.target.value)
                        }
                        rows={3}
                        className={baseInputClass + " resize-none"}
                        placeholder={enabled ? "Not giriniz..." : ""}
                    />
                ) : (
                    <input
                        type={field.type === "date" ? "date" : "text"}
                        value={formData[field.key]}
                        disabled={!enabled}
                        onChange={(e) =>
                            handleChange(field.key, e.target.value)
                        }
                        className={baseInputClass}
                        placeholder={
                            field.type === "date" && enabled ? "gg/aa/yyyy" : ""
                        }
                    />
                )}

                {!enabled && field.enabledFor !== "none" && (
                    <p className="text-[10px] text-slate-300 italic">
                        {(field.enabledFor as AnimalType[])
                            .map((t) => typeLabels[t])
                            .join(", ")}{" "}
                        türü için aktif
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-emerald-50/30 to-slate-100 font-[system-ui]">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white text-lg">
                            🐄
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-800 leading-tight">
                                Hayvan Bilgilerini Güncelle
                            </h1>
                            <p className="text-xs text-slate-400">
                                ID: {formData.Id} · {typeLabels[currentType]}
                            </p>
                        </div>
                    </div>

                    {/* Type switcher pills */}
                    <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
                        {(Object.keys(typeLabels) as AnimalType[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => handleChange("Type", t)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                    currentType === t
                                        ? "bg-white text-emerald-600 shadow-sm"
                                        : "text-slate-400 hover:text-slate-600"
                                }`}
                            >
                                {typeLabels[t]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Active fields indicator */}
                <div className="mb-6 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        {typeLabels[currentType]} türü seçili
                    </span>
                    <span className="text-xs text-slate-400">
                        Aktif olmayan alanlar bu tür için kullanılamaz
                    </span>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-2 divide-x divide-slate-100">
                        {/* Left column */}
                        <div className="p-6 flex flex-col gap-5">
                            {leftFields.map(renderField)}
                        </div>
                        {/* Right column */}
                        <div className="p-6 flex flex-col gap-5">
                            {rightFields.map(renderField)}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => {
                                    setSaved(false);
                                    setError(null);
                                }}
                                className="text-xs text-slate-400 hover:text-slate-600 transition-colors font-medium"
                            >
                                ↩ Sıfırla
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={saved}
                                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                    saved
                                        ? "bg-emerald-100 text-emerald-600 cursor-not-allowed"
                                        : "bg-emerald-500 hover:cursor-pointer hover:bg-emerald-600 text-white shadow-sm hover:shadow-md active:scale-95"
                                }`}
                            >
                                {saved ? "✓ Kaydedildi" : "Güncelle"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
