import logoWhite from '../../img/Dentivo_logo_White.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <img src={logoWhite} alt="Dentivio" style={{height: '40px', marginBottom: '20px'}} />
            <p className="footer-text">Dentivo: Your premier dental destination, blending precision and compassion for a confident, healthy smile. Discover excellence in personalized care and experience dentistry redefined.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <div className="footer-links">
              <a href="#home">Home</a>
              <a href="#about">About Us</a>
              <a href="#services">Services</a>
              <a href="#doctors">Doctors</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Contact Info</h4>
            <div className="footer-links" style={{color: '#94A3B8'}}>
              <p style={{marginBottom: '10px'}}><strong>Address:</strong><br/>Dentivo Dental Clinic, 123 Sparkle Avenue, Cityville, DENT 54321, Dentaland</p>
              <p style={{marginBottom: '10px'}}><strong>Email:</strong><br/>info@dentivocare.com</p>
              <p><strong>Phone:</strong><br/>+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="footer-col">
            <h4>Newsletter</h4>
            <p className="footer-text">Join our newsletter to receive weekly health news.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your Email" />
              <button type="button" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Copyright © 2026 Dentivo. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
