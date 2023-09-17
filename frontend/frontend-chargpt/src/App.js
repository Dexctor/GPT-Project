import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [specifications, setSpecifications] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const generateCode = async () => {
    try {
      const response = await axios.post('/api/generate', {
        userData: { specifications }
      });

      if (response.data && response.data.code) {
        setGeneratedCode(response.data.code);
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API:", error);
    }
  };

  return (
    <div className="App">
      <h1>Generateur de code GPT-4</h1>
      <textarea 
        placeholder="Entrez vos spécifications ici..."
        value={specifications}
        onChange={e => setSpecifications(e.target.value)}
      />
      <button onClick={generateCode}>Générer</button>
      <pre>{generatedCode}</pre>
    </div>
  );
}

export default App;
