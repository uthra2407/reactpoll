import React, { useState, useEffect, useContext } from 'react';
import { SelectedTagsContext } from './CreateContext';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Button, Box } from '@mui/material';

function Filter() {
  const [tags, setTags] = useState([]);
  const { setSelectedTags } = useContext(SelectedTagsContext);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [temporarySelectedTags, setTemporarySelectedTags] = useState({});
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const filterStyle = {
    marginTop: '10px',
    backgroundColor: 'lightblue',
    width: isMobile ? '87%' : '150px', // Adjust width based on screen size
    padding: '10px',
    marginLeft: '10px',
  };

  const tagStyle = {
    marginBottom: '10px',
  };

  const buttonStyle = {
    marginTop: '10px',
    padding: '10px 10px',
    backgroundColor: 'white',
    color: 'black',
    border: '1px solid black',
    borderRadius: '5px',
    cursor: 'pointer',
    
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('http://localhost:8000/polls/polls/tags/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTags(data.Tags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  const fetchFilteredData = async (selectedTagKeys) => {
    try {
      setLoading(true);
      const queryParams = selectedTagKeys.map(tag => `tags=${encodeURIComponent(tag)}`).join('&');
      const response = await fetch(`http://localhost:8000/polls/polls/?${queryParams}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setFilteredData(data);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setTemporarySelectedTags(prevSelectedTags => ({
      ...prevSelectedTags,
      [name]: checked,
    }));
  };

  const handleButtonClick = () => {
    const selectedTagKeys = Object.keys(temporarySelectedTags).filter(tag => temporarySelectedTags[tag]);
    fetchFilteredData(selectedTagKeys);
    setSelectedTags(temporarySelectedTags); // Set the selected tags in context
  };

  return (
    <div style={filterStyle}>
      <div style={{ width: isMobile ? '100%' : '93%' }}>
        {tags.map((tag, index) => (
          <div key={index} style={tagStyle}>
            <label>
              <input
                type="checkbox"
                name={tag}
                onChange={handleCheckboxChange}
              />
              {tag}
            </label>
          </div>
        ))}
        <div>
          <div style={{ '& button': { margin: '8px 0' } }}>
            <Button variant="outlined" size='small' onClick={handleButtonClick} style={{ width: '100%' }}>
              Filter by tags
            </Button>
          </div>
        </div>
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : filteredData && filteredData.length > 0 ? (
          <table>
            {/* Table headers */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}

export default Filter;
