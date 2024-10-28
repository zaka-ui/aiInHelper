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
  if (totalKeywords < 30) return { name: "Level 1", color: "text-emerald-400" };
  if (totalKeywords < 80) return { name: "Level 2", color: "text-blue-400" };
  if (totalKeywords < 180) return { name: "Level 3", color: "text-purple-400" };
  return { name: "VIP", color: "text-amber-400" };
};

const saveResultsToLocalStorage = (businessName, mainLocation, results) => {
  try {
    // Convert results to CSV format
    const csvContent = convertToCSV(businessName, mainLocation, results);

    // Create a new entry for local storage
    const newResult = {
      csv: csvContent,
      id: `history-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    // Retrieve existing results from local storage
    const existingResults = JSON.parse(localStorage.getItem("keywordResults")) || [];

    // Update the results and save back to local storage
    const updatedResults = [...existingResults, newResult];
    localStorage.setItem("keywordResults", JSON.stringify(updatedResults));
    return true;
  } catch (error) {
    console.error("Error saving results:", error);
    return false;
  }
};

const convertToCSV = (businessName, mainLocation, results) => {

  // Add business info as header rows
  const businessInfo = [
    `Business Name,${businessName || 'N/A'}`,
    `Main Location,${mainLocation || 'N/A'}`,
    '' // Empty line to separate business info from data
  ];

  // Original headers plus business info
  const headers = ['Keyword', 'Monthly Searches', 'Competition', 'Related Keywords'];
  const rows = results.map(result => {
   // console.log("data ==>", result);
    const keyword = result?.keyword || 'Unknown Keyword';
    // Get data from the correct path in the response
    const data = result?.result?.[0] || result?.result || {};
    //console.log("dataOne ==>", data);
    
    const message = result?.message;    
    // Get competition index
    const competitionValue = data.result[0].competition_value || '-';
    //console.log("competitionValue ==>", competitionValue);
    
    //Avreage monthly searches
    const avgMonthlySearches = data.result[0].avg_monthly_searches || '-';
    // Handle suggestions differently based on result structure
    const suggestions = data.result && Array.isArray(data.result) 
      ? data.result
          .slice(1) // Skip the first item which is the main result
          .map(sugg => sugg.keyword)
          .join('\n')
      : '';

    return [
      keyword,
      avgMonthlySearches,
      competitionValue,
      suggestions
    ].map(cell => {
      const cellStr = String(cell).replace(/"/g, '""');
      return cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')
        ? `"${cellStr}"`
        : cellStr;
    }).join(',');
  });

  // Combine business info, headers, and data rows
  return [...businessInfo, headers.join(','), ...rows].join('\n');
};

const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Components
const Header = ({ onBack, goHistory }) => (
  <header className="flex items-center justify-between mb-6">
    <button onClick={onBack} className="text-white hover:text-gray-300">
      <ChevronLeft className="w-6 h-6" /> Back
    </button>
    <button onClick={goHistory} className="text-white hover:text-gray-300">
      History
    </button>
  </header>
);
const BusinessInfo = ({ name, location }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-md">
    <h2 className="text-lg font-semibold">{name}</h2>
    <p className="text-sm text-gray-400">{location}</p>
  </div>
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
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setGradientPosition({ x, y });
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
    try {
      if (!results?.length) {
        alert('No results to download');
        return;
      }

      const date = new Date().toISOString().split('T')[0];
      const filename = `keyword-research-${date}.csv`;
      const csvContent = convertToCSV(name, mainLocation ,results);
      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Error creating CSV file. Please try again.');
    }
  };

  const handleSave = () => {
    const saved = saveResultsToLocalStorage(name,mainLocation,results);
    if (saved) {
      //<KeywordLengthModal isOpen={} onClose={} message={}   />
      showError('Results saved successfully!')
      setShowModal(true)
    } else {
      alert('Error saving results. Please try again.');
    }
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
