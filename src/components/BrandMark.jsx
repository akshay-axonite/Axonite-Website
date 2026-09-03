const BrandMark = ({  className = "", textClassName = "text-paper" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/log.png"
        alt="Axonite"
        style={{ 
          height: "45px", 
          minHeight: "45px",
          width: "auto" 
        }}
        className="block shrink-0 object-contain"
      />
    
    </div>
  );
};

export default BrandMark;