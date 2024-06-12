import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Snackbar, Alert } from '@mui/material';
import Heading from './heading';
import TextField from '@mui/material/TextField';

function CreatePoll() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [tags, setTags] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [errors, setErrors] = useState({ question: '', options: '', tags: '' });
  const [isTyping, setIsTyping] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [networkSlow, setNetworkSlow] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < 600);
    };
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
          if (speed < 0.5) {
            setNetworkSlow(true);
            resolve(true);
          } else {
            setNetworkSlow(false);
            resolve(false);
          }
        })
        .catch(() => {
          setNetworkSlow(true);
          resolve(true);
        });
    });
  };

  const handleCreatePoll = async (event) => {
    event.preventDefault();
    setIsCreating(true); // Immediately disable the button

    if (!navigator.onLine) {
      setOffline(true);
      setIsCreating(false); // Ensure isCreating is set to false to reset the button state
      return; // Return early to prevent form submission
    }

    const formIsValid = validateForm();

    if (formIsValid) {
      const isSlow = await checkNetworkSpeed();
      setIsCreating(isSlow); // Show "Creating Poll..." if network is slow

      console.log("Creating poll...");

      const requestBody = {
        "Question": question,
        "OptionVote": options.filter(option => option.trim()),
        "Tags": tags.split(",").map(tag => tag.trim())
      };

      console.log("Request Body:", requestBody);

      fetch('http://localhost:8000/polls/polls/createpoll/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
      .then(response => {
        console.log("Server Response:", response);
        if (!response.ok) {
          throw new Error('Failed to create poll');
        }
        return response.json();
      })
      .then(data => {
        console.log('Poll created successfully:', data);
        setIsCreating(false); // Reset button state after creation
        navigate('/');
      })
      .catch(error => {
        console.error('Error creating poll:', error);
        setIsCreating(false); // Reset button state on error
      });
    } else {
      setIsCreating(false); // Reset button state if form is not valid
      console.log('Form is not valid');
    }
  };

  const validateForm = () => {
    const newErrors = { question: '', options: '', tags: '' };

    if (!question.trim()) {
      newErrors.question = '(Question is required)';
    }

    if (options.some(option => !option.trim())) {
      newErrors.options = '(At least 2 options are required)';
    }

    if (!tags.trim()) {
      newErrors.tags = '(Tags are required)';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleCloseSnackbar = () => {
    setOffline(false);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleDeleteOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  const formContainerStyle = {
    padding: isMobile ? '10px' : '10px',
    maxWidth: isMobile ? '90%' : '500px',
    margin: 'auto',
    marginTop: '150px',
    backgroundColor: 'lightblue',
    marginLeft: isMobile ? '10px' : '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    boxSizing: 'border-box'

  };

  const inputStyle = {
    width: '80%',
    padding: isMobile ? '2px' : '1px',
    marginBottom: '10px',
    fontSize: isMobile ? '5px' : '5px',
  };

  const buttonStyle = {
    width: isMobile ? '95%' : '130px',
    padding: isMobile ? '10px' : '10px',
    fontSize: isMobile ? '14px' : '13px',
    marginTop: '10px',
    marginLeft: isMobile ? '10px' : '20px',
    marginBottom: '20px'
  };

  return (
    <div>
      <Heading />
      <form className='form' onSubmit={handleCreatePoll}>
        <div className="form-container" style={formContainerStyle}>
          <h4 className='h4' style={{ marginBottom: '10px' }}>Question</h4>
          <TextField
            fullWidth
            value={question}
            placeholder='Type your question here'
            onChange={(e) => {
              if (!offline) {
                setQuestion(e.target.value);
                setIsTyping(true);
              }
            }}
            variant="outlined"
            style={inputStyle}
            inputProps={{
              style: {
                fontSize: '12px',
                padding: '10px',
              }
            }}
            InputLabelProps={{ style: { fontSize: '14px' } }}
            error={!!errors.question}
            helperText={errors.question}
            FormHelperTextProps={{ style: { color: isTyping ? 'blue' : 'red' } }}
          />

          <h4 style={{ marginBottom: '5px' }}>Answer Options</h4>
          {options.map((option, index) => (
            <div key={index} style={{ alignItems: 'center', marginBottom: '5px', width: '100%' }}>
              <TextField
                fullWidth
                value={option}
                placeholder={`Option ${index + 1}`}
                onChange={(e) => {
                  const updatedOptions = [...options]; // Create a copy of the options array
                  updatedOptions[index] = e.target.value; // Update the value at the specified index
                  setOptions(updatedOptions); // Update the state with the new array
                  setIsTyping(true);
                }}
                style={inputStyle}
                inputProps={{
                  style: {
                    fontSize: '12px',
                    padding: '10px',
                  }
                }}
                InputLabelProps={{ style: { fontSize: '14px' } }}
                error={!!errors.options}
                helperText={index === options.length - 1 && errors.options}
                FormHelperTextProps={{ style: { color: isTyping ? 'blue' : 'red' } }}
              />

              {options.length > 2 && <Button size='small' variant="outlined" color="error" style={{ marginLeft: '10px', marginTop: '4px' }} onClick={() => handleDeleteOption(index)}>Delete</Button>}
            </div>
          ))}

          <Box sx={{ '& button': { m: 1 } }} style={{ marginLeft: '0px', width: '100%' }}>
            {options.length < 5 && <Button variant='outlined' size='small' sx={{ marginLeft: '0' }} onClick={handleAddOption}>Add Option</Button>}
          </Box>
          <h4 style={{ marginBottom: '5px' }}>Comma Separated Tags</h4>
          <TextField
            fullWidth
            value={tags}
            onChange={(e) => { setTags(e.target.value); setIsTyping(true); }}
            placeholder="Tag1,Tag2,Tag3"
            variant="outlined"
            style={inputStyle}
            inputProps={{
              style: {
                fontSize: '12px',
                padding: '10px',
              }
            }}
            InputLabelProps={{ style: { fontSize: '14px' } }}
            error={!!errors.tags}
            helperText={errors.tags}
            FormHelperTextProps={{ style: { color: isTyping ? 'blue' : 'red' } }}
          />
        </div> {/* Closing div tag for form-container */}

        <Button size='small' type='submit' variant='contained' style={buttonStyle} disabled={isCreating}>
          {isCreating ? 'Creating Poll...' : 'Create Poll'}
        </Button>
      </form>

      <Snackbar open={offline} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          You are offline. Please check your internet connection.
        </Alert>
      </Snackbar>
    </div>
  );
}

export default CreatePoll;
