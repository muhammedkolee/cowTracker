// components/ConfirmModal.tsx
import { useEffect } from "react";

type ModalVariant = "restore" | "permanentDelete";

interface ConfirmModalProps {
    isOpen: boolean;
    variant: ModalVariant;
    earringNo?: string;
    name?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    isOpen,
    variant,
    earringNo,
    name,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    const displayEarring = earringNo || "-";
    const displayName = name || "-";

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        if (isOpen) document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40"
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-xl border border-gray-200 shadow-lg p-7 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {variant === "restore" ? (
                    <>
                        {/* Başlık */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                    <path d="M3 3v5h5"/>
                                </svg>
                            </div>
                            <span className="text-base font-medium text-gray-800">Hayvanı geri yükle</span>
                        </div>

                        {/* Mesaj */}
                        <p className="text-sm text-gray-600 leading-relaxed mb-6">
                            <span className="font-medium text-gray-800">{displayEarring}</span> küpe numarasıyla ve{" "}
                            <span className="font-medium text-gray-800">{displayName}</span> ismiyle kayıtlı hayvanı geri yüklemek istiyor musunuz?
                        </p>

                        {/* Butonlar */}
                        <div className="flex gap-2.5 justify-end">
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 text-sm rounded-lg bg-slate-400 hover:bg-slate-500 text-white transition-colors cursor-pointer"
                            >
                                Hayır, vazgeç
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition-colors cursor-pointer"
                            >
                                Evet, geri yüklensin
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Başlık */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6l-1 14H6L5 6"/>
                                    <path d="M10 11v6"/><path d="M14 11v6"/>
                                    <path d="M9 6V4h6v2"/>
                                </svg>
                            </div>
                            <span className="text-base font-medium text-gray-800">Kalıcı olarak sil</span>
                        </div>

                        {/* Mesaj */}
                        <p className="text-sm text-gray-600 leading-relaxed mb-6">
                            <span className="font-medium text-gray-800">{displayEarring}</span> küpe numarasıyla ve{" "}
                            <span className="font-medium text-gray-800">{displayName}</span> ismiyle kayıtlı hayvanı tamamen silmek istiyor musunuz?{" "}
                            Bu işlem geri alınamaz ve hayvana dair tüm kayıtları geri getirilemez şekilde silecektir.
                        </p>

                        {/* Butonlar */}
                        <div className="flex gap-2.5 justify-end">
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors cursor-pointer flex flex-col items-center leading-tight"
                            >
                                <span>Hayır</span>
                                <span className="text-[11px] font-normal opacity-85">Hiçbir işlem yapılmayacak</span>
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition-colors cursor-pointer flex flex-col items-center leading-tight"
                            >
                                <span>Evet</span>
                                <span className="text-[11px] font-normal opacity-85">Hayvanın silineceğini onaylıyorum</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}