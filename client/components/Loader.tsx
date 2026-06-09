"use client";
import "../public/loader.css"; // Ensure you have the appropriate CSS for the loader

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/5 backdrop-blur-sm">
      <div className="loader">
        {[...Array(12)].map((_, index) => (
          <div key={index} className={`bar${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default FullScreenLoader;
