import React, { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Appointment {
  id: string;
  patientId: string;
  serviceId: string;
  date: string;
  time: string;
  status: string;
  cancelReason: string;
  createdAt: string;
  patientName?: string;
  patientAvatar?: string;
  clinicName?: string;
}

export default function DoctorAppointmentsPage({ onBack }: { onBack?: () => void }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  
  const token = localStorage.getItem('token');
  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/doctor/appointments?size=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Sort to show pending/assigned first, then by date
      const sorted = (res.data.content || []).sort((a: Appointment, b: Appointment) => {
        if (a.status === 'ASSIGNED' && b.status !== 'ASSIGNED') return -1;
        if (a.status !== 'ASSIGNED' && b.status === 'ASSIGNED') return 1;
        return 0;
      });
      setAppointments(sorted);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi tải danh sách cuộc hẹn');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    let reason = '';
    if (newStatus === 'REJECTED' || newStatus === 'CANCELLED') {
      const input = prompt("Vui lòng nhập lý do từ chối/hủy:");
      if (input === null) return;
      reason = input;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/doctor/appointments/${id}/status?status=${newStatus}${reason ? `&cancelReason=${encodeURIComponent(reason)}` : ''}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (newStatus === 'CONFIRMED') {
        toast.success('Đã chấp nhận cuộc hẹn.');
      } else if (newStatus === 'REJECTED' || newStatus === 'CANCELLED') {
        toast.success('Đã hủy bỏ cuộc hẹn.');
      } else {
        toast.success(`Đã cập nhật trạng thái thành ${newStatus}!`);
      }
      fetchAppointments();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const currentData = appointments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDateTime = (dateStr: string, timeStr: string) => {
    if (!dateStr) return 'Chưa rõ';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const formattedTime = timeStr ? timeStr.split(':').slice(0, 2).join(':') : '';
      return `Ngày ${parts[2]} tháng ${parts[1]}, lúc ${formattedTime}`;
    }
    return `${dateStr} ${timeStr}`;
  };

  const getPatientName = (patientId: string) => {
    if (patientId === 'GUEST') return 'Khách vãng lai';
    if (patientId.includes('@')) return patientId.split('@')[0];
    return patientId;
  };

  const getPatientEmail = (patientId: string) => {
    if (patientId === 'GUEST') return 'N/A';
    if (patientId.includes('@')) return patientId;
    return `${patientId}@gmail.com`; // Fallback for display
  };

  return (
    <div>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        


        <h1 style={{ fontSize: '24px', color: '#1e293b', fontWeight: 600, marginBottom: '24px' }}>Danh sách Cuộc Hẹn</h1>

        {/* Table Container */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#000', color: '#fff' }}>
              <tr>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>KHÔNG.</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tên</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>E-Mail</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ngày Và Giờ</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hoạt Động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu...</td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Không có cuộc hẹn nào</td>
                </tr>
              ) : (
                currentData.map((apt, index) => (
                  <tr key={apt.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 24px', color: '#64748b', fontSize: '14px' }}>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={apt.patientAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patientName || getPatientName(apt.patientId))}&background=random`} 
                          onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patientName || getPatientName(apt.patientId))}&background=random`; }}
                          alt="Avatar" 
                          style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9', objectFit: 'cover' }} 
                        />
                        <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>{apt.patientName || getPatientName(apt.patientId)}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ color: '#94a3b8', fontSize: '14px' }}>
                        {getPatientEmail(apt.patientId)}
                      </div>
                      <div style={{ fontSize: '13px', color: '#0369a1', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                         <span style={{ fontSize: '12px' }}>📍</span> {apt.clinicName || 'Chưa cập nhật cơ sở'}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', color: '#94a3b8', fontSize: '14px' }}>
                      {formatDateTime(apt.date, apt.time)}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      {apt.status === 'ASSIGNED' || apt.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button 
                            onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')}
                            style={{ padding: '6px 12px', backgroundColor: '#dcfce7', color: '#166534', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                          >
                            Chấp nhận
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(apt.id, 'REJECTED')}
                            style={{ padding: '6px 12px', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                          >
                            Hủy bỏ
                          </button>
                        </div>
                      ) : (
                        <span style={{ 
                          padding: '6px 12px', 
                          borderRadius: '4px', 
                          fontSize: '13px', 
                          fontWeight: 500,
                          backgroundColor: apt.status === 'CONFIRMED' ? '#dbeafe' : apt.status === 'COMPLETED' ? '#f3e8ff' : '#f1f5f9',
                          color: apt.status === 'CONFIRMED' ? '#1e40af' : apt.status === 'COMPLETED' ? '#6b21a8' : '#64748b'
                        }}>
                          {apt.status === 'CONFIRMED' ? 'Đã chấp nhận' : apt.status === 'COMPLETED' ? 'Đã hoàn thành' : 'Đã hủy'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {!loading && appointments.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                Hiển thị mục {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, appointments.length)} trong tổng số {appointments.length} mục
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{ background: 'none', border: 'none', color: currentPage === 1 ? '#cbd5e1' : '#64748b', cursor: currentPage === 1 ? 'default' : 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  ‹ Trước
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{ background: 'none', border: 'none', color: currentPage === totalPages ? '#cbd5e1' : '#64748b', cursor: currentPage === totalPages ? 'default' : 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  Kế tiếp ›
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
