import { User, LogOut, ChevronDown, Settings, LayoutDashboard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import logo from '../../img/Dentivo_logo.png';

interface HeaderProps {
  token: string | null;
  onLoginClick?: () => void;
  onLogout: () => void;
  minimal?: boolean;
}

export default function Header({ token, onLogout, minimal = false }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => localStorage.getItem('avatarUrl'));
  const [userRole, setUserRole] = useState<string | null>(() => localStorage.getItem('role'));
  const lastScrollY = useRef(0);
  const profileRef = useRef<HTMLDivElement>(null);

  // Sync avatarUrl from localStorage and API
  useEffect(() => {
    const syncAvatar = () => setAvatarUrl(localStorage.getItem('avatarUrl'));
    window.addEventListener('storage', syncAvatar);
    window.addEventListener('focus', syncAvatar);

    if (token) {
      axios.get('http://localhost:8080/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (res.data.avatarUrl) {
          setAvatarUrl(res.data.avatarUrl);
          localStorage.setItem('avatarUrl', res.data.avatarUrl);
        } else {
          setAvatarUrl(null);
          localStorage.removeItem('avatarUrl');
        }
        if (res.data.role) {
          setUserRole(res.data.role);
          localStorage.setItem('role', res.data.role);
        }
      })
      .catch(() => {});
    }

    return () => {
      window.removeEventListener('storage', syncAvatar);
      window.removeEventListener('focus', syncAvatar);
    };
  }, [token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Add background shadow when scrolled past 20px
      setScrolled(currentScrollY > 20);

      // Show header when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: scrolled ? 'var(--header-bg-scrolled)' : 'var(--header-bg)',
    boxShadow: scrolled ? '0 2px 20px rgba(0, 0, 0, 0.08)' : 'none',
    transform: visible ? 'translateY(0)' : 'translateY(-100%)',
    transition: 'transform 0.35s ease-in-out, box-shadow 0.3s ease, background-color 0.3s ease',
    backdropFilter: scrolled ? 'blur(10px)' : 'none',
  };

  return (
    <header style={headerStyle}>
      <div className="header container">
        <div className="logo">
          <img src={logo} alt="Dentivo Logo" />
        </div>
        {!minimal && (
          <nav className="nav-links">
            <div className="nav-item">
              <a href="#home">Trang chủ</a>
            </div>
            <div className="nav-item">
              <a href="#about">Giới thiệu</a>
            </div>
            <div className="nav-item dropdown">
              <a href="#services" className="dropdown-toggle">Dịch vụ <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></a>
              <div className="dropdown-menu">
                <a href="#our-services">Các dịch vụ</a>
                <a href="#service-details">Chi tiết dịch vụ</a>
              </div>
            </div>
            <div className="nav-item dropdown">
              <a href="#doctors" className="dropdown-toggle">Bác sĩ <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></a>
              <div className="dropdown-menu">
                <a href="#our-doctors">Đội ngũ bác sĩ</a>
                <a href="#doctor-details">Thông tin bác sĩ</a>
              </div>
            </div>
            <div className="nav-item dropdown">
              <a href="#pages" className="dropdown-toggle">Trang khác <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></a>
              <div className="dropdown-menu">
                <a href="#appointment">Đặt lịch</a>
                <a href="#pricing">Bảng giá</a>
                <a href="#blog-archive">Tin tức</a>
                <a href="#blog-details">Chi tiết tin tức</a>
                <a href="#faqs">Hỏi đáp</a>
                <a href="#404">Trang lỗi 404</a>
              </div>
            </div>
            <div className="nav-item">
              <a href="#contact">Liên hệ</a>
            </div>
          </nav>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: minimal ? 'auto' : '0' }}>
          {!minimal && location.pathname !== '/booking' && (
            <button className="btn btn-primary" onClick={() => navigate('/booking')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Đặt lịch hẹn
            </button>
          )}
          {token ? (
            <div className="nav-item" ref={profileRef} style={{ position: 'relative' }}>
              <button
                className="profile-toggle"
                title="Profile"
                onClick={() => setProfileOpen((prev) => !prev)}
              >
                <div className="avatar-wrapper">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="User Avatar"
                      onError={() => {
                        // Pre-signed URL expired or invalid → clear and show icon
                        localStorage.removeItem('avatarUrl');
                        setAvatarUrl(null);
                      }}
                    />
                  ) : (
                    <User size={20} color="white" />
                  )}
                </div>
                {/* Mũi tên xoay khi mở/đóng dropdown */}
                <span style={{
                  display: 'inline-flex',
                  transition: 'transform 0.3s ease',
                  transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}>
                  <ChevronDown size={16} color="var(--text-dark)" />
                </span>
              </button>

              {/* Dropdown hiện/ẩn bằng state thay vì CSS :hover */}
              <div
                className="dropdown-menu profile-menu"
                style={{
                  opacity: profileOpen ? 1 : 0,
                  visibility: profileOpen ? 'visible' : 'hidden',
                  transform: profileOpen ? 'translateY(0)' : 'translateY(15px)',
                  transition: 'opacity 0.3s ease, transform 0.3s ease, visibility 0.3s',
                }}
              >
                <button onClick={() => { setProfileOpen(false); navigate('/profile'); }}><User size={16} /> Hồ sơ</button>
                <button onClick={() => { setProfileOpen(false); navigate('/settings'); }}><Settings size={16} /> Cài đặt</button>
                {userRole === 'DOCTOR' && (
                  <button onClick={() => { setProfileOpen(false); navigate('/doctor-dashboard'); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                    Trang Bác sĩ
                  </button>
                )}
                {userRole === 'ADMIN' && (
                  <button onClick={() => { setProfileOpen(false); navigate('/admin/doctors'); }}>
                    <LayoutDashboard size={16} />
                    Trang Quản trị
                  </button>
                )}
                <div className="dropdown-divider"></div>
                <button onClick={() => {
                  localStorage.removeItem('avatarUrl');
                  localStorage.removeItem('role');
                  setAvatarUrl(null);
                  setUserRole(null);
                  setProfileOpen(false);
                  onLogout();
                }} className="logout-btn">
                  <LogOut size={16} /> Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <button className="icon-btn" onClick={() => navigate('/login')} title="Login / Register" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)' }}>
              <User size={24} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
