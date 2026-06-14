import { useState, useEffect } from 'react';
import './index.css';
import './App.css';
import Layout from './components/layout/Layout';
import AuthModal from './components/AuthModal';

// Import images
import hero1 from './img/Hero_IMG-1.webp';
import hero2 from './img/Hero_IMG-2.webp';

import iconWhitening from './img/icon_teeth-whitening.png';
import iconRootCanal from './img/icon_root-canal.png';
import iconSurgery from './img/icon_dental-surgery.png';
import iconGum from './img/icon_gum-treatment.png';

import videoCover from './img/Video-Cover-IMG.webp';
import whyChoose from './img/Why-Choose.webp';
import weTreatment from './img/We-Treatment.webp';

import doctor2 from './img/Doctor-2.webp';
import doctor3 from './img/Doctor-3.webp';
import doctor5 from './img/Doctor-5.webp';
import doctor6 from './img/Doctor-6.webp';
import ctaImg from './img/CTA-IMG.webp';

import blog2 from './img/Blog-2.webp';
import blog3 from './img/Blog-3.webp';
import test1 from './img/Testimonial-1-1.png';
import test2 from './img/Testimonial-2-1.png';

export default function App() {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const heroImages = [hero1, hero2];

  // Image Transition Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev === 0 ? 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <Layout 
      token={token} 
      onLoginClick={() => setIsAuthModalOpen(true)} 
      onLogout={handleLogout}
    >
      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)} 
          onLoginSuccess={handleLoginSuccess} 
        />
      )}
      
      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="container hero-title-container">
          <div className="hero-title-row">
            <span>Maintain</span>
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
          <div className="hero-title-row">
            <span>That Wonderful</span>
          </div>
          <div className="hero-title-row">
            <div className="hero-image-wrapper large">
              <img src={weTreatment} alt="Smile" className="hero-img-transition active" />
            </div>
            <span>Clean Smile</span>
          </div>
          
          <p className="hero-desc text-center">
            We understand that visiting the dentist can feel overwhelming, so we focus on gentle care, clear communication, and a comfortable experience at every visit, ensuring you feel safe and confident.
          </p>
          
          <button className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Book Appointment
          </button>
        </div>
      </section>

      {/* Services We Offer */}
      <section className="services-section section-padding" id="services">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">Services We Offer</h2>
            <p className="hero-desc">We provide a complete range of dental treatments designed to protect, restore, and enhance your smile with comfort and care.</p>
          </div>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon"><img src={iconWhitening} alt="Teeth Whitening" /></div>
              <h3>Teeth Whitening</h3>
              <p>Illuminate your smile with our Teeth Whitening service at Dentivo Dental Hospital. Experience professional care and regain confidence with a brighter, whiter, and healthier smile in just one session. Unveil a radiant, picture-perfect grin today!</p>
              <a href="#" className="read-more">Read More &rarr;</a>
            </div>
            <div className="service-card">
              <div className="service-icon"><img src={iconRootCanal} alt="Root Canal" /></div>
              <h3>Root Canal</h3>
              <p>Revitalize your oral health with precision and care. Dentivo Dental Hospital offers advanced Root Canal services, eliminating discomfort and preserving your natural smile. Trust our experts for a pain-free journey to a healthier, happier mouth.</p>
              <a href="#" className="read-more">Read More &rarr;</a>
            </div>
            <div className="service-card">
              <div className="service-icon"><img src={iconSurgery} alt="Dental Surgery" /></div>
              <h3>Dental Surgery</h3>
              <p>Transforming Smiles, Restoring Confidence. Dentivo Dental Hospital excels in advanced Dental Surgery. Our skilled surgeons prioritize precision and patient comfort for a seamless experience. Trust us for expert care, ensuring your oral well-being through every step of your surgical journey.</p>
              <a href="#" className="read-more">Read More &rarr;</a>
            </div>
            <div className="service-card">
              <div className="service-icon"><img src={iconGum} alt="Gum Treatment" /></div>
              <h3>Gum Treatment</h3>
              <p>Elevate your oral wellness with Dentivo Dental Hospital's Gum Treatment. Our specialized care focuses on gum health, offering personalized solutions to combat issues like gingivitis or periodontitis. Rediscover a confident, healthy smile with our expert gum care tailored just for you.</p>
              <a href="#" className="read-more">Read More &rarr;</a>
            </div>
          </div>
        </div>
      </section>

      {/* About / Video */}
      <section className="section-padding" id="about">
        <div className="container about-grid">
          <div className="about-img-box">
            <div className="about-bg-shape"></div>
            <img src={videoCover} alt="Dental Team" className="about-img" />
            <div className="play-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
          </div>
          <div>
            <h2 className="section-title">This is where healthy smiles in Dentivo begin</h2>
            <p>At Dentivo Dental Clinic, we are more than dental care providers – we are dedicated to protecting and enhancing your smile. With precision, technology, and compassionate care, our team delivers treatment you can trust.</p>
            <br/>
            <p>With a passion for precision and compassionate care, our team transforms dental experiences. Trust us for excellence and a brighter, healthier you.</p>
            
            <div className="feature-list">
              <div className="feature-item">
                <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Gentle, pain-aware treatment approach
              </div>
              <div className="feature-item">
                <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Experienced and certified dental specialists
              </div>
              <div className="feature-item">
                <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Comfortable, patient-focused environment
              </div>
            </div>
            
            <button className="btn btn-primary">More about us &rarr;</button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">12k+</div>
            <div className="stat-label">Happy Patients</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">16+</div>
            <div className="stat-label">Years Trusted Care</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">45+</div>
            <div className="stat-label">Certified Dentists</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">48+</div>
            <div className="stat-label">Award Winning</div>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="section-padding container">
        <div className="why-grid">
          <div>
            <h2 className="section-title">Why Choose Dentivo?</h2>
            <div className="why-list">
              <div className="why-item">
                <h4><span>01/</span> Personalised Service</h4>
                <p>Experience tailored care that revolves around your unique needs. Our dedicated team ensures your dental journey is crafted with precision, addressing your individual concerns for a truly personalized and comforting experience.</p>
              </div>
              <div className="why-item">
                <h4><span>02/</span> Certified Dentists & Specialists</h4>
                <p>Entrust your oral health to a team of highly skilled nurses and staff. With expertise and compassion, they provide a foundation of care, ensuring your well-being and comfort throughout your visit to Dentivo Dental Hospital.</p>
              </div>
              <div className="why-item">
                <h4><span>03/</span> Emergency Dental Support</h4>
                <p>Your well-being is our priority, and we're here for you around the clock. Access expert guidance and support anytime, ensuring peace of mind and immediate assistance for your dental concerns, day or night.</p>
              </div>
            </div>
          </div>
          <div className="why-img-box">
            <img src={whyChoose} alt="Patient Care" className="why-img" />
            <div className="floating-card">
              <h4>Available Doctors</h4>
              <p style={{fontSize: '12px', color: 'var(--text-gray)'}}>Select doctors</p>
              <div className="doc-list">
                <div className="doc-mini">
                  <img src={doctor2} alt="Dr. William Stanh" />
                  <div>
                    <h5>Dr. William Stanh</h5>
                    <p>General Dentist</p>
                  </div>
                </div>
                <div className="doc-mini">
                  <img src={doctor3} alt="Dr. Julia Smith" />
                  <div>
                    <h5>Dr. Julia Smith</h5>
                    <p>Pediatric Dentist</p>
                  </div>
                </div>
              </div>
              <button className="btn btn-outline" style={{width: '100%', padding: '8px', fontSize: '14px'}}>Book Appointment &rarr;</button>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Specialists */}
      <section className="doctors-section section-padding" id="doctors">
        <div className="container text-center">
          <h2 className="section-title">Meet Our Specialists</h2>
          <p className="hero-desc">Meet our specialists and learn who will care for your smile. Gentle treatment, clear guidance, and trusted results every time.</p>
          
          <div className="doctors-grid">
            <div className="doctor-card">
              <div className="doc-img-wrapper">
                <img src={doctor2} alt="Dr. James Carter" />
                <div className="social-links">
                  <a href="#">f</a>
                  <a href="#">t</a>
                  <a href="#">in</a>
                </div>
              </div>
              <h3>Dr. James Carter</h3>
              <p>Orthodontics</p>
            </div>
            <div className="doctor-card">
              <div className="doc-img-wrapper">
                <img src={doctor3} alt="Dr. Jessica Lee" />
                <div className="social-links">
                  <a href="#">f</a>
                  <a href="#">t</a>
                  <a href="#">in</a>
                </div>
              </div>
              <h3>Dr. Jessica Lee</h3>
              <p>Periodontics</p>
            </div>
            <div className="doctor-card">
              <div className="doc-img-wrapper">
                <img src={doctor5} alt="Dr. Emily Thompson" />
                <div className="social-links">
                  <a href="#">f</a>
                  <a href="#">t</a>
                  <a href="#">in</a>
                </div>
              </div>
              <h3>Dr. Emily Thompson</h3>
              <p>Oral Surgeon</p>
            </div>
            <div className="doctor-card">
              <div className="doc-img-wrapper">
                <img src={doctor6} alt="Dr. Sarah Cooper" />
                <div className="social-links">
                  <a href="#">f</a>
                  <a href="#">t</a>
                  <a href="#">in</a>
                </div>
              </div>
              <h3>Dr. Sarah Cooper</h3>
              <p>General Dentistry</p>
            </div>
          </div>
          
          <div style={{marginTop: '40px'}}>
            <button className="btn btn-primary">See All Doctors &rarr;</button>
          </div>
        </div>
      </section>

      {/* Comfortable Way */}
      <section className="section-padding container">
        <div className="why-grid" style={{alignItems: 'center'}}>
          <div>
            <h2 className="section-title">We Treat You in the<br/>Most Comfortable Way</h2>
            <p style={{marginBottom: '30px'}}>Comfortable Dentistry, Compassionate Care. At Dentivo, your well-being is our focus, ensuring a comfortable and effective journey to a healthier smile.</p>
            <img src={weTreatment} alt="Comfortable Care" style={{borderRadius: 'var(--radius-md)', width: '100%'}} />
          </div>
          <div className="comfort-features">
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
              <div></div>
              <button className="btn btn-primary">Book Appointment</button>
            </div>
            
            <div className="comfort-box">
              <div className="comfort-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <h4 style={{marginBottom: '8px'}}>Expert Team, Personalized Care</h4>
                <p style={{fontSize: '14px'}}>Personalized treatment plans tailored to your needs and long-term oral health goals.</p>
              </div>
            </div>
            
            <div className="comfort-box">
              <div className="comfort-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
              </div>
              <div>
                <h4 style={{marginBottom: '8px'}}>Patient-Centric Approach</h4>
                <p style={{fontSize: '14px'}}>More than a patient, you're valued. Our personalized care fosters trust.</p>
              </div>
            </div>
            
            <div className="comfort-box">
              <div className="comfort-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon><line x1="12" y1="22" x2="12" y2="15.5"></line><polyline points="22 8.5 12 15.5 2 8.5"></polyline><polyline points="2 15.5 12 8.5 22 15.5"></polyline><line x1="12" y1="2" x2="12" y2="8.5"></line></svg>
              </div>
              <div>
                <h4 style={{marginBottom: '8px'}}>Comprehensive Services</h4>
                <p style={{fontSize: '14px'}}>Your all-in-one dental destination. We meet every oral health need under our roof.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testi-section section-padding">
        <div className="container text-center">
          <h2 className="section-title">Patients Feedback</h2>
          <p className="hero-desc">Discover what our patients have to say about their experience at Dentivo Dental Clinic. Read genuine testimonials highlighting the comfort, care, and results they received.</p>
          
          <div className="testi-grid" style={{textAlign: 'left'}}>
            <div className="testi-card">
              <p className="testi-text">"From the first visit, the team at Dentivo was calm, organized, and genuinely caring. They explained every step clearly, answered my questions without rushing, and made the whole treatment feel comfortable and stress-free."</p>
              <div className="testi-author">
                <img src={test1} alt="Sophia M." />
                <div>
                  <h4 style={{marginBottom: '4px'}}>Sophia M.</h4>
                  <span style={{fontSize: '14px', color: 'var(--primary-color)'}}>Regular Patient</span>
                </div>
              </div>
            </div>
            <div className="testi-card">
              <p className="testi-text">"My cleaning and whitening experience was smooth and surprisingly comfortable. The hygienist was thorough, the staff was friendly, and the results looked natural. I appreciated how they focused on long-term oral health, not just quick fixes."</p>
              <div className="testi-author">
                <img src={test2} alt="Daniel R." />
                <div>
                  <h4 style={{marginBottom: '4px'}}>Daniel R.</h4>
                  <span style={{fontSize: '14px', color: 'var(--primary-color)'}}>Regular Patient</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News & Articles */}
      <section className="section-padding container text-center">
        <h2 className="section-title">News & Articles</h2>
        <p className="hero-desc">Stay informed with the latest dental insights and tips at Dentivo Dental Hospital. Your key to a healthier, brighter smile.</p>
        
        <div className="news-grid" style={{textAlign: 'left'}}>
          <div className="news-card">
            <img src={blog2} alt="Blog post" />
            <span className="news-date">February 24, 2026</span>
            <h3>How to Prevent Gum Disease Before It Becomes a Serious Problem</h3>
            <a href="#" className="read-more">Read More &rarr;</a>
          </div>
          <div className="news-card">
            <img src={blog3} alt="Blog post" />
            <span className="news-date">February 24, 2026</span>
            <h3>Dental Crowns Explained: When and Why You Might Need One</h3>
            <a href="#" className="read-more">Read More &rarr;</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="section-title">Are You Having Issues With Your Teeth?</h2>
            <p style={{marginBottom: '30px'}}>Get relief from tooth pain, sensitivity, or gum discomfort. Our dental team provides clear guidance and comfortable treatment options.</p>
            <button className="btn btn-primary">Contact us now &rarr;</button>
          </div>
          <img src={ctaImg} alt="Dental Team" className="cta-image" />
        </div>
      </section>
    </Layout>
  );
}
