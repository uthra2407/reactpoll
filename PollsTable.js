import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectedTagsContext } from './CreateContext';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CircularProgress from '@mui/material/CircularProgress';

const CustomDataGrid = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const { selectedTags } = useContext(SelectedTagsContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);  // Set loading state when starting fetch
        const queryParams = Object.keys(selectedTags)
          .filter(tag => selectedTags[tag])
          .map(tag => `tags=${encodeURIComponent(tag)}`)
          .join('&');

        const response = await fetch(`http://localhost:8000/polls/polls/?${queryParams}`);
        const json = await response.json();

        const data = json.data.map((row, index) => ({
          ...row,
          id: index + 1,
          question: row.Question,
          votes: Object.values(row.OptionVote).reduce((acc, curr) => acc + curr, 0),
          tags: row.Tags.join(', '),
        }));

        setTableData(data);
        console.log('Fetched polls:', data);
      } catch (error) {
        console.error('Error fetching polls:', error);
      } finally {
        setLoading(false);  // Unset loading state after fetch completes
      }
    };

    fetchData();
  }, [selectedTags]);

  const navigateToPollDetail = (questionId) => {
    setLoading(true);
    navigate(`/polldetail?id=${questionId}`);
  };

  const containerStyle = {
    width: isMobile ? '89%' : '90%',
    minHeight: `${Math.max(tableData.length * 45 + 20, 200)}px`,
    margin: '0 auto',
    padding: '10px',
    marginLeft: isMobile ? '5px' : '30px',
    marginTop: '0px',
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: isMobile ? 20 : 60 },
    {
      field: 'question',
      headerName: 'Poll Question',
      width: isMobile ? 100 : 400,
      renderCell: (params) => (
        <div style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'left',
          textAlign: 'left',
          height: '100%',
          lineHeight: '1.2',
        }}>
          {params.value}
        </div>
      ),
    },
    { field: 'votes', headerName: 'Total Votes', width: isMobile ? 20 : 90, align: 'center' },
    {
      field: 'tags',
      headerName: 'Tags',
      width: isMobile ? 100 : 200,
      renderCell: (params) => (
        <div style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'left',
          textAlign: 'left',
          height: '100%',
          lineHeight: '1.2',
        }}>
          {params.value}
        </div>
      ),
    },
  ];

  const getRowHeight = () => {
    return isMobile? 100: 50; // Set a fixed row height that is large enough to display wrapped text
  };

  return (
    <div style={{ display: 'fixed', justifyContent: 'center', alignItems: 'center', height: '100vh', marginTop: isMobile ? '10px' : '130px' }}>
    
      <div style={containerStyle}>
        <MuiDataGrid
          onRowClick={(params) => navigateToPollDetail(params.row.id)}
          rows={tableData}
          columns={columns}
          pageSize={12}
          rowsPerPageOptions={[10]}
          getRowId={(row) => row.id}
          rowHeight={getRowHeight()}  // Use the fixed row height
        />
      </div>
    </div>
  );
};

export default CustomDataGrid;
