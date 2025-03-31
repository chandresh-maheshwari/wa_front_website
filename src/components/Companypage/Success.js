import React, { useEffect, useState } from "react";
// Uncomment the line below if using from src/assets
// import successImage from '../../assets/sucsess.png'; // Adjust the path as needed
import "./Company.css"; // Assuming you have a CSS file for styling
// import { Stepper, Step } from "react-form-stepper";
import Stepper from 'react-stepper-horizontal';
import Expired from '../CheckTokenExpier';
import Navlayout from "../../Wa-Frontend/NavLayout";
import { useNavigate } from "react-router-dom";



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

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     window.location.href = "http://walara.localhost.com/admin/dashboard"; // Redirect URL
  //   }, 10000); // 10 seconds

  //   // Cleanup timeout on component unmount
  //   return () => clearTimeout(timer);
  // }, []); // Empty dependency array means it will run once on mount



  // const [count, setCount] = useState(2);
  // const RedirectComponent = () => {
  //   const navigate = useNavigate();
  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       // update the state after 1000ms
  //       setCount((currentCount) => currentCount - 1);
  //     }, 1000);
  //     // when count is 0, navigate
  //     count === 0 && navigate("/event");
  //     // clean up the interval
  //     return () => clearInterval(interval);
  //   }, [count, navigate]);
  //   RedirectComponent();
  // }


  const [timer, setTimer] = React.useState(10);
  const id = React.useRef(null);
  const clear = () => {
    window.clearInterval(id.current);
  };
  React.useEffect(() => {
    id.current = window.setInterval(() => {
      setTimer((time) => time - 1);
    }, 1000);
    return () => clear();
  }, []);

  React.useEffect(() => {
    if (timer === 0) {
      clear();
      // window.location.href = "http://walara.localhost.com/admin/user/dashboard"; 
      window.location.href = `http://walara.localhost.com/admin/user/dashboard?token=${localStorage.getItem('WAauthToken')}`;; 
    }
  }, [timer]);
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
          {/* <p>Redirecting you in {count} sec </p> */}
          <div>Wait to redirect dashboard :<span> {timer} </span></div>
          {/* <div className="countdown-timer">
            Wait to redirect dashboard: <span className={timer > 5 ? "normal" : "warning"}>{timer}</span>
        </div> */}

        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
