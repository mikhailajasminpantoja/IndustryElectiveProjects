import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Button, ButtonGroup, TextField } from '@mui/material';
import { Box } from '@mui/system';
import './App.css';

// Data for different singers
const SingersData = [
  { id: 'first', color: '#7768AE', name: 'First Singer' },
  { id: 'second', color: '#60cf92', name: 'Second Singer' },
  { id: 'third', color: '#5eafe0', name: 'Third Singer' },
  { id: 'fourth', color: '#e77499', name: 'Fourth Singer'},
];

const CompleteLyrics = ({ singer }) => { //responsible for managing and displaying lyrics submission.
  const [lyrics, setLyrics] = useState([]); //Utilizes useState to manage state variables lyrics and inputValue
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => { // Updates inputValue state based on user input.
    setInputValue(event.target.value);
  };

  const handleSubmit = () => { //Adds entered lyric to the lyrics state when submitted.
    if (inputValue.trim() !== '') {
      setLyrics((prevLyrics) => [
        ...prevLyrics,
        { id: Date.now(), lyric: inputValue, color: singer.color },
      ]);
      setInputValue('');
    }
  };

  const handleKeyDown = (event) => { //Submits lyric when Enter key is pressed.
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  return ( //Renders a textfield for user input and displays entered lyrics.
    <div>
      <div className="text-field-container" >
        <TextField
          fullWidth
          variant="outlined"
          label={`Enter Lyrics for ${singer.name}`}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="box-wrapper">
        <Box className="lyrics-container">
          {/* Display lyrics including the currently typed text */}
          {lyrics.map((submission) => (
            <div key={submission.id} className="lyrics-submission">
              <div className="lyric-box" style={{ backgroundColor: submission.color }}>
                <div className="lyric-text">{submission.lyric}</div>
              </div>
            </div>
          ))}
          {/* Display currently typed text */}
          {inputValue && (
            <div className="lyrics-submission">
              <div className="lyric-box" style={{ backgroundColor: singer.color }}>
                <div className="lyric-text">{inputValue}</div>
              </div>
            </div>
          )}
        </Box>
      </div>
    </div>
  );
};

// Main App component we set up routing using React Router.
const App = () => {
  return (
    <Router>
      <div className="App">
        <h1>Complete the Lyrics</h1>
        <ButtonGroup variant="contained">
          {SingersData.map((singer) => ( //this maps over SingersData to render buttons for each singer.
            <Button key={singer.id} style={{ backgroundColor: singer.color }}>
              <Link to={`/${singer.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>{singer.name}</Link>
            </Button>
          ))}
        </ButtonGroup>

        <Routes>
          {SingersData.map((singer) => ( //Defines Routes for each singer's page, rendering the CompleteLyrics component for each.
            <Route key={singer.id} path={`/${singer.id}`} element={<CompleteLyrics singer={singer} />} />
          ))}
          <Route path="/*" element={<Navigate to="/not-found" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
