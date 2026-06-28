import React, { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, Calendar as CalendarIcon, BarChart3, Home, CheckCircle2, XCircle, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import doctorImg from '../assets/doctor1.png';
import calendarIcon3d from '../assets/3d_calendar.png';
import heartIcon3d from '../assets/3d_heart.png';
import DoctorAppointmentsPage from './DoctorAppointmentsPage';

interface Appointment {
  id: string;
  patientId: string;
  serviceId: string;
  date: string;
  time: string;
  status: string;
  cancelReason: string;
  patientName?: string;
  patientAvatar?: string;
  clinicName?: string;
}

interface Service {
  id: string;
  name: string;
}

interface UserProfile {
  fullName: string;
  avatarUrl: string;
}

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentTab, setCurrentTab] = useState<'PENDING,ASSIGNED' | 'CONFIRMED' | 'COMPLETED' | 'REJECTED,CANCELLED'>('PENDING,ASSIGNED');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'appointments'>('overview');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  useEffect(() => {
    setCurrentPage(1);
  }, [currentTab]);
  
  const token = localStorage.getItem('token');
  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchData();
  }, [currentTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appRes, allAppRes, servRes, profileRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/doctor/appointments?size=50&status=${currentTab}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/doctor/appointments?size=1000`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/services`),
        axios.get(`${API_BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setAppointments(appRes.data.content || []);
      setAllAppointments(allAppRes.data.content || []);
      setServices(servRes.data);
      setProfile(profileRes.data);
    } catch (err) {
      console.error(err);
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
        toast.success('Bạn đã nhận lịch khám thành công.');
      } else if (newStatus === 'REJECTED') {
        toast.success('Đã từ chối lịch hẹn. Admin sẽ được thông báo.');
      } else {
        toast.success(`Đã cập nhật trạng thái thành ${newStatus}!`);
      }
      fetchData();
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.');
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật.');
      }
    }
  };

  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const currentAppointments = appointments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Calculate dynamic stats
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointmentsCount = allAppointments.filter(a => a.date === todayStr).length;
  
  const uniquePatients = new Set(allAppointments.map(a => a.patientId));
  const totalPatientsCount = uniquePatients.size;

  // Calculate Monthly Progress (e.g. Completed this month vs Total this month)
  const currentMonthStr = todayStr.substring(0, 7); // yyyy-mm
  const thisMonthAppointments = allAppointments.filter(a => a.date && a.date.startsWith(currentMonthStr));
  const thisMonthCompleted = thisMonthAppointments.filter(a => a.status === 'COMPLETED').length;
  const progressPercent = thisMonthAppointments.length > 0 ? Math.round((thisMonthCompleted / thisMonthAppointments.length) * 100) : 0;
  // Fallback to 56 if no appointments this month just to look like the design initially
  const displayProgress = thisMonthAppointments.length > 0 ? progressPercent : 56;

  // Generate chart data from real appointments
  const chartData = useMemo(() => {
    const data = [];
    let maxCount = 0;
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = allAppointments.filter(a => a.date === dateStr).length;
      if (count > maxCount) maxCount = count;
      data.push({
        name: `${d.getDate()}/${d.getMonth() + 1}`,
        series1: count
      });
    }
    // Prevent divide by zero
    if (maxCount === 0) maxCount = 1;
    return { data, maxCount };
  }, [allAppointments]);

  // Generate dynamic SVG path for the custom area chart
  const svgPath = useMemo(() => {
    const { data, maxCount } = chartData;
    const width = 100;
    const height = 40;
    const step = width / (data.length - 1);
    
    let path = `M0,${height}`;
    data.forEach((point, index) => {
      const x = index * step;
      // Invert Y axis (0 is top, height is bottom)
      // We scale the value to fit within 5% to 90% of the height
      const normalizedValue = point.series1 / maxCount;
      const y = height - (normalizedValue * (height * 0.8) + (height * 0.1));
      
      if (index === 0) {
        path = `M${x},${y}`;
      } else {
        // Simple cubic bezier curve for smooth lines
        const prevX = (index - 1) * step;
        const prevY = height - ((data[index - 1].series1 / maxCount) * (height * 0.8) + (height * 0.1));
        const cx = (prevX + x) / 2;
        path += ` C${cx},${prevY} ${cx},${y} ${x},${y}`;
      }
    });
    return path;
  }, [chartData]);

  if (loading && !profile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#fafbfd' }}>
        <div style={{ width: 40, height: 40, border: '4px solid #849aef', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafbfd', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Sidebar */}
      <div style={{ width: '260px', backgroundColor: '#213343', borderRight: 'none', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '32px 24px 16px', color: '#9CA9B6', fontSize: '13px', fontWeight: 600, letterSpacing: '1px' }}>
          TRANG CHỦ
        </div>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => setActiveView('overview')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: activeView === 'overview' ? '#527768' : 'transparent', color: activeView === 'overview' ? '#ffffff' : '#9CA9B6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: activeView === 'overview' ? 600 : 500, transition: 'all 0.2s' }} onMouseOver={(e) => { if (activeView !== 'overview') e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)' }} onMouseOut={(e) => { if (activeView !== 'overview') e.currentTarget.style.backgroundColor = 'transparent' }}>
            <LayoutDashboard size={20} />
            Bảng Điều Khiển
          </button>
          <button onClick={() => setActiveView('appointments')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: activeView === 'appointments' ? '#527768' : 'transparent', color: activeView === 'appointments' ? '#ffffff' : '#9CA9B6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: activeView === 'appointments' ? 600 : 500, transition: 'all 0.2s' }} onMouseOver={(e) => { if (activeView !== 'appointments') e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)' }} onMouseOut={(e) => { if (activeView !== 'appointments') e.currentTarget.style.backgroundColor = 'transparent' }}>
            <CalendarIcon size={20} />
            Lịch Hẹn
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: 'transparent', color: '#9CA9B6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 500, transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <BarChart3 size={20} />
            Báo Cáo
          </button>
        </div>
        
        <div style={{ marginTop: 'auto', padding: '20px' }}>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: 'transparent', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 600, width: '100%', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '32px 48px', overflowY: 'auto' }}>
        
        {/* Top Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8898aa', fontSize: '14px' }}>
            <Home size={16} style={{ cursor: 'pointer' }} onClick={() => navigate('/')} /> › Bảng điều khiển
            {activeView === 'appointments' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                › Cuộc hẹn
              </span>
            )}
          </div>

          {/* User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#2d3748' }}>{profile?.fullName || 'Bác sĩ'}</div>
              <div style={{ fontSize: '12px', color: '#8898aa' }}>Bác sĩ nha khoa</div>
            </div>
            
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div style={{ position: 'relative' }}>
                <img 
                  src={profile?.avatarUrl || 'https://via.placeholder.com/40'} 
                  alt="Avatar" 
                  onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile?.fullName || 'User') + '&background=random'; }}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #f1f3f5' }} 
                />
                <span style={{ position: 'absolute', bottom: '2px', right: '2px', width: '12px', height: '12px', backgroundColor: '#10b981', border: '2px solid #fff', borderRadius: '50%' }}></span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d3748" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '220px', backgroundColor: '#1e293b', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 50 }}>
                <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 0' }}>
                  <button onClick={() => navigate('/profile')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', backgroundColor: 'transparent', color: '#f8fafc', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500, textAlign: 'left' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Profile
                  </button>
                  <button onClick={() => navigate('/settings')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', backgroundColor: 'transparent', color: '#f8fafc', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500, textAlign: 'left' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    Settings
                  </button>
                  <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '4px 0' }}></div>
                  <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', backgroundColor: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500, textAlign: 'left' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {activeView === 'overview' ? (
          <>
            {/* Welcome Banner */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                <h1 style={{ fontSize: '36px', color: '#2d3748', fontWeight: 300, marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>
                  Chào Buổi Sáng, <span style={{ fontWeight: 600 }}>{profile?.fullName || 'Bác sĩ'}</span>
                </h1>
                <p style={{ color: '#8898aa', fontSize: '15px', marginBottom: '24px' }}>
                  Chúc bạn một ngày làm việc tốt lành. Tiến độ rất tuyệt vời!
                </p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button onClick={() => setActiveView('appointments')} style={{ backgroundColor: '#849aef', color: '#fff', padding: '12px 24px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px rgba(132, 154, 239, 0.2)', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    Xem lịch trình +
                  </button>
                  <button onClick={() => setActiveView('appointments')} style={{ backgroundColor: '#ed8e8e', color: '#fff', padding: '12px 24px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px rgba(237, 142, 142, 0.2)', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    Cuộc hẹn +
                  </button>
                </div>
              </div>
              <div>
                <img src={doctorImg} alt="Doctor" style={{ height: '220px', objectFit: 'contain' }} />
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
              {/* Card 1 */}
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px 0 0 0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', height: '160px' }}>
                <h3 style={{ fontSize: '15px', color: '#2d3748', fontWeight: 600, marginBottom: '8px', textAlign: 'center' }}>Monthly Progress</h3>
                <div style={{ fontSize: '24px', color: '#ed8e8e', fontWeight: 700, textAlign: 'center' }}>{displayProgress}%</div>
                
                <div style={{ flex: 1, width: '100%', marginTop: '10px', position: 'relative' }}>
                  <svg viewBox="0 0 100 40" style={{ width: '100%', height: '100%', position: 'absolute', bottom: 0, left: 0, right: 0 }} preserveAspectRatio="none">
                    <path d={`${svgPath} L100,40 L0,40 Z`} fill="#f0f3ff" />
                    <path d={svgPath} fill="none" stroke="#849aef" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Card 2 */}
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden', height: '160px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '24px 24px 16px 24px', zIndex: 2 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '15px', color: '#2d3748', fontWeight: 600 }}>Today Appointment</h3>
                    <span style={{ color: '#a0aec0', cursor: 'pointer', fontWeight: 700 }}>•••</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '28px', color: '#849aef', fontWeight: 700 }}>{todayAppointmentsCount}</span>
                    <span style={{ backgroundColor: '#d1fae5', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>+25.2%</span>
                  </div>
                </div>
                
                <div style={{ backgroundColor: '#f4f7ff', flex: 1, position: 'relative' }}>
                  <img src={calendarIcon3d} alt="Calendar" style={{ position: 'absolute', bottom: '10px', right: '10px', height: '80px', objectFit: 'contain' }} />
                </div>
              </div>

              {/* Card 3 */}
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden', height: '160px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '24px 24px 16px 24px', zIndex: 2 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '15px', color: '#2d3748', fontWeight: 600 }}>Total patients</h3>
                    <span style={{ color: '#a0aec0', cursor: 'pointer', fontWeight: 700 }}>•••</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '28px', color: '#849aef', fontWeight: 700 }}>{totalPatientsCount > 0 ? totalPatientsCount : '0'}</span>
                    <span style={{ backgroundColor: '#d1fae5', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>+25.2% last week</span>
                  </div>
                </div>
                
                <div style={{ backgroundColor: '#f4f7ff', flex: 1, position: 'relative' }}>
                  <img src={heartIcon3d} alt="Heart Hand" style={{ position: 'absolute', bottom: '10px', right: '10px', height: '90px', objectFit: 'contain' }} />
                </div>
              </div>
            </div>

            {/* Appointments Section */}
            <div id="appointments-section" style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', color: '#2d3748', fontWeight: 600 }}>Lịch hẹn của tôi</h2>
                <button onClick={fetchData} style={{ color: '#849aef', background: 'none', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Làm mới</button>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', borderBottom: '1px solid #f1f3f5' }}>
                {[
                  { id: 'PENDING,ASSIGNED', label: 'Chờ nhận' },
                  { id: 'CONFIRMED', label: 'Đã nhận' },
                  { id: 'COMPLETED', label: 'Đã khám xong' },
                  { id: 'REJECTED,CANCELLED', label: 'Đã từ chối/Hủy' }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id as any)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '12px 4px',
                      fontSize: '15px',
                      fontWeight: currentTab === tab.id ? 600 : 500,
                      color: currentTab === tab.id ? '#849aef' : '#8898aa',
                      borderBottom: currentTab === tab.id ? '2px solid #849aef' : '2px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      marginBottom: '-1px'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {appointments.length === 0 ? (
                  <div style={{ color: '#8898aa', textAlign: 'center', padding: '40px 20px' }}>Chưa có lịch hẹn nào trong mục này.</div>
                ) : currentAppointments.map((apt) => (
                  <div key={apt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', border: '1px solid #f1f3f5', borderRadius: '12px', transition: 'box-shadow 0.2s' }} onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{ backgroundColor: '#f0f3ff', color: '#849aef', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, textAlign: 'center', minWidth: '80px' }}>
                        <div>{apt.date.split('-')[2]}/{apt.date.split('-')[1]}</div>
                        <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>{apt.time.split(':').slice(0, 2).join(':')}</div>
                      </div>
                      <div>
                        <h4 style={{ color: '#2d3748', fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>Bệnh nhân: {apt.patientName || (apt.patientId === 'GUEST' ? 'Khách vãng lai' : apt.patientId)}</h4>
                        <p style={{ color: '#7a8599', fontSize: '14px', marginBottom: '4px' }}>Dịch vụ: <span style={{ fontWeight: 500, color: '#4a5568' }}>{services.find(s => s.id === apt.serviceId)?.name || apt.serviceId}</span></p>
                        <p style={{ color: '#7a8599', fontSize: '13px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                           <span style={{ fontSize: '12px' }}>📍</span> <span style={{ fontWeight: 500, color: '#4a5568' }}>{apt.clinicName || 'Chưa cập nhật cơ sở'}</span>
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: apt.status === 'CONFIRMED' ? '#10b981' : apt.status === 'COMPLETED' ? '#3b82f6' : apt.status.includes('REJECT') || apt.status.includes('CANCEL') ? '#ef4444' : '#f59e0b' }}></span>
                          <span style={{ color: '#7a8599', fontSize: '13px', fontWeight: 500 }}>{apt.status}</span>
                        </div>
                        {apt.cancelReason && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', padding: '6px 12px', backgroundColor: '#fee2e2', borderRadius: '6px', display: 'inline-block' }}>Lý do: {apt.cancelReason}</p>}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {apt.status === 'ASSIGNED' && (
                        <>
                          <button onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'} onMouseOut={(e) => e.currentTarget.style.opacity = '1'}>
                            <CheckCircle2 size={16} /> Nhận lịch
                          </button>
                          <button onClick={() => handleUpdateStatus(apt.id, 'REJECTED')} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'} onMouseOut={(e) => e.currentTarget.style.opacity = '1'}>
                            <XCircle size={16} /> Từ chối
                          </button>
                        </>
                      )}
                      {apt.status === 'CONFIRMED' && (
                        <button onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#849aef', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'} onMouseOut={(e) => e.currentTarget.style.opacity = '1'}>
                          <CheckCircle2 size={16} /> Khám xong
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {!loading && appointments.length > itemsPerPage && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f3f5' }}>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                    Hiển thị mục {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, appointments.length)} trong tổng số {appointments.length} mục
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: currentPage === pageNum ? 600 : 500,
                          backgroundColor: currentPage === pageNum ? '#849aef' : '#f1f5f9',
                          color: currentPage === pageNum ? 'white' : '#64748b',
                          transition: 'all 0.2s'
                        }}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <DoctorAppointmentsPage onBack={() => setActiveView('overview')} />
        )}



      </div>
    </div>
  );
}
