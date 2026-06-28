import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Pencil, Trash2, MapPin, Phone, Clock, Mail } from 'lucide-react';
import ClinicModal from '../../components/admin/ClinicModal';

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

export default function AdminClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/clinics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClinics(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch clinics');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedClinic(null);
    setIsModalOpen(true);
  };

  const handleEdit = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cơ sở này không?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/api/clinics/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchClinics();
      } catch (err) {
        alert('Có lỗi xảy ra khi xóa cơ sở');
      }
    }
  };

  const filteredClinics = clinics.filter(c => 
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.address || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
        <span style={{ fontWeight: 600, color: '#111827' }}>Dashboard</span> &gt; Phòng khám
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
            Danh sách Phòng khám
          </h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Quản lý thông tin các cơ sở phòng khám</p>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#9ca3af' }}>
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Tìm kiếm phòng khám..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 16px 10px 36px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                width: '260px',
                outline: 'none',
                fontSize: '14px',
                backgroundColor: '#fff',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button className="btn btn-primary" onClick={handleCreate} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>
            <Plus size={18} /> Tạo mới
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Đang tải dữ liệu...</div>
      ) : error ? (
        <div style={{ padding: '20px', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '8px' }}>{error}</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {filteredClinics.map(clinic => (
            <div key={clinic.id} style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ width: '100%', height: '200px', backgroundColor: '#f3f4f6', position: 'relative' }}>
                {clinic.imageUrl ? (
                  <img src={clinic.imageUrl} alt={clinic.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                    Chưa có ảnh
                  </div>
                )}
                <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(clinic)} style={{ background: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                    <Pencil size={16} color="#3b82f6" />
                  </button>
                  <button onClick={() => handleDelete(clinic.id)} style={{ background: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                </div>
              </div>
              
              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#111827' }}>{clinic.name}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#4b5563' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <MapPin size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>{clinic.address}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={16} />
                    <span>{clinic.hotline}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={16} />
                    <span>{clinic.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} />
                    <span>{clinic.workingHours}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredClinics.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#6b7280', backgroundColor: 'white', borderRadius: '12px' }}>
              Không tìm thấy cơ sở nào.
            </div>
          )}
        </div>
      )}

      <ClinicModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        clinic={selectedClinic} 
        onSuccess={fetchClinics}
      />
    </div>
  );
}
