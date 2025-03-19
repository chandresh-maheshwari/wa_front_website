import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import ls from "local-storage";
import "./Company.css";
import Tooltip from '@mui/material/Tooltip';

import customSelectStyles from "../../CustomSelectStyles";
import Authapi from "../../Authapi";

import Expired from "../CheckTokenExpier";
import Navlayout from "../../Wa-Frontend/NavLayout";
// import Tooltip from "@mui/material/Tooltip";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

// import { Stepper, Step } from "react-form-stepper";
import Stepper from "react-stepper-horizontal";
import Select from "react-select";



const Company = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    companyName: "",
    contractName: "",
    contactNumber: "",
    email: "",
    postcode: "",
    mainIndustry: null,
    mainActivity: null,
    subActivity: null,
    sicCode: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    addressLine4: "",
  });
  const [activeStep, setActiveStep] = useState(0);
  const [hasSetupCompleted, setHasSetupCompleted] = useState(false);
  const [mainIndustryOptions, setMainIndustryOptions] = useState([]);
  const [mainActivityOptions, setMainActivityOptions] = useState([]);
  const [subActivityOptions, setSubActivityOptions] = useState([]);

  // CODE FOR VALIDATION 26-02-25 START
  const [formErrors, setFormErrors] = useState({
    companyName: "",
    contractName: "",
    contactNumber: "",
    email: "",
    postcode: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    addressLine4: "",
  });
  // CODE FOR VALIDATION 26-02-25 END
  const handleStripeCheckoutSuccess = async (sessionId) => {
    // console.log("Session ID:", sessionId);

    try {
      const response = await Authapi.stripeCheckoutSuccess(sessionId);
      if (response.status === true) {
        // console.log("Session ID stored successfully:", response);
      } else {
        console.error(
          "Failed to store session ID:",
          response.message || "Unknown error"
        );
        Swal.fire({
          icon: "error",
          title: "Payment Session Error",
          text: `Failed to store session ID: ${response.message || "Unknown error"
            }`,
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

    const queryParams = new URLSearchParams(location.search);
    const success = queryParams.get("success");
    const sessionId = queryParams.get("session_id");
    const hasShownSuccessMessage = ls.get("hasShownCompanySetupSuccess");

    if (sessionId && success === "true" && !hasShownSuccessMessage) {
      // console.log(showForm);
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
            contractName: company.company_contact_name || "",
            postcode: company.company_postcode || "",
            addressLine1: company.company_address_1 || "",
            addressLine2: company.company_address_2 || "",
            addressLine3: company.company_address_3 || "",
            addressLine4: company.company_address_4 || "",
            contactNumber: company.company_tel || "",
            email: company.company_email || "",
            companyActive: company.company_active || "",
          });
        } else {
          console.log(response.message);
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    fetchDataForCompanyDetail();
  }, []);

  useEffect(() => {
    // Check if formData is passed in location.state
    if (location.state && location.state.formData) {
      setFormData((prevData) => ({
        ...prevData,
        ...location.state.formData, // Update formData with values from navigation state
      }));
    }
  }, [location.state]);

  useEffect(() => {
    const fetchMainIndustryOptions = async () => {
      try {
        const data = await Authapi.mainIndustry();
        const options = data.map((industry) => ({
          value: industry.id,
          label: industry.name,
        }));
        setMainIndustryOptions(options);
      } catch (error) {
        console.error("Error fetching main industry options:", error);
      }
    };

    fetchMainIndustryOptions();
  }, []);

  const handleMainIndustryChange = async (selected) => {
    setFormData({
      ...formData,
      mainIndustry: selected,
      mainActivity: null,
      subActivity: null,
    });
    setMainActivityOptions([]);
    setSubActivityOptions([]);

    try {
      const data = await Authapi.getMainActivity(selected.value);
      const options = data.map((activity) => ({
        value: activity.id,
        label: activity.name,
      }));
      setMainActivityOptions(options);
    } catch (error) {
      console.error("Error fetching main activities:", error);
    }
  };

  const handleMainActivityChange = async (selected) => {
    setFormData({ ...formData, mainActivity: selected, subActivity: null });
    setSubActivityOptions([]);

    try {
      const data = await Authapi.getSubActivity(selected.value);
      const options = data.map((subActivity) => ({
        value: subActivity.id,
        label: subActivity.name,
        sic_code: subActivity.sic_code,
      }));
      setSubActivityOptions(options);
    } catch (error) {
      console.error("Error fetching sub activities:", error);
    }
  };

  const handleSubActivityChange = (selected) => {
    setFormData({
      ...formData,
      subActivity: selected,
      sicCode: selected ? selected.sic_code : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // console.log("FormData before navigation:", formData); // Debugging log
      try {
        const response = await Authapi.submitCompanyDetails({
          company_name: formData.companyName,
          company_contact_name: formData.contractName,
          company_email: formData.email,
          company_tel: formData.contactNumber,
          company_postcode: formData.postcode,
          company_active: formData.companyActive ? 1 : 0,
          sic_code: formData.sicCode,
          company_address_1: formData.addressLine1,
          company_address_2: formData.addressLine2,
          company_address_3: formData.addressLine3,
          company_address_4: formData.addressLine4,
        });

        if (response.status === 200) {
          sessionStorage.setItem(
            "successMessage",
            "Company Setup Complete! Your company has been successfully registered."
          );

          navigate("/contract", {
            state: { formData },
          });
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
          setFormErrors({
            ...formErrors,
            contactNumber: "Phone Number is required",
          });
        } else if (value.length !== 10) {
          setFormErrors({
            ...formErrors,
            contactNumber: "Phone Number must be exactly 10 digits",
          });
        } else {
          setFormErrors({ ...formErrors, contactNumber: "" });
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
    // if (!formData.companyActive) {
    //   errors.companyActive = "You must confirm the company is active";
    //   isValid = false;
    // }
    // if (!formData.contactNumber) {
    //   errors.contactNumber = "Phone Number is required";
    //   isValid = false;
    // } else if (!/^\d{0,10}$/.test(formData.contactNumber)) {
    //   errors.contactNumber =
    //     "Phone Number must be exactly 10 digits and only contain numbers";
    //   isValid = false;
    // }
    // console.log("Postcode during validation:", formData.postcode);
    // if (!formData.contactNumber) {
    //   errors.contactNumber = "Phone Number is required";
    //   isValid = false;
    // } else if (!/^\d{0,10}$/.test(formData.contactNumber)) {
    //   errors.contactNumber =
    //     "Phone Number must be exactly 10 digits and only contain numbers";
    //   isValid = false;
    // }


    if (!formData.contactNumber) {
      errors.contactNumber = "Company Telephone is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      errors.contactNumber = "Company Telephone must be 10 digits.";
      isValid = false;
    }
    if (!formData.postcode) {
      errors.postcode = "Company Postcode is required";
      isValid = false;
    // } else if (!/^.{1,6}$/.test(formData.postcode)) {
    //   errors.postcode = "Postcode must be up to 6 characters";
    //   isValid = false;
    }
    if (!formData.email) {
      errors.email = "Company Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Company Email is not valid";
      isValid = false;
    }

    if (!formData.contractName) {
      errors.contractName = "Company Contract Name is required";
      isValid = false;
    }

    if (!formData.companyActive) {
      errors.companyActive = "You must confirm the company is active";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const steps = [
    { title: "Company" },
    { title: "Contract" },
    { title: "Depot" },
    { title: "Vehicle" },
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
        completeBarColor="#1e991c"
      />
    );
  }

  const isSicCodeVisible =
    formData.mainIndustry && formData.mainActivity && formData.subActivity;

  return (
    <>
      <Navlayout />
      <Expired />
      {/* <h1 className="header">Company</h1>
      <p className="firstcontent">
        Please fill the form below to set up a company! Add as many details as
        required and proceed.
      </p> */}
      <div className="company-setup-container abcd mb-0 mt-5">
        <div className="container stepper-connector">
          <CustomStepper steps={steps} activeStep={activeStep} />
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
              <h5 className="title">Company Details</h5>
              <p className="description">
                Please fill your information so we can get in touch with you.
              </p>

              <form onSubmit={handleSubmit} className="company-form">
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label className="label" htmlFor="companyName">
                      Company Name
                    </label>
                    <div className="input-with-icon">
                      <Tooltip title="Add your company name" arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                      <div className="field">
                        <input
                          type="text"
                          className={`form-control company ${formErrors.companyName ? "is-invalid" : ""
                            }`}
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          required
                          placeholder="Company Name"
                        />
                        {formErrors.companyName && (
                          <div className="invalid-feedback">
                            {formErrors.companyName}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group col-md-6 mb-4">
                    <label className="label" htmlFor="mainIndustry">
                      Company's Main Industry
                    </label>
                    <div className="input-with-icon">
                      <Tooltip title="Select your company's main industry." arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                      <div className="field">
                        <Select
                          className="searchable_dropdown"
                          options={mainIndustryOptions}
                          value={formData.mainIndustry}
                          onChange={handleMainIndustryChange}
                          placeholder="Select Main Industry"
                          isSearchable
                          styles={customSelectStyles}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6  mb-4">
                    <label className="label" htmlFor="mainActivity">
                      Company's Main Activity
                    </label>
                    <div className="input-with-icon">
                      <Tooltip title="Select your company's main activity from the drop-down menu" arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                      <div className="field">
                        <Select
                          className="searchable_dropdown"
                          options={mainActivityOptions}
                          value={formData.mainActivity}
                          onChange={handleMainActivityChange}
                          placeholder="Select Main Activity"
                          isSearchable
                          isDisabled={!formData.mainIndustry}
                          styles={customSelectStyles}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group col-md-6 mb-4">
                    <label className="label" htmlFor="subActivity">
                      Company's Sub Activity
                    </label>
                    <div className="input-with-icon">
                      <Tooltip title="This can be found on the Companies House website, under Nature of Business (SIC)" arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                      {/* <Select
                      className="form-control company"
                      options={subActivityOptions}
                      value={formData.subActivity}
                      onChange={handleSubActivityChange}
                      placeholder="Select Sub Activity"
                      isSearchable
                      isDisabled={!formData.mainActivity}
                     
                    /> */}
                      <div className="field">
                        <Select
                          className="searchable_dropdown"
                          options={subActivityOptions}
                          value={formData.subActivity}
                          onChange={handleSubActivityChange}
                          placeholder="Select Sub Activity"
                          isSearchable
                          isDisabled={!formData.mainActivity}
                          styles={customSelectStyles} // Apply styles
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {isSicCodeVisible && (
                  <div className="form-group col-md-6">
                    <label className="label">Company's SIC Code :</label>
                    <div className="input-with-icon">
                      <Tooltip title="Select your company's main industry." arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                      <div className="field">
                        <input
                          type="text"
                          className="form-control company"
                          id="sicCode"
                          name="sicCode"
                          value={formData.sicCode}
                          disabled
                          placeholder="Company's SIC Code"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label className="label" htmlFor="contractName">
                      Company Contact Name
                    </label>
                    <div className="input-with-icon">
                      <Tooltip title="Add the name of the main contact" arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                      <div className="field">
                        <input
                          type="text"
                          className={`form-control company ${formErrors.contractName ? "is-invalid" : ""
                            }`}
                          id="contractName"
                          name="contractName"
                          value={formData.contractName}
                          onChange={handleInputChange}
                          required
                          placeholder="Company Contact Name"
                        />
                        {formErrors.contractName && (
                          <div className="invalid-feedback">
                            {formErrors.contractName}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group col-md-6">
                    <label className="label">Company Postcode</label>
                    <div className="input-with-icon">
                      <Tooltip title="Please add the postcode for your company's registered office, that appears on the Companies House website." arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                      <div className="field">
                        <input
                          type="text"
                          className={`form-control company ${formErrors.postcode ? "is-invalid" : ""
                            }`}
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleInputChange}
                          required
                          placeholder="Company Postcode"
                        />
                        {formErrors.postcode && (
                          <div className="invalid-feedback">
                            {formErrors.postcode}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label className="label">Address Line 1</label>
                    <div className="input-with-icon">
                      <Tooltip title="Please add the full address for your company's registered office, that appears on the Companies House website." arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                      <div className="field">
                        <input
                          type="text"
                          className="form-control company"
                          name="addressLine1"
                          value={formData.addressLine1}
                          onChange={handleInputChange}
                          required
                          placeholder="Address Line 1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group col-md-6">
                    <label className="label">Address Line 2</label>
                    <div className="input-with-icon">
                      <Tooltip title="Please add the full address for your company's registered office, that appears on the Companies House website." arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                      <div className="field">
                      <input
                        type="text"
                        className="form-control company"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleInputChange}
                        required
                        placeholder="Address Line 2"
                      />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label className="label">Address Line 3</label>
                    <div className="input-with-icon">
                      <Tooltip title="Please add the full address for your company's registered office, that appears on the Companies House website." arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                      <div className="field">
                      <input
                        type="text"
                        className="form-control company"
                        name="addressLine3"
                        value={formData.addressLine3}
                        onChange={handleInputChange}
                        required
                        placeholder="Address Line 3"
                      />
                      </div>
                    </div>
                  </div>
                  <div className="form-group col-md-6">
                    <label className="label">Address Line 4</label>
                    <div className="input-with-icon">
                      <Tooltip title="Please add the full address for your company's registered office, that appears on the Companies House website." arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                      <div className="field">
                      <input
                        type="text"
                        className="form-control company"
                        name="addressLine4"
                        value={formData.addressLine4}
                        onChange={handleInputChange}
                        required
                        placeholder="Address Line 4"
                      />
                    </div>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label className="label" htmlFor="contactNumber">
                      Company Telephone
                    </label>
                    <div className="input-with-icon">
                      <Tooltip title="Add the number of the main contact in your company." arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                      <div className="field">
                      <input
                        type="tel"
                        className={`form-control company ${formErrors.contactNumber ? "is-invalid" : ""
                          }`}
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        required
                        placeholder="Company Telephone"
                      />
                      {formErrors.contactNumber && (
                        <div className="invalid-feedback">
                          {formErrors.contactNumber}
                        </div>
                      )}
                    </div>
                    </div>
                  </div>

                  <div className="form-group col-md-6">
                    <label className="label" htmlFor="email">
                      Company Email
                    </label>
                    <div className="input-with-icon">
                      <Tooltip
                        title="Add the email address of the main contact in your company."
                        arrow
                      >
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                      <div className="field">
                      <input
                        type="email"
                        className={`form-control company ${formErrors.email ? "is-invalid" : ""
                          }`}
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
                  </div>
                </div>

                <div className="form-row">
                  {/* <div className="form-group col-md-6">
                    <label className="label" htmlFor="contactNumber">
                      Company Telephone
                    </label>
                    <div className="input-with-icon">
                      <Tooltip
                        title="Add the number of the main contact in your company."
                        arrow
                      >
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                      <input
                        type="tel"
                        className={`form-control company ${
                          formErrors.contactNumber ? "is-invalid" : ""
                        }`}
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        required
                        placeholder="Company Telephone"
                      />
                    </div>
                    {formErrors.contactNumber && (
                      <div className="invalid-feedback">
                        {formErrors.contactNumber}
                      </div>
                    )}
                  </div> */}
                  {/* <div className="form-group col-md-6">
                    <label className="label" htmlFor="contractName">
                      Company Contact Name
                    </label>
                    <div className="input-with-icon">
                      <Tooltip title="Add the name of the main contact" arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                      <input
                        type="text"
                        className={`form-control company ${
                          formErrors.contractName ? "is-invalid" : ""
                        }`}
                        id="contractName"
                        name="contractName"
                        value={formData.contractName}
                        onChange={handleInputChange}
                        required
                        placeholder="Company Contact Name"
                      />
                    </div>
                    {formErrors.contractName && (
                      <div className="invalid-feedback">
                        {formErrors.contractName}
                      </div>
                    )}
                  </div> */}

                  <div className="form-group col-md-6">
                    <label className="label">Company Active</label>
                    <div className="input-with-icon">
                      <Tooltip title="Tick this box so that your company is visible in Waste Accountant." arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                      <div className="form-check">
                      <div className="field">
                        <input
                          type="checkbox"
                          className={`form-check-input ${formErrors.companyActive ? "is-invalid" : ""
                            }`}
                          id="companyActive"
                          name="companyActive"
                          checked={formData.companyActive}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              companyActive: e.target.checked,
                            })
                          }
                        />
                        <label
                          // className={`form-check-label ${
                          //   formErrors.companyActive ? "text-danger" : ""
                          // }`}
                          htmlFor="companyActive"
                        >
                          Confirm Company is Active
                        </label>
</div>
                        {formErrors.companyActive && (
                          <div className="invalid-feedback">
                            {formErrors.companyActive}
                          </div>
                        )}
                      </div>
                    </div>
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

      <div className=" company-setup-container mt-1">
        <button
          type="button"
          onClick={handleSubmit}
          className="btn next btn-primary"
        >
          <Tooltip title="Click 'Submit' to save your company details." arrow>
            Next Step
          </Tooltip>{" "}
        </button>
      </div>
      <Tooltip place="top" type="dark" effect="solid" event="click" />
    </>
  );
};

export default Company;
