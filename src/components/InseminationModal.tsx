// src/components/InseminationModal.tsx
import { useState, useEffect } from "react";

interface InseminationData {
    Id: number;
    InseminationDate: string;
    BullName: string;
    CheckedDate: string | null;
    LastBirthDate: string | null;
}

interface InseminationModalProps {
    isOpen: boolean;
    animal: { Id: number; Name?: string; EarringNo?: string; LastBirthDate?: string } | null;
    onConfirm: (data: InseminationData) => Promise<void>;
    onCancel: () => void;
}

export default function InseminationModal({
    isOpen,
    animal,
    onConfirm,
    onCancel,
}: InseminationModalProps) {
    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState<InseminationData>({
        Id: -1,
        InseminationDate: today,
        BullName: "",
        CheckedDate: null,
        LastBirthDate: null,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && animal) {
            setFormData({
                Id: animal.Id,
                InseminationDate: today,
                BullName: "",
                CheckedDate: null,
                LastBirthDate: animal.LastBirthDate
                    ? new Date(animal.LastBirthDate).toISOString().split("T")[0]
                    : null,
            });
        }
    }, [isOpen, animal]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        if (isOpen) document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onCancel]);

    if (!isOpen || !animal) return null;

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm(formData);
        } finally {
            setLoading(false);
        }
    };

    const displayAnimal = animal.Name || animal.EarringNo || `#${animal.Id}`;

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
                    <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2v20M2 12h20"/>
                            <circle cx="12" cy="12" r="4"/>
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-slate-800 leading-tight">Tohumlama Kaydı</h3>
                        <p className="text-xs text-slate-400">{displayAnimal}</p>
                    </div>
                </div>

                <div className="my-5 border-t border-slate-100" />

                <div className="space-y-4">
                    {/* Tohumlama Tarihi */}
                    <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                            Tohumlama Tarihi <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="date"
                            value={formData.InseminationDate}
                            onChange={(e) => setFormData({ ...formData, InseminationDate: e.target.value })}
                            className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                        />
                    </div>

                    {/* Boğa İsmi */}
                    <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                            Boğa İsmi
                        </label>
                        <input
                            type="text"
                            placeholder="Boğa ismini giriniz..."
                            value={formData.BullName}
                            onChange={(e) => setFormData({ ...formData, BullName: e.target.value })}
                            className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition placeholder:text-slate-300"
                        />
                    </div>

                    {/* Kontrol Tarihi */}
                    <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                            Kontrol Tarihi <span className="text-slate-300"></span>
                        </label>
                        <input
                            type="date"
                            value={formData.CheckedDate ?? ""}
                            onChange={(e) => setFormData({ ...formData, CheckedDate: e.target.value || null })}
                            className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                        />
                    </div>

                    {/* Son Doğurduğu Tarih */}
                    <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                            Son Doğurduğu Tarih
                        </label>
                        <input
                            type="date"
                            value={formData.LastBirthDate ?? ""}
                            onChange={(e) => setFormData({ ...formData, LastBirthDate: e.target.value || null })}
                            className="w-full bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                        />
                        <p className="mt-1.5 text-[11px] text-amber-500 leading-relaxed">
                            ⚠ Bu tarih hayvanın son doğurduğu tarihtir, otomatik olarak kaydedilecektir. Tarih üzerinde değişiklik yapılması tavsiye edilmez.
                        </p>
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
                        disabled={loading || !formData.InseminationDate}
                        className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Kaydediliyor..." : "Tohumlamayı Kaydet"}
                    </button>
                </div>
            </div>
        </div>
    );
}