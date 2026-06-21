import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '../ScrollToTop';

interface LayoutProps {
  children: React.ReactNode;
  token: string | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function Layout({ children, token, onLoginClick, onLogout }: LayoutProps) {
  return (
    <>
      <Header token={token} onLoginClick={onLoginClick} onLogout={onLogout} />
      <main style={{ paddingTop: '82px' }}>
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
