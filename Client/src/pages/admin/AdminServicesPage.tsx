import { useState, useEffect } from 'react';
import { Pencil, Info, CheckCircle2, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import ServiceModal from '../../components/admin/ServiceModal';

export interface DentalService {
    id: string;
    serviceCode: string;
    name: string;
    category: string;
    description: string;
    detailedProcess: string;
    price: number;
    maxPrice?: number;
    durationMinutes: number;
    expectedAppointments: number;
    doctorSpecialty: string;
    imageUrl?: string;
    preTreatmentNotes?: string;
    postTreatmentNotes?: string;
    active: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface DentalServiceRequest {
    serviceCode: string;
    name: string;
    category: string;
    description: string;
    detailedProcess: string;
    price: number | string;
    maxPrice?: number | string;
    durationMinutes: number | string;
    expectedAppointments: number | string;
    doctorSpecialty: string;
    imageUrl?: string;
    preTreatmentNotes?: string;
    postTreatmentNotes?: string;
    active: boolean;
}

export default function AdminServicesPage() {
    const [services, setServices] = useState<DentalService[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<DentalService | null>(null);

    const API_URL = 'http://localhost:8080/api';

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            headers: { Authorization: `Bearer ${token}` }
        };
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/services`, getAuthHeaders());
            setServices(res.data);
        } catch (err) {
            setError('Failed to fetch services');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreateModal = () => {
        setSelectedService(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (service: DentalService) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này không?')) {
            try {
                await axios.delete(`${API_URL}/admin/services/${id}`, getAuthHeaders());
                fetchServices();
            } catch (err) {
                console.error("Lỗi khi xóa dịch vụ", err);
                alert("Xóa thất bại!");
            }
        }
    };

    const handleSaveService = async (serviceData: DentalServiceRequest, file?: File) => {
        try {
            let savedServiceId = '';
            if (selectedService) {
                const res = await axios.put(`${API_URL}/admin/services/${selectedService.id}`, serviceData, getAuthHeaders());
                savedServiceId = res.data.id;
            } else {
                const res = await axios.post(`${API_URL}/admin/services`, serviceData, getAuthHeaders());
                savedServiceId = res.data.id;
            }
            
            // Upload image if a file was selected
            if (file && savedServiceId) {
                const formData = new FormData();
                formData.append('file', file);
                await axios.post(`${API_URL}/admin/services/${savedServiceId}/image`, formData, {
                    headers: {
                        ...getAuthHeaders().headers,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            setIsModalOpen(false);
            fetchServices();
        } catch (err) {
            console.error("Lỗi khi lưu dịch vụ", err);
            alert("Lưu thất bại! Vui lòng kiểm tra lại thông tin.");
        }
    };

    const filteredServices = services.filter(service =>
        (service.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.serviceCode || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
                <span style={{ fontWeight: 600, color: '#111827' }}>Dashboard</span> &gt; Dịch vụ
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '32px' }}>
                Quản lý Dịch vụ
            </h1>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm dịch vụ, mã, danh mục..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '12px 16px 12px 42px',
                            border: '1px solid #d1d5db',
                            borderRadius: '10px',
                            width: '100%',
                            outline: 'none',
                            fontSize: '14px',
                            transition: 'border-color 0.2s',
                            boxSizing: 'border-box'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    />
                </div>
                <button 
                    onClick={handleOpenCreateModal}
                    style={{ background: 'var(--primary-color, #2563eb)', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)', transition: 'background-color 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color, #2563eb)'}
                >
                    <Plus size={20} /> Thêm dịch vụ
                </button>
            </div>

            {error && <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontWeight: 500 }}>{error}</div>}

            <div style={{ background: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: '#475569', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mã DV</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: '#475569', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tên dịch vụ</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: '#475569', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Danh mục</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: '#475569', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Giá</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: '#475569', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trạng thái</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: '#475569', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu...</td>
                            </tr>
                        ) : filteredServices.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                        <Info size={32} color="#cbd5e1" />
                                        <span style={{ fontSize: '15px' }}>Không tìm thấy dịch vụ nào</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredServices.map((service) => (
                                <tr key={service.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <td style={{ padding: '16px 24px', color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
                                        {service.serviceCode}
                                    </td>
                                    <td style={{ padding: '16px 24px', color: '#0f172a', fontSize: '14px', fontWeight: 600 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            {service.imageUrl ? (
                                                <img src={service.imageUrl} alt={service.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }} />
                                            ) : (
                                                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                                    <ImageIcon size={20} />
                                                </div>
                                            )}
                                            {service.name}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: '#475569', fontSize: '14px' }}>
                                        <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '16px', fontSize: '13px', fontWeight: 500 }}>{service.category}</span>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: '#0f172a', fontSize: '14px', fontWeight: 600 }}>
                                        {formatPrice(service.price)} {service.maxPrice ? ` - ${formatPrice(service.maxPrice)}` : ''}
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, padding: '6px 12px', borderRadius: '20px', backgroundColor: service.active ? '#dcfce7' : '#fee2e2', color: service.active ? '#166534' : '#991b1b' }}>
                                            {service.active && <CheckCircle2 size={14} />}
                                            <span>{service.active ? 'Hoạt động' : 'Tạm ngưng'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button 
                                                onClick={() => handleOpenEditModal(service)}
                                                style={{ background: '#eff6ff', border: 'none', cursor: 'pointer', color: '#2563eb', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' }} 
                                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                                                title="Sửa"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(service.id)}
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ServiceModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveService}
                initialData={selectedService}
            />
        </div>
    );
}
