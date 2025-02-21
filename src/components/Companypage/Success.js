import React from "react";
// Uncomment the line below if using from src/assets
// import successImage from '../../assets/sucsess.png'; // Adjust the path as needed
import "./Company.css"; // Assuming you have a CSS file for styling
import { Stepper, Step } from "react-form-stepper";

const SuccessPage = () => {
  const [activeStep, setActiveStep] = React.useState(5);

  return (
    <div>
      <h2 className="header">Set up Ready !!!</h2>
      <p className="firstcontent">
        "Your setup has been successfully created! Let's get started on your
        work and make it a great success..."
      </p>
      <div className="container abcd mt-5 mb-5">
        <Stepper activeStep={activeStep} onStepClick={setActiveStep}>
          <Step label="Company" />
          <Step label="Contract" />
          <Step label="Depot" />
          <Step label="Vehicle" />
          <Step label="Completed" />

        </Stepper>
        <div className="pro-under-border"></div>
        <div className="p-4 success-container ">
          <img src="/sucsess.png" alt="Success" className="success-image" />
          <h5 className="submittitle">Submit your request Successfully...</h5>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
