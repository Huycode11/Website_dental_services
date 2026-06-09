export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-grid">
          
          {/* Brand Column */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.5 2 6.5 4.5 6 7.5C5.5 10.5 7 13 8.5 14.5C10 16 10.5 18 10 20C9.5 22 11 22 12 22C13 22 14.5 22 14 20C13.5 18 14 16 15.5 14.5C17 13 18.5 10.5 18 7.5C17.5 4.5 15.5 2 12 2Z" fill="currentColor"/>
                <path d="M10 6.5C10 6.5 11 5.5 12 5.5C13 5.5 14 6.5 14 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="logo-text">Dental<span className="logo-highlight">Care</span></span>
            </div>
            <p className="footer-desc">
              Mang lại nụ cười rạng rỡ và sự tự tin cho bạn với công nghệ nha khoa tiên tiến cùng đội ngũ chuyên gia tận tâm hàng đầu.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon-link" aria-label="Facebook">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a href="#" className="social-icon-link" aria-label="Zalo">
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Zalo</span>
              </a>
              <a href="#" className="social-icon-link" aria-label="Youtube">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.163c-.272-1.216-1.14-2.197-2.3-2.399C19.149 3.5 12 3.5 12 3.5s-7.149 0-9.198.264c-1.16.202-2.028 1.183-2.3 2.399C.25 8.18 0 12 0 12s.25 3.82.502 5.838c.272 1.215 1.14 2.196 2.3 2.398C4.851 20.5 12 20.5 12 20.5s7.149 0 9.198-.264c1.16-.202 2.028-1.183 2.3-2.398C23.75 15.82 24 12 24 12s-.25-3.82-.502-5.838zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="footer-col">
            <h4 className="footer-title">Khám Phá</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Trang Chủ</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleScrollToSection('services'); }}>Dịch Vụ</a></li>
              <li><a href="#doctors" onClick={(e) => { e.preventDefault(); handleScrollToSection('doctors'); }}>Đội Ngũ Bác Sĩ</a></li>
              <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); handleScrollToSection('testimonials'); }}>Đánh Giá Từ Khách Hàng</a></li>
              <li><a href="#booking" onClick={(e) => { e.preventDefault(); handleScrollToSection('booking'); }}>Đặt Lịch Khám</a></li>
            </ul>
          </div>

          {/* Services Column */}
          <div className="footer-col">
            <h4 className="footer-title">Dịch Vụ</h4>
            <ul className="footer-links">
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleScrollToSection('services'); }}>Cấy Ghép Implant</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleScrollToSection('services'); }}>Niềng Răng Thẩm Mỹ</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleScrollToSection('services'); }}>Bọc Răng Sứ</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleScrollToSection('services'); }}>Tẩy Trắng Răng Laser</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); handleScrollToSection('services'); }}>Khám Răng Tổng Quát</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="footer-col">
            <h4 className="footer-title">Liên Hệ</h4>
            <ul className="footer-contact-info">
              <li>
                <svg className="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>123 Đường Ba Tháng Hai, Quận 10, TP. Hồ Chí Minh</span>
              </li>
              <li>
                <svg className="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span>Hotline: 1900 6789 - 028 7300 1234</span>
              </li>
              <li>
                <svg className="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>Thứ 2 - Chủ Nhật: 08:00 - 20:00</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="copyright">&copy; {currentYear} DentalCare. Tất cả quyền được bảo lưu.</p>
          <div className="footer-bottom-links">
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
