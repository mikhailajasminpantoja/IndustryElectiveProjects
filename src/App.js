// App.js
import React, { useState } from 'react';
import routesData from './routes.json';
import './App.css';

const App = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const findPlaces = () => {
    const codes = input.split(',');
    let result = '';
    codes.forEach((code) => {
      const trimmedCode = code.trim();
      if (routesData.hasOwnProperty(trimmedCode)) {
        const places = routesData[trimmedCode].map(place => (
          `<span style="color: ${getPlaceColor(place)}">${place}</span>`
        )).join(' <-> ');
        result += `<div class="route-box"><div class="route">${trimmedCode} => ${places}</div></div>`;
      }
    });
    setOutput(result);
  };

  const getPlaceColor = (place) => {
    switch (place) {
      case 'Alpha':
        return '#FF5733';
      case 'Bravo':
        return '#3498DB'; 
      case 'Charlie':
        return '#9B59B6'; 
      case 'Delta':
        return '#1ABC9C'; 
      case 'Echo':
        return '#E74C3C'; 
      case 'Foxtrot':
        return '#27AE60'; 
      case 'Golf':
        return '#F1C40F'; 
      case 'Hotel':
        return '#E67E22'; 
      case 'India':
        return '#8E44AD'; 
      case 'Juliet':
        return '#2C3E50';
      case 'Kilo':
        return '#16A085'; 
      case 'Lima':
        return '#FFA07A'; 
      case 'Mike':
        return '#00FFFF'; 
      case 'November':
        return '#9400D3'; 
      case 'Oscar':
        return '#FF6347'; 
      case 'Papa':
        return '#FF4500'; 
      case 'Quebec':
        return '#00FF00'; 
      case 'Romeo':
        return '#8A2BE2'; 
      default:
        return '#000'; 
    }
  };

  return (
    <div className="App">
      <h1>Jeep Route Finder</h1>
      <input
        type="text"
        placeholder="Enter Jeep Code(s)"
        value={input}
        onChange={handleInputChange}
      />
      <button onClick={findPlaces}>Find Route</button>
      <div className="output" dangerouslySetInnerHTML={{ __html: output }} />
    </div>
  );
};

export default App;
