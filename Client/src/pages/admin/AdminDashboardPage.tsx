import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, Clock, DollarSign, Users, Activity, PieChart as PieChartIcon } from 'lucide-react';
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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
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

  const statCards = [
    {
      title: 'Tổng lịch hẹn hôm nay',
      value: stats.totalAppointmentsToday,
      icon: <Calendar className="w-8 h-8 text-blue-500" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Lịch chờ duyệt',
      value: stats.pendingAppointments,
      icon: <Clock className="w-8 h-8 text-amber-500" />,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      title: 'Lịch đã xác nhận',
      value: stats.confirmedAppointments,
      icon: <CheckCircle className="w-8 h-8 text-emerald-500" />,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Lịch hoàn thành hôm nay',
      value: stats.completedAppointmentsToday,
      icon: <Activity className="w-8 h-8 text-purple-500" />,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Doanh thu tháng này',
      value: formatCurrency(stats.revenueThisMonth),
      icon: <DollarSign className="w-8 h-8 text-green-500" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Tổng bệnh nhân',
      value: stats.totalPatients,
      icon: <Users className="w-8 h-8 text-indigo-500" />,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tổng quan Dashboard</h1>
          <p className="text-gray-500 mt-2">Theo dõi các chỉ số quan trọng của phòng khám</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex items-center space-x-4"
          >
            <div className={`p-4 rounded-xl ${card.bgColor}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <h3 className={`text-2xl font-bold mt-1 ${card.textColor}`}>{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Appointments Area Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold text-gray-900">Lịch hẹn theo thời gian</h2>
          </div>
          <div className="w-full" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.revenueChart}
                margin={{ top: 10, right: 30, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={true}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={true}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dx={-10}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [value, 'Lịch hẹn']}
                  labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
                />
                <Area 
                  isAnimationActive={true}
                  type="monotone" 
                  dataKey="appointments" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  fillOpacity={0.1} 
                  fill="#f97316" 
                  dot={{ stroke: '#f97316', strokeWidth: 2, fill: '#fff', r: 4 }}
                  activeDot={{ stroke: '#f97316', strokeWidth: 2, fill: '#f97316', r: 6 }}
                  animationBegin={300}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointments Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <PieChartIcon className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold text-gray-900">Phân bổ trạng thái</h2>
          </div>
          <div className="w-full flex justify-center items-center" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Chờ duyệt', value: stats.pendingAppointments },
                    { name: 'Đã xác nhận', value: stats.confirmedAppointments },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  isAnimationActive={true}
                  animationBegin={600}
                  animationDuration={1500}
                  animationEasing="ease-out"
                  stroke="#fff"
                  strokeWidth={2}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  <Cell fill="#f59e0b" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [value, 'Số lượng']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
