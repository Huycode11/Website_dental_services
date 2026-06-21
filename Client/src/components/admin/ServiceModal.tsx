import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import type { DentalServiceRequest, DentalService } from '../../pages/admin/AdminServicesPage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (service: DentalServiceRequest, file?: File) => Promise<void> | void;
    initialData?: DentalService | null;
}

const defaultData: DentalServiceRequest = {
    serviceCode: '',
    name: '',
    category: '',
    description: '',
    detailedProcess: '',
    price: 0,
    durationMinutes: 30,
    expectedAppointments: 1,
    doctorSpecialty: '',
    active: true
};

export default function ServiceModal({ isOpen, onClose, onSave, initialData }: ServiceModalProps) {
    const [formData, setFormData] = useState<DentalServiceRequest>(defaultData);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
    const [specialties, setSpecialties] = useState<{id: string, name: string}[]>([]);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                const [catsRes, specsRes] = await Promise.all([
                    axios.get(`${API_URL}/admin/categories`, { headers }),
                    axios.get(`${API_URL}/admin/specialties`, { headers })
                ]);
                setCategories(catsRes.data);
                setSpecialties(specsRes.data);
            } catch (err) {
                console.error("Lỗi lấy danh mục/chuyên môn", err);
            }
        };
        fetchDropdownData();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData
            });
            setPreviewUrl(initialData.imageUrl || null);
        } else {
            setFormData(defaultData);
            setPreviewUrl(null);
        }
        setSelectedFile(null);
        setIsSubmitting(false);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
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
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await onSave(formData, selectedFile || undefined);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle = {
        padding: '10px 14px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s',
        width: '100%',
        boxSizing: 'border-box' as const
    };

    const labelStyle = {
        fontSize: '14px',
        fontWeight: 600,
        color: '#374151',
        marginBottom: '6px',
        display: 'block'
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{
                background: '#ffffff', borderRadius: '16px', width: '90%', maxWidth: '850px',
                maxHeight: '90vh', overflowY: 'auto', padding: '32px', position: 'relative',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <button 
                    onClick={onClose}
                    style={{ position: 'absolute', top: '24px', right: '24px', background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280', transition: 'background-color 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                >
                    <X size={20} />
                </button>
                
                <h2 style={{ marginTop: 0, marginBottom: '8px', color: '#111827', fontSize: '24px', fontWeight: 700 }}>
                    {initialData ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới'}
                </h2>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
                    Điền đầy đủ thông tin bên dưới để cấu hình dịch vụ nha khoa.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
                    
                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={labelStyle}>Ảnh minh họa</label>
                        <div 
                            style={{ 
                                border: '2px dashed #d1d5db', borderRadius: '12px', padding: '24px', 
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                backgroundColor: '#f9fafb', cursor: 'pointer', transition: 'all 0.2s',
                                position: 'relative', overflow: 'hidden'
                            }}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {previewUrl ? (
                                <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden' }}>
                                    <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                                        onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                                        onMouseOut={(e) => e.currentTarget.style.opacity = '0'}
                                    >
                                        <span style={{ color: '#fff', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}><Upload size={18} /> Đổi ảnh khác</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div style={{ background: '#e0e7ff', color: '#4f46e5', padding: '12px', borderRadius: '50%', marginBottom: '12px' }}>
                                        <ImageIcon size={28} />
                                    </div>
                                    <p style={{ margin: '0 0 4px 0', fontWeight: 500, color: '#374151' }}>Nhấn để tải ảnh lên</p>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>PNG, JPG, WEBP (Tối đa 5MB)</p>
                                </>
                            )}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                accept="image/*" 
                                style={{ display: 'none' }} 
                            />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Mã dịch vụ *</label>
                        <input type="text" name="serviceCode" value={formData.serviceCode} onChange={handleChange} required style={inputStyle} placeholder="VD: DV001" />
                    </div>

                    <div>
                        <label style={labelStyle}>Tên dịch vụ *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} placeholder="VD: Nhổ răng khôn" />
                    </div>

                    <div>
                        <label style={labelStyle}>Danh mục *</label>
                        <select 
                            name="category" 
                            value={formData.category} 
                            onChange={handleChange} 
                            required 
                            style={inputStyle}
                        >
                            <option value="" disabled>-- Chọn danh mục --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={labelStyle}>Chuyên môn bác sĩ</label>
                        <select 
                            name="doctorSpecialty" 
                            value={formData.doctorSpecialty} 
                            onChange={handleChange} 
                            style={inputStyle}
                        >
                            <option value="">-- Chọn chuyên môn --</option>
                            {specialties.map(spec => (
                                <option key={spec.id} value={spec.name}>{spec.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={labelStyle}>Giá * (VNĐ)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" style={inputStyle} />
                    </div>

                    <div>
                        <label style={labelStyle}>Giá tối đa (Nếu là khoảng giá)</label>
                        <input type="number" name="maxPrice" value={formData.maxPrice || ''} onChange={handleChange} min="0" style={inputStyle} placeholder="Để trống nếu là giá cố định" />
                    </div>

                    <div>
                        <label style={labelStyle}>Thời gian thực hiện (phút)</label>
                        <input type="number" name="durationMinutes" value={formData.durationMinutes} onChange={handleChange} required min="1" style={inputStyle} />
                    </div>

                    <div>
                        <label style={labelStyle}>Số lần hẹn dự kiến</label>
                        <input type="number" name="expectedAppointments" value={formData.expectedAppointments} onChange={handleChange} required min="1" style={inputStyle} />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={labelStyle}>Mô tả ngắn</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Dịch vụ này dùng để làm gì..." />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={labelStyle}>Chi tiết quy trình</label>
                        <textarea name="detailedProcess" value={formData.detailedProcess} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Các bước thực hiện..." />
                    </div>

                    <div>
                        <label style={labelStyle}>Lưu ý trước điều trị</label>
                        <textarea name="preTreatmentNotes" value={formData.preTreatmentNotes || ''} onChange={handleChange} rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder="VD: Không ăn trước khi nhổ răng..." />
                    </div>

                    <div>
                        <label style={labelStyle}>Lưu ý sau điều trị</label>
                        <textarea name="postTreatmentNotes" value={formData.postTreatmentNotes || ''} onChange={handleChange} rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder="VD: Kiêng đồ cứng sau khi trám..." />
                    </div>

                    <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '12px', background: '#f3f4f6', padding: '16px', borderRadius: '8px' }}>
                        <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} id="activeCheck" 
                            style={{ width: '20px', height: '20px', accentColor: '#2563eb', cursor: 'pointer' }} />
                        <label htmlFor="activeCheck" style={{ fontSize: '15px', fontWeight: 600, color: '#111827', cursor: 'pointer', margin: 0 }}>
                            Đang cung cấp (Hoạt động)
                        </label>
                    </div>

                    <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                        <button type="button" onClick={onClose}
                            style={{ padding: '10px 20px', border: '1px solid #d1d5db', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#374151', transition: 'background-color 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                        >
                            Hủy bỏ
                        </button>
                        <button type="submit"
                            disabled={isSubmitting}
                            style={{ padding: '10px 24px', border: 'none', background: isSubmitting ? '#93c5fd' : '#2563eb', color: '#fff', borderRadius: '8px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 600, boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)', transition: 'background-color 0.2s' }}
                            onMouseOver={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#1d4ed8' }}
                            onMouseOut={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#2563eb' }}
                        >
                            {isSubmitting ? 'Đang xử lý...' : (initialData ? 'Cập nhật dịch vụ' : 'Lưu dịch vụ mới')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
