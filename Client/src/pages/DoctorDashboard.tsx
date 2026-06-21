import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Calendar, Clock, Activity, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-light)' }}>
        <div style={{ width: 40, height: 40, border: '4px solid var(--primary-color)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  return (
    <>
      <Header token={localStorage.getItem('token')} onLogout={() => {
        localStorage.clear();
        navigate('/login');
      }} minimal />
      <div style={{ maxWidth: '1200px', margin: '100px auto 40px', padding: '0 20px', fontFamily: 'Inter, sans-serif' }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-gray)', fontSize: '14px', fontWeight: 500, cursor: 'pointer', marginBottom: '24px' }}
      >
        <ArrowLeft size={16} /> Back to Home
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', color: 'var(--text-dark)', marginBottom: '8px', fontWeight: 700 }}>Doctor Dashboard</h1>
          <p style={{ color: 'var(--text-gray)', fontSize: '16px' }}>Welcome back, Doctor. Here's your overview for today.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {[
          { label: 'Today\'s Patients', value: '12', icon: <Users size={24} color="var(--primary-color)" />, bg: 'var(--bg-light)' },
          { label: 'Appointments', value: '8', icon: <Calendar size={24} color="var(--primary-color)" />, bg: 'var(--bg-light)' },
          { label: 'Total Hours', value: '6h 30m', icon: <Clock size={24} color="var(--primary-color)" />, bg: 'var(--bg-light)' },
          { label: 'Rating', value: '4.9/5', icon: <Activity size={24} color="var(--primary-color)" />, bg: 'var(--bg-light)' },
        ].map((stat, i) => (
          <div key={i} style={{ backgroundColor: stat.bg, padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: '12px' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-gray)', fontSize: '14px', marginBottom: '4px', fontWeight: 500 }}>{stat.label}</p>
              <h3 style={{ color: 'var(--text-dark)', fontSize: '24px', fontWeight: 700 }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Upcoming Appointments */}
        <div style={{ backgroundColor: 'var(--bg-main)', padding: '32px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', color: 'var(--text-dark)', fontWeight: 600 }}>Upcoming Appointments</h2>
            <button style={{ color: 'var(--primary-color)', background: 'none', border: 'none', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>View All</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { time: '09:00 AM', patient: 'Sarah Jenkins', type: 'Teeth Whitening' },
              { time: '10:30 AM', patient: 'Michael Brown', type: 'Root Canal' },
              { time: '13:00 PM', patient: 'Emma Watson', type: 'Consultation' },
            ].map((apt, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ backgroundColor: 'var(--primary-color)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>
                    {apt.time.split(' ')[0]}
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--text-dark)', fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{apt.patient}</h4>
                    <p style={{ color: 'var(--text-gray)', fontSize: '14px' }}>{apt.type}</p>
                  </div>
                </div>
                <button style={{ backgroundColor: 'var(--bg-light)', color: 'var(--primary-color)', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
                  Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Profile / Schedule Settings */}
        <div style={{ backgroundColor: 'var(--bg-main)', padding: '32px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', color: 'var(--text-dark)', fontWeight: 600 }}>Quick Actions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             <button style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', padding: '20px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s ease' }}>
                <Edit size={24} color="var(--primary-color)" />
                <div>
                  <h4 style={{ color: 'var(--text-dark)', fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Edit Doctor Profile</h4>
                  <p style={{ color: 'var(--text-gray)', fontSize: '14px' }}>Update your specialty, description and experience</p>
                </div>
             </button>

             <button style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', padding: '20px', backgroundColor: 'var(--bg-light)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s ease' }}>
                <Calendar size={24} color="var(--primary-color)" />
                <div>
                  <h4 style={{ color: 'var(--text-dark)', fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Manage Schedule</h4>
                  <p style={{ color: 'var(--text-gray)', fontSize: '14px' }}>Set your working hours and availability</p>
                </div>
             </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
