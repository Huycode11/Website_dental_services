import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface Category {
    id: string;
    name: string;
    description: string;
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const [formData, setFormData] = useState({ name: '', description: '' });

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/categories`, getAuthHeaders());
            setCategories(res.data);
        } catch (err) {
            console.error('Error fetching categories', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedCategory) {
                await axios.put(`${API_URL}/admin/categories/${selectedCategory.id}`, formData, getAuthHeaders());
            } else {
                await axios.post(`${API_URL}/admin/categories`, formData, getAuthHeaders());
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (err) {
            console.error('Lỗi khi lưu danh mục', err);
            alert('Lưu thất bại!');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
        try {
            await axios.delete(`${API_URL}/admin/categories/${id}`, getAuthHeaders());
            fetchCategories();
        } catch (err) {
            console.error('Lỗi khi xóa', err);
            alert('Xóa thất bại!');
        }
    };

    const openModal = (category: Category | null = null) => {
        if (category) {
            setSelectedCategory(category);
            setFormData({ name: category.name, description: category.description || '' });
        } else {
            setSelectedCategory(null);
            setFormData({ name: '', description: '' });
        }
        setIsModalOpen(true);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>Quản lý Danh mục dịch vụ</h1>
                <button
                    onClick={() => openModal()}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary-color, #2563eb)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}
                >
                    <Plus size={20} />
                    Thêm danh mục
                </button>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Tên danh mục</th>
                            <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Mô tả</th>
                            <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={3} style={{ padding: '24px', textAlign: 'center' }}>Đang tải...</td></tr>
                        ) : categories.length === 0 ? (
                            <tr><td colSpan={3} style={{ padding: '24px', textAlign: 'center' }}>Chưa có danh mục nào</td></tr>
                        ) : categories.map(cat => (
                            <tr key={cat.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '16px 24px', fontWeight: 500 }}>{cat.name}</td>
                                <td style={{ padding: '16px 24px', color: '#6b7280' }}>{cat.description}</td>
                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                    <button onClick={() => openModal(cat)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: '12px' }}>
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(cat.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(17, 24, 39, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '500px' }}>
                        <h2 style={{ marginTop: 0, marginBottom: '24px' }}>{selectedCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h2>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Tên danh mục *</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Mô tả</label>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' }}>Hủy bỏ</button>
                                <button type="submit" style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer' }}>Lưu lại</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
