import React, { useEffect, useState } from 'react';
import { StatsCards } from './StatsCards';
import { QuickMenu } from './QuickMenu';
import { UpcomingEvents } from './UpcomingEvents';
import { ActivityLog } from './ActivityLog';
import { Trash2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

declare const __APP_VERSION__: string;

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // State tiplerini daha açık tanımlayalım
    const [counts, setCounts] = useState({ cow: 0, heifer: 0, bull: 0, calf: 0 });
    const [upcomingEvents, setUpcomingEvents] = useState<{ heifers: any[]; cows: any[]; emptyCows: any[] }>({ 
        heifers: [], cows: [], emptyCows: [] 
    });
    const [activityLogs, setActivityLogs] = useState<any[]>([]);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [countsData, eventsData, logsData] = await Promise.all([
                    window.api.getCounts(),
                    window.api.getUpcomingEvents(),
                    window.api.getActivityLogs(),
                ]);

                setCounts(countsData as any);
                setUpcomingEvents(eventsData as any);
                setActivityLogs(logsData);
            } catch (err) {
                console.error("Dashboard verisi yüklenemedi:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-300 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-slate-700 mb-4" />
                    <p className="text-slate-700 font-semibold">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-2 bg-slate-300 min-h-screen text-slate-900 flex flex-col relative">
            <main className="flex-1">
                <StatsCards counts={counts} />
                <QuickMenu />
                <div className="grid grid-cols-3 gap-4">
                    <UpcomingEvents events={upcomingEvents} />
                    <ActivityLog logs={activityLogs} />
                </div>
            </main>

            <footer className="mt-8 flex justify-between items-center relative z-10">
                <button
                    onClick={() => navigate('/trash')}
                    className="group bg-red-600 hover:cursor-pointer text-white px-4 py-3 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 flex items-center gap-0 hover:gap-2 overflow-hidden"
                >
                    <Trash2 size={24} className="shrink-0" />
                    <span className="max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap transition-all duration-300 text-sm font-medium">
                        Silinen Hayvanlar
                    </span>
                </button>

                <div className="flex items-center gap-2">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-md text-sm text-slate-700">
                        App Version: {__APP_VERSION__}
                    </div>
                    <button
                        onClick={() => navigate('/settings')}
                        className="group bg-slate-700 hover:cursor-pointer text-white px-4 py-3 rounded-full shadow-lg hover:bg-slate-800 transition-all duration-300 flex items-center gap-0 hover:gap-2 overflow-hidden"
                    >
                        <Settings size={24} className="shrink-0" />
                        <span className="max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap transition-all duration-300 text-sm font-medium">
                            Ayarlar
                        </span>
                    </button>
                </div>
            </footer>
        </div>
    );
};