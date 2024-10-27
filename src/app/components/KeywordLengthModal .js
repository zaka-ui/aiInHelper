import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const KeywordLengthModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gray-800/90 border border-gray-700 rounded-lg 
                    shadow-2xl backdrop-blur-md overflow-hidden w-full max-w-md
                    transform transition-all duration-200 scale-100">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                      animate-pulse" />
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white
                     transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-amber-500/20 text-amber-400 mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold bg-clip-text text-transparent 
                        bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
              Validation Error
            </h3>
            <p className="text-gray-300 mb-6">
              {message}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600
                       hover:from-blue-500 hover:to-purple-500 text-white font-medium
                       transition-all duration-200 transform hover:scale-105"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default KeywordLengthModal;