import React, { useState, useEffect } from "react";
import "./Vehicle.css";
import Authapi from "../../Authapi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
// import { Stepper, Step } from "react-form-stepper";
import Stepper from "react-stepper-horizontal";
import "./Company.css";
import Expired from "../CheckTokenExpier";
import Navlayout from "../../Wa-Frontend/NavLayout";
import Tooltip from "@mui/material/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import customSelectStyles from "../../CustomSelectStyles";
import Select from "react-select";

const VehicleForm = () => {
  const [formData, setFormData] = useState({
    vehicle_type_id: "",
    vehicle_description: "",
    vehicle_reg: "",
    driver_name: "",
    vehicle_name: "",
    phone_no: "",
    vehicle_license: "",
    vehicle_license_expire_date: "",
    vehicle_address_1: "",
    vehicle_address_2: "",
    vehicle_address_3: "",
    vehicle_address_4: "",
    vehicle_postcode: "",
    fuel_type_id: "",
    vehicle_tare_weight: "",
    vehicle_owner: "",
  });
  const [fuelTypes, setFuelTypes] = useState([]);
  const [vehicleOwner, setVehicleOwner] = useState([]);
  const [activeStep, setActiveStep] = useState(3);
  const [errors, setErrors] = useState({});
  const [vehicletype, setVehicleType] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: "" });
    if (name === "phone_no" && /^\d{0,10}$/.test(value)) {
      setFormData({ ...formData, [name]: value });
    } else if (name !== "phone_no") {
      setFormData({ ...formData, [name]: value });
    }
    if (name === "phone_no") {
      validateForm();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate all required fields
    if (!formData.vehicle_type_id)
      newErrors.vehicle_type_id = "Vehicle Type is required";
    if (!formData.vehicle_description)
      newErrors.vehicle_description = "Vehicle Description is required";
    if (!formData.driver_name)
      newErrors.driver_name = "Driver Name is required";
    if (!formData.vehicle_name)
      newErrors.vehicle_name = "Carrier Name is required";

    // Phone number validation: check if it's provided and matches the 10-digit format
    // if (!formData.phone_no) {
    //   newErrors.phone_no = "Phone Number is required";
    // } else if (formData.phone_no.length !== 10) {
    //   newErrors.phone_no = "Phone Number must be exactly 10 digits";
    // }

    if (!/^\d{10}$/.test(formData.phone_no) && formData.phone_no) {
      newErrors.phone_no = "Phone Number must be exactly 10 digits";
    }

    if (!formData.vehicle_license_expire_date)
      newErrors.vehicle_license_expire_date = "Carrier's License Expiry Date is required";
    if (!formData.vehicle_license)
      newErrors.vehicle_license = "Carrier License No is required";
    if (!formData.fuel_type_id)
      newErrors.fuel_type_id = "Fuel Type is required";
    // if (!formData.vehicle_tare_weight)
    //   newErrors.vehicle_tare_weight = "Vehicle Tare Weight is required";
    // if (!formData.vehicle_owner)
    //   newErrors.vehicle_owner = "Vehicle Owner is required";

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // const handlePreviousClick = () => {
  //   navigate("/depot");
  // };

  const handleVehicleTypeChange = (selectedOption) => {
    setFormData({ ...formData, vehicle_type_id: selectedOption ? selectedOption.value : "" });
  };

  const handleFuelTypeChange = (selectedOption) => {
    setFormData({ ...formData, fuel_type_id: selectedOption ? selectedOption.value : "" });
  };


  const handleVehicleOwnerChange = (selectedOption) => {
    setFormData({ ...formData, vehicle_owner: selectedOption ? selectedOption.value : "" });
  };

  const handlePreviousClick = async () => {
    try {
      const response = await Authapi.getUserDepotdetail();
      // console.log(response);

      if (response.status === 200 && response.depots) {
        const depotData = {
          depotPostcode: response.depots.depot_postcode || "",
          depotTelephone: response.depots.depot_telephone || "",
          depotName: response.depots.depot_name || "",
          startDate: response.depots.start_date_tonnage_material || "",
          endDate: response.depots.end_date_tonnage_material || "",
          dateAddress: response.depots.depot_address_1 || "",
          countyId: response.depots.county_id || "",
          depotTypeId: response.depots.depot_type_id || "",

        };

        // Passing formData via state
        navigate("/depot", {
          state: {
            formData: depotData,
            // contract_id: response.contract.id || "", // Correct contract ID mapping
            // contractName: response.contract.contract_name || "", // Correct contract ID mapping
          },
        });
        // console.log("Redirecting to /depot");
      } else {
        console.error("Error fetching depot data:", response.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            response.message || "Failed to fetch depot data. Please try again.",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error fetching depot data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while fetching depot data.",
        confirmButtonText: "OK",
      });
    }
  };

  const fetchFuelTypes = async () => {
    try {
      const data = await Authapi.getfualtypesdata();
      // console.log("Fuel types data:", data);
      if (data && data.length > 0) {
        // setFuelTypes(response);
        const options = data.map((fualType) => ({
          value: fualType.id,
          label: fualType.fuel_type_name,
        }));
        setFuelTypes(options);
      } else {
        console.warn("No fuel types data received");
      }
    } catch (error) {
      console.error("Failed to fetch fuel types:", error);
    }
  };

  // const fetchVehicleOwner = async () => {
  //   try {
  const vehicleOwnerOptions = [
    { value: "1", label: "Contract Name" },
    { value: "2", label: "Third Party Carrier" },
  ];


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


    getVhicalTypeName();
    fetchFuelTypes();
  }, []);

  const getVhicalTypeName = async () => {
    try {
      const data = await Authapi.userVehicleTypes();

      if (data && data.length > 0) {

        const options = data.map((vehicleType) => ({
          value: vehicleType.id,
          label: vehicleType.vehicle_type_name,
        }));
        setVehicleType(options);
      } else {
        console.warn("No vehicle types data received");
      }
    } catch (error) {
      console.error("Failed to fetch vehicle types:", error);
    }
  };

  useEffect(() => {
    const getUservehicledetail = async () => {


      try {
        const response = await Authapi.getUservehicledetail();
        // console.log(response.Vehicle.vehicle_address_1);
        if (response?.status === 200 && response?.Vehicle) {

          // const { vehicle } = response;

          setFormData((prevData) => ({
            contract_id: response.Vehicle.contract_id || prevData.contract_id || "",
            vehicle_type_id: response.Vehicle.vehicle_type_id || prevData.vehicle_type_id || "",
            tip_id: response.Vehicle.tip_id || prevData.tip_id || "",
            user_tip_id: response.Vehicle.user_tip_id || prevData.user_tip_id || "",
            vehicle_description: response.Vehicle.vehicle_description || prevData.vehicle_description || "",
            vehicle_reg: response.Vehicle.vehicle_reg || prevData.vehicle_reg || "",
            vehicle_name: response.Vehicle.vehicle_name || prevData.vehicle_name || "",
            phone_no: response.Vehicle.phone_no || prevData.phone_no || "",
            vehicle_license: response.Vehicle.vehicle_license || prevData.vehicle_license || "",
            vehicle_license_expire_date: response.Vehicle.vehicle_license_expire_date || prevData.vehicle_license_expire_date || "",
            vehicle_address_1: response.Vehicle.vehicle_address_1 || prevData.vehicle_address_1 || "",
            vehicle_address_2: response.Vehicle.vehicle_address_2 || prevData.vehicle_address_2 || "",
            vehicle_address_3: response.Vehicle.vehicle_address_3 || prevData.vehicle_address_3 || "",
            vehicle_address_4: response.Vehicle.vehicle_address_4 || prevData.vehicle_address_4 || "",
            vehicle_postcode: response.Vehicle.vehicle_postcode || prevData.vehicle_postcode || "",
            vehicle_owner: response.Vehicle.vehicle_owner || prevData.vehicle_owner || "",
            vehicle_emissions: response.Vehicle.vehicle_emissions || prevData.vehicle_emissions || "",
            vehicle_ppm: response.Vehicle.vehicle_ppm || prevData.vehicle_ppm || "",
            vehicle_load: response.Vehicle.vehicle_load || prevData.vehicle_load || "",
            vehicle_tare_weight: response.Vehicle.vehicle_tare_weight || prevData.vehicle_tare_weight || "",
            fuel_type_id: response.Vehicle.fuel_type_id || prevData.fuel_type_id || "",
            driver_name: response.Vehicle.driver_name || prevData.driver_name || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      }
    };

    getUservehicledetail();
  }, []);

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        const response = await Authapi.getUserContractdetail();
        // console.log("Contract details:", response);

        if (response.status === 200 && response.contract) {
          // Update the formData with contract_id
          setFormData((prevData) => ({
            ...prevData,
            contract_id: response.contract.id || "", // Correct contract ID mapping
            contractName: response.contract.contract_name || "", // Correct contract ID mapping
          }));
        } else {
          console.warn("No contract data received");
        }
      } catch (error) {
        console.error("Failed to fetch contract details:", error);
      }
    };

    fetchContractDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Ensure the form is valid before proceeding

    // Map vehicle_owner to appropriate database value
    // console.log("TETSTTTTTT");
    // console.log(formData.vehicle_owner);
    const vehicleOwnerValue = formData.vehicle_owner === "contract_name" ? 1 : 2;

    try {
      const response = await Authapi.userVehicleDetails({
        contract_id: formData.contract_id,
        vehicle_type_id: formData.vehicle_type_id,
        tip_id: formData.tip_id,
        user_tip_id: formData.user_tip_id,
        vehicle_description: formData.vehicle_description,
        vehicle_reg: formData.vehicle_reg,
        vehicle_name: formData.vehicle_name,
        phone_no: formData.phone_no,
        vehicle_license: formData.vehicle_license,
        vehicle_license_expire_date: formData.vehicle_license_expire_date,
        vehicle_address_1: formData.vehicle_address_1,
        vehicle_address_2: formData.vehicle_address_2,
        vehicle_address_3: formData.vehicle_address_3,
        vehicle_address_4: formData.vehicle_address_4,
        vehicle_postcode: formData.vehicle_postcode,
        vehicle_owner: formData.vehicle_owner,
        vehicle_emissions: formData.vehicle_emissions,
        vehicle_ppm: formData.vehicle_ppm,
        vehicle_load: formData.vehicle_load,
        vehicle_tare_weight: formData.vehicle_tare_weight,
        fuel_type_id: formData.fuel_type_id,
        driver_name: formData.driver_name,
      });

      // Check if the request was successful
      if (response.status === 200 || response?.data?.success) {

        sessionStorage.setItem("successMessage", "Vehicle Setup Complete! Your vehicle has been successfully registered.");

        navigate("/success");
        // });
      } else {
        // console.log("RRRRRRRRRRRRRRRRRR");
        throw new Error(response?.message || "Failed to submit vehicle details");
      }
    } catch (error) {
      // console.error("Vehicle submission error:", error);

      // { console.log(error.message) }
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        // text: error.error,
        text: error?.response?.data?.message || error.message || "Failed to submit vehicle details. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const steps = [
    { title: "Company" },
    { title: "Contract" },
    { title: "Depot" },
    { title: "Vehicle" },
    { title: "Completed" },
  ];
  const activeStep1 = 3;
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
  return (
    <>
      <Navlayout />
      <Expired />
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
          <Step label="Completed" />
        </Stepper> */}

        <div>
          {/* <Stepper
            steps={steps}
            activeStep={activeStep1} /> */}
          <div className="container stepper-connector-fifth-child stepper-connector">
            <CustomStepper steps={steps} activeStep={activeStep} />
          </div>
        </div>
        <br />
        <div className="pro-under-border"></div>
        <div className="p-4 content">
          <h5 className="title">Vehicle Details</h5>
          <p className="description">
            Please fill your information so we can get in touch with you.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Vehicle Type</label>
                <div className="input-with-icon">
                  <Tooltip
                    title="Select the Vehicle Type from the drop-down menu"
                    arrow
                  >
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                  <div className="field">
                    <Select
                      className="searchable_dropdown"
                      options={vehicletype}
                      // value={formData.vehicle_type_id}
                      value={vehicletype.find(option => option.value === formData.vehicle_type_id)}
                      onChange={handleVehicleTypeChange}
                      placeholder="Select Vehicle Type"
                      isSearchable
                      styles={customSelectStyles}
                    />
                    {errors.vehicle_type_id && (
                      <small className="text-danger">
                        {errors.vehicle_type_id}
                      </small>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group col-md-6">
                <label>Vehicle Description</label>
                <div className="input-with-icon">
                  <Tooltip title="Enter a description for the vehicle" arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                  <div className="field">
                    <input
                      value={formData.vehicle_description}
                      type="text"
                      className="form-control company"
                      name="vehicle_description"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Vehicle Registration No</label>
                <div className="input-with-icon">
                  <Tooltip title="Add the vehicle driver name if known" arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                  <div className="field">
                    <input
                      value={formData.vehicle_reg} // ✅ Corrected value
                      className="form-control company"
                      type="text"
                      name="vehicle_reg"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group col-md-6">
                <label>Vehicle Driver Name</label>
                <div className="input-with-icon">
                  <Tooltip title="Add the vehicle driver name if known" arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                  <div className="field">
                    <input
                      value={formData.driver_name}
                      className="form-control company"
                      type="text"
                      name="driver_name"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Carriers Name</label>
                <div className="input-with-icon">
                  <Tooltip title="Add the name of the Carrier" arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                  <div className="field">
                    <input
                      value={formData.vehicle_name}
                      className="form-control company"
                      type="text"
                      name="vehicle_name"
                      onChange={handleChange}
                    />
                    {errors.vehicle_name && (
                      <small className="text-danger">{errors.vehicle_name}</small>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-group col-md-6">
                <label>Phone No</label>
                <div className="input-with-icon">
                  <Tooltip title="Add the Carrier company's phone number" arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                  <div className="field">
                    <input
                      value={formData.phone_no}
                      className="form-control company"
                      type="text"
                      name="phone_no"
                      onChange={handleChange}
                    />
                    {errors.phone_no && (
                      <small className="text-danger">{errors.phone_no}</small>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Carrier License No</label>
                <div className="input-with-icon">
                  <Tooltip title="Add the Waste Carrier's licence number. To find the licence number, please visit https://environment.data.gov.uk/public-register/view/search-waste-carriers-brokers" arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>

                  <div className="field">
                    <input
                      value={formData.vehicle_license}
                      className="form-control company"
                      type="text"
                      name="vehicle_license"
                      onChange={handleChange}
                    />
                    {errors.vehicle_license && (
                      <small className="text-danger">{errors.vehicle_license}</small>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-group col-md-6">
                <label>Carrier's License Expiry Date</label>
                <div className="input-with-icon">
                  <Tooltip
                    title="Add the expiry date of the licence. This can be found on the above website."
                    arrow
                  >
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                  <div className="field">
                    <input
                      value={formData.vehicle_license_expire_date}
                      type="date"
                      className="form-control company"
                      name="vehicle_license_expire_date"
                      onChange={handleChange}
                    />
                    {errors.vehicle_license_expire_date && (
                      <small className="text-danger">
                        {errors.vehicle_license_expire_date}
                      </small>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Carriers Address 1</label>
                <div className="input-with-icon">
                  <Tooltip title="Add the Carrier's address. Ensure this is the address on the Carrier's licence." arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                  <div className="field">
                    <input
                      value={formData.vehicle_address_1}
                      className="form-control company"
                      type="text"
                      name="vehicle_address_1"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group col-md-6">
                <label>Carriers Address 2</label>
                <div className="input-with-icon">
                  <Tooltip
                    title="Add the Carrier's address. Ensure this is the address on the Carrier's licence."
                    arrow
                  >
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                  <div className="field">
                    <input
                      value={formData.vehicle_address_2}
                      className="form-control company"
                      type="text"
                      name="vehicle_address_2"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Carriers Address 3</label>
                <div className="input-with-icon">
                  <Tooltip title="Add the Carrier's address. Ensure this is the address on the Carrier's licence." arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                  <div className="field">
                    <input
                      value={formData.vehicle_address_3}
                      className="form-control company"
                      type="text"
                      name="vehicle_address_3"
                      onChange={handleChange}
                    />
                  </div>
                </div>

              </div>

              <div className="form-group col-md-6">
                <label>Carriers Address 4</label>
                <div className="input-with-icon">
                  <Tooltip
                    title="Add the Carrier's address. Ensure this is the address on the Carrier's licence."
                    arrow
                  >
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                  <div className="field">
                    <input
                      value={formData.vehicle_address_4}
                      className="form-control company"
                      type="text"
                      name="vehicle_address_4"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Carriers Postcode</label>
                <div className="input-with-icon">
                  <Tooltip title="Add the Carrier's postcode." arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                  <div className="field">
                    <input
                      value={formData.vehicle_postcode}
                      className="form-control company"
                      type="text"
                      name="vehicle_postcode"
                      onChange={handleChange}
                    />
                  </div>
                </div>

              </div>

              <div className="form-group col-md-6">
                <label>Vehicle Fuel Type</label>
                <div className="input-with-icon">
                  <Tooltip
                    title="Select the Vehicle Type from the drop-down menu"
                    arrow
                  >
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                  <div className="field">
                    <Select
                      className="searchable_dropdown"
                      options={fuelTypes}
                      // value={formData.depotTypeId}
                      value={fuelTypes.find(option => option.value === formData.fuel_type_id)}
                      onChange={handleFuelTypeChange}
                      placeholder="Select Depot Type"
                      isSearchable
                      styles={customSelectStyles}
                    />
                    {errors.fuel_type_id && (
                      <small className="text-danger">{errors.fuel_type_id}</small>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Vehicle Tare Weight</label>
                <div className="input-with-icon">
                  <Tooltip title="Enter the tare weight of the vehicle" arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                  <div className="field">
                    <input
                      value={formData.vehicle_tare_weight}
                      className="form-control company"
                      type="text"
                      name="vehicle_tare_weight"
                      onChange={handleChange}
                    />

                    {errors.vehicle_tare_weight && (
                      <small className="text-danger">
                        {errors.vehicle_tare_weight}
                      </small>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group col-md-6">
                <label>Vehicle Owner</label>
                <div className="input-with-icon">
                  <Tooltip title="Select the owner of the vehicle" arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                  <div className="field">
                    <Select
                      className="searchable_dropdown"
                      options={vehicleOwnerOptions}
                      // value={formData.vehicle_owner}
                      value={vehicleOwnerOptions.find(option => option.value === formData.vehicle_owner)}
                      onChange={handleVehicleOwnerChange}
                      placeholder="Select Owner"
                      isSearchable
                      styles={customSelectStyles}
                    />
                    {errors.vehicle_owner && (
                      <small className="text-danger">{errors.vehicle_owner}</small>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label className="label" htmlFor="contractName">
                  Contract Name
                </label>
                <div className="input-with-icon">
                  <Tooltip title="Select the main function of the Depot." arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                  <div className="field">
                    <input
                      type="text"
                      className="form-control company"
                      id="contractName"
                      name="contractName"
                      value={formData.contractName || ""}
                      placeholder="Contract Name"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="form-group col-md-6">
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className=" company-setup-container mt-0 ">
        <button
          type="button"
          className="btn btn-secondary prevbtn"
          onClick={handlePreviousClick}
        ><Tooltip title="Click 'Previous' to go back and Update your Depot details." arrow>
            Previous Step
          </Tooltip>
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="btn next btn-primary final-submit"
        >
          <Tooltip
            title="Click 'Submit' to save the forwarding facility details."
            arrow
          >
            Submit
          </Tooltip>
        </button>
      </div>
    </>
  );
};

export default VehicleForm;
