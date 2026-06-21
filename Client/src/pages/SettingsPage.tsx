import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Lock, Palette, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'Light');

  useEffect(() => {
    if (theme === 'Dark') {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8 || 
        !/.*[A-Z].*/.test(newPassword) || 
        !/.*[0-9].*/.test(newPassword) || 
        !/.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*/.test(newPassword) ||
        !/^[\x21-\x7E]+$/.test(newPassword)) {
      setError('Password does not meet the security requirements.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:8080/api/user/change-password', {
        currentPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess(res.data.message || 'Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAppearance = () => {
    setSuccess('Theme settings saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', fontFamily: 'Inter, sans-serif' }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-gray)', fontSize: '14px', fontWeight: 500, cursor: 'pointer', marginBottom: '24px' }}
      >
        <ArrowLeft size={16} /> Back to Home
      </button>

      <h1 style={{ fontSize: '28px', color: 'var(--text-dark)', marginBottom: '32px', fontWeight: 700 }}>Settings</h1>

      {/* Security Section */}
      <div style={{ backgroundColor: 'var(--bg-main)', borderRadius: '12px', padding: '32px', boxShadow: 'var(--shadow-sm)', marginBottom: '32px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Lock size={24} color="var(--primary-color)" />
          <h2 style={{ fontSize: '20px', color: 'var(--text-dark)', margin: 0, fontWeight: 600 }}>Security</h2>
        </div>
        <p style={{ color: 'var(--text-gray)', fontSize: '14px', marginBottom: '32px' }}>Manage your password and security settings</p>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}
        {success && (
          <div style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <CheckCircle2 size={18} /> {success}
          </div>
        )}

        <form onSubmit={handleChangePassword}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Password</label>
            <input 
              type="password" 
              placeholder="Enter current password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '15px', backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Password</label>
              <input 
                type="password" 
                placeholder="Enter new password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '15px', backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confirm Password</label>
              <input 
                type="password" 
                placeholder="Confirm new password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '15px', backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
          </div>

          {newPassword.length > 0 && (
            <ul style={{ fontSize: '12px', color: '#ef4444', marginTop: '0', paddingLeft: '20px', marginBottom: '24px' }}>
              <li style={{ color: newPassword.length >= 8 ? '#059669' : '#ef4444' }}>Ít nhất 8 ký tự</li>
              <li style={{ color: /.*[A-Z].*/.test(newPassword) ? '#059669' : '#ef4444' }}>Chứa ít nhất 1 chữ hoa</li>
              <li style={{ color: /.*[0-9].*/.test(newPassword) ? '#059669' : '#ef4444' }}>Chứa ít nhất 1 chữ số</li>
              <li style={{ color: /.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*/.test(newPassword) ? '#059669' : '#ef4444' }}>Chứa ít nhất 1 ký tự đặc biệt</li>
              <li style={{ color: /^[\x21-\x7E]+$/.test(newPassword) ? '#059669' : '#ef4444' }}>Không chứa khoảng trắng, có dấu</li>
            </ul>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                backgroundColor: 'var(--primary-color)', color: 'white', padding: '12px 24px', 
                borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '14px', 
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              <Lock size={16} /> {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Appearance Section */}
      <div style={{ backgroundColor: 'var(--bg-main)', borderRadius: '12px', padding: '32px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Palette size={24} color="var(--primary-color)" />
          <h2 style={{ fontSize: '20px', color: 'var(--text-dark)', margin: 0, fontWeight: 600 }}>Appearance</h2>
        </div>
        <p style={{ color: 'var(--text-gray)', fontSize: '14px', marginBottom: '32px' }}>Customize how the application looks</p>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Theme</label>
          <select 
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{ width: '100%', maxWidth: '300px', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '15px', backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)', outline: 'none', cursor: 'pointer' }}
          >
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
          <button 
            onClick={handleSaveAppearance}
            style={{ 
              backgroundColor: 'var(--primary-color)', color: 'white', padding: '12px 24px', 
              borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '14px', cursor: 'pointer'
            }}
          >
            Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
}
