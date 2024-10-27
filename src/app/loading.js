export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Animated background gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 50%, 
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

      <div className="flex flex-col justify-center items-center h-screen relative z-10">
        <div className="relative">
          {/* Gradient ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse"></div>
          
          {/* Spinning loader */}
          <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-400 rounded-full animate-spin 
                       relative m-0.5">
          </div>
        </div>
        
        <p className="mt-4 text-2xl font-bold bg-clip-text text-transparent 
                    bg-gradient-to-r from-blue-400 to-purple-500">
          Loading...
        </p>
      </div>
    </div>
  );
}