import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Company.css";
import Authapi from "../../Authapi";
import Swal from "sweetalert2";
// import { Stepper, Step } from "react-form-stepper";
import Stepper from 'react-stepper-horizontal';
import Expired from '../CheckTokenExpier';
import Navlayout from "../../Wa-Frontend/NavLayout";

import "./Depot.css";

const DepotForm = () => {
  const [formData, setFormData] = useState({
    depotTypeId: "",
    depotName: "",
    contractId: "",
    countyId: "",
    startDate: "",
    endDate: "",
    depotPostcode: "",
    depotTelephone: "",
    contractName: "",
    dateAddress: ""
  });
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(2);
  const navigate = useNavigate();
  const [depotTypes, setDepotTypes] = useState([]);
  const [countytypes, setCountyTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const getUserDepotTypeName = async () => {
      try {
        const response = await Authapi.getUserDepotTypeName();
        console.log("Fuel types data:", response);
        if (response && response.length > 0) {
          setDepotTypes(response);
        } else {
          console.warn("No fuel types data received");
        }
      } catch (error) {
        console.error("Failed to fetch fuel types:", error);
      }
    };

    const getcountyName = async () => {
      try {
        const response = await Authapi.countynameget();
        console.log("county data:", response);
        if (response && response.length > 0) {
          setCountyTypes(response);
        } else {
          console.warn("No county names received");
        }
      } catch (error) {
        console.error("Failed to fetch county names:", error);
      }
    };

    getUserDepotTypeName();
    getcountyName();
  }, []);


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

    // Phone number validation: only numbers and up to 10 digits allowed
    if (name === "depotTelephone") {
      if (/^\d{0,10}$/.test(value)) {
        setFormData({ ...formData, [name]: value }); // Update formData with the value
      }
      validateForm(); // Call the validation after updating phone number
    } else {
      setFormData({ ...formData, [name]: value }); // Update formData for other fields
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate Depot Type
    if (!formData.depotTypeId) {
      newErrors.depotTypeId = "Depot Type is required.";
    }

    // Validate Depot Name
    if (!formData.depotName) {
      newErrors.depotName = "Depot Name is required.";
    }

    // Validate County
    if (!formData.countyId) {
      newErrors.countyId = "County is required.";
    }

    // Validate Start Date
    if (!formData.startDate) {
      newErrors.startDate = "Start Date is required.";
    }

    // Validate End Date
    if (!formData.endDate) {
      newErrors.endDate = "End Date is required.";
    }

    // Validate Depot Postcode
    if (!formData.depotPostcode) {
      newErrors.depotPostcode = "Depot Postcode is required.";
    }

    // Validate Depot Telephone (Phone number validation - exactly 10 digits)
    if (!formData.depotTelephone) {
      newErrors.depotTelephone = "Depot Telephone is required.";
    } else if (!/^\d{10}$/.test(formData.depotTelephone)) {
      newErrors.depotTelephone = "Phone number must be 10 digits.";
    }

    // Validate Depot Address
    if (!formData.dateAddress) {
      newErrors.dateAddress = "Depot Address is required.";
    }

    setErrors(newErrors); // Set all errors
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    // console.log(formData);
    // console.log(formData.contractId);
    try {
      const response = await Authapi.submitDepotDetails({
        depot_type_id: formData.depotTypeId,
        depot_name: formData.depotName,
        contract_id: formData.contractId,
        county_id: formData.countyId,
        start_date_tonnage_material: formData.startDate,
        end_date_tonnage_material: formData.endDate,
        depot_postcode: formData.depotPostcode,
        depot_telephone: formData.depotTelephone,
        depot_address_1: formData.dateAddress,
      });

      if (response.status === 200) {
        // await Swal.fire({
        //   icon: "success",
        //   title: "Depot Setup Complete",
        //   text: "Your depot has been successfully registered.",
        //   confirmButtonText: "OK",
        // });
        sessionStorage.setItem("successMessage", "Depot Setup Complete! Your Depot has been successfully registered.");

        navigate("/vehicle");
      } else {
        throw new Error(response.message || "Failed to setup depot");
      }
    } catch (error) {
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
      if (location.state && location.state.formData) {

        setFormData({
          ...location.state.formData,
        });
      } else {

        const response = await Authapi.getUserDepotdetail();
        if (response.status === 200) {
          setFormData({
            depotName: response.depots.depot_name || "",
            endDate: response.depots.end_date_tonnage_material || "",
            startDate: response.depots.start_date_tonnage_material || "",
            depotTelephone: response.depots.depot_telephone || "",
            depotPostcode: response.depots.depot_postcode || "",
            dateAddress: response.depots.depot_address_1 || "",
            countyId: response.depots.county_id || "",
            depotTypeId: response.depots.depot_type_id || "",
            contractId: response.depots.contract_id || "",
          });
        }
      }
    };

    fetchData();
  }, [location.state]);


  const handleStepChange = (step) => {
    setActiveStep(step);
  };


  const handlePreviousClick = async () => {
    try {
      const response = await Authapi.getUserContractdetail();

      console.log(response);

      if (response.status === 200 && response.contract) {
        console.log("Contract Name:", response.contract.contract_name);


        navigate("/contract", {
          state: {
            formData: {
              companyName: response.contract.id || "",
              companyName: response.contract.contract_name || "",
            },
          },
        });


        console.log("Redirecting to /contract");
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

  // const handlePreviousClick = async () => {
  //   try {
  //     const response = await Authapi.getUserContractdetail();

  //     console.log(response); 

  //     if (response.status === 200 && response.contract) {
  //       console.log("Contract Name:", response.contract.contract_name); 


  //       navigate("/depot", {
  //         state: {
  //           formData: {
  //             depotPostcode: response.depots.depot_postcode || "", 
  //           },
  //         },
  //       });


  //       console.log("Redirecting to /depot");
  //     } else {
  //       console.log("Error message:", response.message); 

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
  // };

  const steps = [
    { title: 'Company' },
    { title: 'Contract' },
    { title: 'Depot' },
    { title: 'Vehicle' },
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
      <h1 className="header">Depot</h1>
      <p className="firstcontent">
        Please fill the form below to set up a Depot! Add as many details as
        required and proceed.
      </p>
      <div className="container mb-0">
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
              <h5 className="title">Depot details</h5>
              <p className="description">
                Please fill your information so we can get in touch with you.
              </p>

              <form onSubmit={handleSubmit} className="company-form">
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label>Contract Name</label>
                    {/* <input
                      className="form-control company"
                      type="hidden"
                      name="contractId"
                      value={formData.contractId}
                      disabled
                    /> */}
                    <input
                      className="form-control company"
                      type="text"
                      name="contractName"
                      value={formData.contractName}
                      disabled
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label>Depot Type</label>
                    <select
                      className="form-control company"
                      name="depotTypeId"
                      value={formData.depotTypeId}
                      onChange={handleChange}
                    >
                      <option value="">Select Depot Type</option>
                      {depotTypes.map((depot) => (
                        <option key={depot.id} value={depot.id}>
                          {depot.depot_type_name}
                        </option>
                      ))}
                    </select>
                    {errors.depotTypeId && <small className="text-danger">{errors.depotTypeId}</small>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label>Depot Name</label>
                    <input
                      className="form-control company"
                      type="text"
                      name="depotName"
                      value={formData.depotName}
                      onChange={handleChange}
                    />
                    {errors.depotName && <small className="text-danger">{errors.depotName}</small>}
                  </div>

                  <div className="form-group col-md-6">
                    <label>County</label>
                    <select
                      className="form-control company"
                      name="countyId"
                      value={formData.countyId}
                      onChange={handleChange}
                    >
                      <option value="">Select County</option>
                      {countytypes.map((county) => (
                        <option key={county.id} value={county.id}>
                          {county.county_name}
                        </option>
                      ))}
                    </select>
                    {errors.countyId && <small className="text-danger">{errors.countyId}</small>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label>Date From</label>
                    <input
                      value={formData.startDate}
                      className="form-control company"
                      type="date"
                      name="startDate"
                      onChange={handleChange}
                    />
                    {errors.startDate && <small className="text-danger">{errors.startDate}</small>}
                  </div>

                  <div className="form-group col-md-6">
                    <label>Date End</label>
                    <input
                      className="form-control company"
                      type="date"
                      value={formData.endDate}
                      name="endDate"
                      onChange={handleChange}
                    />
                    {errors.endDate && <small className="text-danger">{errors.endDate}</small>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6 ">
                    <label>Date Postcode</label>
                    <input
                      className="form-control company"
                      type="text"
                      name="depotPostcode"
                      value={formData.depotPostcode}
                      onChange={handleChange}
                    />
                    {errors.depotPostcode && <small className="text-danger">{errors.depotPostcode}</small>}
                  </div>

                  <div className="form-group col-md-6">
                    <label>Telephone</label>
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
                <div className="form-row">
                  <div className="form-group col-md-6">

                    <label>Date Address</label>
                    <input
                      value={formData.dateAddress}
                      className="form-control company"
                      type="text"
                      name="dateAddress"
                      onChange={handleChange}
                    />
                    {errors.dateAddress && <small className="text-danger">{errors.dateAddress}</small>}
                  </div>
                  <div className="form-group col-md-6"></div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      {/* <div className="container">
        <div className="row">
          <div className="col-6">
            <button
              type="button"
              className="btn btn-secondary prevbtn depotbuttons "
              onClick={handlePreviousClick}
            >
              Previous step
            </button>
          </div>
          <div className="col-6">
            <button
              type="button"
              className="btn next btn-primary prevbtn next1 depotbuttons"
              onClick={handleSubmit}
            >
              Next step
            </button>
          </div>
        </div>
      </div> */}
      <div className=" company-setup-container mt-0 ">
        <button
          type="button"
          className="btn btn-secondary prevbtn"
          onClick={handlePreviousClick}
        >
          Previous step
        </button>

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

export default DepotForm;
