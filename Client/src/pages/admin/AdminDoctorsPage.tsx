import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCircle, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import DoctorModal from '../../components/admin/DoctorModal';

interface AdminDoctor {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  specialty: string;
  avatarUrl: string;
  role: string;
  active: boolean;
  createdAt: string;
  experience?: string;
  description?: string;
}

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<AdminDoctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<AdminDoctor | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/admin/doctors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedDoctor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (doctor: AdminDoctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này không? Thao tác này sẽ đặt tài khoản của họ về vai trò bệnh nhân.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/api/admin/doctors/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchDoctors();
      } catch (err) {
        alert('Có lỗi xảy ra khi xóa bác sĩ');
      }
    }
  };

  const filteredDoctors = doctors.filter(doc => 
    (doc.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.specialty || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.phone || '').includes(searchTerm)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);
  const currentDoctors = filteredDoctors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset to page 1 if search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div>
      <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
        <span style={{ fontWeight: 600, color: '#111827' }}>Dashboard</span> &gt; Bác sĩ
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
            All Doctors
          </h1>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
            More Than {doctors.length} Doctors
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#9ca3af' }}>
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Tìm kiếm bác sĩ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 16px 10px 36px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                width: '260px',
                outline: 'none',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            />
          </div>
          <button 
            onClick={handleCreate}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'var(--primary-color, #2563eb)', color: '#fff', 
              border: 'none', padding: '10px 20px', borderRadius: '8px', 
              cursor: 'pointer', fontWeight: 500, boxShadow: '0 2px 4px rgba(37,99,235,0.2)'
            }}>
            <Plus size={18} /> Tạo mới
          </button>
        </div>
      </div>

      {error && <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading doctors...</div>
      ) : filteredDoctors.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280', background: '#fff', borderRadius: '12px', border: '1px dashed #d1d5db' }}>
          Không tìm thấy bác sĩ nào
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '20px'
        }}>
          {currentDoctors.map((doc) => (
            <div key={doc.id} style={{
              background: '#f8fafc',
              border: '1px solid #f1f5f9',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'default',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)';
              e.currentTarget.style.background = '#ffffff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.background = '#f8fafc';
            }}
            >
              {/* Action Buttons (Edit/Delete) */}
              <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => handleEdit(doc)}
                  style={{ background: '#eff6ff', border: 'none', cursor: 'pointer', color: '#2563eb', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center' }} 
                  title="Sửa"
                >
                  <Pencil size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(doc.id)}
                  style={{ background: '#fef2f2', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center' }} 
                  title="Xóa"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Avatar Section */}
              <div style={{ flexShrink: 0, marginTop: '16px' }}>
                {doc.avatarUrl ? (
                  <img 
                    src={doc.avatarUrl} 
                    alt={doc.fullName} 
                    style={{ 
                      width: '80px', height: '80px', 
                      borderRadius: '12px', objectFit: 'cover',
                      backgroundColor: '#e2e8f0'
                    }} 
                  />
                ) : (
                  <div style={{ 
                    width: '80px', height: '80px', borderRadius: '12px', 
                    background: '#e2e8f0', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <UserCircle size={48} color="#94a3b8" />
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
                    {doc.fullName}
                  </h3>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#64748b' }}>
                    {doc.specialty || 'Chuyên khoa (Chưa cập nhật)'}
                  </p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                    Availability: <span style={{ fontWeight: 500, color: '#475569' }}>Monday - Friday</span>
                  </p>
                </div>

                {/* Right Stat Section */}
                <div style={{ textAlign: 'center', marginLeft: '16px' }}>
                  <div style={{ color: '#3b82f6', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                    120 Patients
                  </div>
                  <div style={{ color: '#60a5fa', fontSize: '13px' }}>
                    Served
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Pagination (Only show if > 1 page) */}
      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '32px' }}>
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNum = index + 1;
            const isActive = pageNum === currentPage;
            return (
              <button 
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                style={{ 
                  width: '40px', height: '40px', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', borderRadius: '8px', border: 'none', 
                  background: isActive ? '#818cf8' : '#e0e7ff', 
                  color: isActive ? '#fff' : '#6366f1', 
                  fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' 
                }}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      )}

      <DoctorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          fetchDoctors();
        }}
        initialData={selectedDoctor}
      />
    </div>
  );
}
