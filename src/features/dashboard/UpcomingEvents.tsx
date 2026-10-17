import React from 'react';

interface AnimalEvent {
    name: string;
    earringNo: string;
    days: number;
}

interface EventsData {
    heifers: AnimalEvent[];
    cows: AnimalEvent[];
    emptyCows: AnimalEvent[];
}

const EventItem: React.FC<{
    item: AnimalEvent;
    variant: "birth" | "empty";
}> = ({ item, variant }) => (
    <div
        className={`${
            variant === "birth"
                ? "bg-blue-50 border-blue-500"
                : "bg-purple-50 border-purple-500"
        } p-4 rounded-lg shadow-sm border-l-4 mb-2`}
    >
        <p className="font-semibold text-slate-800">{item.name || item.earringNo || "-"}</p>
        <p className="text-sm text-slate-600">{item.earringNo}</p>
        <p className="text-xs text-slate-500 mt-1">
            {variant === "empty"
                ? `${item.days} gündür boş.`
                : item.days >= 0
                    ? `Doğuma ${item.days} gün kaldı.`
                    : `Tahmini doğum tarihi ${Math.abs(item.days)} gün geçti.`}
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
                        ? events.cows.map((cow) => (
                            <EventItem
                                key={`${cow.earringNo}-${cow.name}`}
                                item={cow}
                                variant="birth"
                            />
                        ))
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
                            <EventItem
                                key={`${item.earringNo}-${item.name}-${i}`}
                                item={item}
                                variant="empty"
                            />
                        ))
                        : <p className="text-slate-400 italic text-sm text-center pt-8">Boş hayvan yok.</p>
                    }
                </div>
            </div>
        </>
    );
};
