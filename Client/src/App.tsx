import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminLayout from './components/admin/AdminLayout';
import AdminDoctorsPage from './pages/admin/AdminDoctorsPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminSpecialtiesPage from './pages/admin/AdminSpecialtiesPage';
import './index.css';
import './App.css';

export default function App() {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'Light';
    if (theme === 'Dark') {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, []);

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        
        {/* Admin Routes */}
        <Route path="/admin/doctors" element={<AdminLayout><AdminDoctorsPage /></AdminLayout>} />
        <Route path="/admin/services" element={<AdminLayout><AdminServicesPage /></AdminLayout>} />
        <Route path="/admin/categories" element={<AdminLayout><AdminCategoriesPage /></AdminLayout>} />
        <Route path="/admin/specialties" element={<AdminLayout><AdminSpecialtiesPage /></AdminLayout>} />
      </Routes>
    </>
  );
}
