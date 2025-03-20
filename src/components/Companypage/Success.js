import React from "react";
// Uncomment the line below if using from src/assets
// import successImage from '../../assets/sucsess.png'; // Adjust the path as needed
import "./Company.css"; // Assuming you have a CSS file for styling
// import { Stepper, Step } from "react-form-stepper";
import Stepper from 'react-stepper-horizontal';
import Expired from '../CheckTokenExpier';
import Navlayout from "../../Wa-Frontend/NavLayout";

const SuccessPage = () => {
  const [activeStep, setActiveStep] = React.useState(4);
  const steps = [
    { title: 'Company' },
    { title: 'Contract' },
    { title: 'Depot' },
    { title: 'Vehicle' },
    { title: 'Completed' },
  ];
  const activeStep1 = 4;

  function CustomStepper(props) {
    return (
      <Stepper
        {...props}
        activeColor="#1e991c"
        defaultColor="#eee"
        completeColor="#1e991c"
        activeTitleColor="#1e991c"
        completeTitleColor="#1e991c"
        defaultTitleColor="#bbb"
        circleFontColor="#fff"
        completeBarColor="#1e991c" />
    );
  }
  return (
    <div>
      <Navlayout />
      <Expired />
   
      <div className="company-setup-container abcd mt-5">
        <div className="container stepper-connector-fifth-child stepper-connector">
          <CustomStepper
            steps={steps}
            activeStep={activeStep} />
        </div><br />
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
