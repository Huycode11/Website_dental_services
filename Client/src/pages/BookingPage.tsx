import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Stethoscope, User as UserIcon, CheckCircle2, Eye, EyeOff, Mail, Lock, User as UserFullIcon } from 'lucide-react';
import Layout from '../components/layout/Layout';


interface Clinic {
  id: string;
  name: string;
  address: string;
  hotline: string;
  imageUrl?: string;
}

interface Specialty {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  doctorSpecialty: string;
}

export default function BookingPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // Data state
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  // Selection state
  const [selectedClinic, setSelectedClinic] = useState<string>('');
  const [clinicPage, setClinicPage] = useState<number>(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const clinicsPerPage = 6;
  const totalClinicPages = Math.ceil(clinics.length / clinicsPerPage);
  const paginatedClinics = clinics.slice((clinicPage - 1) * clinicsPerPage, clinicPage * clinicsPerPage);

  // UI state
  const [step, setStep] = useState<number>(1);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auth form state
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clinicRes, specRes, servRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/clinics`),
        axios.get(`${API_BASE_URL}/specialties`),
        axios.get(`${API_BASE_URL}/services`)
      ]);
      setClinics(clinicRes.data);
      setSpecialties(specRes.data);
      setServices(servRes.data);
    } catch (error) {
      console.error('Error fetching data for booking:', error);
    }
  };

  const getFilteredServices = () => {
    if (!selectedSpecialty) return [];
    const spec = specialties.find(s => s.id === selectedSpecialty);
    if (!spec) return [];
    return services.filter(s => s.doctorSpecialty === spec.name);
  };

  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dayStr = String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0');
      const dayOfWeek = date.getDay();
      const dayName = dayOfWeek === 0 ? 'Chủ nhật' : `Thứ ${dayOfWeek + 1}`;
      const isoDate = date.toISOString().split('T')[0];
      days.push({ label: `(${dayStr})`, dayName, isoDate });
    }
    return days;
  };

  const morningSlots = ['09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00'];
  const afternoonSlots = ['14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00'];

  const handleSubmitBooking = async (currentToken: string | null = token) => {
    setLoading(true);
    try {
      // If patient is logged in, their token should ideally extract their ID. 
      // But we just pass "GUEST" if no token, otherwise API takes token.
      const patientId = localStorage.getItem('userId') || 'GUEST';
      let notes = '';
      if (isGuestMode) {
        notes = `Khách vãng lai: ${guestName} - ${guestPhone}`;
      }

      const payload = {
        patientId,
        clinicId: selectedClinic,
        specialtyId: selectedSpecialty,
        serviceId: selectedService,
        date: selectedDate,
        time: selectedTime,
        notes: notes
      };

      const config = currentToken ? { headers: { Authorization: `Bearer ${currentToken}` } } : {};
      await axios.post(`${API_BASE_URL}/appointments`, payload, config);
      setStep(3); // Success step
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Có lỗi xảy ra khi đặt lịch, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep1 = () => {
    if (!isFormComplete) {
      alert('Vui lòng chọn đầy đủ thông tin khám!');
      return;
    }
    if (token) {
      // Already logged in, submit booking immediately
      handleSubmitBooking(token);
    } else {
      // Not logged in, go to step 2 for authentication
      setStep(2);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!isLoginMode) {
      if (password !== confirmPassword) {
        setAuthError('Mật khẩu nhập lại không khớp.');
        return;
      }
      if (password.length < 8) {
        setAuthError('Mật khẩu phải có ít nhất 8 ký tự.');
        return;
      }
      if (!/.*[A-Z].*/.test(password)) {
        setAuthError('Mật khẩu phải chứa ít nhất 1 chữ hoa.');
        return;
      }
      if (!/.*[0-9].*/.test(password)) {
        setAuthError('Mật khẩu phải chứa ít nhất 1 số.');
        return;
      }
      if (!/.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*/.test(password)) {
        setAuthError('Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt.');
        return;
      }
      if (!/^[\x21-\x7E]+$/.test(password)) {
        setAuthError('Mật khẩu không được chứa khoảng trắng hoặc có dấu.');
        return;
      }
    }

    setLoading(true);
    try {
      let currentToken = null;
      if (isLoginMode) {
        const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
        if (res.data.token) {
          currentToken = res.data.token;
        }
      } else {
        const res = await axios.post(`${API_BASE_URL}/auth/register`, { email, password, fullName });
        if (res.data.token) {
          currentToken = res.data.token;
        }
      }

      if (currentToken) {
        localStorage.setItem('token', currentToken);
        setToken(currentToken);
        // After successful login/register, automatically submit booking
        await handleSubmitBooking(currentToken);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setAuthError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      } else {
        setAuthError('Có lỗi xảy ra. Vui lòng thử lại.');
      }
      setLoading(false);
    }
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone) {
      setAuthError('Vui lòng nhập đầy đủ họ tên và số điện thoại.');
      return;
    }
    await handleSubmitBooking(null);
  };

  const nextDays = getNextDays();

  const generateCalendarDays = () => {
    const days = [];
    let startDay = 1;
    for (let i = 0; i < 30; i++) {
      days.push(startDay++);
    }
    return days;
  };

  const isFormComplete = selectedClinic && selectedSpecialty && selectedService && selectedDate && selectedTime;

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  // --- Inline Styles ---
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      padding: '120px 20px 60px',
      justifyContent: 'center',
      alignItems: 'flex-start',
    } as React.CSSProperties,
    wrapper: {
      display: 'flex',
      gap: '20px',
      width: '100%',
      maxWidth: '1200px',
    } as React.CSSProperties,
    sidebar: {
      width: '300px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      height: 'fit-content',
    } as React.CSSProperties,
    sidebarHeader: {
      backgroundColor: '#122B42',
      color: 'white',
      padding: '15px',
      fontWeight: '600',
      textAlign: 'center' as const,
    } as React.CSSProperties,
    sidebarBody: {
      padding: '20px',
    } as React.CSSProperties,
    main: {
      flex: 1,
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
    } as React.CSSProperties,
    mainHeader: {
      backgroundColor: '#122B42',
      color: 'white',
      padding: '25px 30px',
      display: 'flex',
      alignItems: 'center',
    } as React.CSSProperties,
    mainBody: {
      padding: '24px',
      backgroundColor: '#f0f7f5',
    } as React.CSSProperties,
    label: {
      display: 'block',
      fontWeight: '600',
      marginBottom: '10px',
      color: '#122B42',
    } as React.CSSProperties,
    select: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      backgroundColor: 'white',
      cursor: 'pointer',
      color: '#122B42',
      marginBottom: '24px',
    } as React.CSSProperties,
    dateSelector: {
      display: 'flex',
      gap: '10px',
      marginBottom: '24px',
    } as React.CSSProperties,
    dateBox: (isActive: boolean) => ({
      flex: 1,
      backgroundColor: isActive ? '#e6f0fa' : 'white',
      border: `1px solid ${isActive ? '#122B42' : '#cbd5e1'}`,
      borderRadius: '8px',
      padding: '15px 10px',
      textAlign: 'center' as const,
      cursor: 'pointer',
      color: isActive ? '#1d4ed8' : '#122B42',
      fontWeight: isActive ? '600' : 'normal',
    } as React.CSSProperties),
    timeGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
      marginBottom: '20px',
    } as React.CSSProperties,
    timeSlot: (isActive: boolean) => ({
      backgroundColor: isActive ? '#122B42' : 'white',
      border: `1px solid ${isActive ? '#122B42' : '#cbd5e1'}`,
      borderRadius: '6px',
      padding: '12px',
      textAlign: 'center' as const,
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      color: isActive ? 'white' : '#122B42',
    } as React.CSSProperties),
    submitBtn: {
      width: '100%',
      backgroundColor: '#10b981', // Green color
      color: 'white',
      padding: '14px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '15px',
    } as React.CSSProperties,
    modalOverlay: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    } as React.CSSProperties,
    modalContent: {
      background: 'white',
      borderRadius: '12px',
      width: '400px',
      padding: '20px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    } as React.CSSProperties,
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '5px',
      textAlign: 'center' as const,
    } as React.CSSProperties,
    calendarDay: (disabled: boolean = false) => ({
      padding: '10px 0',
      borderRadius: '4px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: '14px',
      color: disabled ? '#cbd5e1' : '#122B42',
    } as React.CSSProperties),
    stepperContainer: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px',
      position: 'relative' as const,
    } as React.CSSProperties,
    stepCircle: (isActive: boolean) => ({
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: isActive ? 'white' : 'transparent',
      border: isActive ? 'none' : '2px solid rgba(255,255,255,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isActive ? '#122B42' : 'rgba(255,255,255,0.7)',
      position: 'relative' as const,
      boxShadow: isActive ? '0 0 0 4px rgba(255,255,255,0.3)' : 'none',
      zIndex: 2,
    } as React.CSSProperties),
    stepLine: {
      height: '2px',
      flex: 1,
      backgroundColor: 'rgba(255,255,255,0.4)',
      maxWidth: '120px',
    } as React.CSSProperties,
    authCard: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      margin: '0 auto',
    } as React.CSSProperties,
    inputGroup: {
      marginBottom: '15px',
    } as React.CSSProperties,
    inputWrapper: {
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      padding: '10px 15px',
      backgroundColor: 'white',
    } as React.CSSProperties,
    input: {
      border: 'none',
      outline: 'none',
      flex: 1,
      marginLeft: '10px',
      fontSize: '14px',
    } as React.CSSProperties,
  };

  const getStepIcon = (stepNumber: number) => {
    switch (stepNumber) {
      case 1: return <Stethoscope size={24} />;
      case 2: return <UserIcon size={24} />;
      case 3: return <CheckCircle2 size={24} />;
      default: return null;
    }
  };

  return (
    <Layout token={token} onLogout={handleLogout}>
      <div style={styles.container}>
        {!selectedClinic ? (
          <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', color: '#122B42', marginBottom: '30px', fontSize: '28px', fontWeight: 'bold' }}>
              Chọn Cơ Sở Khám Bệnh
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {paginatedClinics.map(clinic => (
                <div key={clinic.id} style={{
                  background: 'white', borderRadius: '12px', padding: '24px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb',
                  display: 'flex', gap: '24px', alignItems: 'flex-start'
                }}>
                  <div style={{
                    width: '100px', height: '100px', borderRadius: '12px', 
                    background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid #f1f5f9', overflow: 'hidden'
                  }}>
                    {clinic.imageUrl ? (
                      <img src={clinic.imageUrl} alt={clinic.name} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                    ) : (
                      <span style={{fontSize:'36px'}}>🏥</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '20px', margin: '0 0 12px 0', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {clinic.name} <CheckCircle2 size={18} color="#0ea5e9" fill="#e0f2fe" />
                    </h3>
                    <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '15px', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: '1.5' }}>
                       <span style={{marginTop: '2px'}}>📍</span> {clinic.address}
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        onClick={() => setSelectedClinic(clinic.id)}
                        style={{ padding: '10px 20px', borderRadius: '24px', border: 'none', background: '#38bdf8', color: 'white', cursor: 'pointer', fontSize: '15px', fontWeight: 500, boxShadow: '0 2px 4px rgba(56, 189, 248, 0.3)', transition: 'all 0.2s' }}>
                        Đặt khám ngay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {totalClinicPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', gap: '10px' }}>
                <button
                  onClick={() => setClinicPage(prev => Math.max(prev - 1, 1))}
                  disabled={clinicPage === 1}
                  style={{
                    padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e7eb',
                    background: clinicPage === 1 ? '#f3f4f6' : 'white', cursor: clinicPage === 1 ? 'not-allowed' : 'pointer',
                    color: clinicPage === 1 ? '#9ca3af' : '#0369a1', fontWeight: 500
                  }}
                >
                  Trang trước
                </button>
                <span style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#64748b' }}>
                  {clinicPage} / {totalClinicPages}
                </span>
                <button
                  onClick={() => setClinicPage(prev => Math.min(prev + 1, totalClinicPages))}
                  disabled={clinicPage === totalClinicPages}
                  style={{
                    padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e7eb',
                    background: clinicPage === totalClinicPages ? '#f3f4f6' : 'white', cursor: clinicPage === totalClinicPages ? 'not-allowed' : 'pointer',
                    color: clinicPage === totalClinicPages ? '#9ca3af' : '#0369a1', fontWeight: 500
                  }}
                >
                  Trang sau
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={styles.wrapper}>
            {/* Sidebar */}
          <div style={styles.sidebar}>
            <div style={styles.sidebarHeader}>Thông tin cơ sở y tế</div>
            <div style={styles.sidebarBody}>
              {selectedClinic ? (() => {
                const clinic = clinics.find(c => c.id === selectedClinic);
                if (clinic) {
                  return (
                    <>
                      <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#122B42' }}>{clinic.name}</h3>
                      <p style={{ fontSize: '14px', color: '#667585', lineHeight: '1.5' }}>
                        {clinic.address}
                      </p>
                    </>
                  );
                }
                return null;
              })() : (
                <div style={{ padding: '20px 0', textAlign: 'center', color: '#667585' }}>
                  Vui lòng chọn cơ sở y tế
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div style={styles.main}>
            <div style={styles.mainHeader}>
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => {
                  if (step === 1) {
                    setSelectedClinic(''); // go back to clinic list
                  } else {
                    setStep(prev => prev - 1);
                  }
                }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              </div>

              <div style={styles.stepperContainer}>
                <div style={styles.stepCircle(step === 1)}>{getStepIcon(1)}</div>
                <div style={styles.stepLine}></div>
                <div style={styles.stepCircle(step === 2)}>{getStepIcon(2)}</div>
                <div style={styles.stepLine}></div>
                <div style={styles.stepCircle(step === 3)}>{getStepIcon(3)}</div>
              </div>
            </div>

            <div style={styles.mainBody}>

              {step === 1 && (
                <>
                  {/* Specialty */}
                  <div>
                    <label style={styles.label}>Chuyên khoa <span style={{ color: 'red' }}>*</span></label>
                    <select
                      style={styles.select}
                      value={selectedSpecialty}
                      onChange={(e) => {
                        setSelectedSpecialty(e.target.value);
                        setSelectedService('');
                      }}
                    >
                      <option value="">Chọn chuyên khoa</option>
                      {specialties.map(spec => (
                        <option key={spec.id} value={spec.id}>{spec.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Service */}
                  <div>
                    <label style={styles.label}>Dịch vụ <span style={{ color: 'red' }}>*</span></label>
                    <select
                      style={styles.select}
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      disabled={!selectedSpecialty}
                    >
                      <option value="">Chọn dịch vụ</option>
                      {getFilteredServices().map(serv => (
                        <option key={serv.id} value={serv.id}>
                          {serv.name} - {serv.price.toLocaleString('vi-VN')} đ
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label style={styles.label}>Ngày khám <span style={{ color: 'red' }}>*</span></label>
                    {!selectedService ? (
                      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Chọn thông tin trên để hiển thị ngày giờ khám</p>
                    ) : (
                      <div style={styles.dateSelector}>
                        {nextDays.map((d, i) => (
                          <div
                            key={i}
                            style={styles.dateBox(selectedDate === d.isoDate)}
                            onClick={() => setSelectedDate(d.isoDate)}
                          >
                            <div style={{ fontSize: '16px', marginBottom: '4px' }}>{d.label}</div>
                            <div style={{ fontSize: '14px', color: selectedDate === d.isoDate ? '#1d4ed8' : '#64748b' }}>{d.dayName}</div>
                          </div>
                        ))}
                        <div style={styles.dateBox(false)} onClick={() => setIsCalendarOpen(true)}>
                          <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                          </div>
                          <div style={{ fontSize: '14px', color: '#64748b' }}>Ngày khác</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Time */}
                  <div>
                    <label style={styles.label}>Giờ khám <span style={{ color: 'red' }}>*</span></label>
                    {!selectedDate ? (
                      <p style={{ color: '#64748b', fontSize: '14px' }}>Chọn thông tin trên để hiển thị ngày giờ khám</p>
                    ) : (
                      <>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#122B42' }}>Buổi sáng</div>
                          <div style={styles.timeGrid}>
                            {morningSlots.map(time => (
                              <div
                                key={time}
                                style={styles.timeSlot(selectedTime === time)}
                                onClick={() => setSelectedTime(time)}
                              >
                                {time}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#122B42' }}>Buổi chiều</div>
                          <div style={styles.timeGrid}>
                            {afternoonSlots.map(time => (
                              <div
                                key={time}
                                style={styles.timeSlot(selectedTime === time)}
                                onClick={() => setSelectedTime(time)}
                              >
                                {time}
                              </div>
                            ))}
                          </div>
                        </div>
                        <p style={{ color: '#f59e0b', fontSize: '13px', marginTop: '15px' }}>
                          Tất cả thời gian theo múi giờ Việt Nam GMT +7
                        </p>
                      </>
                    )}
                  </div>

                  <button
                    style={styles.submitBtn}
                    disabled={!isFormComplete || loading}
                    onClick={handleNextStep1}
                  >
                    {loading ? 'Đang xử lý...' : 'Tiếp tục'}
                  </button>
                </>
              )}

              {step === 2 && (
                <div style={styles.authCard}>
                  <h3 style={{ textAlign: 'center', color: '#122B42', marginBottom: '10px' }}>
                    {isGuestMode ? 'Thông tin đặt lịch' : (isLoginMode ? 'Đăng nhập để đặt lịch' : 'Tạo tài khoản mới')}
                  </h3>
                  <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                    {isGuestMode
                      ? 'Vui lòng nhập thông tin liên hệ của bạn'
                      : `Vui lòng ${isLoginMode ? 'đăng nhập' : 'đăng ký'} để hoàn tất thông tin đặt lịch của bạn.`}
                  </p>

                  {authError && <div style={{ color: 'red', fontSize: '13px', textAlign: 'center', marginBottom: '15px' }}>{authError}</div>}

                  {isGuestMode ? (
                    <form onSubmit={handleGuestSubmit}>
                      <div style={styles.inputGroup}>
                        <div style={styles.inputWrapper}>
                          <UserFullIcon size={18} color="#94a3b8" />
                          <input style={styles.input} type="text" placeholder="Họ và tên" value={guestName} onChange={e => setGuestName(e.target.value)} required />
                        </div>
                      </div>
                      <div style={styles.inputGroup}>
                        <div style={styles.inputWrapper}>
                          <Mail size={18} color="#94a3b8" />
                          <input style={styles.input} type="tel" placeholder="Số điện thoại" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} required />
                        </div>
                      </div>
                      <button type="submit" style={styles.submitBtn} disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
                      </button>
                      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
                        Đã có tài khoản?{' '}
                        <span style={{ color: '#122B42', fontWeight: '600', cursor: 'pointer' }} onClick={() => setIsGuestMode(false)}>
                          Đăng nhập
                        </span>
                      </div>
                    </form>
                  ) : (
                    <>
                      <form onSubmit={handleAuthSubmit}>
                        {!isLoginMode && (
                          <div style={styles.inputGroup}>
                            <div style={styles.inputWrapper}>
                              <UserFullIcon size={18} color="#94a3b8" />
                              <input style={styles.input} type="text" placeholder="Họ và tên" value={fullName} onChange={e => setFullName(e.target.value)} required />
                            </div>
                          </div>
                        )}

                        <div style={styles.inputGroup}>
                          <div style={styles.inputWrapper}>
                            <Mail size={18} color="#94a3b8" />
                            <input style={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                          </div>
                        </div>

                        <div style={styles.inputGroup}>
                          <div style={styles.inputWrapper}>
                            <Lock size={18} color="#94a3b8" />
                            <input style={styles.input} type={showPassword ? "text" : "password"} placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} required />
                            <div style={{ cursor: 'pointer', display: 'flex' }} onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                            </div>
                          </div>
                        </div>

                        {!isLoginMode && password.length > 0 && (
                          <ul style={{ fontSize: '12px', color: '#ef4444', marginTop: '8px', paddingLeft: '20px', marginBottom: '15px' }}>
                            <li style={{ color: password.length >= 8 ? '#059669' : '#ef4444' }}>Ít nhất 8 ký tự</li>
                            <li style={{ color: /.*[A-Z].*/.test(password) ? '#059669' : '#ef4444' }}>Chứa ít nhất 1 chữ hoa</li>
                            <li style={{ color: /.*[0-9].*/.test(password) ? '#059669' : '#ef4444' }}>Chứa ít nhất 1 chữ số</li>
                            <li style={{ color: /.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*/.test(password) ? '#059669' : '#ef4444' }}>Chứa ít nhất 1 ký tự đặc biệt</li>
                            <li style={{ color: /^[\x21-\x7E]+$/.test(password) ? '#059669' : '#ef4444' }}>Không chứa khoảng trắng, có dấu</li>
                          </ul>
                        )}

                        {!isLoginMode && (
                          <div style={styles.inputGroup}>
                            <div style={styles.inputWrapper}>
                              <Lock size={18} color="#94a3b8" />
                              <input style={styles.input} type={showConfirmPassword ? "text" : "password"} placeholder="Nhập lại mật khẩu" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                              <div style={{ cursor: 'pointer', display: 'flex' }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                              </div>
                            </div>
                          </div>
                        )}

                        <button type="submit" style={styles.submitBtn} disabled={loading}>
                          {loading ? 'Đang xử lý...' : (isLoginMode ? 'Đăng nhập & Tiếp tục' : 'Đăng ký & Tiếp tục')}
                        </button>
                      </form>

                      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div>
                          {isLoginMode ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                          <span style={{ color: '#122B42', fontWeight: '600', cursor: 'pointer' }} onClick={() => setIsLoginMode(!isLoginMode)}>
                            {isLoginMode ? 'Đăng ký ngay' : 'Đăng nhập'}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: '#122B42', fontWeight: '600', cursor: 'pointer' }} onClick={() => setIsGuestMode(true)}>
                            Hoặc đặt lịch không cần tài khoản
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
            )}

            {step === 3 && (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <CheckCircle2 size={80} color="#10b981" style={{ margin: '0 auto 20px' }} />
                <h2 style={{ color: '#122B42', marginBottom: '10px' }}>Đặt lịch thành công!</h2>
                <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '400px', margin: '0 auto 30px', lineHeight: '1.6' }}>
                  Cảm ơn bạn đã tin tưởng Nha Khoa Dentivo. Lịch khám của bạn đã được ghi nhận thành công.
                </p>
                <button
                  style={{ ...styles.submitBtn, width: 'auto', padding: '12px 30px' }}
                  onClick={() => navigate('/')}
                >
                  Trở về trang chủ
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
        )}

      {/* Calendar Modal */}
      {isCalendarOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsCalendarOpen(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '18px', fontWeight: '600', textAlign: 'center', marginBottom: '15px' }}>Chọn ngày khám</div>

            <div style={{ backgroundColor: '#eef2ff', color: '#3b82f6', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span>Nha Khoa Dentivo hỗ trợ đặt lịch khám bệnh trước từ 1 đến 30 ngày.</span>
            </div>

            <div style={styles.calendarGrid}>
              {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                <div key={day} style={{ fontWeight: '600', fontSize: '14px', marginBottom: '10px' }}>{day}</div>
              ))}

              <div style={styles.calendarDay(true)}>30</div>
              <div style={styles.calendarDay(true)}>31</div>
              {generateCalendarDays().map(day => (
                <div
                  key={day}
                  style={{ ...styles.calendarDay(false), backgroundColor: (selectedDate.endsWith(`-${String(day).padStart(2, '0')}`)) ? '#3b82f6' : 'transparent', color: (selectedDate.endsWith(`-${String(day).padStart(2, '0')}`)) ? 'white' : '#122B42' }}
                  onClick={() => {
                    const mockDateStr = `2026-07-${String(day).padStart(2, '0')}`;
                    setSelectedDate(mockDateStr);
                    setIsCalendarOpen(false);
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #3b82f6', backgroundColor: 'white' }}></div> Ngày hiện tại
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#eef2ff' }}></div> Ngày có lịch
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #3b82f6', backgroundColor: '#3b82f6' }}></div> Ngày đã chọn
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
}
