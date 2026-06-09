import { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <a href="#" className="logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.5 2 6.5 4.5 6 7.5C5.5 10.5 7 13 8.5 14.5C10 16 10.5 18 10 20C9.5 22 11 22 12 22C13 22 14.5 22 14 20C13.5 18 14 16 15.5 14.5C17 13 18.5 10.5 18 7.5C17.5 4.5 15.5 2 12 2Z" fill="currentColor"/>
            <path d="M10 6.5C10 6.5 11 5.5 12 5.5C13 5.5 14 6.5 14 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="logo-text">Dental<span className="logo-highlight">Care</span></span>
        </a>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="nav-link">Trang Chủ</a>
          <a href="#services" onClick={(e) => { e.preventDefault(); handleScrollToSection('services'); }} className="nav-link">Dịch Vụ</a>
          <a href="#doctors" onClick={(e) => { e.preventDefault(); handleScrollToSection('doctors'); }} className="nav-link">Bác Sĩ</a>
          <a href="#testimonials" onClick={(e) => { e.preventDefault(); handleScrollToSection('testimonials'); }} className="nav-link">Đánh Giá</a>
          <a href="#booking" onClick={(e) => { e.preventDefault(); handleScrollToSection('booking'); }} className="btn btn-primary btn-sm btn-booking">Đặt Lịch Hẹn</a>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Nav */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'active' : ''}`}>
        <a href="#" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="mobile-nav-link">Trang Chủ</a>
        <a href="#services" onClick={(e) => { e.preventDefault(); handleScrollToSection('services'); }} className="mobile-nav-link">Dịch Vụ</a>
        <a href="#doctors" onClick={(e) => { e.preventDefault(); handleScrollToSection('doctors'); }} className="mobile-nav-link">Bác Sĩ</a>
        <a href="#testimonials" onClick={(e) => { e.preventDefault(); handleScrollToSection('testimonials'); }} className="mobile-nav-link">Đánh Giá</a>
        <a href="#booking" onClick={(e) => { e.preventDefault(); handleScrollToSection('booking'); }} className="btn btn-primary btn-booking-mobile">Đặt Lịch Hẹn</a>
      </div>
    </header>
  );
}
