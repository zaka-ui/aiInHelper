'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Trash2,
  Download,
  ChevronLeft,
  Calendar,
  AlertCircle,
  History as HistoryIcon
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alertDialog";

const History = () => {
  const [history, setHistory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });
  const router = useRouter();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setGradientPosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const savedResults = localStorage.getItem('keywordResults');
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        const resultsWithDates = parsedResults.map((item, index) => ({
          ...item,
          timestamp: item.timestamp || new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
          id: item.id || `history-${index}`
        }));
        setHistory(resultsWithDates);
      } catch (error) {
        console.error('Error parsing history:', error);
      }
    }
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = (id) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('keywordResults', JSON.stringify(updatedHistory));
    setSelectedItem(null);
  };

  const downloadCSV = (item, filename) => {
    // Parse the CSV string into an array of keyword objects
    const csvData = item.csv.split('\n').slice(3); // Assuming the first three lines are headers
    const results = csvData.map(row => {
      const columns = row.split(',');
      return {
        keyword: columns[0]?.trim() || 'N/A',
        avg_monthly_searches: columns[1]?.trim() || '-',
        competition_value: columns[2]?.trim() || '-',
      };
    });

    const headers = ['Keyword', 'Monthly Searches', 'Competition'];
    const rows = results.map(result => [
      result.keyword,
      result.avg_monthly_searches,
      result.competition_value,
    ].map(cell => {
      const cellStr = String(cell).replace(/"/g, '""');
      return cellStr.includes(',') ? `"${cellStr}"` : cellStr;
    }).join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
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

      <div className="relative max-w-4xl mx-auto px-6 py-12 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm
                      border border-gray-700 shadow-lg">
          <button
            onClick={() => router.back()}
            className="flex items-center px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30
                     text-blue-400 hover:bg-blue-600/30 transition-all duration-200"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Go back
          </button>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
                       from-blue-400 to-purple-500">
            Research History
          </h1>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/50 rounded-lg border border-gray-700 
                        backdrop-blur-sm shadow-lg">
            <HistoryIcon className="mx-auto h-16 w-16 text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-300">No history yet</h3>
            <p className="mt-2 text-gray-400">
              Your keyword research history will appear here
            </p>
          </div>
        ) : (
          <div className="bg-gray-800/50 rounded-lg border border-gray-700 backdrop-blur-sm 
                       shadow-lg overflow-hidden">
            <ul className="divide-y divide-gray-700/50">
              {history.map((item) => (
                <li key={item.id} className="group hover:bg-blue-600/10 transition-colors duration-200">
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center text-gray-400 group-hover:text-gray-300 
                                    transition-colors duration-200">
                          <Calendar className="mr-2 h-4 w-4" />
                          {formatDate(item.timestamp)}
                        </div>
                        <p className="mt-2 text-gray-300 group-hover:text-white transition-colors duration-200">
                          {Array.isArray(item) ? `${item.length} keywords analyzed` : 'Keyword analysis'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => downloadCSV(item, `keyword-research-${new Date(item.timestamp).toISOString().split('T')[0]}.csv`)}
                          className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 transition-all duration-200"
                          title="Download CSV"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="p-2 rounded-lg bg-red-600/20 border border-red-500/30
                                   text-red-400 hover:bg-red-600/30 transition-all duration-200"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <AlertDialogContent className="bg-gray-800 border border-gray-700 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-white">
                Delete History Item
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                Are you sure you want to delete this keyword research history item?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(selectedItem?.id)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default History;