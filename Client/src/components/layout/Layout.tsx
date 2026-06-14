import React from 'react';
import Header from './Header';
import Footer from './Footer';

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
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}
