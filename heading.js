import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


function Heading() {
  const [isFixed, setIsFixed] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.pageYOffset;
      if (offset > 0) {
        setIsFixed(false);
      } else {
        setIsFixed(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const headingStyle = {
    position: isFixed ? 'fixed' : 'absolute',
    top: isFixed ? '0' : '20px',
    left: '0',
    backgroundColor: 'lightgrey',
    color: 'black',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: isMobile ? '90%' : '75%', // Adjust width based on screen size
    zIndex: '1000',
    transition: 'top 0.3s ease-in-out',
  };

  return (
    <div style={headingStyle} className='heading'>
      <h1>Flyweight Polls</h1>
    </div>
  );
}

export default Heading;
