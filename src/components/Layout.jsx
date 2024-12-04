// Layout.js
import React from 'react';
import BackgroundAnimation from './BackgroundAnimation';

const Layout = ({ children }) => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <BackgroundAnimation />
      {children}
    </div>
  );
};

export default Layout;
