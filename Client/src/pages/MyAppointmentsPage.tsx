import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Calendar,
  Clock,
  MapPin,
  UserRound,
  Activity,
  AlertCircle,
  XCircle,
  CheckCircle2,
  CalendarDays,
  ChevronRight,
  ChevronLeft,
  Stethoscope,
  ClipboardList,
  ListFilter,
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';

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
  patientName: string;
  patientAvatar: string;
  doctorName?: string;
  clinicId: string;
  clinicName: string;
}

type FilterType = 'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

// Small signature icon — a simplified tooth outline used as the recurring
// visual motif for the page (record tabs, empty state, hero watermark).
function ToothMark({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 3c-1.9 0-2.9 1-4 1-1.7 0-3 1.4-3 3.4 0 2 .6 4 1.1 6C6.6 15.6 7 18 8.4 20c.6.9 1.2 1.4 1.8 1.4.9 0 1-1.1 1.2-2.4.2-1.4.4-3 1-3.4h.2c.6.4.8 2 1 3.4.2 1.3.3 2.4 1.2 2.4.6 0 1.2-.5 1.8-1.4 1.4-2 1.8-4.4 2.3-6.6.5-2 1.1-4 1.1-6C20 5.4 18.7 4 17 4c-1.1 0-2.1-1-4-1-.4 0-.7 0-1 .1-.3-.1-.6-.1-1 0-.3-.1-.7-.1-1-.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Subtle repeating tooth-outline watermark for the hero panel.
function HeroPattern() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.07]"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 400 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="tooth-grid" width="56" height="56" patternUnits="userSpaceOnUse">
          <path
            d="M28 12c-3 0-4.6 1.8-7 1.8-3 0-5.2 2.4-5.2 6 0 3.4 1 6.8 1.9 10.4 1 3.7 1.6 7.5 3.9 10.9 1 1.5 2 2.4 3.1 2.4 1.6 0 1.7-1.9 2.1-4.2.3-2.4.7-5.1 1.6-5.8h.4c.9.7 1.3 3.4 1.6 5.8.4 2.3.5 4.2 2.1 4.2 1.1 0 2.1-.9 3.1-2.4 2.3-3.4 2.9-7.2 3.9-10.9.9-3.6 1.9-7 1.9-10.4 0-3.6-2.2-6-5.2-6-1.9 0-3.6-1.8-7-1.8"
            stroke="white"
            strokeWidth="1.4"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="400" height="200" fill="url(#tooth-grid)" />
    </svg>
  );
}

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(
          'http://localhost:8080/api/appointments/my-appointments',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAppointments(response.data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Không thể tải lịch hẹn. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('avatarUrl');
    navigate('/login');
  };

  const handleCancelAppointment = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) return;

    const reason = window.prompt('Vui lòng nhập lý do hủy lịch hẹn (không bắt buộc):');

    try {
      const token = localStorage.getItem('token');

      await axios.put(
        `http://localhost:8080/api/appointments/my-appointments/${id}/cancel`,
        null,
        {
          params: { reason },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === id
            ? {
              ...apt,
              status: 'CANCELLED',
              cancelReason: reason || 'Hủy bởi bệnh nhân',
            }
            : apt
        )
      );
    } catch (err: any) {
      console.error('Error cancelling appointment:', err);
      alert(err.response?.data?.message || 'Không thể hủy lịch hẹn. Vui lòng thử lại sau.');
    }
  };

  // Each status maps to a tab color (record-folder tab), a badge style,
  // and an icon — kept in one place so the card list and the filter
  // pills always agree with each other.
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Chờ duyệt',
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          tab: 'bg-amber-400',
          dot: 'bg-amber-400',
        };

      case 'ASSIGNED':
      case 'CONFIRMED':
        return {
          label: 'Đã xác nhận',
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          tab: 'bg-blue-400',
          dot: 'bg-blue-400',
        };

      case 'COMPLETED':
        return {
          label: 'Đã hoàn thành',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          tab: 'bg-emerald-400',
          dot: 'bg-emerald-400',
        };

      case 'CANCELLED':
        return {
          label: 'Đã hủy',
          badge: 'bg-red-50 text-red-600 border-red-200',
          tab: 'bg-red-400',
          dot: 'bg-red-400',
        };

      default:
        return {
          label: status,
          badge: 'bg-gray-50 text-gray-600 border-gray-200',
          tab: 'bg-gray-300',
          dot: 'bg-gray-300',
        };
    }
  };

  const stats = useMemo(() => {
    const safeAppointments = Array.isArray(appointments) ? appointments : [];
    return {
      total: safeAppointments.length,
      pending: safeAppointments.filter((item) => item.status === 'PENDING').length,
      confirmed: safeAppointments.filter((item) =>
        ['ASSIGNED', 'CONFIRMED'].includes(item.status)
      ).length,
      completed: safeAppointments.filter((item) => item.status === 'COMPLETED').length,
    };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const safeAppointments = Array.isArray(appointments) ? appointments : [];
    if (activeFilter === 'ALL') return safeAppointments;

    if (activeFilter === 'CONFIRMED') {
      return safeAppointments.filter((item) =>
        ['ASSIGNED', 'CONFIRMED'].includes(item.status)
      );
    }

    return safeAppointments.filter((item) => item.status === activeFilter);
  }, [appointments, activeFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const currentAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const role = localStorage.getItem('role');

  if (role === 'ADMIN' || role === 'DOCTOR' || role === 'ROLE_DOCTOR') {
    return (
      <div className="min-h-screen flex flex-col bg-[#f6f8f7]">
        <Header token={localStorage.getItem('token')} onLogout={handleLogout} />
        
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] p-8 md:p-12 max-w-md w-full text-center shadow-lg shadow-gray-100/50 border border-gray-100">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-red-50/50">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">Truy cập bị từ chối</h2>
            <p className="text-gray-500 mb-8 leading-relaxed text-[15px]">
              Bạn không có quyền truy cập trang này. Tính năng <strong className="text-gray-700">Lịch hẹn của tôi</strong> chỉ dành riêng cho tài khoản Khách hàng.
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full inline-flex items-center justify-center gap-2 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all active:scale-[0.98] shadow-md"
            >
              Về trang chủ
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8f7]">
      <Header token={localStorage.getItem('token')} onLogout={handleLogout} />

      <main className="flex-grow pt-10 pb-14 px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
        <div className="w-full max-w-6xl">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-primary via-primary to-[#173f37] px-6 py-6 md:px-8 md:py-8 text-white shadow-lg shadow-primary/10">
            <HeroPattern />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/75 ring-1 ring-white/10">
                  <ClipboardList className="w-3.5 h-3.5" />
                  Hồ sơ lịch khám
                </div>

                <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">
                  Lịch hẹn của tôi
                </h1>

                <p className="mt-2 text-white/70 max-w-xl text-[14px] leading-relaxed">
                  Theo dõi trạng thái, thông tin bác sĩ và toàn bộ lịch khám nha khoa
                  của bạn tại một nơi.
                </p>
              </div>

              <button
                onClick={() => navigate('/booking')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-bold text-primary hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm shrink-0"
              >
                <Calendar className="w-5 h-5" />
                Đặt lịch mới
              </button>
            </div>
          </section>

          {/* Statistics */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <StatCard
              icon={<CalendarDays className="w-5 h-5" />}
              accent="text-primary bg-primary/10"
              value={stats.total}
              label="Tổng lịch hẹn"
              barClass="bg-primary/70"
              isActive={activeFilter === 'ALL'}
              onClick={() => setActiveFilter('ALL')}
            />
            <StatCard
              icon={<Clock className="w-5 h-5" />}
              accent="text-amber-500 bg-amber-50"
              value={stats.pending}
              label="Chờ duyệt"
              barClass="bg-amber-400"
              isActive={activeFilter === 'PENDING'}
              onClick={() => setActiveFilter('PENDING')}
            />
            <StatCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              accent="text-blue-500 bg-blue-50"
              value={stats.confirmed}
              label="Đã xác nhận"
              barClass="bg-blue-400"
              isActive={activeFilter === 'CONFIRMED'}
              onClick={() => setActiveFilter('CONFIRMED')}
            />
            <StatCard
              icon={<Activity className="w-5 h-5" />}
              accent="text-emerald-500 bg-emerald-50"
              value={stats.completed}
              label="Đã hoàn thành"
              barClass="bg-emerald-400"
              isActive={activeFilter === 'COMPLETED'}
              onClick={() => setActiveFilter('COMPLETED')}
            />
          </section>

          {/* Content */}
          <section className="mt-7 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-6 md:px-8 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Danh sách lịch hẹn</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Có <span className="font-semibold text-gray-700">{filteredAppointments.length}</span> lịch hẹn đang hiển thị
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col justify-center items-center gap-3 py-24">
                <div className="animate-spin rounded-full h-11 w-11 border-2 border-gray-200 border-t-primary" />
                <p className="text-sm text-gray-400">Đang tải lịch hẹn của bạn…</p>
              </div>
            ) : error ? (
              <div className="m-6 bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-20 px-5">
                <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-primary/5 text-primary/30 flex items-center justify-center">
                  <ToothMark className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  Chưa có lịch hẹn phù hợp
                </h3>

                <p className="text-gray-500 mt-2">
                  Bạn chưa có lịch hẹn trong trạng thái này.
                </p>

                <button
                  onClick={() => navigate('/booking')}
                  className="mt-6 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl font-medium transition-colors"
                >
                  Đặt lịch khám ngay
                </button>
              </div>
            ) : (
              <div className="p-5 md:p-7 flex flex-col gap-5">
                {currentAppointments.map((apt) => {
                  const status = getStatusConfig(apt.status);
                  const canCancel = ['PENDING', 'ASSIGNED', 'CONFIRMED'].includes(apt.status);

                  return (
                    <article
                      key={apt.id}
                      className="group flex rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                    >
                      {/* Record-folder tab — colored per status, the page's signature detail */}
                      <div className={`w-1.5 shrink-0 ${status.tab}`} />

                      <div className="flex-1 min-w-0">
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Stethoscope className="w-7 h-7" />
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-xl font-bold text-gray-900">
                                  Dịch vụ nha khoa
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                  Mã lịch hẹn:{' '}
                                  <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
                                    {apt.id ? apt.id.split('-')[0].toUpperCase() : 'N/A'}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <span
                              className={`inline-flex items-center gap-1.5 justify-center rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap ${status.badge}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                              {status.label}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/60 rounded-2xl p-4 border border-gray-100">
                            <InfoItem
                              icon={<Calendar className="w-5 h-5" />}
                              label="Ngày hẹn"
                              value={apt.date}
                            />
                            <InfoItem
                              icon={<Clock className="w-5 h-5" />}
                              label="Thời gian"
                              value={apt.time}
                            />
                            <InfoItem
                              icon={<MapPin className="w-5 h-5" />}
                              label="Phòng khám"
                              value={apt.clinicName || 'Đang cập nhật'}
                            />
                            <InfoItem
                              icon={<UserRound className="w-5 h-5" />}
                              label="Bác sĩ phụ trách"
                              value={
                                apt.doctorId !== 'UNASSIGNED'
                                  ? apt.doctorName || 'Đã được phân công'
                                  : 'Đang chờ phân công'
                              }
                            />
                          </div>

                          {apt.notes && (
                            <div className="mt-4 rounded-xl bg-gray-50 p-4 border border-gray-100">
                              <p className="text-sm font-semibold text-gray-700 mb-1">
                                Ghi chú của bạn
                              </p>
                              <p className="text-sm text-gray-600">{apt.notes}</p>
                            </div>
                          )}

                          {apt.cancelReason && apt.status === 'CANCELLED' && (
                            <div className="mt-4 rounded-xl bg-red-50 p-4 border border-red-100">
                              <p className="text-sm font-semibold text-red-700 mb-1">
                                Lý do hủy lịch
                              </p>
                              <p className="text-sm text-red-600">{apt.cancelReason}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-gray-50/70 border-t border-dashed border-gray-200 gap-4">
                          <span className="text-sm font-medium text-gray-500">
                            Đã đặt lúc:{' '}
                            <span className="text-gray-900">
                              {apt.createdAt ? new Date(apt.createdAt).toLocaleDateString('vi-VN') : 'Không rõ'}
                            </span>
                          </span>

                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            {canCancel && (
                              <button
                                onClick={() => handleCancelAppointment(apt.id)}
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-base font-semibold text-white bg-red-500 hover:bg-red-600 shadow-sm transition-all duration-200"
                              >
                                <XCircle className="w-5 h-5" />
                                Hủy lịch hẹn
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-6 pt-6 border-t border-gray-100">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Trang trước
                    </button>

                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-12 h-12 flex items-center justify-center rounded-2xl text-base font-bold transition-all shadow-sm ${currentPage === i + 1
                              ? 'bg-primary text-white scale-105'
                              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      Trang sau
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function StatCard({
  icon,
  accent,
  value,
  label,
  barClass,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  accent: string;
  value: number;
  label: string;
  barClass: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative bg-white border rounded-2xl p-5 shadow-sm overflow-hidden text-left transition-all ${
        isActive
          ? 'border-primary ring-1 ring-primary scale-[1.02] shadow-md'
          : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
      }`}
    >
      <span className={`absolute top-0 left-0 h-1 w-full ${barClass}`} />
      <div className="flex items-center justify-between">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent}`}>
          {icon}
        </div>
        <span className="text-2xl font-bold text-gray-900 tabular-nums">{value}</span>
      </div>
      <p className={`text-sm text-gray-500 mt-4 font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-500'}`}>{label}</p>
    </button>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-primary bg-primary/10 p-2.5 rounded-lg shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="font-bold text-gray-900 text-sm truncate">{value}</p>
      </div>
    </div>
  );
}
