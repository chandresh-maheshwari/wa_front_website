import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import ls from "local-storage";
import "./Company.css";
// import "./CompanyExtra.css";
import Authapi from "../../Authapi";
// import { StartTokenExpiryCheck } from './components/CheckTokenExpier';
// /import {Expired} from '../CheckTokenExpier';
import Expired from '../CheckTokenExpier';
import Navlayout from "../../Wa-Frontend/NavLayout";



// import { Stepper, Step } from "react-form-stepper";
import Stepper from 'react-stepper-horizontal';


const Company = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    contactNumber: "",
    email: "",
  });
  const [activeStep, setActiveStep] = useState(0);
  const [hasSetupCompleted, setHasSetupCompleted] = useState(false);

  // CODE FOR VALIDATION 26-02-25 START
  const [formErrors, setFormErrors] = useState({
    companyName: "",
    contactName: "",
    contactNumber: "",
    email: "",
  });
  // CODE FOR VALIDATION 26-02-25 END
  const handleStripeCheckoutSuccess = async (sessionId) => {
    console.log("Session ID:", sessionId);

    try {
      const response = await Authapi.stripeCheckoutSuccess(sessionId);
      if (response.status === true) {
        console.log("Session ID stored successfully:", response);
      } else {
        console.error("Failed to store session ID:", response.message || "Unknown error");
        Swal.fire({
          icon: "error",
          title: "Payment Session Error",
          text: `Failed to store session ID: ${response.message || "Unknown error"}`,
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error calling stripeCheckoutSuccess API:", error);
      Swal.fire({
        icon: "error",
        title: "Session ID Error",
        text: "Failed to store payment session information. Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };
  useEffect(() => {
    const authToken = ls.get("WAauthToken");
    // if (!authToken) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Authentication Required",
    //     text: "Please login to continue.",
    //     confirmButtonText: "OK",
    //   }).then(() => {
    //     // navigate("/login");
    //   });
    //   return;
    // }

    const queryParams = new URLSearchParams(location.search);
    const success = queryParams.get("success");
    const sessionId = queryParams.get("session_id");
    const hasShownSuccessMessage = ls.get("hasShownCompanySetupSuccess");

    if (sessionId && success === "true" && !hasShownSuccessMessage) {
      console.log(showForm);
      if (!showForm) {
        setShowForm(true);
      }
      Swal.fire({
        icon: "success",
        title: "Payment Successful!",
        text: "Please complete your company setup below.",
        confirmButtonText: "OK",
      }).then(async () => {
        try {
          await handleStripeCheckoutSuccess(sessionId);
          ls.set("hasShownCompanySetupSuccess", true);
        } catch (error) {
          console.error("Error calling stripeCheckoutSuccess API:", error);
        }
      });
    } else if (success === "true") {
      setShowForm(true);
    } else if (success === "false") {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: "Your payment was not successful. Please try again.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/menu/our-products");
      });
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchDataForCompanyDetail = async () => {
      try {
        const response = await Authapi.getusercompanydetail();
        if (response.status === 200) {
          const company = response.company;
          setFormData({
            companyName: company.company_name || "",
            contactName: company.company_contact_name || "",
            contactNumber: company.company_tel || "",
            email: company.company_email || "",
          });
        }
        else{
          console.log(response.message);
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
        // console.error("aaaaaaaaaaaaaaaaaa", error.response.data.message);
      }
    };

    fetchDataForCompanyDetail();
  }, []);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await Authapi.submitCompanyDetails({
          company_name: formData.companyName,
          company_contact_name: formData.contactName,
          company_email: formData.email,
          company_tel: formData.contactNumber,
        });

        if (response.status === 200) {
          // Save success message to sessionStorage
          sessionStorage.setItem("successMessage", "Company Setup Complete! Your company has been successfully registered.");

          // Redirect to another page
          navigate("/contract");
        } else {
          throw new Error(response.message || "Failed to setup company");
        }
      } catch (error) {
        console.error("Company setup error:", error);
        Swal.fire({
          icon: "error",
          title: "Setup Failed",
          text: error.message || "Failed to setup company. Please try again.",
          confirmButtonText: "OK",
        });
      }
    }




    // NEXT STEP CODE
    // let step = 'step1';

    // const step1 = document.getElementById('step-1');
    // const step2 = document.getElementById('step-2');
    // const step3 = document.getElementById('step-3');
    // const step4 = document.getElementById('step-4');

    // const step1p = document.getElementById('step1_progress');
    // const step2p = document.getElementById('step2_progress');
    // const step3p = document.getElementById('step3_progress');

    //function next() {
    // if (step === 'step1') {
    //   step = 'step2';
    //   step1.classList.remove("is-active");
    //   step1p.css('transform', 'translateX(100%)');
    //   step1p.css('-webkit-transform', 'translateX(100%)');
    //   step1p.classList.add("is-active");
    // } else if (step === 'step2') {
    //   step = 'step3';
    //   step2.classList.remove("is-active");
    //   step2p.css('transform', 'translateX(100%)');
    //   step2p.css('-webkit-transform', 'translateX(100%)');
    //   step3.classList.add("is-active");
    // } else if (step === 'step3') {
    //   step = 'step4';
    //   step3.classList.remove("is-active");
    //   step3p.css('-webkit-transform', 'translateX(100%)');
    //   step4.classList.add("is-active");
    // } else if (step === 'step4') {
    //   step = 'complete';
    //   step4.classList.remove("is-active");
    // }
    // }

  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };


  // CODE FOR VALIDATION 26-02-25 START
  const handleInputChange = (e) => {
    const { name, value } = e.target;


    setFormErrors({ ...formErrors, [name]: "" });


    if (name === "contactNumber") {
      if (/^\d{0,10}$/.test(value)) {
        setFormData({ ...formData, [name]: value });

        if (value.length === 0) {
          setFormErrors({ ...formErrors, contactNumber: "" });
        } else {
          validateForm();
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.companyName) {
      errors.companyName = "Company Name is required";
      isValid = false;
    }

    if (!formData.contactNumber) {
      errors.contactNumber = "Phone Number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      errors.contactNumber = "Phone Number must be exactly 10 digits and only contain numbers";
      isValid = false;
    }

    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is not valid";
      isValid = false;
    }

    if (!formData.contactName) {
      errors.contactName = "Contact  Name is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };
  // CODE FOR VALIDATION 26-02-25 END
  // let step = 'step1';

  // const step1 = document.getElementById('step-1');
  // const step2 = document.getElementById('step-2');
  // const step3 = document.getElementById('step-3');
  // const step4 = document.getElementById('step-4');

  // function next() {
  // if (step === 'step1') {
  //   step = 'step2';
  //   step1.classList.remove("is-active");
  //   $(step1).find('.progress-bar__bar').css('transform','translateX(100%)'); 
  // $(step1).find('.progress-bar__bar').css('-webkit-transform','translateX(100%)');
  //   step2.classList.add("is-active");
  // } else if (step === 'step2') {
  //   step = 'step3';
  //   step2.classList.remove("is-active");
  //   $(step2).find('.progress-bar__bar').css('transform','translateX(100%)');
  //   $(step2).find('.progress-bar__bar').css('-webkit-transform','translateX(100%)');
  //   step3.classList.add("is-active"); 
  // } else if (step === 'step3') {
  //   step = 'step4';
  //   step3.classList.remove("is-active");
  //   $(step3).find('.progress-bar__bar').css('-webkit-transform','translateX(100%)');
  //   step4.classList.add("is-active");
  // } else if (step === 'step4') {
  //   step = 'complete';
  //   step4.classList.remove("is-active");
  // }
  // }



  // function App() {
  const steps = [
    { title: 'Company' },
    { title: 'Contract' },
    { title: 'Depot' },
    { title: 'Vehicle' },
  ];
  const activeStep1 = 0;

  function CustomStepper(props) {
    return (
      <Stepper
        {...props}
        activeColor="#113b4f"
        defaultColor="#eee"
        completeColor="#1e991c"
        activeTitleColor="#113b4f"
        completeTitleColor="#1e991c"
        defaultTitleColor="#bbb"
        circleFontColor="#fff"
        completeBarColor="#1e991c" />
    );
  }
  return (

    <>
    <Navlayout />
      <Expired />
      <h1 className="header">Company</h1>
      <p className="firstcontent">
        Please fill the form below to set up a company! Add as many details as
        required and proceed.
      </p>
      <div className="company-setup-container abcd mb-0">

        {/* Stepper component */}
        {/* <Stepper activeStep={activeStep} onStepClick={handleStepChange}>
          <Step label="Company" />
          <Step label="Contract" />
          <Step label="Depot" />
          <Step label="Vehicle" />
        </Stepper> */}

        {/* <div className="stepper">
            <Stepper
              steps={steps}
              activeStep={activeStep1} />
          </div> */}


        <div className="container stepper-connector">
          <CustomStepper
            steps={steps}
            activeStep={activeStep}
          />
          {/* <div style={{padding: '20px'}}>
        { getSectionComponent()  }
        { (activeStep !== 0 && activeStep !== steps.length - 1)
            && <button onClick={ () => setActiveStep(activeStep - 1) }>Previous</button>
        }
        { activeStep !== steps.length - 1
          && <button onClick={ () => setActiveStep(activeStep + 1) }>Next</button>
        } */}
        </div>
        {/* </div> */}
        

        {/* <div class="container-fluid">
          <br /><br />
          <ul class="list-unstyled multi-steps">
            <li id="step-1" class="is-active">
              <div class="progress-bar progress-bar--success">
                <div className="progress-bar__bar" id="step1_progress"></div>
              </div>
            </li>
            <li id="step-2">First Step
              <div class="progress-bar progress-bar--success">
                <div class="progress-bar__bar" id="step2_progress"></div>
              </div>
            </li>
            <li id="step-3">Middle Stage
              <div class="progress-bar progress-bar--success">
                <div class="progress-bar__bar" id="step3_progress"></div>
              </div>
            </li>
            <li id="step-4">Finish</li>
          </ul>
        </div> */}


          <br />
        <div className="pro-under-border"></div>

        <div className="steps-content mt-3">
          {activeStep === 0 && showForm && (
            <div className="p-4 content ">
              <h5 className="title">Company details</h5>
              <p className="description">
                Please fill your information so we can get in touch with you.
              </p>
              <form onSubmit={handleSubmit} className="company-form">
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label className="label" htmlFor="companyName">
                      Company Name
                    </label>
                    <input
                      type="text"
                      className={`form-control company ${formErrors.companyName ? "is-invalid" : ""}`}
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      placeholder="Company Name"
                    />
                    {formErrors.companyName && (
                      <div className="invalid-feedback">{formErrors.companyName}</div>
                    )}
                  </div>
                  <div className="form-group col-md-6">
                    <label className="label" htmlFor="email">
                      Company Email
                    </label>
                    <input
                      type="email"
                      className={`form-control company ${formErrors.email ? "is-invalid" : ""}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Company Email"
                    />
                    {formErrors.email && (
                      <div className="invalid-feedback">{formErrors.email}</div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label className="label" htmlFor="contactNumber">
                      Company Telephone
                    </label>
                    <input
                      type="tel"
                      className={`form-control company ${formErrors.contactNumber ? "is-invalid" : ""}`}
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="Company Telephone"
                    />
                    {formErrors.contactNumber && (
                      <div className="invalid-feedback">{formErrors.contactNumber}</div>
                    )}
                  </div>
                  <div className="form-group col-md-6">
                    <label className="label" htmlFor="contactName">
                      Company Contact Name
                    </label>
                    <input
                      type="text"
                      className={`form-control company ${formErrors.contactName ? "is-invalid" : ""}`}
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      required
                      placeholder="Company Contact Name"
                    />
                    {formErrors.contactName && (
                      <div className="invalid-feedback">{formErrors.contactName}</div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}

          {activeStep === 1 && (
            <div>
              <h5>Step 2 Content</h5>
            </div>
          )}
        </div>
      </div>

      {/* <button
        type="button"
        onClick={handleSubmit}
        className="btn next btn-primary"
      >
        Next Step
      </button> */}
      <div className=" company-setup-container mt-1">
        <button
          type="button"
          onClick={handleSubmit}
          className="btn next btn-primary"
        >
          Next Step
        </button>
      </div>
    </>
  );
};

export default Company;