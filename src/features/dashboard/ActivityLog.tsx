import React from 'react';

interface LogProps {
  message: string;
  timestamp: string;
}

const LogItem: React.FC<LogProps> = ({ message, timestamp }) => (
  <div className="bg-green-50 p-4 rounded-lg shadow-sm border-l-4 border-green-500 mb-2">
    <p className="text-sm text-slate-800">{message}</p>
    <p className="text-xs text-slate-500 mt-1">{timestamp}</p>
  </div>
);

export const ActivityLog: React.FC = () => {
  // Bu veriler Supabase'den son kayıtlar sorgusu ile gelecek
  const logs = [
    { message: 'TR181020358 küpe numaralı buzağı "Düve" olarak kaydedildi!', timestamp: '04.04.2026 14:33' },
    { message: 'TR181020357 küpe numaralı buzağı "Dana" olarak kaydedildi!', timestamp: '10.04.2026 16:20' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
       <h3 className="bg-green-600 text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6 font-bold">Son Güncellemeler</h3>
       <div className="overflow-y-auto h-64">
            {logs.map((log, index) => <LogItem key={index} {...log} />)}
       </div>
    </div>
  );
};