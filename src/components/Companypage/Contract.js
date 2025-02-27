import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Company.css";
import Authapi from "../../Authapi";
import Swal from "sweetalert2";
import { Stepper, Step } from "react-form-stepper";
import "./Contract.css";

const Contract = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    companyName: "",
    contractName: "",
    companyId: "",
    contractId: "",
  });
  const [formErrors, setFormErrors] = useState({
    companyName: "",
    contractName: "",
  });

  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchContractDetails = async () => {
  //     try {
  //       const response = await Authapi.getLatestContractDetails();
  //       if (response.status === true) {
  //         setFormData((prev) => ({
  //           ...prev,
  //           contractName: response.contract.contract_name || "",
  //           contractId: response.contract.id || "",
  //         }));
  //       }
  //     } catch (error) {
  //       console.error("Error fetching contract details:", error);
  //     }
  //   };
  //   fetchContractDetails();   
  // }, []);

  useEffect(() => {
    const message = sessionStorage.getItem("successMessage");
    if (message) {
      setSuccessMessage(message);
      // Clear the message after it's displayed
      sessionStorage.removeItem("successMessage");

      // Remove the success message after 30 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 10000); // 30 seconds timeout
    }
    const fetchContractDetails = async () => {
      try {
        const response = await Authapi.getLatestContractDetails();
        console.log("API Response:", response);
        console.log("Contract Name:", response.contract.contract_name);
        console.log("Contract ID:", response.contract.id);
        if (response.status === true) {
          setFormData((prev) => ({
            ...prev,
            contractName: response.contract.contract_name || "",
            contractId: response.contract.id || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching contract details:", error);
      }
    };
    fetchContractDetails();
  }, []);


  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await Authapi.getLatestCompanyDetails();
        if (response.status === "success") {
          setFormData((prev) => ({
            ...prev,
            companyName: response.data.company_name || "",
            companyId: response.data.company_id || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    const fetchContractDetails = async () => {
      try {
        const response = await Authapi.getLatestContractDetails();
        if (response.status === "success") {
          setFormData((prev) => ({
            ...prev,
            contractName: response.contract.contract_name || "",
            contractId: response.contract.id || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching contract details:", error);
      }
    };

    fetchCompanyDetails();
    fetchContractDetails();
  }, []);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errors = { ...formErrors };
    switch (name) {
      case "companyName":
        errors.companyName = value ? "" : "Company name is required";
        break;
      case "contractName":
        errors.contractName = value ? "" : "Contract name is required";
        break;
      default:
        break;
    }
    setFormErrors(errors);
    // checkFormValidity();
  };





  const handleSubmit = async (e) => {
    e.preventDefault();
    validateField("companyName", formData.companyName);
    validateField("contractName", formData.contractName);
    if (formErrors.companyName || formErrors.contractName || !formData.companyName || !formData.contractName) {
      return;
    }
    try {
      const response = await Authapi.submitContractDetails({
        company_id: formData.companyId,
        company_name: formData.companyName,
        contract_name: formData.contractName,
        contract_id: formData.contractId,
      });

      if (response.status === 200) {
        // await Swal.fire({
        //   icon: "success",
        //   title: "Contract Setup Complete",
        //   text: "Your contract has been successfully registered.",
        //   confirmButtonText: "OK",
        // });
        sessionStorage.setItem("successMessage", "Contract Setup Complete! Your Contract has been successfully registered.");

        navigate("/depot");
      } else {
        throw new Error(response.message || "Failed to setup contract");
      }
    } catch (error) {
      console.error("Contract setup error:", error);
      Swal.fire({
        icon: "error",
        title: "Setup Failed",
        text: error.message || "Failed to setup contract. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  // const handlePreviousClick = () => {
  //   const fetchCompanyData = async () => {
  //     try {
  //       const response = await Authapi.getusercompanydetail(); 
  //       // console.log(response)
  //       if (response.status === 200 && response.company) {
  //       setFormData({
  //         companyName: response.company.company_name || "",
  //         companyId: response.company.company_contact_name || "",
  //         contractName: "",
  //         contractId: "",
  //       });

  //       } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: response.message || "Failed to fetch company data. Please try again.",
  //         confirmButtonText: "OK",
  //       });
  //       }
  //     } catch (error) {
  //     console.error("Error fetching company data:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "An error occurred while fetching company data.",
  //       confirmButtonText: "OK",
  //     });
  //     }
  //   };

  //   fetchCompanyData();
  // navigate("/company");

  // };


  // const handlePreviousClick = async () => {
  //   try {
  //     const response = await Authapi.getusercompanydetail(); 
  //     // Check if the API response contains company data
  //     if (response.status === 200 && response.company) {
  //       setFormData({
  //         companyName: response.company.company_name || "",
  //         contactName: response.company.company_contact_name || "",
  //         contactNumber: response.company.company_tel || "",
  //         email: response.company.company_email || "",
  //       });
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: response.message || "Failed to fetch company data. Please try again.",
  //         confirmButtonText: "OK",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching company data:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "An error occurred while fetching company data.",
  //       confirmButtonText: "OK",
  //     });
  //   }
  //   navigate("/company");
  // };



  const handlePreviousClick = async () => {
    try {
      const response = await Authapi.getusercompanydetail();

      if (response.status === 200 && response.company) {
        console.log(response.company.company_contact_name);

        navigate("/company", {
          state: {
            formData: {
              companyName: response.company.company_name || "",
              contactName: response.company.company_contact_name || "",
              contactNumber: response.company.company_tel || "",
              email: response.company.company_email || "",
            },
          },
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message || "Failed to fetch company data. Please try again.",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while fetching company data.",
        confirmButtonText: "OK",
      });
    }
  };



  // const handleNextClick = async () => {
  //   try {
  //     await handleSubmit();
  //     setActiveStep(2);
  //   } catch (error) {
  //     console.error("Error advancing to next step:", error);
  //   }
  // };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <>
      <h2 className="header">Contract</h2>
      <p className="firstcontent">
        Please fill the form below to set up a Contract! Add as many details as
        required and proceed.
      </p>
      <div className="container mb-0">
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}
      </div>
      <div className="container abcd mt-5">
        <Stepper activeStep={activeStep} onStepClick={handleStepChange}>
          <Step label="Company" />
          <Step label="Contract" />
          <Step label="Depot" />
          <Step label="Vehicle" />
        </Stepper>
        <div className="pro-under-border"></div>

        <div className="p-4 content">
          <h5 className="title">Contract details</h5>
          <p className="description">
            Please fill your information so we can get in touch with you.
          </p>
          <form >
            <div className="form-group col-md-6">
              <label className="label" htmlFor="companyName">
                Company
              </label>
              <input
                type="text"
                className={`form-control company ${formErrors.companyName ? "is-invalid" : ""}`}
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                disabled
                placeholder="Company"
              />
              {formErrors.companyName && (
                <div className="invalid-feedback">{formErrors.companyName}</div>
              )}
            </div>
            <div className="form-group col-md-6">
              <label className="label" htmlFor="contractName">
                Contract Name
              </label>
              <input
                type="text"
                className={`form-control company ${formErrors.contractName ? "is-invalid" : ""}`}
                id="contractName"
                name="contractName"
                value={formData.contractName}
                onChange={handleInputChange}
                placeholder="Contract Name"
              />
              {formErrors.contractName && (
                <div className="invalid-feedback">{formErrors.contractName}</div>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-6">
            <button
              type="button"
              className="btn btn-secondary formbtn"
              onClick={handlePreviousClick}
            >
              Previous step
            </button>
          </div>
          <div className="col-6">
            <button
              type="button"
              className="btn next btn-primary formbtn"
              onClick={handleSubmit}
            >
              Next step
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contract;





