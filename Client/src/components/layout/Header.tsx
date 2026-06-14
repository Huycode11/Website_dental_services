import { User, LogOut } from 'lucide-react';
import logo from '../../img/Dentivo_logo.png';

interface HeaderProps {
  token: string | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function Header({ token, onLoginClick, onLogout }: HeaderProps) {
  return (
    <header className="header container">
      <div className="logo">
        <img src={logo} alt="Dentivio Logo" />
      </div>
      <nav className="nav-links">
        <div className="nav-item">
          <a href="#home">Home</a>
        </div>
        <div className="nav-item">
          <a href="#about">About</a>
        </div>
        <div className="nav-item dropdown">
          <a href="#services" className="dropdown-toggle">Services <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></a>
          <div className="dropdown-menu">
            <a href="#our-services">Our Services</a>
            <a href="#service-details">Service Details</a>
          </div>
        </div>
        <div className="nav-item dropdown">
          <a href="#doctors" className="dropdown-toggle">Doctors <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></a>
          <div className="dropdown-menu">
            <a href="#our-doctors">Our Doctors</a>
            <a href="#doctor-details">Doctor Details</a>
          </div>
        </div>
        <div className="nav-item dropdown">
          <a href="#pages" className="dropdown-toggle">Pages <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></a>
          <div className="dropdown-menu">
            <a href="#appointment">Appointment</a>
            <a href="#pricing">Pricing</a>
            <a href="#blog-archive">Blog Archive</a>
            <a href="#blog-details">Blog Details</a>
            <a href="#faqs">FAQs</a>
            <a href="#404">404 Page</a>
          </div>
        </div>
        <div className="nav-item">
          <a href="#contact">Contact</a>
        </div>
      </nav>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {token ? (
          <button className="icon-btn" onClick={onLogout} title="Logout" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)' }}>
            <LogOut size={24} />
          </button>
        ) : (
          <button className="icon-btn" onClick={onLoginClick} title="Login / Register" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)' }}>
            <User size={24} />
          </button>
        )}
        <button className="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          Book Appointment
        </button>
      </div>
    </header>
  );
}
