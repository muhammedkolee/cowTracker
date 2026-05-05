// src/features/dashboard/QuickMenu.tsx
import { useNavigate } from 'react-router-dom';

export const QuickMenu: React.FC = () => {
  const navigate = useNavigate(); // Yönlendirme yapmak için bu fonksiyonu kullanırız

  const menus = [
    { label: 'Gebe İnekler', path: '/cows', color: 'text-blue-700', borderColor: 'border-blue-700', hoverEffect: 'hover:bg-blue-700 hover:text-white' },
    { label: 'Tüm Hayvanlar', path: '/animals', color: 'text-white', borderColor: 'border-green-700', bgColor: 'bg-green-700', hoverEffect: 'hover:bg-white hover:text-green-700' },
    { label: 'Buzağılar', path: '/calves', color: 'text-green-700', borderColor: 'border-violet-700', hoverEffect: 'hover:bg-violet-700 hover:text-white' },
    { label: 'Düveler', path: '/heifers', color: 'text-green-700', borderColor: 'border-violet-700', hoverEffect: 'hover:bg-violet-700 hover:text-white' },
    { label: 'Danalar', path: '/bulls', color: 'text-green-700', borderColor: 'border-violet-700', hoverEffect: 'hover:bg-violet-700 hover:text-white' },
    { label: 'Aşılar', path: '/vaccines', color: 'text-green-700', borderColor: 'border-violet-700', hoverEffect: 'hover:bg-violet-700 hover:text-white' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {menus.map((menu, index) => (
        <button 
          key={index} 
          onClick={() => navigate(menu.path)} // Tıklanınca ilgili yola gider
          className={`${menu.hoverEffect ? menu.hoverEffect : ''} ${menu.bgColor ? menu.bgColor : 'bg-white'} ${menu.bgColor ? 'text-white' : menu.color} border-2 ${menu.borderColor} hover:cursor-pointer font-semibold py-4 px-6 rounded-lg shadow hover:opacity-90 transition text-center`}
        >
          {menu.label}
        </button>
      ))}
    </div>
  );
};