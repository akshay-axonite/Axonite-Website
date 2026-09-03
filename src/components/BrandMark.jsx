const BrandMark = ({ size = 48, className = "", textClassName = "text-paper" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/logo.png"
        alt="Axonite"
        style={{ 
          height: `${size}px`, 
          minHeight: `${size}px`,
          width: "auto" 
        }}
        className="block shrink-0 object-contain"
      />
    
    </div>
  );
};

export default BrandMark;