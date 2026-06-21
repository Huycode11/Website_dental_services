import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

interface DoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function DoctorModal({ isOpen, onClose, onSuccess, initialData }: DoctorModalProps) {
  const [specialties, setSpecialties] = useState<{id: string, name: string}[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    specialty: '',
    experience: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        password: '',
        phone: initialData.phone || '',
        specialty: initialData.specialty || '',
        experience: initialData.experience || '',
        description: initialData.description || '',
      });
    } else if (isOpen) {
      setFormData({
        fullName: '', email: '', password: '', phone: '', specialty: '', experience: '', description: ''
      });
    }
  }, [initialData, isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      const fetchSpecialties = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get('http://localhost:8080/api/admin/specialties', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setSpecialties(res.data);
        } catch (err) {
          console.error("Lỗi khi tải danh sách chuyên khoa", err);
        }
      };
      fetchSpecialties();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (initialData) {
        // Edit mode
        await axios.put(`http://localhost:8080/api/admin/doctors/${initialData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create mode
        await axios.post('http://localhost:8080/api/admin/doctors', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi xử lý bác sĩ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#fff', borderRadius: '12px', padding: '24px', width: '100%',
        maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>{initialData ? 'Chỉnh sửa bác sĩ' : 'Tạo mới bác sĩ'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={20} color="#6b7280" />
          </button>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Họ tên *</label>
            <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} style={inputStyle} placeholder="VD: Dr. John Doe" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Email {initialData ? '' : '*'}</label>
            <input required={!initialData} disabled={!!initialData} type="email" name="email" value={formData.email} onChange={handleChange} style={{...inputStyle, backgroundColor: initialData ? '#f3f4f6' : '#fff'}} placeholder="email@example.com" />
          </div>
          {!initialData && (
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Mật khẩu *</label>
              <input required type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} placeholder="Mật khẩu (ít nhất 8 ký tự, gồm chữ hoa, số và ký tự đặc biệt)" />
            </div>
          )}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Số điện thoại *</label>
            <input required type="text" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} placeholder="0123456789" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Chuyên khoa *</label>
            <select required name="specialty" value={formData.specialty} onChange={handleChange as any} style={inputStyle}>
              <option value="">-- Chọn chuyên khoa --</option>
              {specialties.map(spec => (
                <option key={spec.id} value={spec.name}>{spec.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Kinh nghiệm</label>
            <input type="text" name="experience" value={formData.experience} onChange={handleChange} style={inputStyle} placeholder="VD: 5 years" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Mô tả thêm</label>
            <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Nhập mô tả..." />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 16px', border: '1px solid #d1d5db', background: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, color: '#374151' }}>
              Hủy
            </button>
            <button type="submit" disabled={loading} style={{ padding: '10px 16px', border: 'none', background: 'var(--primary-color, #2563eb)', color: '#fff', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 500, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Đang lưu...' : (initialData ? 'Lưu thay đổi' : 'Tạo bác sĩ')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  outline: 'none',
  fontSize: '14px',
  boxSizing: 'border-box' as const,
};
