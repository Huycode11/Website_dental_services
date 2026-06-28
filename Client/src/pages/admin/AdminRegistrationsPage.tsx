import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Edit, Eye, User, Calendar as CalendarIcon, Clock, Activity, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  serviceId: string;
  scheduleId: string;
  status: string;
  notes: string;
  cancelReason: string;
  createdAt: string;
  date: string;
  time: string;
  patientName?: string;
  clinicName?: string;
}

interface Doctor {
  id: string;
  fullName: string;
  specialty: string;
}

interface Service {
  id: string;
  name: string;
  doctorSpecialty: string;
}

export default function AdminRegistrationsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;
  // Default filter for "Lịch đăng ký"
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal state for assigning doctor
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  
  const parseTimeStr = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + (minutes || 0);
  };

  const isDoctorBusy = (docId: string, date: string, time: string, currentAppId: string) => {
    if (!date || !time) return false;
    let sTime = time, eTime = time;
    if (time.includes(" - ")) {
      const parts = time.split(" - ");
      sTime = parts[0].trim();
      eTime = parts[1].trim();
    }
    const newStart = parseTimeStr(sTime);
    const newEnd = parseTimeStr(eTime);

    return appointments.some(a => {
      if (a.id === currentAppId) return false;
      if (a.doctorId !== docId) return false;
      if (a.status !== 'ASSIGNED' && a.status !== 'CONFIRMED') return false;
      if (a.date !== date) return false;
      
      let existStart = a.time, existEnd = a.time;
      if (a.time && a.time.includes(" - ")) {
        const parts = a.time.split(" - ");
        existStart = parts[0].trim();
        existEnd = parts[1].trim();
      }
      
      return newStart < parseTimeStr(existEnd) && newEnd > parseTimeStr(existStart);
    });
  };

  const token = localStorage.getItem('token');
  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchData();
  }, [currentPage, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appRes, docRes, servRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/appointments?page=${currentPage}&size=${pageSize}${statusFilter ? `&status=${statusFilter}` : ''}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/doctors`),
        axios.get(`${API_BASE_URL}/services`) 
      ]);
      setAppointments(appRes.data.content || []);
      setTotalPages(appRes.data.totalPages || 0);
      setServices(servRes.data);
      
      if (Array.isArray(docRes.data)) {
         setDoctors(docRes.data);
      } else if (docRes.data.data) {
         setDoctors(docRes.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDoctor = async () => {
    if (!selectedAppointment || !selectedDoctorId) {
      toast.error("Vui lòng chọn bác sĩ");
      return;
    }
    try {
      await axios.put(
        `${API_BASE_URL}/admin/appointments/${selectedAppointment.id}/assign?doctorId=${selectedDoctorId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Đã phân công bác sĩ thành công!');
      setIsModalOpen(false);
      setSelectedDoctorId('');
      fetchData(); // Refresh list
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Lỗi khi phân công bác sĩ. (Có thể do trùng lịch)');
      } else {
        toast.error('Lỗi khi phân công bác sĩ.');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span style={{ padding: '4px 12px', borderRadius: '20px', backgroundColor: '#fef3c7', color: '#d97706', fontSize: '13px', fontWeight: 600 }}>Chờ duyệt</span>;
      case 'ASSIGNED':
        return <span style={{ padding: '4px 12px', borderRadius: '20px', backgroundColor: '#dbeafe', color: '#2563eb', fontSize: '13px', fontWeight: 600 }}>Đã phân công</span>;
      case 'CONFIRMED':
        return <span style={{ padding: '4px 12px', borderRadius: '20px', backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '13px', fontWeight: 600 }}>Đã xác nhận</span>;
      case 'REJECTED':
        return <span style={{ padding: '4px 12px', borderRadius: '20px', backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '13px', fontWeight: 600 }}>Đã từ chối</span>;
      case 'CANCELLED':
        return <span style={{ padding: '4px 12px', borderRadius: '20px', backgroundColor: '#f3f4f6', color: '#4b5563', fontSize: '13px', fontWeight: 600 }}>Đã hủy</span>;
      case 'COMPLETED':
        return <span style={{ padding: '4px 12px', borderRadius: '20px', backgroundColor: '#f3e8ff', color: '#9333ea', fontSize: '13px', fontWeight: 600 }}>Đã hoàn thành</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const handleCompleteAppointment = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn đánh dấu lịch này là đã hoàn thành?')) return;
    try {
      await axios.put(
        `${API_BASE_URL}/doctor/appointments/${id}/status?status=COMPLETED`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Đã cập nhật trạng thái hoàn thành');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  if (loading && appointments.length === 0) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-gray)' }}>Đang tải dữ liệu...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: 'var(--text-dark)', marginBottom: '8px', fontWeight: 700 }}>Quản lý lịch hẹn</h1>
          <p style={{ color: 'var(--text-gray)', fontSize: '15px' }}>Quản lý toàn bộ lịch khám của bệnh nhân</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(0); }}
            style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: 'white' }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="ASSIGNED">Đã phân công</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="COMPLETED">Đã khám xong</option>
            <option value="REJECTED">Từ chối</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
          <button onClick={fetchData} style={{ padding: '10px 20px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
            Làm mới
          </button>
        </div>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: 'var(--text-gray)' }}>Bệnh nhân</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: 'var(--text-gray)' }}>Dịch vụ</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: 'var(--text-gray)' }}>Ngày giờ</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: 'var(--text-gray)' }}>Bác sĩ phụ trách</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: 'var(--text-gray)' }}>Trạng thái</th>
              <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '14px', fontWeight: 600, color: 'var(--text-gray)' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => {
                const doc = doctors.find(d => d.id === apt.doctorId);
                const doctorName = doc ? doc.fullName : 'Chưa phân công';
                const serviceName = services.find(s => s.id === apt.serviceId)?.name || apt.serviceId;
                
                return (
                  <tr key={apt.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 500, color: 'var(--text-dark)' }}>
                         {apt.patientName || (apt.patientId === 'GUEST' ? 'Khách vãng lai' : apt.patientId)}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-gray)', marginTop: '2px' }}>
                         {apt.patientId !== 'GUEST' ? apt.patientId : 'Khách vãng lai'}
                      </div>
                      <div style={{ fontSize: '13px', color: '#0369a1', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                         <span style={{ fontSize: '12px' }}>📍</span> {apt.clinicName || 'Chưa cập nhật cơ sở'}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 500 }}>{serviceName}</div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 500 }}>{apt.date}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-gray)' }}>{apt.time}</div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 500, color: apt.doctorId === 'UNASSIGNED' ? '#94a3b8' : 'var(--text-dark)' }}>
                        {doctorName}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      {getStatusBadge(apt.status)}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {apt.status === 'PENDING' ? (
                          <button
                            onClick={() => {
                              setSelectedAppointment(apt);
                              setIsModalOpen(true);
                            }}
                            style={{ padding: '6px 12px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                          >
                            Phân công
                          </button>
                        ) : (apt.status === 'ASSIGNED' || apt.status === 'CONFIRMED') ? (
                          <>
                            <button
                              onClick={() => {
                                setSelectedAppointment(apt);
                                setIsModalOpen(true);
                              }}
                              style={{ padding: '8px', backgroundColor: '#f8fafc', color: 'var(--primary-color)', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                              title="Phân công lại"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleCompleteAppointment(apt.id)}
                              style={{ padding: '8px', backgroundColor: '#ecfdf5', color: '#10b981', border: '1px solid #a7f3d0', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                              title="Đánh dấu hoàn thành"
                            >
                              <CheckCircle size={16} />
                            </button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
            })}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', gap: '10px' }}>
          <button 
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            style={{ padding: '8px 16px', backgroundColor: currentPage === 0 ? '#f1f5f9' : 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: currentPage === 0 ? 'not-allowed' : 'pointer', color: currentPage === 0 ? '#94a3b8' : '#334155' }}
          >
            Trang trước
          </button>
          <div style={{ display: 'flex', gap: '5px' }}>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                style={{
                  width: '35px', height: '35px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: currentPage === idx ? 'var(--primary-color)' : 'white',
                  color: currentPage === idx ? 'white' : '#334155',
                  border: currentPage === idx ? 'none' : '1px solid #cbd5e1',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            style={{ padding: '8px 16px', backgroundColor: currentPage === totalPages - 1 ? '#f1f5f9' : 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer', color: currentPage === totalPages - 1 ? '#94a3b8' : '#334155' }}
          >
            Trang sau
          </button>
        </div>
      )}

      {/* Modal Phân công bác sĩ */}
      {isModalOpen && selectedAppointment && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '20px' }}>Phân công Bác sĩ</h2>
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <p><strong>Ngày khám:</strong> {selectedAppointment.date}</p>
              <p><strong>Giờ khám:</strong> {selectedAppointment.time}</p>
              <p><strong>Dịch vụ:</strong> {services.find(s => s.id === selectedAppointment.serviceId)?.name || selectedAppointment.serviceId}</p>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Chọn Bác sĩ phụ trách</label>
              <select 
                value={selectedDoctorId}
                onChange={e => setSelectedDoctorId(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }}
              >
                <option value="">-- Chọn bác sĩ --</option>
                {(() => {
                   const requiredSpecialty = services.find(s => s.id === selectedAppointment.serviceId)?.doctorSpecialty;
                   const availableDoctors = requiredSpecialty
                     ? doctors.filter(doc => doc.specialty === requiredSpecialty)
                     : doctors;
                   return availableDoctors.map(doc => {
                     const busy = isDoctorBusy(doc.id, selectedAppointment.date, selectedAppointment.time, selectedAppointment.id);
                     return (
                       <option key={doc.id} value={doc.id} disabled={busy}>
                         {doc.fullName} ({doc.specialty}) {busy ? '- Bận' : ''}
                       </option>
                     );
                   });
                })()}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => { setIsModalOpen(false); setSelectedDoctorId(''); }}
                style={{ padding: '10px 20px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer' }}
              >
                Hủy
              </button>
              <button 
                onClick={handleAssignDoctor}
                style={{ padding: '10px 20px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
