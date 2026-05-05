// src/components/GaveBirthModal.tsx
import { useState, useEffect } from "react";

interface CalfData {
    Name: string;
    EarringNo: string;
    Gender: boolean;
    BirthDate: string;
}

interface GaveBirthModalProps {
    isOpen: boolean;
    motherId: number;
    motherName?: string;
    motherEarringNo?: string;
    onConfirm: (motherId: number, calfData: CalfData) => Promise<void>;
    onCancel: () => void;
}

export default function GaveBirthModal({
    isOpen,
    motherId,
    motherName,
    motherEarringNo,
    onConfirm,
    onCancel,
}: GaveBirthModalProps) {
    const [calfData, setCalfData] = useState<CalfData>({
        Name: "",
        EarringNo: "",
        Gender: true,
        BirthDate: new Date().toISOString().split("T")[0],
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setCalfData({
                Name: "",
                EarringNo: "",
                Gender: true,
                BirthDate: new Date().toISOString().split("T")[0],
            });
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        if (isOpen) document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm(motherId, calfData);
        } finally {
            setLoading(false);
        }
    };

    const displayMother = motherName || motherEarringNo || `#${motherId}`;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40"
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-2xl shadow-xl p-7 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Başlık */}
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 12l2 2 4-4"/>
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-slate-800 leading-tight">Doğum Kaydı</h3>
                        <p className="text-xs text-slate-400">{displayMother}</p>
                    </div>
                </div>

                <div className="my-5 border-t border-slate-100" />

                {/* Form */}
                <div className="space-y-4">
                    {/* Doğum Tarihi */}
                    <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                            Doğum Tarihi <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="date"
                            value={calfData.BirthDate}
                            onChange={(e) => setCalfData({ ...calfData, BirthDate: e.target.value })}
                            className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        />
                    </div>

                    {/* Cinsiyet */}
                    <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                            Cinsiyet
                        </label>
                        <div className="flex rounded-xl overflow-hidden border border-slate-200">
                            <button
                                type="button"
                                onClick={() => setCalfData({ ...calfData, Gender: true })}
                                className={`flex-1 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                                    calfData.Gender
                                        ? "bg-pink-500 text-white"
                                        : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                }`}
                            >
                                Dişi
                            </button>
                            <div className="w-px bg-slate-200" />
                            <button
                                type="button"
                                onClick={() => setCalfData({ ...calfData, Gender: false })}
                                className={`flex-1 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                                    !calfData.Gender
                                        ? "bg-blue-500 text-white"
                                        : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                }`}
                            >
                                Erkek
                            </button>
                        </div>
                    </div>

                    {/* Buzağı İsmi */}
                    <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                            Buzağı İsmi <span className="text-slate-300"></span>
                        </label>
                        <input
                            type="text"
                            placeholder="İsim giriniz..."
                            value={calfData.Name}
                            onChange={(e) => setCalfData({ ...calfData, Name: e.target.value })}
                            className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition placeholder:text-slate-300"
                        />
                    </div>

                    {/* Küpe Numarası */}
                    <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                            Küpe Numarası <span className="text-slate-300"></span>
                        </label>
                        <input
                            type="text"
                            placeholder="Küpe no giriniz..."
                            value={calfData.EarringNo}
                            onChange={(e) => setCalfData({ ...calfData, EarringNo: e.target.value })}
                            className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition placeholder:text-slate-300"
                        />
                    </div>
                </div>

                <div className="my-5 border-t border-slate-100" />

                {/* Butonlar */}
                <div className="flex gap-2.5">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 py-2.5 text-sm font-medium rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading || !calfData.BirthDate}
                        className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-green-600 hover:bg-green-500 text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Kaydediliyor..." : "Doğumu Kaydet"}
                    </button>
                </div>
            </div>
        </div>
    );
}