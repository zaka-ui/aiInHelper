'use client'; // Ensure this is a client component

import { createContext, useState } from 'react';

// Named export
export const ResultsContext = createContext();

export const ResultsProvider = ({ children }) => {
  const [results, setResults] = useState([]);
  const [name, setName] = useState("");
  const [mainLocation, setMainLocation] = useState("");
  const [locations , setLocations ] = useState([]);
  const [aiResponse, setAiResponse] = useState("No Responde found");

  return (
    <ResultsContext.Provider value={{ results, setResults, name, setName, mainLocation, setMainLocation ,locations , setLocations ,aiResponse,setAiResponse }}>
      {children}
    </ResultsContext.Provider>
  );
};
