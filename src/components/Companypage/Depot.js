import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Company.css";
import Authapi from "../../Authapi";
import Swal from "sweetalert2";
// import { Stepper, Step } from "react-form-stepper";
import Stepper from 'react-stepper-horizontal';
import Expired from '../CheckTokenExpier';
import Navlayout from "../../Wa-Frontend/NavLayout";
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import "./Depot.css";
import customSelectStyles from "../../CustomSelectStyles";
import Select from "react-select";
import { RotatingLines } from "react-loader-spinner";

const DepotForm = () => {
  //   const [formData, setFormData] = useState({
  //     depotTypeId: "",
  //     depotName: "",
  //     contractId: "",
  //     countyId: "",
  //     startDate: "",
  //     endDate: "",
  //     depotPostcode: "",
  //     depotTelephone: "",
  //     contractName: "",
  //     dateAddress: ""
  //   });


  const [formData, setFormData] = useState({
    depotTypeId: "",
    contractId: "",
    depotName: "",
    depotPermitNo: "",
    depotAddress1: "",
    depotAddress2: "",
    depotAddress3: "",
    depotAddress4: "",
    depotPostcode: "",
    countyId: "",
    depotTelephone: "",
    // depotPermitTonnageLimit: "",
    includeTonnageLimitonDashboard: "",
    startDate: "",
    endDate: "",
    contractName: "",
    // dateAddress: ""
  });


  const location = useLocation();
  const [activeStep, setActiveStep] = useState(2);
  const navigate = useNavigate();
  const [depotTypes, setDepotTypes] = useState([]);
  const [countytypes, setCountyTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

    // Add Code For loader 
    const Loader = () => (
      <div className="loader-overlay">
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
      </div>
    );

  const getUserDepotTypeName = async (selected) => {
    // setFormData({ ...formData, depotTypeId: selected });
    try {
      const data = await Authapi.getUserDepotTypeName();
      if (data && data.length > 0) {
        const options = data.map((depotType) => ({
          value: depotType.id,
          label: depotType.depot_type_name,
        }));
        setDepotTypes(options);
      } else {
        console.warn("No fuel types data received");
      }
    } catch (error) {
      console.error("Failed to fetch fuel types:", error);
    }
  };
  useEffect(() => {
    getUserDepotTypeName();
    getcountyName();
  }, []);

  const handleDepotTypeChange = (selectedOption) => {
    setFormData({ ...formData, depotTypeId: selectedOption ? selectedOption.value : "" });
  };

  const handleCountyChange = (selectedOption) => {
    setFormData({ ...formData, countyId: selectedOption ? selectedOption.value : "" });
  };

  const getcountyName = async () => {
    //   setFormData({
    //     ...formData,
    //     mainIndustry: selected,
    // });

    try {
      const data = await Authapi.countynameget();
      const options = data.map((country) => ({
        value: country.id,
        label: country.county_name,
      }));
      setCountyTypes(options);
    } catch (error) {
      console.error("Failed to fetch county names:", error);
    }
  };



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

    if (location.state && location.state.formData) {
      const { formData } = location.state;
      setFormData(formData);
    }

    const fetchContractDetails = async () => {
      try {
        const response = await Authapi.getLatestContractDetails();
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

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: "" }); // Clear the error for that field

    // Phone number validation: only numbers and minimum 10 digits allowed
    if (name === "depotTelephone") {
      if (/^\d{0,12}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
        
        if (value.length === 0) {
          setErrors({
            ...errors,
            depotTelephone: "Depot Telephone is required"
          });
        } else if (value.length < 10) {
          setErrors({
            ...errors,
            depotTelephone: "Phone number must be at least 10 digits"
          });
        } else {
          setErrors({ ...errors, depotTelephone: "" });
        }
      }
    } else {
      setFormData({ ...formData, [name]: value }); // Update formData for other fields
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate Depot Type
    // if (!formData.depotTypeId) {
    //   newErrors.depotTypeId = "Depot Type is required.";
    // }
    // console.log(formData);

    if (!formData.contractName) {
      newErrors.contractName = "Contract Name is required.";
    }

    // Validate Depot Name
    if (!formData.depotName) {
      newErrors.depotName = "Depot Name is required.";
    }

    // Validate County
    // if (!formData.countyId) {
    //   newErrors.countyId = "County is required.";
    // }

    // Validate Start Date
    // if (!formData.startDate) {
    //   newErrors.startDate = "Start Date is required.";
    // }

    // // Validate End Date
    // if (!formData.endDate) {
    //   newErrors.endDate = "End Date is required.";
    // }

    // Validate Depot Postcode
    if (!formData.depotPostcode) {
      newErrors.depotPostcode = "Depot Postcode is required.";
    }else if (/^\d{7}$/.test(formData.depotPostcode)) {
      newErrors.depotPostcode = "Depot Postcode should not be exactly 7 digits.";
    }

    // Validate Depot Telephone (Phone number validation - minimum 10 digits)
    if (!formData.depotTelephone) {
      newErrors.depotTelephone = "Depot Telephone is required.";
    } else if (!/^\d{10,12}$/.test(formData.depotTelephone)) {
      newErrors.depotTelephone = "Phone number must be between 10 and 12 digits.";
    }

    // Validate Depot Address
    // if (!formData.dateAddress) {
    //   newErrors.dateAddress = "Depot Address is required.";
    // }
    setErrors(newErrors); // Set all errors
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    // alert("sdfsdf");
    if (!validateForm()) return;
    // console.log(formData);
    // console.log(formData.contractId);
    try {
      setLoading(true);
      const response = await Authapi.submitDepotDetails({
        depot_type_id: formData.depotTypeId,
        contract_id: formData.contractId,
        contract_name: formData.contractName,
        depot_name: formData.depotName,
        depot_permit_no: formData.depotPermitNo,
        depot_address_1: formData.depotAddress1,
        depot_address_2: formData.depotAddress2,
        depot_address_3: formData.depotAddress3,
        depot_address_4: formData.depotAddress4,
        depot_postcode: formData.depotPostcode,
        county_id: formData.countyId,
        depot_telephone: formData.depotTelephone,
        // depot_permit_tonnage_limit: formData.depotPermitTonnageLimit,
        include_tonnage_limit_on_dashboard: formData.includeTonnageLimitOnDashboard,
        start_date_tonnage_material: formData.startDate,
        end_date_tonnage_material: formData.endDate,
        // depot_address_1: formData.dateAddress,
      });

      if (response.status === 200) {
        // await Swal.fire({
        //   icon: "success",
        //   title: "Depot Setup Complete",
        //   text: "Your depot has been successfully registered.",
        //   confirmButtonText: "OK",
        // });
        setLoading(false);
        sessionStorage.setItem("successMessage", "Depot Setup Complete! Your Depot has been successfully registered.");

        // navigate("/vehicle");
        navigate("/site");
      } else {
        setLoading(false);
        throw new Error(response.message || "Failed to setup depot");
      }
    } catch (error) {
      setLoading(false);
      console.error("Depot setup error:", error);
      Swal.fire({
        icon: "error",
        title: "Setup Failed",
        text: error.message || "Failed to setup depot. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // if (location.state && location.state.formData) {

      //   setFormData({
      //     ...location.state.formData,
      //   });
      // } else {

      const response = await Authapi.getUserDepotdetail();
      if (response.status === 200) {
        // console.log("TESTING");
        // console.log();
        setFormData({
          depotTypeId: response.depots.depot_type_id || "",
          contractId: response.depots.contract_id || "",
          contractName: response.depots.contract_name || "",
          depotName: response.depots.depot_name || "",
          depotPermitNo: response.depots.depot_permit_no || "",
          depotAddress1: response.depots.depot_address_1 || "",
          depotAddress2: response.depots.depot_address_2 || "",
          depotAddress3: response.depots.depot_address_3 || "",
          depotAddress4: response.depots.depot_address_4 || "",
          depotPostcode: response.depots.depot_postcode || "",
          countyId: response.depots.county_id || "",
          depotTelephone: response.depots.depot_telephone || "",
          // depotPermitTonnageLimit: response.depots.depot_permit_tonnage_limit || "",
          includeTonnageLimitOnDashboard: response.depots.include_tonnage_limit_on_dashboard || "",
          startDate: response.depots.start_date_tonnage_material || "",
          endDate: response.depots.end_date_tonnage_material || "",
          // dateAddress: response.depots.depot_address_1 || "",
        });
        // }
      }
    };

    fetchData();
    // }, [location.state]);
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


  const handleStepChange = (step) => {
    setActiveStep(step);
  };


  const handlePreviousClick = async () => {
    try {
      const response = await Authapi.getUserContractdetail();

      // console.log(response);

      if (response.status === 200 && response.contract) {
        // console.log("Contract Name:", response.contract.contract_name);


        navigate("/contract", {
          state: {
            formData: {
              companyName: response.contract.id || "",
              companyName: response.contract.contract_name || "",
            },
          },
        });


        // console.log("Redirecting to /contract");
      } else {
        console.log("Error message:", response.message);

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


  const steps = [
    { title: 'Company' },
    { title: 'Contract' },
    { title: 'Depot' },
    { title: 'Site' },
  ];
  const activeStep1 = 2;


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
      {/* <h1 className="header">Depot</h1>
      <p className="firstcontent">
        Please fill the form below to set up a Depot! Add as many details as
        required and proceed.
      </p> */}
      {loading && <Loader />}

      <div className="container mb-0 mt-5">
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}
      </div>
      <div className=" company-setup-container abcd mb-0">
        {/* <Stepper activeStep={activeStep} onStepClick={handleStepChange}>
          <Step label="Company" />
          <Step label="Contract" />
          <Step label="Depot" />
          <Step label="Vehicle" />
        </Stepper> */}
        {/* <div>
          <Stepper
            steps={steps}
            activeStep={activeStep1} /> */}
        <div className="container stepper-connector">
          <CustomStepper
            steps={steps}
            activeStep={activeStep} />
        </div><br />
        <div className="pro-under-border"></div>
        <div className="steps-content mt-3">
          {activeStep === 2 && (
            <div className="p-4 content">
              <h5 className="title">Depot Details</h5>
              <p className="description">
                Please complete all sections.
              </p>

              <form onSubmit={handleSubmit} className="company-form">
                <div className="form-row">

                  <div className="form-group col-md-6">
                    <div className="input-with-icon">
                      <label className="label">Depot Type</label>
                      <Tooltip title="Select the main function of the Depot." arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                    </div>
                    <div className="field">
                      <Select
                        className="searchable_dropdown"
                        options={depotTypes}
                        // value={formData.depotTypeId}
                        value={depotTypes.find(option => option.value === formData.depotTypeId)}
                        onChange={handleDepotTypeChange}
                        placeholder="Select Depot Type"
                        isSearchable
                        styles={customSelectStyles}
                      />
                      {errors.depotTypeId && <small className="text-danger">{errors.depotTypeId}</small>}
                    </div>
                  </div>

                  <div className="form-group col-md-6">
                    <div className="input-with-icon">
                      <label className="label">Contract</label>
                      <Tooltip title="Select the Contract that manages the depot from the drop-down menu" arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                    </div>
                    <div className="field">
                      <input
                        className="form-control company"
                        type="text"
                        name="contractName"
                        value={formData.contractName}
                        onChange={handleDepotTypeChange}
                        disabled />
                      {errors.contractName && <small className="text-danger">{errors.contractName}</small>}
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <div className="input-with-icon">
                      <label className="label">Depot Name</label>
                      <Tooltip title="Add the name of the Depot." arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                    </div>
                    <div className="field">
                      <input
                        className="form-control company"
                        type="text"
                        name="depotName"
                        value={formData.depotName}
                        onChange={handleChange}
                      />
                      {errors.depotName && <small className="text-danger">{errors.depotName}</small>}
                    </div>
                  </div>

                  {/* <div className="form-group col-md-6">
                    <div className="input-with-icon">
                      <label className="label">Depot Permit No</label>
                      <Tooltip title="If the Depot has an environmental permit, add this here." arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                    </div>
                    <div className="field">
                      <input
                        className="form-control company"
                        type="text"
                        name="depotPermitNo"
                        value={formData.depotPermitNo}
                        onChange={handleChange}
                      />
                      {errors.depotPermitNo && <small className="text-danger">{errors.depotPermitNo}</small>}
                    </div>
                  </div> */}


<div className="form-group col-md-6">
                    <div className="input-with-icon">
                      <label className="label">Depot Address 1</label>
                      <Tooltip title="Add the depot address" arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                    </div>
                    {/* {console.log(formData)} */}
                    <div className="field">
                      <input
                        value={formData.depotAddress1}
                        className="form-control company"
                        type="text"
                        name="depotAddress1"
                        onChange={handleChange}
                      />
                      {/* {errors.depotAddress1 && <small className="text-danger">{errors.depotAddress1}</small>} */}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  

                  <div className="form-group col-md-6">
                    <div className="input-with-icon">
                      <label className="label">Depot Address 2</label>
                      <Tooltip title="Add the depot address" arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                    </div>
                    <div className="field">
                      <input
                        className="form-control company"
                        type="text"
                        value={formData.depotAddress2}
                        name="depotAddress2"
                        onChange={handleChange}
                      />
                      {/* {errors.depotAddress2 && <small className="text-danger">{errors.depotAddress2}</small>} */}
                    </div>
                  </div>

                  <div className="form-group col-md-6">
                    <div className="input-with-icon">
                      <label className="label">Depot Address 3</label>
                      <Tooltip title="Add the depot address" arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                    </div>
                    <div className="field">
                      <input
                        value={formData.depotAddress3}
                        className="form-control company"
                        type="text"
                        name="depotAddress3"
                        onChange={handleChange}
                      />
                      {/* {errors.depotAddress3 && <small className="text-danger">{errors.depotAddress3}</small>} */}
                    </div>
                  </div>
                </div>
                <div className="form-row">                
                  <div className="form-group col-md-6">
                    <div className="input-with-icon">
                      <label className="label">Depot Address 4</label>
                      <Tooltip title="Add the depot address" arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                    </div>
                    <div className="field">
                      <input
                        className="form-control company"
                        type="text"
                        value={formData.depotAddress4}
                        name="depotAddress4"
                        onChange={handleChange}
                      />
                      {/* {errors.depotAddress4 && <small className="text-danger">{errors.depotAddress4}</small>} */}
                    </div>
                  </div>
                  <div className="form-group col-md-6 ">
                    <div className="input-with-icon">
                      <label className="label">Depot Postcode</label>
                      <Tooltip title="Maximum 7 leave digit will be allow" arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                    </div>
                    <div className="field">
                      <input
                        className="form-control company"
                        type="text"
                        name="depotPostcode"
                        value={formData.depotPostcode}
                        onChange={handleChange}
                        maxLength={7}
                      />
                      {errors.depotPostcode && <small className="text-danger">{errors.depotPostcode}</small>}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  
                  

                  <div className="form-group col-md-6">
                    <div className="input-with-icon">
                      <label className="label">County</label>
                      <Tooltip title="Select the county where the depot is located form the drop-down menu." arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                    </div>
                    <div className="field">
                      <Select
                        className="searchable_dropdown"
                        options={countytypes}
                        // value={formData.countyId}
                        value={countytypes.find(option => option.value === formData.countyId)}
                        onChange={handleCountyChange}
                        placeholder="Select County"
                        isSearchable
                        styles={customSelectStyles}
                      />
                      {errors.countyId && <small className="text-danger">{errors.countyId}</small>}
                    </div>
                  </div>
                  <div className="form-group col-md-6">
                    <div className="input-with-icon">
                      <label className="label">Telephone</label>
                      <Tooltip title="Add the depot telephone number" arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                    </div>
                    <div className="field">
                      <input
                        className="form-control company"
                        type="tel"
                        name="depotTelephone"
                        value={formData.depotTelephone}
                        onChange={handleChange}
                      />
                      {errors.depotTelephone && <small className="text-danger">{errors.depotTelephone}</small>}
                    </div>
                  </div>
                </div>

                {/* <div className="form-row">
                  <div className="form-group col-md-6">
                    <div className="input-with-icon">
                      <label className="label">Depot Permit Tonnage Limit</label>
                      <Tooltip title="If the depot has an environmental permit, please add the permit number." arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                    </div>
                    <div className="field">
                      <input
                        className="form-control company"
                        type="tel"
                        name="depotPermitTonnageLimit"
                        value={formData.depotPermitTonnageLimit}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-group col-md-6">
                  </div>
                </div> */}
                <div className="form-row">
                  {/* <div className="form-group col-md-6">
                    <div className="input-with-icon">
                      <label className="label">Include Tonnage Limit on Dashboard</label>
                      <Tooltip title="Tick if you wish to see tonnage limit in the dashboard." arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                    </div>
                    <div className="form-check">
                      <div className="field">
                        <input
                          type="checkbox"                        
                          className='form-check-input'
                          id="includeTonnageLimitOnDashboard"
                          name="includeTonnageLimitOnDashboard"
                          checked={formData.includeTonnageLimitOnDashboard}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              includeTonnageLimitOnDashboard: e.target.checked,
                            })
                          }
                        />
                        <label className="label"
                          htmlFor="includeTonnageLimitOnDashboard"
                        >
                          Confirm Include Tonnage Limit on Dashboard is Active
                        </label>

                        <div className="invalid-feedback">
                        </div>
                      </div>
                    </div>
                  </div> */}

                  {/* <div className="form-group col-md-6">
                    <div className="input-with-icon">
                      <label className="label">Date From</label>
                      <Tooltip title="Select the start date" arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                    </div>
                    <div className="field">
                      <input
                        value={formData.startDate}
                        className="form-control company"
                        type="date"
                        name="startDate"
                        onChange={handleChange}
                      />
                      {errors.startDate && <small className="text-danger">{errors.startDate}</small>}
                    </div>
                  </div> */}


                </div>

                <div className="form-row">
                  {/* <div className="form-group col-md-6">
                    <div className="input-with-icon">
                      <label className="label">Date End</label>
                      <Tooltip title="Select the end date" arrow>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="info-icon"
                        />
                      </Tooltip>
                    </div>
                    <div className="field">
                      <input
                        className="form-control company"
                        type="date"
                        value={formData.endDate}
                        name="endDate"
                        onChange={handleChange}
                      />
                      {errors.endDate && <small className="text-danger">{errors.endDate}</small>}
                    </div>
                  </div> */}
                  <div className="form-group col-md-6">
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      <div className=" company-setup-container mt-0 ">
        <button
          type="button"
          className="btn btn-secondary prevbtn"
          onClick={handlePreviousClick}
        ><Tooltip title="Click 'Previous' to go back and Update your contract details." arrow>
            Previous Step
          </Tooltip>
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="btn next btn-primary"
        ><Tooltip title="Click 'Submit' to save your depot details" arrow>
            Next Step
          </Tooltip> </button>
      </div>
    </>
  );
};

export default DepotForm;
