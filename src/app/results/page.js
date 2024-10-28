'use client';

import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ResultsContext } from "../../context/result";
import { 
  ChevronLeft,
  Download,
  Save,
  Wand2,
  Building2,
  MapPin,
  AlertCircle,
  Loader2
} from 'lucide-react';
import ResultsTable from "../components/resultTable";
import PopUp from "../components/savePopup";


// Helper functions
const calculateTotalKeywords = (results) => results?.length || 0;

const determineLevel = (totalKeywords) => {
};

const saveResultsToLocalStorage = (businessName, mainLocation, results) => {
};

const convertToCSV = (businessName, mainLocation, results) => {
};

const downloadCSV = (csvContent, filename) => {
};

// Components
const Header = ({ onBack , goHistory}) => (
);

const BusinessInfo = ({ name, location }) => (
);

const ActionButtons = ({ analyzeKeywords, onDownload, onSave, disabled }) => (
  <div className="flex flex-wrap gap-3">
    <button
      onClick={analyzeKeywords}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2 rounded-lg
                bg-gradient-to-r from-blue-600 to-blue-700
                hover:from-blue-500 hover:to-blue-600
                disabled:from-gray-600 disabled:to-gray-700
                text-white transition-all duration-200 transform hover:scale-[1.02]
                disabled:hover:scale-100 shadow-lg"
    >
      {disabled ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
     ai Suggestions
    </button>
    <button
      onClick={onDownload}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2 rounded-lg
                bg-gradient-to-r from-emerald-600 to-emerald-700
                hover:from-emerald-500 hover:to-emerald-600
                disabled:from-gray-600 disabled:to-gray-700
                text-white transition-all duration-200 transform hover:scale-[1.02]
                disabled:hover:scale-100 shadow-lg"
    >
      <Download className="w-5 h-5" /> Download CSV
    </button>
    <button
      onClick={onSave}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2 rounded-lg
                bg-gradient-to-r from-purple-600 to-purple-700
                hover:from-purple-500 hover:to-purple-600
                disabled:from-gray-600 disabled:to-gray-700
                text-white transition-all duration-200 transform hover:scale-[1.02]
                disabled:hover:scale-100 shadow-lg"
    >
      <Save className="w-5 h-5" /> Save Results
    </button>
  </div>
);




// Main component
export default function Results() {
  const { results, name, mainLocation,setAiResponse } = useContext(ResultsContext);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const totalKeywords = calculateTotalKeywords(results);
  const level = determineLevel(totalKeywords);
  useEffect(() => {
    const handleMouseMove = (e) => {
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  //popup
  const showError = (message) => {
  setModalMessage(message);
  setShowModal(true);
};
  const handleDownloadCSV = () => {
  };

  const handleSave = () => {
  };

 
  
 const analyzeKeywords = async (results) => {
  try {
    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ body: results })
    });
    const data = await response.json();
    console.log("Keyword analysis results:", data.analysis);
    // Access the analysis result directly from the data object
    setAiResponse(data.analysis);
    router.push('/ai')
  } catch (error) {
    console.error("Error during keyword analysis:", error.message);
    handleError("An unexpected error occurred. Please check your network connection or try again later.");
  }
};

  // Placeholder for user feedback
const handleError = (message) => {
    alert(message); // Replace with your preferred user feedback method (e.g., setShowError)
};
  

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Animated background gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, 
                      rgb(59, 130, 246) 0%, 
                      rgb(37, 99, 235) 25%, 
                      rgb(29, 78, 216) 50%, 
                      transparent 100%)`
        }}
      />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      <div className="relative max-w-7xl mx-auto p-6 space-y-6">
        <Header onBack={() => router.back()}  goHistory={()=> router.push('history')} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BusinessInfo name={name} location={mainLocation} />

          {results?.length > 0 && (
            <div className="flex justify-end items-center bg-gray-800/50 p-6 rounded-lg 
                         backdrop-blur-sm border border-gray-700 shadow-lg">
              <ActionButtons
                analyzeKeywords={()=>{analyzeKeywords(results)}}
                onDownload={handleDownloadCSV}
                onSave={handleSave}
                disabled={isLoading}
              />
            </div>
          )}
        </div>

        <div className="bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700 
                     shadow-lg overflow-hidden">
          <ResultsTable
            results={results}
            totalKeywords={totalKeywords}
            level={level}
          />
        </div>
      </div>
        {/* Modal Component */}
        <PopUp
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          message={modalMessage}
        />
    </div>
  );
}
