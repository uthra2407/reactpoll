import React, { useState, useEffect } from 'react';
import CreatePollBtn from './CreatePollBtn';
import Filter from './filter';

function SideBar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const createPollBtnStyle = {
    position: 'fixed',
    top: '110px',
    left: '10px',
    padding: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '0px',
    width: isMobile ? '100%' : '180px',
  };

  const filterStyle = {
    position: 'fixed',
    top: '150px',
    left: '10px',
    padding: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '0px',
    width: isMobile ? '100%' : '180px',
  };

  return (
    <div>
      <div>
        <CreatePollBtn />
      </div>
      <div>
        <Filter />
      </div>
    </div>
  );
}

export default SideBar;
