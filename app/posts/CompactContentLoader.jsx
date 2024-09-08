import React from "react";

const CompactContentLoader = () => {
  return (
    <div className="flex items-center justify-center p-4 space-x-2">
      <div className="w-2 h-2 bg-black rounded-full animate-bounce dark:bg-white"></div>
      <div
        className="w-2 h-2 bg-black rounded-full dark:bg-white animate-bounce"
        style={{ animationDelay: "0.1s" }}
      ></div>
      <div
        className="w-2 h-2 bg-black rounded-full dark:bg-white animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></div>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
        Loading content...
      </span>
    </div>
  );
};

export default CompactContentLoader;
