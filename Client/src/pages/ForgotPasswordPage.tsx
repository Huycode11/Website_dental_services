import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, KeyRound, ArrowLeft, Loader2, CheckCircle2, Send } from 'lucide-react';
import './LoginPage.css';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
      setSuccess('Reset instructions sent to your email.');
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!otp || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu không khớp.');
      return;
    }

    // Client-side validation for password complexity
    if (newPassword.length < 8) {
      setError('Mật khẩu phải dài ít nhất 8 ký tự.');
      return;
    }
    if (!/.*[A-Z].*/.test(newPassword)) {
      setError('Mật khẩu phải chứa ít nhất 1 chữ hoa.');
      return;
    }
    if (!/.*[0-9].*/.test(newPassword)) {
      setError('Mật khẩu phải chứa ít nhất 1 số.');
      return;
    }
    if (!/.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*/.test(newPassword)) {
      setError('Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt.');
      return;
    }
    if (!/^[\x21-\x7E]+$/.test(newPassword)) {
      setError('Mật khẩu không được chứa khoảng trắng hoặc có dấu.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/auth/reset-password', { 
        email, 
        otp, 
        newPassword 
      });
      setSuccess('Đã đặt lại mật khẩu thành công.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <div className="login-card" style={{ padding: '40px', maxWidth: '450px', width: '100%', backgroundColor: 'var(--bg-main)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        <div className="login-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            width: '60px', height: '60px', backgroundColor: 'var(--primary-color)', 
            borderRadius: '16px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', margin: '0 auto 20px', 
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)' 
          }}>
            <Send color="#ffffff" size={28} style={{ marginLeft: '-2px', marginTop: '2px' }} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>Quên mật khẩu?</h2>
          <p style={{ color: '#6b7280', fontSize: '15px' }}>
            {step === 1 ? "Nhập email của bạn để nhận mã xác nhận." : "Nhập mã OTP và mật khẩu mới."}
          </p>
        </div>

        {error && <div className="error-message" style={{ background: '#fee2e2', color: '#ef4444', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}
        {success && <div className="success-message" style={{ background: '#d1fae5', color: '#059669', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} />{success}</div>}

        {step === 1 ? (
          <form className="login-form" onSubmit={handleSendOtp}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Địa chỉ Email</label>
              <div className="input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail className="input-icon" size={20} style={{ position: 'absolute', left: '14px', color: '#9ca3af' }} />
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  style={{ 
                    width: '100%', padding: '12px 14px 12px 42px', 
                    border: '1px solid #d1d5db', borderRadius: '8px', 
                    fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' 
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>

            <button type="submit" className="login-submit" disabled={loading} style={{ 
              width: '100%', padding: '14px', backgroundColor: 'var(--primary-color)', 
              color: '#fff', border: 'none', borderRadius: '8px', 
              fontSize: '16px', fontWeight: 600, cursor: 'pointer', 
              transition: 'background-color 0.2s', marginBottom: '24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
              {loading ? <><Loader2 className="spinner" size={20} /> Đang xử lý...</> : 'Gửi mã xác nhận'}
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleResetPassword}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Mã OTP</label>
              <div className="input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <KeyRound className="input-icon" size={20} style={{ position: 'absolute', left: '14px', color: '#9ca3af' }} />
                <input
                  type="text"
                  placeholder="Nhập mã 6 số"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                  maxLength={6}
                  required
                  style={{ 
                    width: '100%', padding: '12px 14px 12px 42px', 
                    border: '1px solid #d1d5db', borderRadius: '8px', 
                    fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' 
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Mật khẩu mới</label>
              <div className="input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock className="input-icon" size={20} style={{ position: 'absolute', left: '14px', color: '#9ca3af' }} />
                <input
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  required
                  style={{ 
                    width: '100%', padding: '12px 14px 12px 42px', 
                    border: '1px solid #d1d5db', borderRadius: '8px', 
                    fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' 
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#F59E0B'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
              {newPassword.length > 0 && (
                newPassword.length < 8 || 
                !/.*[A-Z].*/.test(newPassword) || 
                !/.*[0-9].*/.test(newPassword) || 
                !/.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*/.test(newPassword) ||
                !/^[\x21-\x7E]+$/.test(newPassword)
              ) && (
                <ul style={{ fontSize: '12px', color: '#ef4444', marginTop: '8px', paddingLeft: '20px', marginBottom: 0 }}>
                  <li style={{ color: newPassword.length >= 8 ? '#059669' : '#ef4444' }}>Ít nhất 8 ký tự</li>
                  <li style={{ color: /.*[A-Z].*/.test(newPassword) ? '#059669' : '#ef4444' }}>Chứa ít nhất 1 chữ hoa</li>
                  <li style={{ color: /.*[0-9].*/.test(newPassword) ? '#059669' : '#ef4444' }}>Chứa ít nhất 1 chữ số</li>
                  <li style={{ color: /.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*/.test(newPassword) ? '#059669' : '#ef4444' }}>Chứa ít nhất 1 ký tự đặc biệt</li>
                  <li style={{ color: /^[\x21-\x7E]+$/.test(newPassword) ? '#059669' : '#ef4444' }}>Không chứa khoảng trắng, có dấu</li>
                </ul>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Xác nhận mật khẩu</label>
              <div className="input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock className="input-icon" size={20} style={{ position: 'absolute', left: '14px', color: '#9ca3af' }} />
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                  style={{ 
                    width: '100%', padding: '12px 14px 12px 42px', 
                    border: '1px solid #d1d5db', borderRadius: '8px', 
                    fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' 
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#F59E0B'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>

            <button type="submit" className="login-submit" disabled={loading} style={{ 
              width: '100%', padding: '14px', backgroundColor: 'var(--primary-color)', 
              color: '#fff', border: 'none', borderRadius: '8px', 
              fontSize: '16px', fontWeight: 600, cursor: 'pointer', 
              transition: 'background-color 0.2s', marginBottom: '24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
              {loading ? <><Loader2 className="spinner" size={20} /> Đang xử lý...</> : 'Đặt lại mật khẩu'}
            </button>
          </form>
        )}

        <div className="login-footer" style={{ textAlign: 'center' }}>
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '15px' }}>
            <ArrowLeft size={16} /> Quay lại Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
