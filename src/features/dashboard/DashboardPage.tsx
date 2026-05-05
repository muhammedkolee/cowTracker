import React from 'react';
import { StatsCards } from './StatsCards';
import { QuickMenu } from './QuickMenu';
import { UpcomingEvents } from './UpcomingEvents';
import { ActivityLog } from './ActivityLog';
import { Trash2, Settings } from 'lucide-react'; // İkonlar için lucide-react yüklemen gerekebilir
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="p-2 bg-slate-300 min-h-screen text-slate-900 flex flex-col relative">
      
      <main className="flex-1">
        <StatsCards />
        <QuickMenu />
        
        <div className="grid grid-cols-3 gap-4">
          <UpcomingEvents />
          <ActivityLog />
        </div>
      </main>

      {/* Alt kısımdaki sürüm bilgisi ve butonlar */}
<footer className="mt-8 flex justify-between items-center relative z-10">
    {/* Çöp Kutusu Butonu */}
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
            App Version:  {__APP_VERSION__}
        </div>

        {/* Ayarlar Butonu */}
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