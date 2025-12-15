import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Company.css";
import Authapi from "../../Authapi";
import Swal from "sweetalert2";
// import { Stepper, Step } from "react-form-stepper";
import "./Contract.css";
import Stepper from 'react-stepper-horizontal';
// import Expired from '../CheckTokenExpier'; //working code for check token expire
import Navlayout from "../../Wa-Frontend/NavLayout";
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
// Using a simple Bootstrap spinner to avoid multiple overlapping loaders


const Contract = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    companyName: "",
    contractName: "",
    companyId: "",
    contractId: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // submit loader
  const [initialLoading, setInitialLoading] = useState(true); // page-load loader


  // Add Code For loader 
  const Loader = () => (
    <div className="loader-overlay single-loader">
      <div className="spinner-border text-primary" role="status" aria-label="Loading" />
    </div>
  );

  // useEffect(() => {
  //   const message = sessionStorage.getItem("successMessage");
  //   if (message) {
  //     setSuccessMessage(message);
  //     // Clear the message after it's displayed
  //     sessionStorage.removeItem("successMessage");

  //     // Remove the success message after 30 seconds
  //     setTimeout(() => {
  //       setSuccessMessage("");
  //     }, 50000); // 30 seconds timeout
  //   }
  //   const fetchContractDetails = async () => {
  //     try {
  //       const response = await Authapi.getLatestContractDetails();
  //       if (response.status === true) {
  //         setFormData((prev) => ({
  //           ...prev,
  //           contractName: response.contract.contract_name || "",
  //           companyId: response.contract.company_id || "",
  //           companyName: response.contract.company_name || "",
  //           contractId: response.contract.id || "",
  //         }));
  //       }
  //     } catch (error) {
  //       console.error("Error fetching contract details:", error);
  //     }
  //   };
  //   fetchContractDetails();
  // }, []);




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: "" }); // Clear the error for that field
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const applyCompany = (res) => {
        const companyData =
          res?.data?.data ||
          res?.data?.company ||
          res?.data ||
          res?.company ||
          res;

        const isOk =
          res?.status === "success" ||
          res?.status === true ||
          res?.status === 200 ||
          !!companyData;

        if (!isOk || !companyData) return false;

        if (!isMounted) return false;

        setFormData((prev) => ({
          ...prev,
          companyName:
            companyData.company_name ||
            companyData.companyName ||
            companyData.name ||
            prev.companyName,
          companyId:
            companyData.id ||
            companyData.company_id ||
            companyData.companyId ||
            prev.companyId,
        }));
        return true;
      };

      try {
        const message = sessionStorage.getItem("successMessage");
        if (message) {
          setSuccessMessage(message);
          sessionStorage.removeItem("successMessage");
          setTimeout(() => {
            if (isMounted) setSuccessMessage("");
          }, 10000);
        }

        const [contractRes, latestCompanyRes, fallbackCompanyRes] = await Promise.allSettled([
          Authapi.getLatestContractDetails(),
          Authapi.getLatestCompanyDetails(),
          Authapi.getusercompanydetail(),
        ]);

        if (contractRes.status === "fulfilled") {
          const res = contractRes.value;
          if (res?.status === true || res?.status === "success" || res?.status === 200) {
            if (isMounted) {
              setFormData((prev) => ({
                ...prev,
                contractName: res.contract?.contract_name || prev.contractName,
                contractId: res.contract?.id || prev.contractId,
                companyId: res.contract?.company_id || prev.companyId,
                companyName: res.contract?.company_name || prev.companyName,
              }));
            }
          }
        } else {
          console.error("Error loading contract:", contractRes.reason);
        }

        // try primary then fallback
        if (latestCompanyRes.status === "fulfilled") {
          const applied = applyCompany(latestCompanyRes.value);
          if (!applied && fallbackCompanyRes.status === "fulfilled") {
            applyCompany(fallbackCompanyRes.value);
          }
        } else if (fallbackCompanyRes.status === "fulfilled") {
          applyCompany(fallbackCompanyRes.value);
        } else {
          console.error("Error loading company:", latestCompanyRes.reason || fallbackCompanyRes.reason);
        }
      } catch (e) {
        console.error("Error loading data:", e);
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);




  const validateForm = () => {
    const newErrors = {};
    // console.log(formData);

    if (!formData.companyName) {
      newErrors.companyName = "companyName is required.";
    }

    if (!formData.contractName) {
      newErrors.contractName = "contractName is required.";
    }

    setErrors(newErrors); // Set all errors
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      // console.log(formData);
      // console.log(formData.companyId);
      const response = await Authapi.submitContractDetails({
        company_id: formData.companyId,
        company_name: formData.companyName,
        contract_name: formData.contractName,
        contract_id: formData.contractId,
      });

      if (response.status === 200) {
        setLoading(false);
        // await Swal.fire({
        //   icon: "success",
        //   title: "Contract Setup Complete",
        //   text: "Your contract has been successfully registered.",
        //   confirmButtonText: "OK",
        // });
        sessionStorage.setItem("successMessage", "Contract Setup Complete! Your Contract has been successfully registered.");

        navigate("/depot");
      } else {
        setLoading(false);
        throw new Error(response.message || "Failed to setup contract");
      }
    } catch (error) {
      setLoading(false);
      console.error("Contract setup error:", error);
      Swal.fire({
        icon: "error",
        title: "Setup Failed",
        text: error.message || "Failed to setup contract. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  const handlePreviousClick = async () => {
    try {
      const response = await Authapi.getusercompanydetail();

      if (response.status === 200 && response.company) {
        // console.log("API Response:", response.company); // Debugging log

        navigate("/company", {
          state: {
            formData: {
              companyName: response.company.company_name || "",
              contactName: response.company.company_contact_name || "",
              contactNumber: response.company.company_tel || "",
              email: response.company.company_email || "",
              postcode: response.company.company_postcode || "", // Ensure this is correct
              sicCode: response.company.sic_code || "",
              addressLine1: response.company.company_address_1 || "",
              addressLine2: response.company.company_address_2 || "",
              addressLine3: response.company.company_address_3 || "",
              addressLine4: response.company.company_address_4 || "",
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

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const connectorStyleConfig = {
    activeColor: '#4caf50', // Green color for completed steps
    completedColor: '#4caf50', // Green color for completed steps
    disabledColor: '#ccc', // Default color for incomplete steps
  };

  const steps = [
    { title: 'Company' },
    { title: 'Contract' },
    { title: 'Depot' },
    { title: 'Site' },
  ];
  const activeStep1 = 1;

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
        completeBarColor="#1e991c"
        activeStepClassName="active-step"

      />
    );
  }
  return (
    <>
      <Navlayout />
      {/* <Expired /> //working code for check token expire */}
      {(loading || initialLoading) && <Loader />}

      <div className="container mb-0 mt-5">
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}
      </div>
      <div className=" company-setup-container abcd mb-0">
        <div className="container stepper-connector">
          <CustomStepper
            steps={steps}
            activeStep={activeStep} />
        </div><br />



        {/* <Stepper steps={ [{title: 'Step One'}, {title: 'Step Two'}, {title: 'Step Three'}, {title: 'Step Four'}] } activeStep={ 1 } /> */}

        <div className="pro-under-border"></div>

        <div className="p-4 content">
          <h5 className="title">Contract Details</h5>
          <p className="description">
            Please complete all sections.
          </p>
          <form >
            <div className="form-group col-md-6">
              <div className="input-with-icon">
                <label className="label" htmlFor="companyName">
                  Company
                </label>
                <Tooltip title="Select your company from the drop down menu" arrow>
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="info-icon"
                  />
                </Tooltip>
              </div>
              <div className="field">
                <input
                  type="text"
                  className='form-control company'
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  disabled
                // placeholder="Company"
                />
                {/* {console.log(formErrors)}  */}
                {/* {formErrors.companyName && (
                    <div className="invalid-feedback">{formErrors.companyName}</div>
                  )} */}
                {errors.companyName && <small className="text-danger">{errors.companyName}</small>}
              </div>
            </div>
            <div className="form-group col-md-6">
              <div className="input-with-icon">
                <label className="label" htmlFor="contractName">
                  Contract Name
                </label>
                <Tooltip title="Add the name of the contract that you are adding data to" arrow>
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="info-icon"
                  />
                </Tooltip>
              </div>
              <div className="field">
                <input
                  type="text"
                  className='form-control company'
                  id="contractName"
                  name="contractName"
                  value={formData.contractName}
                  onChange={handleInputChange}
                // placeholder="Contract Name"
                />
                {/* {formErrors.contractName && (
                    <div className="invalid-feedback">{formErrors.contractName}</div>
                  )} */}
                {errors.contractName && <small className="text-danger">{errors.contractName}</small>}
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className=" company-setup-container mt-0 ">
        <button
          type="button"
          className="btn btn-secondary prevbtn"
          onClick={handlePreviousClick}>
          <Tooltip title="Click 'Previous' to go back and Update your company details." arrow>
            <span>Previous Step</span>
          </Tooltip>
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="btn next btn-primary"
        ><Tooltip title="Click 'Submit' to save your contract details." arrow>
            <span>Next Step</span>
          </Tooltip></button>
      </div>

    </>
  );
};

export default Contract;





