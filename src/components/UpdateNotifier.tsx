import React, { useEffect, useState } from "react";
import { AlertTriangle, Download, RefreshCw, X } from "lucide-react";

type UpdateInfo = {
    status: "none" | "checking" | "available" | "downloading" | "finished" | "error";
    progress?: number;
    version?: string;
    releaseNotes?: string;
    message?: string;
};

const emptyState: UpdateInfo = { status: "none", progress: 0 };

export const UpdateNotifier: React.FC = () => {
    const [updateInfo, setUpdateInfo] = useState<UpdateInfo>(emptyState);
    const [isVisible, setIsVisible] = useState(false);
    const [isWorking, setIsWorking] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const applyState = (state: UpdateInfo) => {
            if (!isMounted) return;
            setUpdateInfo(state);
            setIsWorking(state.status === "downloading" || state.status === "checking");
            if (state.status !== "none" && state.status !== "checking") {
                setIsVisible(true);
            }
        };

        const removeListener = window.updateAPI.onStateChanged(applyState);
        window.updateAPI.getState().then(applyState).catch(() => undefined);

        return () => {
            isMounted = false;
            removeListener();
        };
    }, []);

    const startDownload = async () => {
        setIsWorking(true);
        try {
            await window.updateAPI.startDownload();
        } catch {
            setUpdateInfo((current) => ({
                ...current,
                status: "error",
                message: "Güncelleme indirilemedi. İnternet bağlantınızı kontrol edip tekrar deneyin.",
            }));
            setIsWorking(false);
        }
    };

    const retry = async () => {
        setIsWorking(true);
        const started = await window.updateAPI.checkNow().catch(() => false);
        if (!started) setIsWorking(false);
    };

    if (!isVisible || updateInfo.status === "none" || updateInfo.status === "checking") return null;

    const isError = updateInfo.status === "error";

    return (
        <div className="fixed bottom-6 right-6 z-[9999] w-96 max-w-[calc(100vw-3rem)] animate-in fade-in slide-in-from-right-10 duration-500">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                <div className="p-5">
                    <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`rounded-lg p-2 ${isError ? "bg-amber-100 text-amber-700" : "bg-emerald-500/10 text-emerald-600"}`}>
                                {isError ? (
                                    <AlertTriangle size={20} />
                                ) : (
                                    <RefreshCw
                                        size={20}
                                        className={updateInfo.status === "downloading" ? "animate-spin" : ""}
                                    />
                                )}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">
                                    {isError ? "Güncelleme Hatası" : "Güncelleme Hazır"}
                                </h4>
                                {updateInfo.version && (
                                    <p className="text-xs text-slate-500">Versiyon: {updateInfo.version}</p>
                                )}
                            </div>
                        </div>
                        <button
                            type="button"
                            aria-label="Güncelleme bildirimini kapat"
                            onClick={() => setIsVisible(false)}
                            className="text-slate-400 transition-colors hover:cursor-pointer hover:text-slate-600"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {updateInfo.status === "available" && (
                        <>
                            <p className="mb-3 text-sm text-slate-600">
                                Yeni sürümü indirip yüklemek ister misiniz?
                            </p>
                            {updateInfo.releaseNotes && (
                                <div className="mb-4 max-h-24 overflow-y-auto rounded-lg bg-slate-50 px-3 py-2 text-xs whitespace-pre-line text-slate-600">
                                    {updateInfo.releaseNotes}
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsVisible(false)}
                                    className="rounded-xl bg-slate-100 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:cursor-pointer hover:bg-slate-200"
                                >
                                    Daha Sonra
                                </button>
                                <button
                                    type="button"
                                    onClick={startDownload}
                                    disabled={isWorking}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:cursor-pointer hover:bg-emerald-600 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-400"
                                >
                                    <Download size={16} />
                                    İndir
                                </button>
                            </div>
                        </>
                    )}

                    {updateInfo.status === "downloading" && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                <span>İndiriliyor...</span>
                                <span>%{Math.round(updateInfo.progress ?? 0)}</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full bg-emerald-500 transition-all duration-300"
                                    style={{ width: `${updateInfo.progress ?? 0}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {updateInfo.status === "finished" && (
                        <>
                            <p className="mb-3 text-sm text-slate-600">
                                Güncelleme indirildi. Uygulama yeniden başlatılarak kurulacak.
                            </p>
                            <button
                                type="button"
                                onClick={() => window.updateAPI.quitAndInstall()}
                                className="w-full rounded-xl bg-slate-800 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:cursor-pointer hover:bg-slate-900"
                            >
                                Yükle ve Yeniden Başlat
                            </button>
                        </>
                    )}

                    {isError && (
                        <>
                            <p className="mb-3 text-sm text-slate-600">
                                {updateInfo.message ?? "Güncelleme işlemi tamamlanamadı."}
                            </p>
                            <button
                                type="button"
                                onClick={retry}
                                disabled={isWorking}
                                className="w-full rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-white transition-colors hover:cursor-pointer hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >
                                {isWorking ? "Kontrol ediliyor..." : "Tekrar Dene"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
