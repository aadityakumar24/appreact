import React, { useState } from 'react';
import './App.css';

function App() {
  const [jsonData, setJsonData] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const parsedData = JSON.parse(jsonData);
      const result = await fetch('http://127.0.0.1:5000/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: parsedData.data }),
      });

      const responseData = await result.json();
      setResponse(responseData);
    } catch (err) {
      setError('Invalid JSON or Error in fetching data.');
    }
  };

  const handleOptionChange = (e) => {
    const { value } = e.target;
    setSelectedOptions(
      selectedOptions.includes(value)
        ? selectedOptions.filter((option) => option !== value)
        : [...selectedOptions, value]
    );
  };

  const renderResponse = () => {
    if (!response) return null;

    const { numbers, alphabets, highest_lowercase_alphabet } = response;
    const filteredResponse = {
      numbers: selectedOptions.includes('Numbers') ? numbers : [],
      alphabets: selectedOptions.includes('Alphabets') ? alphabets : [],
      highest_lowercase_alphabet: selectedOptions.includes('Highest Lowercase Alphabet')
        ? highest_lowercase_alphabet
        : [],
    };

    return (
      <div className="response">
        <h3>Response</h3>
        <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>BFHL API Frontend</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          placeholder='Enter JSON data, e.g. { "data": ["A","B","z"] }'
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p className="error">{error}</p>}
      <div className="dropdown">
        <h3>Filter Options</h3>
        <label>
          <input
            type="checkbox"
            value="Numbers"
            onChange={handleOptionChange}
          /> Numbers
        </label>
        <label>
          <input
            type="checkbox"
            value="Alphabets"
            onChange={handleOptionChange}
          /> Alphabets
        </label>
        <label>
          <input
            type="checkbox"
            value="Highest Lowercase Alphabet"
            onChange={handleOptionChange}
          /> Highest Lowercase Alphabet
        </label>
      </div>
      {renderResponse()}
    </div>
  );
}

export default App;
