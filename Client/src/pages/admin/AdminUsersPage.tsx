import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Edit, Lock, Unlock, Trash2, Calendar as CalendarIcon, User as UserIcon } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  active: boolean;
  createdAt: string;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  serviceId: string;
  serviceName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const token = localStorage.getItem('token');

  // Modal states
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [viewAppointmentsUser, setViewAppointmentsUser] = useState<User | null>(null);
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);
  const [isAppointmentsModalOpen, setIsAppointmentsModalOpen] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  // Form states
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    if (!window.confirm(`Bạn có chắc muốn ${currentStatus ? 'khóa' : 'mở khóa'} tài khoản này?`)) return;
    try {
      await axios.put(`http://localhost:8080/api/admin/users/${id}/status?active=${!currentStatus}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Có lỗi xảy ra.');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.')) return;
    try {
      await axios.delete(`http://localhost:8080/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Có lỗi xảy ra.');
    }
  };

  const openEditModal = (user: User) => {
    setEditUser(user);
    setEditFullName(user.fullName || '');
    setEditPhone(user.phone || '');
    setEditRole(user.role || 'CUSTOMER');
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    
    try {
      await axios.put(`http://localhost:8080/api/admin/users/${editUser.id}`, {
        fullName: editFullName,
        phone: editPhone,
        role: editRole
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Có lỗi xảy ra khi cập nhật.');
    }
  };

  const openAppointmentsModal = async (user: User) => {
    setViewAppointmentsUser(user);
    setIsAppointmentsModalOpen(true);
    setLoadingAppointments(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/admin/users/${user.id}/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserAppointments(res.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setUserAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.phone && user.phone.includes(searchTerm));
    
    const matchesRole = filterRole === 'ALL' 
      || user.role === filterRole 
      || (filterRole === 'DOCTOR' && user.role === 'ROLE_DOCTOR')
      || (filterRole === 'CUSTOMER' && user.role === 'PATIENT');
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    if (role === 'ADMIN') return { bg: '#fee2e2', text: '#b91c1c' };
    if (role === 'DOCTOR' || role === 'ROLE_DOCTOR') return { bg: '#dbeafe', text: '#1d4ed8' };
    return { bg: '#f3f4f6', text: '#374151' }; // CUSTOMER
  };

  const formatRole = (role: string) => {
    if (role === 'ADMIN') return 'Admin';
    if (role === 'DOCTOR' || role === 'ROLE_DOCTOR') return 'Bác sĩ';
    return 'Bệnh nhân';
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--secondary-color)', margin: 0 }}>Quản lý Người dùng</h1>
      </div>

      {/* Filters */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={20} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Tìm theo tên, email, SĐT..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none' }}
          />
        </div>
        <select 
          value={filterRole} 
          onChange={(e) => setFilterRole(e.target.value)}
          style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', background: 'white' }}
        >
          <option value="ALL">Tất cả vai trò</option>
          <option value="CUSTOMER">Bệnh nhân</option>
          <option value="DOCTOR">Bác sĩ</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '16px', fontWeight: '600', color: '#4b5563', fontSize: '14px' }}>Họ Tên</th>
                <th style={{ padding: '16px', fontWeight: '600', color: '#4b5563', fontSize: '14px' }}>Email</th>
                <th style={{ padding: '16px', fontWeight: '600', color: '#4b5563', fontSize: '14px' }}>SĐT</th>
                <th style={{ padding: '16px', fontWeight: '600', color: '#4b5563', fontSize: '14px' }}>Vai trò</th>
                <th style={{ padding: '16px', fontWeight: '600', color: '#4b5563', fontSize: '14px' }}>Trạng thái</th>
                <th style={{ padding: '16px', fontWeight: '600', color: '#4b5563', fontSize: '14px', textAlign: 'center' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>Đang tải dữ liệu...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>Không tìm thấy người dùng nào</td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px', fontSize: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <UserIcon size={16} color="#6b7280" />
                        </div>
                        <span style={{ fontWeight: '500', color: '#111827' }}>{user.fullName || '(Chưa cập nhật)'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#4b5563' }}>{user.email}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#4b5563' }}>{user.phone || '-'}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '9999px', 
                        fontSize: '12px', 
                        fontWeight: '500',
                        backgroundColor: getRoleBadgeColor(user.role).bg,
                        color: getRoleBadgeColor(user.role).text
                      }}>
                        {formatRole(user.role)}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '9999px', 
                        fontSize: '12px', 
                        fontWeight: '500',
                        backgroundColor: user.active ? '#dcfce7' : '#fee2e2',
                        color: user.active ? '#166534' : '#b91c1c'
                      }}>
                        {user.active ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button 
                        onClick={() => openAppointmentsModal(user)}
                        title="Xem lịch hẹn"
                        style={{ background: '#f3f4f6', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#4b5563' }}
                      >
                        <CalendarIcon size={16} />
                      </button>
                      <button 
                        onClick={() => openEditModal(user)}
                        title="Chỉnh sửa"
                        style={{ background: '#f3f4f6', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#3b82f6' }}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(user.id, user.active)}
                        title={user.active ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                        style={{ background: '#f3f4f6', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: user.active ? '#f59e0b' : '#10b981' }}
                      >
                        {user.active ? <Lock size={16} /> : <Unlock size={16} />}
                      </button>
                      {user.role !== 'ADMIN' && (
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          title="Xóa tài khoản"
                          style={{ background: '#fee2e2', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#ef4444' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--secondary-color)' }}>Cập nhật người dùng</h2>
            <form onSubmit={handleEditSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Email</label>
                <input type="text" value={editUser?.email || ''} disabled style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#f9fafb' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Họ và tên</label>
                <input 
                  type="text" 
                  value={editFullName} 
                  onChange={e => setEditFullName(e.target.value)} 
                  style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none' }} 
                  required
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Số điện thoại</label>
                <input 
                  type="tel" 
                  value={editPhone} 
                  onChange={e => setEditPhone(e.target.value)} 
                  style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none' }} 
                />
              </div>
              {editUser?.role !== 'ADMIN' && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Vai trò</label>
                  <select 
                    value={editRole === 'PATIENT' ? 'CUSTOMER' : editRole} 
                    onChange={e => setEditRole(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', background: 'white' }}
                  >
                    <option value="CUSTOMER">Bệnh nhân</option>
                    <option value="DOCTOR">Bác sĩ</option>
                  </select>
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '10px 16px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Hủy</button>
                <button type="submit" style={{ padding: '10px 16px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointments Modal */}
      {isAppointmentsModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '800px', maxWidth: '90%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: 'var(--secondary-color)' }}>Lịch hẹn của: {viewAppointmentsUser?.fullName || viewAppointmentsUser?.email}</h2>
              <button onClick={() => setIsAppointmentsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loadingAppointments ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Đang tải lịch hẹn...</div>
              ) : userAppointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Khách hàng này chưa có lịch hẹn nào.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '12px', fontWeight: '600', color: '#4b5563', fontSize: '13px' }}>Ngày & Giờ</th>
                      <th style={{ padding: '12px', fontWeight: '600', color: '#4b5563', fontSize: '13px' }}>Dịch vụ</th>
                      <th style={{ padding: '12px', fontWeight: '600', color: '#4b5563', fontSize: '13px' }}>Bác sĩ</th>
                      <th style={{ padding: '12px', fontWeight: '600', color: '#4b5563', fontSize: '13px' }}>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userAppointments.map((app: any) => (
                      <tr key={app.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px', fontSize: '14px' }}>
                          <div style={{ fontWeight: '500' }}>{app.appointmentDate}</div>
                          <div style={{ color: '#6b7280', fontSize: '12px' }}>{app.startTime}</div>
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{app.serviceName || app.serviceId}</td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{app.doctorName || app.doctorId}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: app.status === 'COMPLETED' ? '#dcfce7' : app.status === 'CANCELLED' ? '#fee2e2' : '#dbeafe',
                            color: app.status === 'COMPLETED' ? '#166534' : app.status === 'CANCELLED' ? '#b91c1c' : '#1d4ed8'
                          }}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
