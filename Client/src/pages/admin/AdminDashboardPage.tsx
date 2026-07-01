import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, Clock, DollarSign, Users, Activity, PieChart as PieChartIcon, ChevronDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface ChartData {
  date: string;
  revenue: number;
  appointments: number;
}

interface DashboardStats {
  totalAppointmentsToday: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointmentsToday: number;
  revenueThisMonth: number;
  totalPatients: number;
  revenueChart: ChartData[];
}

interface AdminDoctor {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  specialty: string;
  avatarUrl: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [doctors, setDoctors] = useState<AdminDoctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [statsResponse, doctorsResponse] = await Promise.all([
          axios.get('http://localhost:8080/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8080/api/admin/doctors', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setStats(statsResponse.data);
        setDoctors(doctorsResponse.data.slice(0, 5)); // Show top 5 doctors
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) {
    return <div className="p-8 text-center text-gray-500">Failed to load dashboard statistics.</div>;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const statCards = [
    {
      title: 'Tổng lịch hẹn',
      value: stats.totalAppointmentsToday,
      icon: <Calendar className="w-7 h-7 text-white" />,
      iconBg: 'bg-[#e07a46]',
      textColor: 'text-gray-900',
    },
    {
      title: 'Lịch chờ duyệt',
      value: stats.pendingAppointments,
      icon: <Clock className="w-7 h-7 text-white" />,
      iconBg: 'bg-[#eab341]',
      textColor: 'text-gray-900',
    },
    {
      title: 'Lịch đã xác nhận',
      value: stats.confirmedAppointments,
      icon: <CheckCircle className="w-7 h-7 text-white" />,
      iconBg: 'bg-[#5bba81]',
      textColor: 'text-gray-900',
    },
    {
      title: 'Hoàn thành hôm nay',
      value: stats.completedAppointmentsToday,
      icon: <Activity className="w-7 h-7 text-white" />,
      iconBg: 'bg-[#5684e2]',
      textColor: 'text-gray-900',
    },
    {
      title: 'Doanh thu tháng này',
      value: formatCurrency(stats.revenueThisMonth),
      icon: <DollarSign className="w-7 h-7 text-white" />,
      iconBg: 'bg-[#8b5cf6]',
      textColor: 'text-gray-900',
    },
    {
      title: 'Tổng bệnh nhân',
      value: stats.totalPatients,
      icon: <Users className="w-7 h-7 text-white" />,
      iconBg: 'bg-[#ec4899]',
      textColor: 'text-gray-900',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in bg-gray-50/50 min-h-screen flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tổng quan Dashboard</h1>
          <p className="text-gray-500 mt-2 font-medium">Theo dõi các chỉ số quan trọng của phòng khám</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 rounded-2xl ${card.iconBg} flex items-center justify-center shadow-sm`}>
                {card.icon}
              </div>
              <p className="text-[15px] font-medium text-gray-500">{card.title}</p>
            </div>
            <h3 className={`text-2xl font-bold tracking-tight ${card.textColor}`}>{card.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Area Chart */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Activity className="w-6 h-6 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Lịch hẹn theo thời gian</h2>
          </div>
          <div className="w-full" style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.revenueChart}
                margin={{ top: 10, right: 20, left: -10, bottom: 30 }}
              >
                <defs>
                  <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                  dy={8}
                  interval="preserveStartEnd"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 13, fontWeight: 500 }}
                  dx={-15}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [<span className="font-bold text-orange-600">{value}</span>, 'Lịch hẹn']}
                  labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}
                />
                <Area
                  isAnimationActive={true}
                  type="monotone"
                  dataKey="appointments"
                  stroke="#f97316"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAppointments)"
                  dot={{ stroke: '#f97316', strokeWidth: 3, fill: '#fff', r: 5 }}
                  activeDot={{ stroke: '#f97316', strokeWidth: 0, fill: '#f97316', r: 8, className: "animate-pulse" }}
                  animationBegin={300}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointments Pie Chart */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <PieChartIcon className="w-6 h-6 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Phân bổ trạng thái</h2>
          </div>
          <div className="w-full flex justify-center items-center" style={{ height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Chờ duyệt', value: stats.pendingAppointments },
                    { name: 'Đã xác nhận', value: stats.confirmedAppointments },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  isAnimationActive={true}
                  animationBegin={600}
                  animationDuration={1500}
                  animationEasing="ease-out"
                  stroke="none"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  <Cell fill="#f59e0b" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [<span className="font-bold">{value}</span>, 'Số lượng']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Staff Member Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Staff Member</h2>
          <div className="relative">
            <button className="flex items-center space-x-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20">
              <span className="font-medium text-sm">Month</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 px-4 font-semibold text-gray-500 text-sm whitespace-nowrap">No.</th>
                <th className="py-4 px-4 font-semibold text-gray-500 text-sm whitespace-nowrap">Names</th>
                <th className="py-4 px-4 font-semibold text-gray-500 text-sm whitespace-nowrap">Email</th>
                <th className="py-4 px-4 font-semibold text-gray-500 text-sm whitespace-nowrap">Join Date</th>
                <th className="py-4 px-4 font-semibold text-gray-500 text-sm whitespace-nowrap">Designation</th>
                <th className="py-4 px-4 font-semibold text-gray-500 text-sm whitespace-nowrap">Working Days</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor, index) => (
                <tr key={doctor.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="py-5 px-4 text-gray-500 text-sm font-medium">{index + 1}</td>
                  <td className="py-5 px-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary/20 transition-colors">
                        <img
                          src={doctor.avatarUrl || 'https://via.placeholder.com/40'}
                          alt={doctor.fullName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(doctor.fullName) + '&background=random';
                          }}
                        />
                      </div>
                      <span className="font-bold text-gray-900">{doctor.fullName}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-gray-500 text-sm">{doctor.email}</td>
                  <td className="py-5 px-4 text-gray-500 text-sm">{formatDate(doctor.createdAt)}</td>
                  <td className="py-5 px-4 text-gray-500 text-sm">{doctor.specialty || 'General Dentist'}</td>
                  <td className="py-5 px-4 text-gray-500 text-sm">24 Days Work Out Of 30</td>
                </tr>
              ))}
              {doctors.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No staff members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
