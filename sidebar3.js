import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

function Sidebar3() {
    const navigate = useNavigate();
    const location = useLocation();
    const { poll } = location.state || { poll: null };
    const [selectedOption, setSelectedOption] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
    const [networkSlow, setNetworkSlow] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const updateIsMobile = () => setIsMobile(window.innerWidth < 600);
        window.addEventListener('resize', updateIsMobile);
        return () => window.removeEventListener('resize', updateIsMobile);
    }, []);

    const checkNetworkSpeed = () => {
        return new Promise((resolve) => {
            const startTime = new Date().getTime();
            fetch('https://www.google.com/images/phd/px.gif')
                .then(() => {
                    const endTime = new Date().getTime();
                    const duration = endTime - startTime;
                    const speed = 200 / duration; // 200 bytes / duration in ms
                    setNetworkSlow(speed < 0.5);
                    resolve(speed < 0.5);
                })
                .catch(() => {
                    setNetworkSlow(true);
                    resolve(true);
                });
        });
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleVoteSubmit = async (event) => {
        event.preventDefault();
        if (selectedOption && poll && poll.QuestionID) {
            setIsCreating(true);  // Immediately disable the button

            const isSlow = await checkNetworkSpeed();  // Check network speed concurrently
            setIsCreating(isSlow);  // Update the state based on network speed check

            try {
                const response = await fetch(`http://localhost:8000/polls/polls/${poll.QuestionID}/update-vote/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ incrementOption: selectedOption }),
                });

                if (response.ok) {
                    const updatedPoll = await response.json();
                    console.log('Vote submitted successfully:', updatedPoll);
                    navigate('/');
                } else {
                    console.error('Failed to submit vote:', response.statusText);
                    alert('Failed to submit vote. Please try again.');
                }
            } catch (error) {
                console.error('Error submitting vote:', error);
                alert('An error occurred while submitting your vote. Please try again.');
            } finally {
                setIsCreating(false);
            }
        } else {
            alert('Please select an option and ensure poll data is available before submitting your vote.');
        }
    };

    const sidebarStyle = {
        width: isMobile ? '90%' : '50%',
        maxWidth: '500px',
        margin: isMobile ? '10px' : '20px auto',
        padding: isMobile ? '10px' : '20px',
        backgroundColor: '#fff',
        marginTop: isMobile ? '110px' : '120px',
        marginLeft: isMobile ? '10px' : '0px',
    };

    const buttonStyle = {
        width: isMobile ? '95%' : '20%',
        marginTop: '20px',
    };

    const optionStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
    };

    return (
        <div style={sidebarStyle}>
            {poll ? (
                <div>
                    <h2 className='h2'>{poll.Question}</h2>
                    <ul className="poll-options" style={{ listStyleType: 'none', padding: 0 }}>
                        {poll.OptionVote && Object.entries(poll.OptionVote).map(([option]) => (
                            <li key={option} className="option-item" style={optionStyle}>
                                <input
                                    type="radio"
                                    id={option}
                                    name="option"
                                    value={option}
                                    checked={selectedOption === option}
                                    onChange={handleOptionChange}
                                    style={{ marginRight: '10px' }}
                                />
                                <label htmlFor={option}>{option}</label>
                            </li>
                        ))}
                    </ul>
                    <Button className='button' variant="contained" onClick={handleVoteSubmit} style={buttonStyle} disabled={isCreating}>
                        {isCreating ? 'Updating Poll...' : 'Vote'}
                    </Button>
                </div>
            ) : (
                <p>No poll data available</p>
            )}
        </div>
    );
}

export default Sidebar3;
