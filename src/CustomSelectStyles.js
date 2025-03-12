const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "46px",
      border: "1px solid #E5E7EB",
      backgroundColor: "#F9FAFB",
      boxShadow: "none",
      height: "66px",
      "&:hover": {
        border: "1px solid #E5E7EB",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#333",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#333",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      color: "#333",
    }),
  };
  
  export default customSelectStyles;
  