import React, { useState, useRef, useEffect } from "react";

function CustomSelect({ options, value, onChange, id }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue, id } });
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div 
      className={`md-custom-select ${isOpen ? "md-custom-select-active" : ""}`} 
      ref={containerRef}
    >
      <button
        type="button"
        className="md-custom-select-trigger"
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption.label}</span>
        <span className="md-custom-select-arrow">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="md-custom-select-dropdown" role="listbox">
          {options.map((option) => (
            <div
              key={option.value}
              className={`md-custom-select-option ${
                option.value === value ? "md-custom-select-option-selected" : ""
              }`}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomSelect;
