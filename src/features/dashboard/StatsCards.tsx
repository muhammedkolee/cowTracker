import React from "react";

interface Counts {
    cow: number;
    calf: number;
    heifer: number;
    bull: number;
}

interface StatCardProps {
    title: string;
    count: number;
    bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, count, bgColor }) => (
    <div className={`${bgColor} text-white p-6 rounded-lg shadow-md flex-1 text-center`}>
        <p className="text-3xl font-bold">{count} adet</p>
        <p className="text-lg">{title} kayıtlı.</p>
    </div>
);

export const StatsCards: React.FC<{ counts: Counts }> = ({ counts }) => {
    const stats = [
        { title: "inek", count: counts.cow, bgColor: "bg-blue-600" },
        { title: "buzağı", count: counts.calf, bgColor: "bg-green-600" },
        { title: "düve", count: counts.heifer, bgColor: "bg-yellow-500" },
        { title: "dana", count: counts.bull, bgColor: "bg-red-600" },
    ];

    return (
        <div className="flex gap-4 mb-8">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
};