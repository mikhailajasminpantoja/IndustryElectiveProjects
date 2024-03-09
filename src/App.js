import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const BingoGame = () => {
  const [cards, setCards] = useState([]); 
  const [code, setCode] = useState(''); 
  const [arrCode, setArrCode] = useState([]);
  const [error, setError] = useState(''); 

  const checkWinStatus = async (playcardToken) => {
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

  useEffect(() => { 
    const interval = setInterval(() => {
      for(const playcardToken of arrCode) {
        checkWinStatus(playcardToken);
      } 
    }, 1000); 
    return () => clearInterval(interval);
  }, [arrCode]); 

  const transpose = (array) => {  
    return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
  };

  const handleAddCard = () => {
    fetchData(); 
  };

  const fetchData = async () => {
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

  const handleGameCodeChange = (e) => {
    setCode(e.target.value); 
  };

  const handleSubmitCode = (e) => {
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
