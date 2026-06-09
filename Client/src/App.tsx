import { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import heroImg from './assets/dental_hero.png';
import doctor1Img from './assets/doctor1.png';
import doctor2Img from './assets/doctor2.png';
import './App.css';

interface AppointmentForm {
  fullName: string;
  phone: string;
  email: string;
  service: string;
  doctor: string;
  date: string;
  notes: string;
}

export default function App() {
  const [formData, setFormData] = useState<AppointmentForm>({
    fullName: '',
    phone: '',
    email: '',
    service: '',
    doctor: '',
    date: '',
    notes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<AppointmentForm>>({});

  const services = [
    {
      id: 'implant',
      title: 'Cấy Ghép Implant',
      desc: 'Giải pháp phục hình răng đã mất tối ưu nhất hiện nay, phục hồi chức năng ăn nhai và thẩm mỹ giống như răng thật 99%.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
    },
    {
      id: 'ortho',
      title: 'Niềng Răng Thẩm Mỹ',
      desc: 'Điều chỉnh răng khấp khểnh, lệch khớp cắn bằng hệ thống mắc cài kim loại, sứ hoặc khay trong suốt Invisalign hiện đại.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
        </svg>
      )
    },
    {
      id: 'crown',
      title: 'Răng Sứ Thẩm Mỹ',
      desc: 'Bọc răng sứ titan, Cercon, Zirconia cao cấp giúp khắc phục tình trạng răng sứt mẻ, xỉn màu, mang lại hàm răng trắng đều.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    },
    {
      id: 'whitening',
      title: 'Tẩy Trắng Răng Laser',
      desc: 'Công nghệ tẩy trắng răng bằng ánh sáng laser hiện đại, loại bỏ mảng bám xỉn màu chỉ sau 45 phút, an toàn không buốt tê.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    },
    {
      id: 'general',
      title: 'Nha Khoa Tổng Quát',
      desc: 'Khám định kỳ răng miệng, lấy cao răng siêu âm nhẹ nhàng, điều trị tủy răng và nhổ răng khôn không đau bằng máy Piezotome.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      )
    }
  ];

  const doctors = [
    {
      id: 'doc-nguyen',
      name: 'ThS. BS. Nguyễn Minh Đức',
      role: 'Chuyên gia Cấy ghép Implant & Phẫu thuật Hàm mặt',
      degree: '12 năm kinh nghiệm - Tốt nghiệp xuất sắc Đại học Y Dược TP.HCM, tu nghiệp chuyên sâu tại Pháp.',
      image: doctor1Img
    },
    {
      id: 'doc-tran',
      name: 'BS. Trần Thị Thu Trang',
      role: 'Trưởng khoa Chỉnh nha & Thẩm mỹ Răng sứ',
      degree: '10 năm kinh nghiệm - Thành viên Hiệp hội Chỉnh nha Việt Nam (VAO), chứng chỉ Invisalign quốc tế.',
      image: doctor2Img
    }
  ];

  const selectDoctorAndScroll = (doctorName: string, serviceName: string) => {
    setFormData(prev => ({
      ...prev,
      doctor: doctorName,
      service: serviceName || prev.service
    }));
    
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof AppointmentForm]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Partial<AppointmentForm> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Vui lòng nhập họ tên';
    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/[\s.-]/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ (10-11 chữ số)';
    }
    if (!formData.service) errors.service = 'Vui lòng chọn dịch vụ';
    if (!formData.doctor) errors.doctor = 'Vui lòng chọn bác sĩ';
    if (!formData.date) errors.date = 'Vui lòng chọn ngày khám';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API Call to Server
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessModal(true);
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      service: '',
      doctor: '',
      date: '',
      notes: '',
    });
    setFormErrors({});
    setShowSuccessModal(false);
  };

  return (
    <>
      <Header />
      
      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section className="hero-wrapper" id="home">
          <div className="hero-content-grid">
            <div className="hero-text">
              <div className="hero-tag">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Phòng khám đạt chuẩn quốc tế
              </div>
              <h1 className="hero-title">
                Nụ cười rạng rỡ<br />
                <span>Kiến tạo tương lai</span>
              </h1>
              <p className="hero-description">
                DentalCare cam kết mang lại trải nghiệm chăm sóc răng miệng không đau, nhẹ nhàng cùng công nghệ số hóa 3D hàng đầu thế giới. Khám phá nụ cười đẹp tự nhiên ngay hôm nay!
              </p>
              <div className="hero-actions">
                <a href="#booking" className="btn btn-primary" onClick={(e) => { e.preventDefault(); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }); }}>Đặt Lịch Khám</a>
                <a href="#services" className="btn btn-secondary" onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }}>Các Dịch Vụ</a>
              </div>
            </div>
            <div className="hero-image-container">
              <div className="hero-bg-accent"></div>
              <img src={heroImg} className="hero-img-blob" alt="Dental Care Reception" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">10k+</div>
              <div className="stat-label">Khách Hàng Hài Lòng</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">15+</div>
              <div className="stat-label">Bác Sĩ Chuyên Khoa</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">99%</div>
              <div className="stat-label">Đánh Giá Tích Cực</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">10+</div>
              <div className="stat-label">Năm Kinh Nghiệm</div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="services-section">
          <div className="section-title-wrapper">
            <span className="section-tag">Dịch Vụ của Chúng Tôi</span>
            <h2 className="section-title">Chăm Sóc Nụ Cười Toàn Diện</h2>
            <p className="section-desc">Cung cấp đầy đủ các giải pháp nha khoa từ cơ bản đến chuyên sâu với độ chính xác cao và an toàn tuyệt đối.</p>
          </div>
          <div className="services-grid">
            {services.map(service => (
              <div key={service.id} className="service-card">
                <div className="service-icon-box">
                  {service.icon}
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.desc}</p>
                <a href="#booking" className="service-link" onClick={(e) => {
                  e.preventDefault();
                  setFormData(prev => ({ ...prev, service: service.title }));
                  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Đặt lịch khám dịch vụ này
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Doctors Section */}
        <section id="doctors">
          <div className="section-title-wrapper">
            <span className="section-tag">Đội Ngũ Chuyên Gia</span>
            <h2 className="section-title">Gặp Gỡ Các Bác Sĩ Của Chúng Tôi</h2>
            <p className="section-desc">Hội tụ những bác sĩ nha khoa có tay nghề cao, tận tâm, chu đáo và luôn đặt sức khỏe khách hàng lên hàng đầu.</p>
          </div>
          <div className="doctors-grid">
            {doctors.map(doctor => (
              <div key={doctor.id} className="doctor-card">
                <div className="doctor-img-box">
                  <img src={doctor.image} className="doctor-img" alt={doctor.name} />
                </div>
                <div className="doctor-info">
                  <h3 className="doctor-name">{doctor.name}</h3>
                  <span className="doctor-role">{doctor.role}</span>
                  <p className="doctor-degree">{doctor.degree}</p>
                  <button className="btn btn-secondary btn-sm" onClick={() => selectDoctorAndScroll(doctor.name, doctor.id === 'doc-nguyen' ? 'Cấy Ghép Implant' : 'Niềng Răng Thẩm Mỹ')}>
                    Đặt lịch với bác sĩ này
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="testimonials-section">
          <div className="section-title-wrapper">
            <span className="section-tag">Cảm Nhận Khách Hàng</span>
            <h2 className="section-title">Câu Chuyện Nụ Cười Thành Công</h2>
            <p className="section-desc">Sự hài lòng và hạnh phúc của khách hàng là động lực lớn nhất giúp chúng tôi không ngừng cải tiến dịch vụ.</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ))}
              </div>
              <p className="testimonial-text">
                "Tôi đã làm răng sứ thẩm mỹ tại DentalCare và cực kỳ hài lòng. Bác sĩ Trang làm rất tỉ mỉ, nhẹ nhàng, không hề đau như tôi nghĩ. Form răng lên tự nhiên và trắng sáng giúp tôi tự tin giao tiếp hẳn lên."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">H</div>
                <div>
                  <h4 className="author-name">Chị Thu Hằng</h4>
                  <span className="author-service">Bọc răng sứ Cercon</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ))}
              </div>
              <p className="testimonial-text">
                "Mất răng số 6 làm tôi ăn nhai rất khó khăn. Được bác sĩ Đức tư vấn cấy ghép Implant, quá trình làm nhanh gọn, thiết bị chụp 3D hiện đại nên đặt trụ rất chuẩn. Bây giờ răng chắc khỏe như răng thật vậy."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">M</div>
                <div>
                  <h4 className="author-name">Anh Hoàng Minh</h4>
                  <span className="author-service">Cấy ghép Implant Straumann</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Form Section */}
        <section id="booking">
          <div className="booking-grid">
            <div className="booking-info-box">
              <div>
                <h3 className="booking-info-title">Đặt Lịch Hẹn Khám</h3>
                <p className="booking-info-desc">Đặt lịch hẹn trực tuyến nhanh chóng trong 60 giây. Chúng tôi sẽ gọi điện xác nhận lịch hẹn của bạn ngay sau khi nhận được yêu cầu.</p>
              </div>
              <div className="contact-details">
                <div className="contact-detail-item">
                  <svg className="contact-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  <div className="contact-detail-text">
                    <h5>Hotline Hỗ Trợ 24/7</h5>
                    <p>1900 6789 - 028 7300 1234</p>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <svg className="contact-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <div className="contact-detail-text">
                    <h5>Địa Chỉ Phòng Khám</h5>
                    <p>123 Đường Ba Tháng Hai, Quận 10, TP. Hồ Chí Minh</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="booking-form-box">
              <form onSubmit={handleFormSubmit}>
                <div className="form-group-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="fullName">Họ và Tên *</label>
                    <input 
                      type="text" 
                      id="fullName"
                      name="fullName"
                      className="form-control"
                      placeholder="Nguyễn Văn A"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                    {formErrors.fullName && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{formErrors.fullName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">Số Điện Thoại *</label>
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone"
                      className="form-control"
                      placeholder="0901234567"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    {formErrors.phone && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{formErrors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Địa chỉ Email (Không bắt buộc)</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="nguyenvana@gmail.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="service">Dịch Vụ Khám *</label>
                    <select 
                      id="service"
                      name="service"
                      className="form-control"
                      value={formData.service}
                      onChange={handleInputChange}
                    >
                      <option value="">-- Chọn dịch vụ --</option>
                      {services.map(s => (
                        <option key={s.id} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                    {formErrors.service && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{formErrors.service}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="doctor">Bác Sĩ Mong Muốn *</label>
                    <select 
                      id="doctor"
                      name="doctor"
                      className="form-control"
                      value={formData.doctor}
                      onChange={handleInputChange}
                    >
                      <option value="">-- Chọn bác sĩ --</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                      <option value="Tùy chọn bác sĩ phù hợp">Bác sĩ nào cũng được (Phòng khám tự sắp xếp)</option>
                    </select>
                    {formErrors.doctor && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{formErrors.doctor}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="date">Ngày Hẹn Khám *</label>
                  <input 
                    type="date" 
                    id="date"
                    name="date"
                    className="form-control"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                  {formErrors.date && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{formErrors.date}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="notes">Ghi chú triệu chứng hoặc yêu cầu đặc biệt</label>
                  <textarea 
                    id="notes"
                    name="notes"
                    className="form-control"
                    placeholder="Ví dụ: Răng đau ê buốt khi uống nước lạnh..."
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      Đang xử lý lịch hẹn...
                    </>
                  ) : (
                    'Xác Nhận Đăng Ký Khám'
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-icon-box">
              <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h4 className="success-title">Đặt Lịch Thành Công!</h4>
            <p className="success-msg">
              Cảm ơn <strong>{formData.fullName}</strong>. Yêu cầu khám <strong>{formData.service}</strong> của bạn vào ngày <strong>{formData.date}</strong> cùng với <strong>{formData.doctor}</strong> đã được ghi nhận. Chúng tôi sẽ liên hệ qua điện thoại để xác nhận sớm nhất!
            </p>
            <button className="btn btn-primary" onClick={resetForm}>Đồng ý</button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
