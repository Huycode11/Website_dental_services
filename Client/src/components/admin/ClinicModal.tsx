import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import axios from 'axios';

interface Clinic {
  id: string;
  name: string;
  address: string;
  hotline: string;
  email: string;
  workingHours: string;
  googleMapsUrl: string;
  imageUrl?: string;
}

interface ClinicModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinic: Clinic | null;
  onSuccess: () => void;
}

export default function ClinicModal({ isOpen, onClose, clinic, onSuccess }: ClinicModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    hotline: '',
    email: '',
    googleMapsUrl: '',
  });
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('20:00');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (clinic) {
      setFormData({
        name: clinic.name || '',
        address: clinic.address || '',
        hotline: clinic.hotline || '',
        email: clinic.email || '',
        googleMapsUrl: clinic.googleMapsUrl || '',
      });
      if (clinic.workingHours) {
        const times = clinic.workingHours.split(' - ');
        setStartTime(times[0] || '08:00');
        setEndTime(times[1] || '20:00');
      } else {
        setStartTime('08:00');
        setEndTime('20:00');
      }
      setPreviewUrl(clinic.imageUrl || null);
    } else {
      setFormData({
        name: '',
        address: '',
        hotline: '',
        email: '',
        googleMapsUrl: '',
      });
      setStartTime('08:00');
      setEndTime('20:00');
      setPreviewUrl(null);
    }
    setSelectedFile(null);
  }, [clinic, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      let clinicId = clinic?.id;
      
      const payload = {
        ...formData,
        workingHours: `${startTime} - ${endTime}`
      };

      if (clinicId) {
        await axios.put(`http://localhost:8080/api/clinics/${clinicId}`, payload, { headers });
      } else {
        const res = await axios.post(`http://localhost:8080/api/clinics`, payload, { headers });
        clinicId = res.data.id;
      }

      if (selectedFile && clinicId) {
        const fileData = new FormData();
        fileData.append('file', selectedFile);
        await axios.post(`http://localhost:8080/api/clinics/${clinicId}/image`, fileData, {
          headers: { ...headers, 'Content-Type': 'multipart/form-data' }
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      alert('Có lỗi xảy ra khi lưu thông tin cơ sở');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#fff', borderRadius: '12px', padding: '24px', width: '100%',
        maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>{clinic ? 'Cập nhật thông tin cơ sở' : 'Thêm cơ sở mới'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={20} color="#6b7280" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ marginBottom: '8px', textAlign: 'center' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#374151', textAlign: 'left' }}>Ảnh cơ sở</label>
            <div 
              style={{ 
                width: '100%', 
                height: '200px', 
                border: '2px dashed #d1d5db', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#f9fafb'
              }}
              onClick={() => document.getElementById('clinicImageUpload')?.click()}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ color: '#9ca3af', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Upload size={32} style={{ marginBottom: '8px' }} />
                  <span>Chọn ảnh tải lên</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              id="clinicImageUpload" 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleFileChange} 
            />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Tên phòng khám *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} placeholder="Nha khoa Dentivo Cơ sở 1" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Hotline *</label>
              <input type="text" name="hotline" value={formData.hotline} onChange={handleChange} required style={inputStyle} placeholder="1900 1234" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} placeholder="contact@dentivo.com" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Giờ làm việc *</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required style={inputStyle} />
                <span>-</span>
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required style={inputStyle} />
              </div>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Địa chỉ *</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required style={inputStyle} placeholder="Số 1, Đường 2, Quận 3..." />
          </div>

          <div>
            <label style={labelStyle}>Google Maps URL (Link nhúng)</label>
            <input type="text" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleChange} style={inputStyle} placeholder="https://www.google.com/maps/embed?pb=..." />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} disabled={loading} style={{ padding: '10px 16px', border: '1px solid #d1d5db', background: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, color: '#374151' }}>
              Hủy
            </button>
            <button type="submit" disabled={loading} style={{ padding: '10px 16px', border: 'none', background: 'var(--primary-color, #2563eb)', color: '#fff', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 500, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Đang lưu...' : 'Lưu thông tin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', 
  marginBottom: '6px', 
  fontSize: '14px', 
  fontWeight: 500, 
  color: '#374151'
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  outline: 'none',
  fontSize: '14px',
  boxSizing: 'border-box' as const,
};
