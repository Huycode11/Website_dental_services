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
      setError('Passwords do not match.');
      return;
    }

    // Client-side validation for password complexity
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (!/.*[A-Z].*/.test(newPassword)) {
      setError('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/.*[0-9].*/.test(newPassword)) {
      setError('Password must contain at least one number.');
      return;
    }
    if (!/.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*/.test(newPassword)) {
      setError('Password must contain at least one special character.');
      return;
    }
    if (!/^[\x21-\x7E]+$/.test(newPassword)) {
      setError('Password must not contain spaces or accented characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/auth/reset-password', { 
        email, 
        otp, 
        newPassword 
      });
      setSuccess('Your password has been reset successfully.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to reset password.');
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
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>Forgot password?</h2>
          <p style={{ color: '#6b7280', fontSize: '15px' }}>
            {step === 1 ? "No worries, we'll send you reset instructions." : "Enter your OTP and new password."}
          </p>
        </div>

        {error && <div className="error-message" style={{ background: '#fee2e2', color: '#ef4444', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}
        {success && <div className="success-message" style={{ background: '#d1fae5', color: '#059669', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} />{success}</div>}

        {step === 1 ? (
          <form className="login-form" onSubmit={handleSendOtp}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Email Address</label>
              <div className="input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail className="input-icon" size={20} style={{ position: 'absolute', left: '14px', color: '#9ca3af' }} />
                <input
                  type="email"
                  placeholder="Enter your email"
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
              {loading ? <><Loader2 className="spinner" size={20} /> Processing...</> : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleResetPassword}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>OTP Code</label>
              <div className="input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <KeyRound className="input-icon" size={20} style={{ position: 'absolute', left: '14px', color: '#9ca3af' }} />
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
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
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>New Password</label>
              <div className="input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock className="input-icon" size={20} style={{ position: 'absolute', left: '14px', color: '#9ca3af' }} />
                <input
                  type="password"
                  placeholder="Enter new password"
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
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Confirm Password</label>
              <div className="input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock className="input-icon" size={20} style={{ position: 'absolute', left: '14px', color: '#9ca3af' }} />
                <input
                  type="password"
                  placeholder="Confirm new password"
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
              {loading ? <><Loader2 className="spinner" size={20} /> Processing...</> : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="login-footer" style={{ textAlign: 'center' }}>
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '15px' }}>
            <ArrowLeft size={16} /> Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
