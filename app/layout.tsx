'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLoginStatus();
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleRegister = () => {
    window.location.href = '/register';
  };

  return (
    <div>
      <header>
        <button onClick={handleGoHome}>Home</button>
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegister}>Register</button>
          </>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
