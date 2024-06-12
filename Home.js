import React, { useState, useEffect } from 'react';
import SideBar from './sidebar';
import MainComponent from './MainComponent';
import Heading from './heading';
import { SelectedTagsProvider } from './CreateContext';


function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <SelectedTagsProvider>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <Heading />
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row', // Responsive layout
            flex: 1, // Take remaining space
            overflow: 'auto', // Make this part scrollable if necessary
          }}
        >
          <SideBar />
          <MainComponent />
        </div>
      </div>
    </SelectedTagsProvider>
  );
}

export default Home;
