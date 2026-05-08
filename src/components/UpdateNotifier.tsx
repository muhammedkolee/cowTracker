import React, { useEffect, useState } from 'react';
import { Download, RefreshCw, X } from 'lucide-react';

export const UpdateNotifier: React.FC = () => {
    const [updateInfo, setUpdateInfo] = useState<{
        status: 'none' | 'available' | 'downloading' | 'finished';
        progress: number;
        version?: string;
    }>({ status: 'none', progress: 0 });
    const [isDownloadingStarted, setIsDownloadingStarted] = useState(false);

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Güncelleme bulundu
        window.updateAPI.onUpdateAvailable((ver: string) => {
            setUpdateInfo({ status: 'available', progress: 0, version: ver });
            setIsVisible(true);
        });

        // İndirme ilerlemesi
        window.updateAPI.onDownloadProgress((pct: number) => {
            setUpdateInfo(prev => ({ ...prev, status: 'downloading', progress: pct }));
        });

        // İndirme tamamlandı
        window.updateAPI.onUpdateDownloaded(() => {
            setUpdateInfo(prev => ({ ...prev, status: 'finished', progress: 100 }));
        });
    }, []);

    if (!isVisible || updateInfo.status === 'none') return null;

    return (
        <div className="fixed bottom-6 right-6 z-9999 w-85 animate-in fade-in slide-in-from-right-10 duration-500">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
                                <RefreshCw size={20} className={updateInfo.status === 'downloading' ? 'animate-spin' : ''} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Güncelleme Hazır</h4>
                                <p className="text-slate-500 text-xs">Versiyon: {updateInfo.version}</p>
                            </div>
                        </div>
                        <button onClick={() => setIsVisible(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {updateInfo.status === 'available' && (
                            <button
                                onClick={() => {
                                    setIsDownloadingStarted(true);
                                    window.updateAPI.startDownload();
                                }}
                                disabled={isDownloadingStarted} // Basıldığı an deaktif olur
                                className={`w-full text-white text-sm font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg ${
                                    isDownloadingStarted 
                                        ? "bg-slate-400 cursor-not-allowed" 
                                        : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 active:scale-95"
                                }`}
                            >
                                {isDownloadingStarted ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Bağlanılıyor...
                                    </>
                                ) : (
                                    <>
                                        <Download size={16} />
                                        Şimdi İndir
                                    </>
                                )}
                            </button>
                        )}

                    {updateInfo.status === 'downloading' && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                <span>İndiriliyor...</span>
                                <span>%{Math.round(updateInfo.progress)}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div 
                                    className="bg-emerald-500 h-full transition-all duration-300" 
                                    style={{ width: `${updateInfo.progress}%` }} 
                                />
                            </div>
                        </div>
                    )}

                    {updateInfo.status === 'finished' && (
                        <button
                            onClick={() => window.updateAPI.quitAndInstall()}
                            className="w-full bg-slate-800 hover:cursor-pointer hover:bg-slate-900 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-lg"
                        >
                            Yükle ve Yeniden Başlat
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};