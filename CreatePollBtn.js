import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, useMediaQuery, useTheme } from '@mui/material';

function CreatePollBtn() {
  const navigate = useNavigate(); // Initialize useNavigate
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClick = () => {
    // Navigate to the create poll page
    navigate('/createpoll');
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: 'skyblue', // Change the background color here (e.g., green)
    color: 'white', // Change the text color here (e.g., white)
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '165px',
    marginTop: '110px',
    marginLeft: '10px',
  };

  return (
    <div style={{ width: "100%", marginTop: isMobile ? '110px' : '110px' }}>
      <Button variant="contained" sx={{ width: isMobile ? '93%' : '93%', marginTop: isMobile ? '30px' : '30px', marginLeft: isMobile ? '10px' : '10px' }} onClick={handleClick}>Create Poll</Button>
    </div>
  );
}

export default CreatePollBtn;
