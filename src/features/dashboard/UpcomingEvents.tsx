import React from 'react';

interface EventProps {
  name: string;
  tagNo: string;
  daysLeft: number;
}

const EventItem: React.FC<EventProps> = ({ name, tagNo, daysLeft }) => (
  <div className="bg-purple-50 p-4 rounded-lg shadow-sm border-l-4 border-purple-500 mb-2">
    <p className="font-semibold text-slate-800">{name}</p>
    <p className="text-sm text-slate-600">{tagNo}</p>
    <p className="text-xs text-slate-500 mt-1">{daysLeft}</p>
  </div>
);

export const UpcomingEvents: React.FC = () => {
  // Bu veriler Supabase'den tarih sorgusu ile gelecek
  const dueHeifers = [
    { name: 'Bala', tagNo: 'TR181157606', daysLeft: 64 },
    { name: 'UY858057340932', tagNo: '89', daysLeft: 89 },
    { name: 'ANGUS DELİ', tagNo: 'UY858054503104', daysLeft: 30 }, // Ek örnek
  ];

   const dueCows = [
    { name: 'Elizabeth', tagNo: 'DE951784138', daysLeft: 7 },
  ];

  return (
    <>
      {/* Yaklaşan Düveler */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="bg-purple-600 text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6 font-bold">Yaklaşan Düveler</h3>
        <div className="overflow-y-auto h-64">
            {dueHeifers.map((heifer, index) => <EventItem key={index} {...heifer} />)}
        </div>
      </div>

      {/* Yaklaşan İnekler */}
      <div className="bg-white p-6 rounded-lg shadow-md">
         <h3 className="bg-blue-600 text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6 font-bold">Yaklaşan İnekler</h3>
         <div className="overflow-y-auto h-64">
            {dueCows.map((cow, index) => <EventItem key={index} {...cow} />)}
         </div>
      </div>
    </>
  );
};