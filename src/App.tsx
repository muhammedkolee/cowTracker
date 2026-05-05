import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardPage } from './features/dashboard/DashboardPage';
import CowPage from './features/cows/CowPage';
import CalfPage from './features/calves/CalfPage';
import AnimalPage from './features/animals/AnimalPage';
import HeiferPage from './features/heifers/HeiferPage';
import BullPage from './features/bulls/BullPage';
import SettingsPage from './features/settings/SettingPage';
import VaccinePage from './features/vaccines/VaccinePage';
import DeletedAnimalsPage from './features/deletedAnimals/DeletedAnimals';
import AuthPage from './features/Auth/AuthPage';

function App() {
	const [isLoading, setIsLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            // Hatırlarsan electron-store (auth-session.json) içine kaydetmiştik
            const savedSession = await window.authAPI.getAuth(); 

            // Eğer session varsa, geçerliliğini Supabase üzerinden de kontrol edebilirsin
            if (savedSession) {
                setSession(savedSession);
            }
            
            setIsLoading(false);
        };

        checkSession();
    }, []);

    if (isLoading) {
        return <div className="bg-slate-600 h-screen flex items-center justify-center text-white">Yükleniyor...</div>;
    }


	return (
		<Router>
			<main className="h-screen w-screen bg-slate-100 overflow-x-hidden">
				<Routes>
				{/* Main Page */}
				<Route path="/" element={session ? <DashboardPage /> : <AuthPage />} />
				
				{/* Cows Page */}
				<Route path="/cows" element={<CowPage />} />

				{/* Animals Page */}
				<Route path="/animals" element={<AnimalPage />} />
				
				{/* Calves Page */}
				<Route path="/calves" element={<CalfPage />} />
				
				{/* Heifers Page */}
				<Route path="/heifers" element={<HeiferPage />} />
				
				{/* Bulls Page */}
				<Route path="/bulls" element={<BullPage />} />
				
				{/* Vaccines Page */}
				<Route path="/vaccines" element={<VaccinePage />} />

				{/* Deleted Animals Page */}
				<Route path="/trash" element={<DeletedAnimalsPage />} />

				{/* Settings Page */}
				<Route path="/settings" element={<SettingsPage />} />
				</Routes>
			</main>
		</Router>
	);
}

export default App;