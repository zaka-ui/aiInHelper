import React, { useState, useRef, useEffect, useContext } from 'react';
import { ResultsContext } from "../../context/result"; 
import { X, MapPin, Plus } from 'lucide-react';

const TagInput = () => {
  const { setLocations } = useContext(ResultsContext);
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);

  const suggestions = [
    "Paris", "Bordeaux", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes",
    "Montpellier", "Strasbourg", "Lille", "Rennes", "Toulon", "Reims",
    "Saint-Étienne", "Le Havre", "Dijon", "Grenoble", "Angers", "Villeurbanne",
    "Nîmes", "Aix-en-Provence", "Clermont-Ferrand", "Le Mans", "Brest", "Tours",
    "Amiens", "Annecy", "Limoges", "Metz", "Boulogne-Billancourt", "Perpignan",
    "Besançon", "Orléans", "Rouen", "Saint-Denis", "Montreuil", "Caen",
    "Argenteuil", "Mulhouse", "Nancy", "Tourcoing", "Roubaix", "Nanterre",
    "Vitry-sur-Seine", "Créteil", "Poitiers", "Ille-et-Vilaine"
  ].sort();
  
  const filteredSuggestions = suggestions.filter(
    city => city.toLowerCase().includes(inputValue.toLowerCase()) &&
    !tags.includes(city)
  );

  useEffect(() => {
    setLocations(tags);
  }, [tags, setLocations]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target) &&
          !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      const matchedCity = suggestions.find(
        city => city.toLowerCase() === inputValue.toLowerCase()
      );
      if (matchedCity && !tags.includes(matchedCity)) {
        setTags([...tags, matchedCity]);
        setInputValue('');
        setShowSuggestions(false);
      }
    }
  };

  const addTag = (suggestion) => {
    if (!tags.includes(suggestion)) {
      setTags([...tags, suggestion]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full">
      <div className="group relative w-full">
        <MapPin className="absolute left-3 top-4 text-gray-500 group-focus-within:text-blue-400 transition-colors z-10" />
        <div className="min-h-[100px] w-full p-2 pl-12 bg-gray-800/50 border border-gray-700 
                    rounded-lg flex flex-wrap gap-2 items-start backdrop-blur-sm
                    focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent
                    transition-all duration-200">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-blue-600/20 border border-blue-500/30 
                       px-3 py-1 rounded-full backdrop-blur-sm group hover:bg-blue-600/30 
                       transition-all duration-200"
            >
              <span className="text-sm text-gray-100">{tag}</span>
              <button
                onClick={() => removeTag(index)}
                className="text-gray-400 hover:text-red-400 rounded-full p-0.5
                         opacity-70 group-hover:opacity-100 transition-all duration-200"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Type a city name"
            className="flex-grow min-w-[200px] bg-transparent outline-none text-gray-100 
                     placeholder:text-gray-500 py-1"
          />
        </div>
        
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div 
            ref={suggestionRef}
            className="absolute left-0 right-0 mt-2 bg-gray-800/95 border border-gray-700 
                     shadow-lg rounded-lg overflow-hidden max-h-60 overflow-y-auto
                     backdrop-blur-sm z-50"
          >
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => addTag(suggestion)}
                className="w-full text-left px-4 py-2 text-gray-100 hover:bg-blue-600/20 
                         focus:bg-blue-600/20 focus:outline-none transition-colors duration-200
                         flex items-center justify-between group"
              >
                <span>{suggestion}</span>
                <Plus size={14} className="opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity duration-200" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagInput;