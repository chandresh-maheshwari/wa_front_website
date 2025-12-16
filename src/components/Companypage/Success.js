import React, { useEffect, useState } from "react";
// Uncomment the line below if using from src/assets
// import successImage from '../../assets/sucsess.png'; // Adjust the path as needed
import "./Company.css"; // Assuming you have a CSS file for styling
// import { Stepper, Step } from "react-form-stepper";
import Stepper from 'react-stepper-horizontal';
// import Expired from '../CheckTokenExpier'; //working code for check token expire
import Navlayout from "../../Wa-Frontend/NavLayout";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Authapi from "../../Authapi";



const SuccessPage = () => {
  const navigate = useNavigate();
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


  const [timer, setTimer] = React.useState(3);
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

  const userData = localStorage.getItem("userData");

 console.log(userData);
      const parsedData = JSON.parse(userData);
    //  const username = parsedData.username;
    //  const pass =  parsedData.password;
  
  React.useEffect(() => {
    if (timer === 0) {
      clear();
      // const queryParams = new URLSearchParams({
      //   username: parsedData.username,
      //   password: parsedData.password
      // }).toString();
      // console.log(dynamicHost);
      const dynamicHost = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
      const token = localStorage.getItem("WAauthToken");
      window.location.href = `${dynamicHost}/admin/user/dashboard/?token=${token}`;
      // window.location.href = `http://walara.localhost.com/admin/user/dashboard/?token=${localStorage.getItem("WAauthToken")}`;
            // window.location.href = 'http://walara.localhost.com/admin/xyz'; 

    }
  }, [timer]);

  React.useEffect(() => {
    const checkAccess = async () => {
      try {
        const subscriptionCheck = await Authapi.checkUserSubscription();
        const subscription =
          subscriptionCheck?.subscription ||
          subscriptionCheck?.data?.subscription ||
          subscriptionCheck?.data ||
          null;
        const hasSubscription =
          subscriptionCheck?.hasSubscription === true ||
          subscriptionCheck?.status === true ||
          subscriptionCheck?.data?.hasSubscription === true ||
          (!!subscription && !!subscription.user_id);

        const trialEndsAt =
          subscription?.trial_ends_at ||
          subscription?.trial_end ||
          subscription?.trialEndsAt;
        const endsAt = subscription?.ends_at || subscription?.ended_at;
        const stripeStatus = subscription?.stripe_status || subscription?.status;
        const today = new Date();
        const isTrialActive =
          trialEndsAt &&
          !isNaN(new Date(trialEndsAt).getTime()) &&
          new Date(trialEndsAt) >= today;
        const isStatusActive =
          stripeStatus === "active" ||
          stripeStatus === "trialing" ||
          stripeStatus === "active_trialing";
        const isEnded =
          endsAt && !isNaN(new Date(endsAt).getTime()) && new Date(endsAt) <= today;

        const hasValidSubscription =
          hasSubscription && (isTrialActive || isStatusActive) && !isEnded;

        if (!hasValidSubscription) {
          Swal.fire({
            icon: "warning",
            title: "Access Restricted",
            text: "Please purchase a subscription to continue.",
            confirmButtonText: "OK",
          }).then(() => navigate("/menu/our-products"));
        }
      } catch (subErr) {
        console.error("Subscription check failed:", subErr);
        Swal.fire({
          icon: "error",
          title: "Unable to verify access",
          text: "Please try again after a moment.",
          confirmButtonText: "OK",
        }).then(() => navigate("/menu/our-products"));
      }
    };

    checkAccess();
  }, [navigate]);
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
      {/* <Expired /> //working code for check token expire */}
   
      <div className="company-setup-container abcd mt-5">
        <div className="container stepper-connector-fifth-child stepper-connector">
          <CustomStepper
            steps={steps}
            activeStep={activeStep} />
        </div><br />
        <div className="pro-under-border"></div>
        <div className="p-4 success-container ">
          <img src="/sucsess.png" alt="Success" className="success-image" />
          <h5 className="submittitle"><b>Account Created Successfully !</b></h5>
          {/* <p>Redirecting you in {count} sec </p> */}
          {/* <div className="mt-4">Please wait to be redirected to your Waste Accountant Dashboard : <span className={timer > 5 ? "normal" : "warning"}>{timer}</span></div> */}
          {/* <div>Wait to redirect dashboard : <span className={timer > 5 ? "normal" : "warning"}>{timer}</span></div> */}
          {/* <div className="countdown-timer">
            Wait to redirect dashboard: <span className={timer > 5 ? "normal" : "warning"}>{timer}</span>
        </div> */}

        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
