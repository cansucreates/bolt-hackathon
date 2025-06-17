import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BackgroundDecorations from '../common/BackgroundDecorations';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <BackgroundDecorations />
      <Header />
      <main className="flex-grow pt-16 sm:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;