import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const SuggestionsList = ({ suggestions }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxVisibleSuggestions = 3;

  // If no suggestions or invalid data, show no suggestions message
  if (!suggestions || !Array.isArray(suggestions) || suggestions.length <= 1) {
    return (
      <span className="text-gray-500 italic">
        No suggestions available
      </span>
    );
  }

  // Format the data to include only necessary information
  const formattedSuggestions = suggestions.map(item => ({
    keyword: item.keyword,
    searches: item.avg_monthly_searches,
    competition: item.competition_value
  }));

  const visibleSuggestions = isExpanded
    ? formattedSuggestions
    : formattedSuggestions.slice(0, maxVisibleSuggestions);

  return (
    <div className="space-y-2">
      <ul className="space-y-1">
        {visibleSuggestions.map((suggestion, index) => (
          <li
            key={`${suggestion.keyword}-${index}`}
            className="text-sm hover:bg-gray-50   rounded p-1"
          >
            <div className="flex items-center justify-between">
              <span className='hover:text-gray-500'>{suggestion.keyword}</span>
              <span className="text-xs text-gray-500">
                ({suggestion.searches}/mo)
              </span>
            </div>
          </li>
        ))}
      </ul>
      
      {formattedSuggestions.length > maxVisibleSuggestions && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="ml-1 w-4 h-4" />
            </>
          ) : (
            <>
              Show More ({formattedSuggestions.length - maxVisibleSuggestions} more) <ChevronDown className="ml-1 w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default SuggestionsList;