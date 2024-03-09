import React, { useState, useEffect } from 'react';
import './App.css'; 
import axios from 'axios'; // Imports the axios library which is used for making HTTP requests.

const BingoGame = () => { // functional components/setter functions
  const [cards, setCards] = useState([]);  //hold the bingo cards retrieved from the server
  const [code, setCode] = useState(''); // stores input value for the bingo game code
  const [arrCode, setArrCode] = useState([]); // holds an array of play card tokens
  const [error, setError] = useState(''); // holds error messages to be displayed to the user

  const checkWinStatus = async (playcardToken) => { //sends a request to check if a player has won based on the provided play card token
    console.log("Checking win status: ");
    const url = `http://www.hyeumine.com/checkwin.php?playcard_token=${playcardToken}`;
    try {
      const response = await axios.get(url);
      console.log(`${playcardToken}:`, response.data);
      if(response.data === 1) {
        alert("Congratulations! You won with Card token: " + playcardToken);
      }
    } catch (error) {
      console.error(`Error fetching data for ${playcardToken}:`, error);
    }
  };

  useEffect(() => { //this function checks for the "win status" changes
    const interval = setInterval(() => {
      for(const playcardToken of arrCode) {
        checkWinStatus(playcardToken);
      } 
    }, 1000); 
    return () => clearInterval(interval);
  }, [arrCode]); 

  const transpose = (array) => {  // transpose number of arrays received from the server
    return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
  };

  const handleAddCard = () => { //calls the fetch data, triggered when the "Add Card" button is clicked
    fetchData(); 
  };

  const fetchData = async () => { // fetches bingo card data from the server based on the entered game code.
    try {
      const response = await axios.get(`http://www.hyeumine.com/getcard.php?bcode=${code}`);
      if(response.data === 0) { 
        setError('Game code not found, please try a different one.');
        return; 
      }
      setError('');
      const card = response.data.card;
      const numbersArray = [card.B, card.I, card.N, card.G, card.O];
      const transposedArray = transpose(numbersArray);
      const playcardToken = response.data.playcard_token;
      
      setCards(prevCards => [...prevCards, { numbers: transposedArray, token: playcardToken }]);
      setArrCode(prevArrCode => [...prevArrCode, playcardToken]);
    } catch (err) {
        console.error(err);
    }
  };

  //event handlers
  const handleGameCodeChange = (e) => { // updates the "code" state with the input value
    setCode(e.target.value); 
  };

  const handleSubmitCode = (e) => { //fetch data based on the entered game code
    e.preventDefault(); 
    fetchData();
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmitCode} className="form">
        <label htmlFor="gameCode"><strong>Bingo Game Code:</strong></label>
        <input
          id="gameCode"
          type="text"
          value={code}
          onChange={handleGameCodeChange}
        />
        <button type="submit">Submit</button>
        <button type="button" onClick={handleAddCard}>Add Card</button>
      </form>
      {error && <p className="error">{error}</p>} 
      <div className="card">
        {cards.map((card, cardIndex) => (
          <div key={cardIndex} className="bingo-card"> 
            <div className="bingo-header">
              {['B', 'I', 'N', 'G', 'O'].map((letter, index) => (
                <div key={index} className="bingo-header-cell">{letter}</div>
              ))}
            </div>
            {card.numbers.map((column, columnIndex) => (
              <div key={columnIndex} className="bingo-column">
                {column.map((number, numberIndex) => (
                  <div key={numberIndex} className="bingo-cell">
                    {number}
                  </div>
                ))}
              </div>
            ))}
            <div className="bingo-card-id">Token: {card.token}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BingoGame;
