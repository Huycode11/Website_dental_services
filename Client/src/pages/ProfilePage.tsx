import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, User, Mail, Phone, Calendar, ArrowLeft, Save, Loader2, Briefcase, Award, FileText, Link } from 'lucide-react';
import axios from 'axios';

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl: string;
  role: string;
  createdAt: string;
  specialty?: string;
  experience?: string;
  description?: string;
  facebookLink?: string;
  twitterLink?: string;
  linkedinLink?: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Doctor state
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState('');
  const [description, setDescription] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [twitterLink, setTwitterLink] = useState('');
  const [linkedinLink, setLinkedinLink] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [hoverAvatar, setHoverAvatar] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      setFullName(res.data.fullName || '');
      setPhone(res.data.phone || '');
      if (res.data.role === 'DOCTOR' || res.data.role === 'ROLE_DOCTOR') {
        setSpecialty(res.data.specialty || '');
        setExperience(res.data.experience || '');
        setDescription(res.data.description || '');
        setFacebookLink(res.data.facebookLink || '');
        setTwitterLink(res.data.twitterLink || '');
        setLinkedinLink(res.data.linkedinLink || '');
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload: any = { fullName, phone };
      if (profile?.role === 'DOCTOR' || profile?.role === 'ROLE_DOCTOR') {
        payload.specialty = specialty;
        payload.experience = experience;
        payload.description = description;
        payload.facebookLink = facebookLink;
        payload.twitterLink = twitterLink;
        payload.linkedinLink = linkedinLink;
      }
      
      const res = await axios.put('http://localhost:8080/api/user/profile',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(res.data);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to S3
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post('http://localhost:8080/api/user/avatar', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT manually set Content-Type — let the browser set multipart boundary
        }
      });
      setProfile(res.data);
      // Sync avatar URL to localStorage so Header reflects it immediately
      if (res.data.avatarUrl) localStorage.setItem('avatarUrl', res.data.avatarUrl);
      setSuccess('Avatar updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || err.response?.data || err.message || 'Unknown error';
        setError(`Upload failed (${err.response?.status ?? 'network'}): ${msg}`);
      } else {
        setError('Failed to upload avatar');
      }
      setAvatarPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const avatarSrc = avatarPreview || profile?.avatarUrl;
  const formatDate = (iso?: string) => iso
    ? new Date(iso).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  /* ─── Styles ─── */
  const page: React.CSSProperties = {
    minHeight: '100vh',
    background: 'var(--bg-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    fontFamily: 'var(--font-secondary)',
  };

  const card: React.CSSProperties = {
    background: 'var(--bg-main)',
    borderRadius: 24,
    boxShadow: '0 20px 60px rgba(49,110,101,0.12)',
    width: '100%',
    maxWidth: 600,
    overflow: 'hidden',
  };

  const banner: React.CSSProperties = {
    background: 'linear-gradient(135deg, var(--primary-color) 0%, #1e5248 100%)',
    padding: '40px 40px 70px',
    position: 'relative',
  };

  const avatarWrap: React.CSSProperties = {
    position: 'absolute',
    bottom: -52,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 104,
    height: 104,
    borderRadius: '50%',
    border: '4px solid var(--bg-main)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    cursor: 'pointer',
    overflow: 'hidden',
    background: 'var(--bg-main)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const cameraOverlay: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: hoverAvatar || uploading ? 1 : 0,
    transition: 'opacity 0.2s ease',
    borderRadius: '50%',
  };

  const body: React.CSSProperties = {
    padding: '72px 40px 40px',
  };

  const label: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-gray)',
    marginBottom: 6,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  };

  const input: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 10,
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
    color: 'var(--text-dark)',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  const readonlyInput: React.CSSProperties = {
    ...input,
    background: '#f8fafc',
    color: '#94a3b8',
    cursor: 'not-allowed',
  };

  if (loading) return (
    <div style={{ ...page }}>
      <Loader2 size={32} color="var(--primary-color)" style={{ animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <div style={page}>
      <div style={card}>
        {/* Banner */}
        <div style={banner}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 style={{ color: '#fff', fontFamily: 'var(--font-primary)', fontSize: 22, textAlign: 'center', marginTop: 12 }}>
            My Profile
          </h1>

          {/* Avatar */}
          <div
            style={avatarWrap}
            onClick={() => fileInputRef.current?.click()}
            onMouseEnter={() => setHoverAvatar(true)}
            onMouseLeave={() => setHoverAvatar(false)}
          >
            {avatarSrc
              ? <img src={avatarSrc} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <User size={48} color="#316E65" />
            }
            <div style={cameraOverlay}>
              {uploading
                ? <Loader2 size={22} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
                : <Camera size={22} color="#fff" />
              }
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
        </div>

        {/* Body */}
        <div style={body}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-primary)' }}>
              {profile?.fullName}
            </p>
            <span style={{ fontSize: 12, background: '#e8f5f2', color: 'var(--primary-color)', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
              {profile?.role}
            </span>
          </div>

          {error && (
            <div style={{ background: '#fee2e2', color: '#ef4444', padding: '10px 14px', borderRadius: 8, fontSize: 14, marginBottom: 16 }}>{error}</div>
          )}
          {success && (
            <div style={{ background: '#d1fae5', color: '#059669', padding: '10px 14px', borderRadius: 8, fontSize: 14, marginBottom: 16 }}>{success}</div>
          )}

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Full Name */}
            <div>
              <div style={label}><User size={14} /> Full Name</div>
              <input
                style={input}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Email (readonly) */}
            <div>
              <div style={label}><Mail size={14} /> Email Address</div>
              <input style={readonlyInput} value={profile?.email || ''} readOnly />
            </div>

            {/* Phone */}
            <div>
              <div style={label}><Phone size={14} /> Phone Number</div>
              <input
                style={input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your phone number"
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Member since */}
            <div>
              <div style={label}><Calendar size={14} /> Member Since</div>
              <input style={readonlyInput} value={formatDate(profile?.createdAt)} readOnly />
            </div>

            {/* Doctor specific fields */}
            {(profile?.role === 'DOCTOR' || profile?.role === 'ROLE_DOCTOR') && (
              <>
                <div>
                  <div style={label}><Briefcase size={14} /> Specialty</div>
                  <input
                    style={input}
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g. Periodontics, Orthodontics"
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div>
                  <div style={label}><Award size={14} /> Experience</div>
                  <input
                    style={input}
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 10+ years"
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div>
                  <div style={label}><FileText size={14} /> Description</div>
                  <textarea
                    style={{ ...input, height: '100px', resize: 'vertical' }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us about yourself..."
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                  <div>
                    <div style={label}><Link size={14} /> Facebook Link</div>
                    <input
                      style={input}
                      value={facebookLink}
                      onChange={(e) => setFacebookLink(e.target.value)}
                      placeholder="https://facebook.com/..."
                      onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                  <div>
                    <div style={label}><Link size={14} /> LinkedIn Link</div>
                    <input
                      style={input}
                      value={linkedinLink}
                      onChange={(e) => setLinkedinLink(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                </div>
                <div>
                  <div style={label}><Link size={14} /> Twitter Link</div>
                  <input
                    style={input}
                    value={twitterLink}
                    onChange={(e) => setTwitterLink(e.target.value)}
                    placeholder="https://twitter.com/..."
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={saving}
              style={{
                background: 'var(--primary-color)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '14px',
                fontSize: 15,
                fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 8,
                transition: 'background 0.2s',
                fontFamily: 'var(--font-primary)',
              }}
              onMouseEnter={(e) => !saving && ((e.currentTarget as HTMLButtonElement).style.background = 'var(--primary-hover)')}
              onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = 'var(--primary-color)'}
            >
              {saving
                ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
                : <><Save size={16} /> Save Changes</>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
