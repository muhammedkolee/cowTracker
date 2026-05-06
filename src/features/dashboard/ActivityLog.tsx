import React from 'react';

interface LogEntry {
    animalName: string;
    earringNo: string;
    oldType: "calf";
    newType: "bull" | "heifer";
    changedAt: string; // ISO string
}

const LogItem: React.FC<{ log: LogEntry }> = ({ log }) => {
    const label = log.newType === "bull" ? "Boğa" : "Düve";
    const changedDate = new Date(log.changedAt).toLocaleDateString("tr-TR");

    return (
        <div className="bg-green-50 p-4 rounded-lg shadow-sm border-l-4 border-green-500 mb-2">
            <p className="text-sm text-slate-800 font-semibold">
                {log.earringNo || log.animalName || "İsimsiz"} → <span className="text-green-700">{label}</span> olarak güncellendi
            </p>
            <p className="text-xs text-slate-500 mt-1">{changedDate}</p>
        </div>
    );
};

export const ActivityLog: React.FC<{ logs: LogEntry[] }> = ({ logs }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="bg-green-600 text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6 font-bold">
                Son Güncellemeler
            </h3>
            <div className="overflow-y-auto h-64">
                {logs.length > 0
                    ? logs.map((log, i) => <LogItem key={i} log={log} />)
                    : <p className="text-slate-400 italic text-sm text-center pt-8">Son 7 günde güncelleme yok.</p>
                }
            </div>
        </div>
    );
};