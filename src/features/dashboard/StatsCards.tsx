import React from 'react';

interface StatCardProps {
  title: string;
  count: number;
  bgColor: string; // Tailwind classı (örn: 'bg-blue-600')
}

const StatCard: React.FC<StatCardProps> = ({ title, count, bgColor }) => (
  <div className={`${bgColor} text-white p-6 rounded-lg shadow-md flex-1 text-center`}>
    <p className="text-3xl font-bold">{count} adet</p>
    <p className="text-lg">{title} kayıtlı.</p>
  </div>
);

export const StatsCards: React.FC = () => {
  // Bu veriler ileride Supabase'den gelecek
  const stats = [
    { title: 'inek', count: 21, bgColor: 'bg-blue-600' },
    { title: 'buzağı', count: 28, bgColor: 'bg-green-600' },
    { title: 'düve', count: 20, bgColor: 'bg-yellow-500' },
    { title: 'dana', count: 3, bgColor: 'bg-red-600' },
  ];

  return (
    <div className="flex gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};