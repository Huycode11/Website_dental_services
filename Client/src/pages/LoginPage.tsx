import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (!termsAccepted) {
        setError('You must accept the Terms of Service and Privacy Policy');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      if (!/.*[A-Z].*/.test(password)) {
        setError('Password must contain at least one uppercase letter.');
        return;
      }
      if (!/.*[0-9].*/.test(password)) {
        setError('Password must contain at least one number.');
        return;
      }
      if (!/.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*/.test(password)) {
        setError('Password must contain at least one special character.');
        return;
      }
      if (!/^[\x21-\x7E]+$/.test(password)) {
        setError('Password must not contain spaces or accented characters.');
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:8080/api/auth/login', {
          email,
          password
        });
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          if (res.data.role) localStorage.setItem('role', res.data.role);
          // Fetch profile to get avatarUrl
          try {
            const profile = await axios.get('http://localhost:8080/api/user/profile', {
              headers: { Authorization: `Bearer ${res.data.token}` }
            });
            if (profile.data.avatarUrl) localStorage.setItem('avatarUrl', profile.data.avatarUrl);
            else localStorage.removeItem('avatarUrl');
          } catch { /* ignore */ }
          
          if (res.data.role === 'DOCTOR' || res.data.role === 'ROLE_DOCTOR') {
            navigate('/doctor-dashboard');
          } else {
            navigate('/');
          }
        }
      } else {
        const res = await axios.post('http://localhost:8080/api/auth/register', {
          email,
          password,
          fullName
        });
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          if (res.data.role) localStorage.setItem('role', res.data.role);
          localStorage.removeItem('avatarUrl'); // new user has no avatar yet
          
          if (res.data.role === 'DOCTOR' || res.data.role === 'ROLE_DOCTOR') {
            navigate('/doctor-dashboard');
          } else {
            navigate('/');
          }
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
      } else {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className={`login-card ${!isLogin ? 'register-card' : ''}`}>
        <div className="login-header">
          <div className="login-logo-placeholder">
            <Box size={24} color="var(--primary-color)" />
          </div>
          <h2>{isLogin ? 'Chào mừng đến Dentivo' : 'Tạo tài khoản'}</h2>
          <p>{isLogin ? 'Mừng bạn trở lại! Vui lòng đăng nhập vào tài khoản' : 'Tham gia cùng chúng tôi hôm nay và bắt đầu hành trình'}</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {isLogin ? (
            // LOGIN FORM
            <>
              <div className="input-group">
                <label>Địa chỉ Email</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input 
                    type="email" 
                    placeholder="Nhập email của bạn" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Mật khẩu</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Nhập mật khẩu" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="forgot-password">
                <button type="button" onClick={() => navigate('/forgot-password')} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '14px', fontWeight: 500, padding: 0 }}>Quên mật khẩu?</button>
              </div>
            </>
          ) : (
            // REGISTER FORM
            <div className="register-grid">
              <div className="input-group">
                <label>Họ và Tên</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input 
                    type="text" 
                    placeholder="Nhập họ và tên" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Địa chỉ Email</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input 
                    type="email" 
                    placeholder="Nhập email của bạn" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Mật khẩu</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Nhập mật khẩu" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password.length > 0 && (
                  password.length < 8 || 
                  !/.*[A-Z].*/.test(password) || 
                  !/.*[0-9].*/.test(password) || 
                  !/.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*/.test(password) ||
                  !/^[\x21-\x7E]+$/.test(password)
                ) && (
                  <ul style={{ fontSize: '12px', color: '#ef4444', marginTop: '8px', paddingLeft: '20px', marginBottom: 0 }}>
                    <li style={{ color: password.length >= 8 ? '#059669' : '#ef4444' }}>Ít nhất 8 ký tự</li>
                    <li style={{ color: /.*[A-Z].*/.test(password) ? '#059669' : '#ef4444' }}>Chứa ít nhất 1 chữ hoa</li>
                    <li style={{ color: /.*[0-9].*/.test(password) ? '#059669' : '#ef4444' }}>Chứa ít nhất 1 chữ số</li>
                    <li style={{ color: /.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*/.test(password) ? '#059669' : '#ef4444' }}>Chứa ít nhất 1 ký tự đặc biệt</li>
                    <li style={{ color: /^[\x21-\x7E]+$/.test(password) ? '#059669' : '#ef4444' }}>Không chứa khoảng trắng, có dấu</li>
                  </ul>
                )}
              </div>

              <div className="input-group">
                <label>Xác nhận mật khẩu</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Nhập lại mật khẩu" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {!isLogin && (
            <div className="terms-checkbox">
              <input 
                type="checkbox" 
                id="terms" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label htmlFor="terms">
                Tôi đồng ý với <a href="#">Điều khoản dịch vụ</a> và <a href="#">Chính sách bảo mật</a>
              </label>
            </div>
          )}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? 'Vui lòng đợi...' : (isLogin ? 'Đăng nhập' : 'Tạo tài khoản')}
          </button>
        </form>

        <div className="login-footer">
          {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <button type="button" className="toggle-auth-mode" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
}
