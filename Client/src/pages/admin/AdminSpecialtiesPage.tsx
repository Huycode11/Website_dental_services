import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface Specialty {
    id: string;
    name: string;
    description: string;
}

export default function AdminSpecialtiesPage() {
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({ name: '', description: '' });

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const fetchSpecialties = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/specialties`, getAuthHeaders());
            setSpecialties(res.data);
        } catch (err) {
            console.error('Error fetching specialties', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpecialties();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            if (selectedSpecialty) {
                await axios.put(`${API_URL}/admin/specialties/${selectedSpecialty.id}`, formData, getAuthHeaders());
            } else {
                await axios.post(`${API_URL}/admin/specialties`, formData, getAuthHeaders());
            }
            setIsModalOpen(false);
            fetchSpecialties();
        } catch (err) {
            console.error('Lỗi khi lưu chuyên môn', err);
            alert('Lưu thất bại!');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa chuyên môn này?')) return;
        try {
            await axios.delete(`${API_URL}/admin/specialties/${id}`, getAuthHeaders());
            fetchSpecialties();
        } catch (err) {
            console.error('Lỗi khi xóa', err);
            alert('Xóa thất bại!');
        }
    };

    const openModal = (specialty: Specialty | null = null) => {
        if (specialty) {
            setSelectedSpecialty(specialty);
            setFormData({ name: specialty.name, description: specialty.description || '' });
        } else {
            setSelectedSpecialty(null);
            setFormData({ name: '', description: '' });
        }
        setIsModalOpen(true);
    };

    return (
        <div>
            <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>Dashboard</span> &gt; Chuyên khoa
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Quản lý Chuyên môn / Chuyên khoa</h1>
                <button 
                    onClick={() => openModal()}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary-color, #2563eb)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)', transition: 'background-color 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color, #2563eb)'}
                >
                    <Plus size={20} />
                    Thêm chuyên khoa
                </button>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tên chuyên khoa</th>
                            <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mô tả</th>
                            <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu...</td></tr>
                        ) : specialties.length === 0 ? (
                            <tr>
                                <td colSpan={3} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '15px' }}>Chưa có chuyên khoa nào</span>
                                    </div>
                                </td>
                            </tr>
                        ) : specialties.map(spec => (
                            <tr key={spec.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                <td style={{ padding: '16px 24px', fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>{spec.name}</td>
                                <td style={{ padding: '16px 24px', color: '#475569', fontSize: '14px' }}>{spec.description || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Không có mô tả</span>}</td>
                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button 
                                            onClick={() => openModal(spec)} 
                                            style={{ background: '#eff6ff', border: 'none', cursor: 'pointer', color: '#2563eb', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                                            title="Sửa"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(spec.id)} 
                                            style={{ background: '#fef2f2', border: 'none', cursor: 'pointer', color: '#dc2626', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                            title="Xóa"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(17, 24, 39, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '500px' }}>
                        <h2 style={{ marginTop: 0, marginBottom: '24px' }}>{selectedSpecialty ? 'Sửa chuyên khoa' : 'Thêm chuyên khoa mới'}</h2>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Tên chuyên khoa *</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Mô tả</label>
                                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' }}>Hủy bỏ</button>
                                <button type="submit" disabled={isSubmitting} style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: isSubmitting ? '#93c5fd' : '#2563eb', color: '#fff', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>{isSubmitting ? 'Đang lưu...' : 'Lưu lại'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
