import React, { useState } from "react"; 
import routesData from "./routes.json"; // import routes data which contains the jeep routes
import "./App.css";

// Function to validate Jeep Codes 
const validateInput = (inputStr) => {
  // Split the input by comma
  const codes = inputStr.split(",");

  for (let code of codes) {
    // Check if each code matches the pattern if it is two digits, followed by a letter
    if (!/^\d{2}[A-Za-z]$/.test(code.trim())) {
      return false;
    }
  }
  return true;
};

// Function to find common places between two routes provided as arrays
const findCommonPlacesBetweenRoutes = (route1, route2) => {
  const commonPlaces = [];
  for (let place of route1) {
    if (route2.includes(place)) {
      commonPlaces.push(place);
    }
  }
  return commonPlaces;
};

// Function to generate hash code for a given string
const hashCode = (str) => {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; 
  }
  return hash;
};

// Function to colorize text, this applies color to text based on the common places
const colorize = (text, commonPlacesMap) => {
  let color = ""; // Default color
  for (const pair in commonPlacesMap) {
    if (commonPlacesMap.hasOwnProperty(pair)) {
      const commonPlaces = commonPlacesMap[pair];
      if (commonPlaces.includes(text)) {
        color = getColorForPair(pair);
        break; // Once we find a match, we can break the loop
      }
    }
  }
  return <span style={{ color }}>{text}</span>;
};

// Function to get color for a pair of Jeep Codes
const getColorForPair = (pair) => {
  // Generate a unique color based on the pair
  const hash = hashCode(pair);
  const color = "#" + Math.abs(hash).toString(16).substring(0, 6); // Convert hash code to hex color
  return color;
};

// main function 
const JeepRouteApp = () => { 
  const [input, setInput] = useState(""); // store input
  const [output, setOutput] = useState(""); // store output 
  const [error, setError] = useState(""); // store error message

  const handleInputChange = (e) => { // updates the input state as the user types in the input field
    setInput(e.target.value);
  };

  const handleSubmit = () => { // function basically handles the submission
    // Validates the input, generates common places map for each pair of jeep codes
    if (!validateInput(input)) {
      setError(
        "Invalid input. Jeep Code format should be: 2 digits followed by a letter (e.g., 01A)"
      );
      setOutput(""); // outputs the routes for each jeep code
      return;
    }

    // Split input by comma and strip whitespace
    const jeepCodes = input.split(",").map((code) => code.trim());

    // Generate common places map for each pair of Jeep Codes
    const commonPlacesMap = {};
    for (let i = 0; i < jeepCodes.length; i++) {
      for (let j = i + 1; j < jeepCodes.length; j++) {
        const code1 = jeepCodes[i];
        const code2 = jeepCodes[j];
        const route1 = routesData[code1];
        const route2 = routesData[code2];
        const commonPlaces = findCommonPlacesBetweenRoutes(route1, route2);
        commonPlacesMap[`${code1}${code2}`] = commonPlacesMap[`${code2}${code1}`] = commonPlaces;
      }
    }

    // Output routes for each Jeep Code
    const routesOutput = jeepCodes.map((code) => {
      const currentRoute = routesData[code];

      return (
        <div key={code}>
          {code} =>{" "}
          {currentRoute.map((place, index) => (
            <React.Fragment key={place}>
              {index > 0 && " <-> "} 
              {colorize(place, commonPlacesMap)}
            </React.Fragment>
          ))}
        </div>
      );
    });

    // Set output
    setOutput(routesOutput);
    setError("");
  };

  return ( //the look for the app
    <div className="App">
      <h1>Jeep Route App</h1>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter Jeep Code(s) separated by comma"
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="output">{output}</div>
    </div>
  );
};

export default JeepRouteApp;
