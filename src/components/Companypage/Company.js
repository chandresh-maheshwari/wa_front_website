import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import ls from "local-storage";
import "./Company.css";
import Authapi from "../../Authapi";

import { Stepper, Step } from "react-form-stepper";

const Company = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    contactNumber: "",
    email: "",
  });
  const [activeStep, setActiveStep] = useState(0);
  const [hasSetupCompleted, setHasSetupCompleted] = useState(false);

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
    if (!authToken) {
      Swal.fire({
        icon: "error",
        title: "Authentication Required",
        text: "Please login to continue.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    const queryParams = new URLSearchParams(location.search);
    const success = queryParams.get("success");
    const sessionId = queryParams.get("session_id");
    const hasShownSuccessMessage = ls.get("hasShownCompanySetupSuccess");

    if (sessionId && success === "true" && !hasShownSuccessMessage) {
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
    const fetchData = async () => {
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
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Authapi.submitCompanyDetails({
        company_name: formData.companyName,
        company_contact_name: formData.contactName,
        company_email: formData.email,
        company_tel: formData.contactNumber,
      });

      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Company Setup Complete",
          text: "Your company has been successfully registered.",
          confirmButtonText: "OK",
        });
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
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <>
      <h1 className="header">Company</h1>
      <p className="firstcontent">
        Please fill the form below to set up a company! Add as many details as
        required and proceed.
      </p>
      <div className="company-setup-container abcd">
        {/* Stepper component */}
        <Stepper activeStep={activeStep} onStepClick={handleStepChange}>
          <Step label="Step 1" />
          <Step label="Step 2" />
          <Step label="Step 3" />
          <Step label="Step 4" />
        </Stepper>
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
                      className="form-control company"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      placeholder="Company Name"
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label className="label" htmlFor="email">
                      Company Email
                    </label>
                    <input
                      type="email"
                      className="form-control company"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Company Email"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label className="label" htmlFor="contactNumber">
                      Company Telephone
                    </label>
                    <input
                      type="tel"
                      className="form-control company"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="Company Telephone"
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label className="label" htmlFor="contactName">
                      Company Contact Name
                    </label>
                    <input
                      type="text"
                      className="form-control company"
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      required
                      placeholder="Company Contact Name"
                    />
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

      <button
        type="button"
        onClick={handleSubmit}
        className="btn next btn-primary"
      >
        Next Step
      </button>
    </>
  );
};

export default Company;