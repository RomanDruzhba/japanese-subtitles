import React from 'react';
import Header from './Header';
import Footer from './Footer';

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <main className='flex-1, p-10 min-h-[86.1vh]'>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
