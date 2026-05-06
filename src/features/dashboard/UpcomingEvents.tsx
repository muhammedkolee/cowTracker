import React from 'react';

interface AnimalEvent {
    name: string;
    earringNo: string;
    daysLeft: number;
}

interface EventsData {
    heifers: AnimalEvent[];   // Boş günü 60+ olan düveler
    cows: AnimalEvent[];      // Doğumuna 20 günden az kalan inekler
    emptyCows: AnimalEvent[]; // Boş günü 60+ olan inekler
}

const EventItem: React.FC<{ item: AnimalEvent; color: string }> = ({ item, color }) => (
    <div className={`bg-${color}-50 p-4 rounded-lg shadow-sm border-l-4 border-${color}-500 mb-2`}>
        <p className="font-semibold text-slate-800">{item.name || item.earringNo || "-"}</p>
        <p className="text-sm text-slate-600">{item.earringNo}</p>
        <p className="text-xs text-slate-500 mt-1">
            {item.daysLeft > 0 ? `${item.daysLeft} gündür boş.` : `${Math.abs(item.daysLeft)} gün geçti`}
        </p>
    </div>
);

export const UpcomingEvents: React.FC<{ events: EventsData }> = ({ events }) => {
    return (
        <>
            {/* Yaklaşan İnekler — doğuma 20 günden az */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="bg-blue-600 text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6 font-bold">
                    Yaklaşan İnekler
                </h3>
                <div className="overflow-y-auto h-64">
                    {events.cows.length > 0
                        ? events.cows.map((cow, i) => <EventItem key={i} item={cow} color="blue" />)
                        : <p className="text-slate-400 italic text-sm text-center pt-8">Yaklaşan doğum yok.</p>
                    }
                </div>
            </div>

            {/* Boş Düveler & İnekler — 60+ gün */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="bg-purple-600 text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6 font-bold">
                    Boş Hayvanlar (60+ Gün)
                </h3>
                <div className="overflow-y-auto h-64">
                    {[...events.heifers, ...events.emptyCows].length > 0
                        ? [...events.heifers, ...events.emptyCows].map((item, i) => (
                            <EventItem key={i} item={item} color="purple" />
                        ))
                        : <p className="text-slate-400 italic text-sm text-center pt-8">Boş hayvan yok.</p>
                    }
                </div>
            </div>
        </>
    );
};