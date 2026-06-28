import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Activity, Building, BookOpen, CheckCircle, Bell, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Tổng quan', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Bác sĩ', path: '/admin/doctors', icon: <Users size={20} /> },
    { name: 'Lịch khám', path: '/admin/schedule', icon: <Calendar size={20} /> },
    { name: 'Dịch vụ', path: '/admin/services', icon: <Activity size={20} /> },
    { name: 'Danh mục dịch vụ', path: '/admin/categories', icon: <Activity size={20} /> },
    { name: 'Phòng khám', path: '/admin/clinics', icon: <Building size={20} /> },
    { name: 'Chuyên khoa', path: '/admin/specialties', icon: <BookOpen size={20} /> },
    { name: 'Quản lý lịch hẹn', path: '/admin/registrations', icon: <Calendar size={20} /> },
    { name: 'Người dùng', path: '/admin/users', icon: <Users size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'var(--font-secondary)' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: 'var(--secondary-color)', color: 'var(--text-light)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--font-primary)' }}>Dashboard</h2>
        </div>
        
        <nav style={{ flex: 1, padding: '0 12px' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '8px',
                color: isActive ? 'var(--text-light)' : '#9ca3af',
                background: isActive ? 'var(--primary-color)' : 'transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s'
              })}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ height: '70px', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 32px', gap: '20px' }}>
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-gray)' }}>
            <Bell size={22} />
          </button>
          <button 
            onClick={handleLogout}
            style={{ background: 'var(--primary-color)', border: 'none', color: 'var(--text-light)', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LogOut size={18} />
          </button>
        </header>

        {/* Page Content */}
        <main style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
