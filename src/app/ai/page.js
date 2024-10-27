"use client"
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ResultsContext } from "@/context/result";

const Gmini = () => {
  const { aiResponse } = useContext(ResultsContext);
  const router = useRouter();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"
        onClick={()=>{}}
      />
      <div className="bg-gray-800/90 border border-gray-700 rounded-lg 
                    shadow-2xl backdrop-blur-md overflow-hidden w-full max-w-[80rem] max-h-[35rem] overflow-y-scroll 
                    transform transition-all duration-200 srollbar scale-100">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                      animate-pulse" />
        <div className="relative p-6">
          <button
            onClick={()=>{}}
            className="absolute top-4 right-4 text-gray-400 hover:text-white
                     transition-colors duration-200"
          >
            
          </button>
          <div className="flex flex-col items-center text-center">
            <p className="text-gray-300 mb-6">
              {aiResponse}
            </p>
            <button
             onClick={()=> router.back()}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600
                       hover:from-blue-500 hover:to-purple-500 text-white font-medium
                       transition-all duration-200 transform hover:scale-105"
            >
              Got back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Gmini ;