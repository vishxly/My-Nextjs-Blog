import React from "react";

const CompactContentLoader = () => {
  return (
    <div className="flex items-center justify-center p-4 space-x-2">
      {/* Fluid expanding and contracting circle */}
      <div className="relative w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse"></div>

      {/* Rotating abstract shape */}
      <div className="relative w-8 h-8 transform rotate-45 rounded-lg bg-gradient-to-r from-blue-400 to-green-500 animate-spin-slow"></div>

      {/* Morphing blob */}
      <div className="relative w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-blob"></div>

      <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300">
        Loading content...
      </span>
    </div>
  );
};

export default CompactContentLoader;





// import React from "react";

// const CompactContentLoader = () => {
//   return (
//     <div className="flex items-center justify-center p-4 space-x-2">
//       <div className="w-2 h-2 bg-black rounded-full animate-bounce dark:bg-white"></div>
//       <div
//         className="w-2 h-2 bg-black rounded-full dark:bg-white animate-bounce"
//         style={{ animationDelay: "0.1s" }}
//       ></div>
//       <div
//         className="w-2 h-2 bg-black rounded-full dark:bg-white animate-bounce"
//         style={{ animationDelay: "0.2s" }}
//       ></div>
//       <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
//         Loading content...
//       </span>
//     </div>
//   );
// };

// export default CompactContentLoader;


