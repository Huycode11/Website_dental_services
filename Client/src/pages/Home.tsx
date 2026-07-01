import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';
import '../App.css';
import Layout from '../components/layout/Layout';
import Reveal from '../components/Reveal';
import StatCounter from '../components/StatCounter';

// Import images
import hero1 from '../img/Hero_IMG-1.webp';
import hero2 from '../img/Hero_IMG-2.webp';

import iconWhitening from '../img/icon_teeth-whitening.png';
import iconRootCanal from '../img/icon_root-canal.png';
import iconSurgery from '../img/icon_dental-surgery.png';
import iconGum from '../img/icon_gum-treatment.png';

import videoCover from '../img/Video-Cover-IMG.webp';
import whyChoose from '../img/Why-Choose.webp';
import weTreatment from '../img/We-Treatment.webp';

import doctor2 from '../img/Doctor-2.webp';
import doctor3 from '../img/Doctor-3.webp';
import ctaImg from '../img/CTA-IMG.webp';

import blog2 from '../img/Blog-2.webp';
import blog3 from '../img/Blog-3.webp';
import test1 from '../img/Testimonial-1-1.png';
import test2 from '../img/Testimonial-2-1.png';

export default function Home() {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [doctors, setDoctors] = useState<any[]>([]);
  const navigate = useNavigate();
  
  const heroImages = [hero1, hero2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev === 0 ? 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/doctors');
        setDoctors(res.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }
    };
    fetchDoctors();
  }, []);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <Layout 
      token={token} 
      onLoginClick={() => {}} 
      onLogout={handleLogout}
    >
      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="container hero-title-container">
          <Reveal delay={0}>
            <div className="hero-title-row">
              <span>Duy trì</span>
              <div className="hero-image-wrapper">
                {heroImages.map((img, index) => (
                  <img 
                    key={index}
                    src={img} 
                    alt="Hero Slide" 
                    className={`hero-img-transition ${index === currentHeroIndex ? 'active' : 'inactive'}`} 
                  />
                ))}
                <div className="pure-badge">99%<br/>PURE</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="hero-title-row">
              <span>Nụ cười tuyệt đẹp</span>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="hero-title-row">
              <div className="hero-image-wrapper large">
                <img src={weTreatment} alt="Smile" className="hero-img-transition active" />
              </div>
              <span>Trắng sáng rạng rỡ</span>
            </div>
          </Reveal>
          
          <Reveal delay={300}>
            <p className="hero-desc text-center">
              Chúng tôi hiểu rằng việc đến nha khoa có thể khiến bạn lo lắng. Vì vậy, chúng tôi tập trung vào sự chăm sóc nhẹ nhàng, giao tiếp rõ ràng và mang lại trải nghiệm thoải mái trong mỗi lần khám.
            </p>
          </Reveal>
          
          <Reveal delay={400}>
            <button className="btn btn-primary" onClick={() => navigate('/booking')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Đặt lịch hẹn
            </button>
          </Reveal>
        </div>
      </section>

      {/* Services We Offer */}
      <section className="services-section section-padding" id="services">
        <div className="container">
          <Reveal>
            <div className="text-center">
              <h2 className="section-title">Dịch vụ của chúng tôi</h2>
              <p className="hero-desc">Chúng tôi cung cấp đầy đủ các phương pháp điều trị nha khoa nhằm bảo vệ, phục hồi và nâng tầm nụ cười của bạn một cách thoải mái nhất.</p>
            </div>
          </Reveal>
          
          <div className="services-grid">
            <Reveal delay={0}>
              <div className="service-card">
                <div className="service-icon"><img src={iconWhitening} alt="Teeth Whitening" /></div>
                <h3>Tẩy trắng răng</h3>
                <p>Làm bừng sáng nụ cười với dịch vụ Tẩy trắng răng tại Dentivo. Trải nghiệm sự chăm sóc chuyên nghiệp và lấy lại tự tin với nụ cười trắng sáng rạng rỡ chỉ sau một liệu trình.</p>
                <a href="#" className="read-more">Xem thêm &rarr;</a>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="service-card">
                <div className="service-icon"><img src={iconRootCanal} alt="Root Canal" /></div>
                <h3>Chữa tủy răng</h3>
                <p>Phục hồi sức khỏe răng miệng với độ chính xác cao. Dịch vụ Chữa tủy răng tiên tiến giúp loại bỏ cơn đau và bảo tồn răng thật của bạn một cách tối đa.</p>
                <a href="#" className="read-more">Xem thêm &rarr;</a>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="service-card">
                <div className="service-icon"><img src={iconSurgery} alt="Dental Surgery" /></div>
                <h3>Phẫu thuật nha khoa</h3>
                <p>Thực hiện các ca phẫu thuật phức tạp như nhổ răng khôn, ghép xương với đội ngũ bác sĩ chuyên khoa. Đảm bảo an toàn, không đau và nhanh hồi phục.</p>
                <a href="#" className="read-more">Xem thêm &rarr;</a>
              </div>
            </Reveal>
            <Reveal delay={300}>
              <div className="service-card">
                <div className="service-icon"><img src={iconGum} alt="Gum Treatment" /></div>
                <h3>Điều trị nướu</h3>
                <p>Chăm sóc chuyên sâu các bệnh lý về nướu như viêm nướu, viêm nha chu. Mang lại cho bạn nền tảng răng miệng vững chắc và nụ cười khỏe mạnh.</p>
                <a href="#" className="read-more">Xem thêm &rarr;</a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* About / Video */}
      <section className="section-padding" id="about">
        <div className="container about-grid">
          <Reveal direction="left">
            <div className="about-img-box">
              <div className="about-bg-shape"></div>
              <img src={videoCover} alt="Dental Team" className="about-img" />
              <div className="play-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </div>
            </div>
          </Reveal>
          <Reveal direction="right">
            <div>
              <h2 className="section-title">Nơi nụ cười khỏe mạnh bắt đầu</h2>
              <p>Tại Nha khoa Dentivo, chúng tôi không chỉ là những người cung cấp dịch vụ – chúng tôi tận tâm bảo vệ và hoàn thiện nụ cười của bạn. Với kỹ thuật hiện đại và sự tận tình, chúng tôi mang đến hiệu quả mà bạn có thể tin tưởng.</p>
              <br/>
              <p>Đội ngũ của chúng tôi luôn nỗ lực thay đổi trải nghiệm nha khoa trở nên nhẹ nhàng hơn. Hãy tin tưởng để chúng tôi giúp bạn tỏa sáng.</p>
              
              <div className="feature-list">
                <div className="feature-item">
                  <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Phương pháp điều trị nhẹ nhàng, không đau
                </div>
                <div className="feature-item">
                  <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm
                </div>
                <div className="feature-item">
                  <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Không gian thoải mái, lấy khách hàng làm trung tâm
                </div>
              </div>
              
              <button className="btn btn-primary">Về chúng tôi &rarr;</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats — Count Up */}
      <section className="container">
        <div className="stats-grid">
          <StatCounter value={12} suffix="k+" label="Khách hàng hài lòng" delay={0} />
          <StatCounter value={16} suffix="+" label="Năm kinh nghiệm" delay={100} />
          <StatCounter value={45} suffix="+" label="Bác sĩ chuyên khoa" delay={200} />
          <StatCounter value={48} suffix="+" label="Giải thưởng" delay={300} />
        </div>
      </section>

      {/* Why Choose */}
      <section className="section-padding container">
        <div className="why-grid">
          <Reveal direction="left">
            <div>
              <h2 className="section-title">Tại sao chọn Dentivo?</h2>
              <div className="why-list">
                <div className="why-item">
                  <h4><span>01/</span> Dịch vụ cá nhân hóa</h4>
                  <p>Trải nghiệm quá trình chăm sóc được thiết kế riêng biệt theo tình trạng răng miệng và nhu cầu cụ thể của từng khách hàng.</p>
                </div>
                <div className="why-item">
                  <h4><span>02/</span> Đội ngũ Bác sĩ chuyên môn cao</h4>
                  <p>An tâm trao gửi nụ cười cho đội ngũ bác sĩ chuyên khoa giỏi, được đào tạo bài bản và luôn cập nhật công nghệ điều trị mới nhất.</p>
                </div>
                <div className="why-item">
                  <h4><span>03/</span> Hỗ trợ nha khoa 24/7</h4>
                  <p>Sức khỏe của bạn là ưu tiên hàng đầu. Chúng tôi luôn sẵn sàng hỗ trợ giải đáp mọi vấn đề về răng miệng của bạn bất cứ lúc nào.</p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal direction="right">
            <div className="why-img-box">
              <img src={whyChoose} alt="Patient Care" className="why-img" />
              <div className="floating-card">
                <h4>Bác sĩ đang trực</h4>
                <p style={{fontSize: '12px', color: 'var(--text-gray)'}}>Danh sách bác sĩ</p>
                <div className="doc-list">
                  <div className="doc-mini">
                    <img src={doctor2} alt="Dr. William Stanh" />
                    <div>
                      <h5>Dr. William Stanh</h5>
                      <p>Nha sĩ tổng quát</p>
                    </div>
                  </div>
                  <div className="doc-mini">
                    <img src={doctor3} alt="Dr. Julia Smith" />
                    <div>
                      <h5>Dr. Julia Smith</h5>
                      <p>Nha sĩ Nhi khoa</p>
                    </div>
                  </div>
                </div>
                <button className="btn btn-outline" style={{width: '100%', padding: '8px', fontSize: '14px'}} onClick={() => navigate('/booking')}>Đặt lịch hẹn &rarr;</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Meet Our Specialists */}
      <section className="doctors-section section-padding" id="doctors">
        <div className="container text-center">
          <Reveal>
            <h2 className="section-title">Đội ngũ Chuyên gia</h2>
            <p className="hero-desc">Gặp gỡ những chuyên gia sẽ trực tiếp chăm sóc nụ cười của bạn. Điều trị nhẹ nhàng, hướng dẫn tận tình và kết quả đáng tin cậy.</p>
          </Reveal>
          
          <div className="doctors-grid">
            {doctors.length > 0 ? doctors.map((doc, i) => (
              <Reveal key={doc.id} delay={i * 100}>
                <div className="doctor-card">
                  <div className="doc-img-wrapper">
                    <img src={doc.avatarUrl || doctor2} alt={doc.fullName} />
                    <div className="social-links">
                      {doc.facebookLink && <a href={doc.facebookLink} target="_blank" rel="noreferrer">f</a>}
                      {doc.twitterLink && <a href={doc.twitterLink} target="_blank" rel="noreferrer">t</a>}
                      {doc.linkedinLink && <a href={doc.linkedinLink} target="_blank" rel="noreferrer">in</a>}
                    </div>
                  </div>
                  <h3>{doc.fullName}</h3>
                  <p>{doc.specialty}</p>
                  <button 
                    onClick={() => navigate('/booking', { state: { selectedDoctorId: doc.id } })}
                    className="btn btn-primary" 
                    style={{marginTop: '15px', padding: '8px 16px', fontSize: '14px', width: '100%', borderRadius: 'var(--radius-md)'}}
                  >
                    Đặt lịch
                  </button>
                </div>
              </Reveal>
            )) : (
              <p>Không tìm thấy bác sĩ.</p>
            )}
          </div>
          
          <Reveal delay={400}>
            <div style={{marginTop: '40px'}}>
              <button className="btn btn-primary">Xem tất cả bác sĩ &rarr;</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Comfortable Way */}
      <section className="section-padding container">
        <div className="why-grid" style={{alignItems: 'center'}}>
          <Reveal direction="left">
            <div>
              <h2 className="section-title">Điều trị bằng phương pháp<br/>thoải mái nhất</h2>
              <p style={{marginBottom: '30px'}}>Tại Dentivo, trải nghiệm của bạn luôn được chú trọng nhằm mang lại hiệu quả điều trị cao mà không gây khó chịu hay đau đớn.</p>
              <img src={weTreatment} alt="Comfortable Care" style={{borderRadius: 'var(--radius-md)', width: '100%'}} />
            </div>
          </Reveal>
          <Reveal direction="right">
            <div className="comfort-features">
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                <div></div>
                <button className="btn btn-primary" onClick={() => navigate('/booking')}>Đặt lịch hẹn</button>
              </div>
              
              <div className="comfort-box">
                <div className="comfort-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <div>
                  <h4 style={{marginBottom: '8px'}}>Đội ngũ chuyên gia, Chăm sóc tận tâm</h4>
                  <p style={{fontSize: '14px'}}>Phác đồ điều trị được cá nhân hóa nhằm hướng tới sức khỏe răng miệng lâu dài.</p>
                </div>
              </div>
              
              <div className="comfort-box">
                <div className="comfort-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                </div>
                <div>
                  <h4 style={{marginBottom: '8px'}}>Lấy khách hàng làm trung tâm</h4>
                  <p style={{fontSize: '14px'}}>Không chỉ là khách hàng, bạn là một người bạn được chúng tôi trân trọng.</p>
                </div>
              </div>
              
              <div className="comfort-box">
                <div className="comfort-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon><line x1="12" y1="22" x2="12" y2="15.5"></line><polyline points="22 8.5 12 15.5 2 8.5"></polyline><polyline points="2 15.5 12 8.5 22 15.5"></polyline><line x1="12" y1="2" x2="12" y2="8.5"></line></svg>
                </div>
                <div>
                  <h4 style={{marginBottom: '8px'}}>Dịch vụ toàn diện</h4>
                  <p style={{fontSize: '14px'}}>Cung cấp đầy đủ mọi giải pháp nha khoa đáp ứng mọi nhu cầu của bạn.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testi-section section-padding">
        <div className="container text-center">
          <Reveal>
            <h2 className="section-title">Đánh giá từ khách hàng</h2>
            <p className="hero-desc">Lắng nghe những cảm nhận thực tế của khách hàng về trải nghiệm, sự chăm sóc và kết quả điều trị tại Nha khoa Dentivo.</p>
          </Reveal>
          
          <div className="testi-grid" style={{textAlign: 'left'}}>
            <Reveal delay={0}>
              <div className="testi-card">
                <p className="testi-text">"From the first visit, the team at Dentivo was calm, organized, and genuinely caring. They explained every step clearly, answered my questions without rushing, and made the whole treatment feel comfortable and stress-free."</p>
                <div className="testi-author">
                  <img src={test1} alt="Sophia M." />
                  <div>
                    <h4 style={{marginBottom: '4px'}}>Sophia M.</h4>
                    <span style={{fontSize: '14px', color: 'var(--primary-color)'}}>Khách hàng thân thiết</span>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="testi-card">
                <p className="testi-text">"My cleaning and whitening experience was smooth and surprisingly comfortable. The hygienist was thorough, the staff was friendly, and the results looked natural. I appreciated how they focused on long-term oral health, not just quick fixes."</p>
                <div className="testi-author">
                  <img src={test2} alt="Daniel R." />
                  <div>
                    <h4 style={{marginBottom: '4px'}}>Daniel R.</h4>
                    <span style={{fontSize: '14px', color: 'var(--primary-color)'}}>Khách hàng thân thiết</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* News & Articles */}
      <section className="section-padding container text-center">
        <Reveal>
          <h2 className="section-title">Tin tức & Bài viết</h2>
          <p className="hero-desc">Cập nhật những kiến thức và mẹo chăm sóc răng miệng mới nhất từ chuyên gia.</p>
        </Reveal>
        
        <div className="news-grid" style={{textAlign: 'left'}}>
          <Reveal delay={0}>
            <div className="news-card">
              <img src={blog2} alt="Blog post" />
              <span className="news-date">24 Tháng 2, 2026</span>
              <h3>Bí quyết ngăn ngừa các bệnh lý về nướu</h3>
              <a href="#" className="read-more">Xem thêm &rarr;</a>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="news-card">
              <img src={blog3} alt="Blog post" />
              <span className="news-date">24 Tháng 2, 2026</span>
              <h3>Mão răng sứ: Khi nào bạn thực sự cần đến nó?</h3>
              <a href="#" className="read-more">Xem thêm &rarr;</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <Reveal>
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2 className="section-title">Bạn đang gặp vấn đề về răng miệng?</h2>
              <p style={{marginBottom: '30px'}}>Hãy để chúng tôi giải quyết triệt để cơn đau nhức, ê buốt. Đội ngũ bác sĩ sẽ tư vấn phương án điều trị tốt nhất cho bạn.</p>
              <button className="btn btn-primary">Liên hệ ngay &rarr;</button>
            </div>
            <img src={ctaImg} alt="Dental Team" className="cta-image" />
          </div>
        </section>
      </Reveal>
    </Layout>
  );
}
