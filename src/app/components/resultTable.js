import SuggestionsList from "./suggestions";
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const ResultsTable = ({ results, totalKeywords, level }) => {
  if (!results?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <AlertCircle className="w-12 h-12 mb-4 text-gray-500" />
        <span className="text-lg">No results found</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th colSpan="4" className="bg-gray-800/60 border-b border-gray-700 px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Total Keywords:</span>
                  <span className="text-white font-bold bg-gray-700/50 px-3 py-1 rounded-full">
                    {totalKeywords}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Classification:</span>
                  <span className={`font-bold px-3 py-1 rounded-full 
                                ${level.name === "Level 1" ? "bg-emerald-500/20 text-emerald-400" :
                                  level.name === "Level 2" ? "bg-blue-500/20 text-blue-400" :
                                  level.name === "Level 3" ? "bg-purple-500/20 text-purple-400" :
                                  "bg-amber-500/20 text-amber-400"}`}>
                    {level.name}
                  </span>
                </div>
              </div>
            </th>
          </tr>
          <tr className="bg-gray-800/40">
            <th className="px-6 py-4 text-left text-gray-300 font-medium border-b border-gray-700">
              Keyword
            </th>
            <th className="px-6 py-4 text-left text-gray-300 font-medium border-b border-gray-700">
              Monthly Searches
            </th>
            <th className="px-6 py-4 text-left text-gray-300 font-medium border-b border-gray-700">
              Competition
            </th>
            <th className="px-6 py-4 text-left text-gray-300 font-medium border-b border-gray-700">
              Suggestions
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => {
            const keyword = result?.keyword || "Unknown Keyword";
            const data = result?.result?.[0] || result?.result?.result?.[0];
            const message = result?.result?.message || result?.message;
            const suggestions = result?.result?.result || result?.result;
            
            return (
              <tr
                key={keyword + index}
                className={`border-b border-gray-700/50 transition-colors duration-150
                          ${index % 2 === 0 ? 'bg-gray-800/20' : 'bg-gray-800/40'}
                          hover:bg-blue-600/10`}
              >
                <td className="px-6 py-4 font-medium text-gray-200">
                  {keyword}
                </td>
                <td className="px-6 py-4 text-right">
                  {message ? (
                    <div className="flex items-center justify-end text-amber-400 bg-amber-500/10 
                                  px-3 py-1 rounded-full">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span>{message?.split(' ').slice(0,6).join(' ')}</span>
                    </div>
                  ) : (
                    <span className="text-gray-300">
                      {data?.avg_monthly_searches?.toLocaleString() || '-'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full
                                ${data?.competition_value === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                                  data?.competition_value === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                                  data?.competition_value === 'LOW' ? 'bg-green-500/20 text-green-400' :
                                  'bg-gray-500/20 text-gray-400'}`}>
                    {data?.competition_value || message?.split(' ').slice(0,6).join(' ') || '-'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <SuggestionsList
                    suggestions={suggestions}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;