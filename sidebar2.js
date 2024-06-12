import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
//import './sidebar2.css';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CircularProgress from '@mui/material/CircularProgress';

function Sidebar2() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [poll, setPoll] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchPollDetails = async () => {
            const pollId = searchParams.get('id');
            if (!pollId) {
                setError('No poll ID specified');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:8000/polls/polls/${pollId}/details/`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const json = await response.json();
                console.log('Fetched poll details:', json.data); // Log the fetched poll data
                setPoll(json.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            } 
        };

        fetchPollDetails();
    }, [searchParams]);

    const handleVoteClick = () => {
        if (poll) {
            navigate(`/vote?id=${poll.QuestionID}`, { state: { poll } });
        }
    };

    const columns = [
        { field: "op", headerName: "Option", width: isMobile ? '120' : '200' ,
            renderCell: (params) => (
            <div style={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              display: 'flex', // Use flexbox for alignment
              alignItems: 'center', // Center vertically
              justifyContent: 'left', // Center horizontally
              textAlign: 'left', 
              height: '100%', // Ensure div takes full cell height
              lineHeight: '1.2',
            }}>
              {params.value}
              </div>
        ),
    },
        { field: "vote", headerName: "Votes", width: isMobile ? '120' : '100' }
    ];
    if (loading) {
        return (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}>
            <CircularProgress />
          </div>
        );
      }

    const rows = poll ? Object.entries(poll.OptionVote).map(([option, votes], index) => ({
        id: index, 
        op: option,
        vote: votes
    })) : [];

    const sidebarStyle = {
        width: isMobile ? '90%' : '500px', // Adjust sidebar width based on screen size
        marginLeft: isMobile ? '10px' : '10px',
        marginTop: isMobile ? '40px':'130px',
        height:'560px'
    };

    const buttonStyle = {
        width: isMobile ? '100%' : 'auto', // Adjust button width based on screen size
        left: '0',
        marginTop: isMobile ? '10px' : '5px',
    };

    const tableStyle = {
        width: isMobile ? '100%' : '370px', // Adjust table width based on screen size
        marginTop: isMobile ? '20px' : '20px',
    };
    const tag ={
        marginTop:'30px',
        marginBottom: isMobile?'30px':'50px',
    }

    return (
        <aside className='sidebar' style={sidebarStyle}>
            {poll ? (
                <div>
                    <h1 className='h1'>{poll.Question}</h1>
                    <div>
                        <Button variant="contained" size='small' className='button' onClick={handleVoteClick} style={buttonStyle}>Vote on this Poll</Button>
                    </div>
                    <div className='table'>
                        <DataGrid rows={rows} columns={columns} style={tableStyle} />
                    </div>
                    <div style={tag}>
                        <strong>Tags:</strong> {poll.Tags.join(', ')}
                    </div>
                </div>
            ) : (
                <p>No poll details available.</p>
            )}
        </aside>
    );
}

export default Sidebar2;
