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

const VehicleForm = () => {
  // const [formData, setFormData] = useState({
  //   vehicle_type_id: "",
  //   vehicle_description: "",
  //   driver_name: "",
  //   vehicle_name: "",
  //   phone_no: "",
  //   vehicle_license_expire_date: "",
  //   fuel_type_id: "",
  //   vehicle_tare_weight: "",
  //   vehicle_owner: "",
  //   contract_id: "",
  //   contractName: "",
  // });
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
      newErrors.vehicle_name = "Vehicle Name is required";

    // Phone number validation: check if it's provided and matches the 10-digit format
    if (!formData.phone_no) {
      newErrors.phone_no = "Phone Number is required";
    } else if (formData.phone_no.length !== 10) {
      newErrors.phone_no = "Phone Number must be exactly 10 digits";
    }

    if (!formData.vehicle_license_expire_date)
      newErrors.vehicle_license_expire_date = "License Expiry Date is required";
    if (!formData.fuel_type_id)
      newErrors.fuel_type_id = "Fuel Type is required";
    if (!formData.vehicle_tare_weight)
      newErrors.vehicle_tare_weight = "Vehicle Tare Weight is required";
    if (!formData.vehicle_owner)
      newErrors.vehicle_owner = "Vehicle Owner is required";

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // const handlePreviousClick = () => {
  //   navigate("/depot");
  // };

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

  // const handlePreviousClick = async () => {
  //   try {
  //     const response = await Authapi.getUserDepotdetail();

  //     console.log(response);

  //     if (response.status === 200 && response.depots && response.depots.depot_postcode) {
  //       console.log("Depot Postcode:", response.depots.depot_postcode);
  //       navigate("/depot", {
  //         state: { formData: { depotpostcode: response.depots.depot_postcode } }
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
    const fetchFuelTypes = async () => {
      try {
        const response = await Authapi.getfualtypesdata();
        // console.log("Fuel types data:", response);
        if (response && response.length > 0) {
          setFuelTypes(response);
        } else {
          console.warn("No fuel types data received");
        }
      } catch (error) {
        console.error("Failed to fetch fuel types:", error);
      }
    };
    const getVhicalTypeName = async () => {
      try {
        const response = await Authapi.userVehicleTypes();
        // console.log("Vehicle types data:", response);

        if (response && response.length > 0) {
          // Set the state with the fetched vehicle types
          setVehicleType(response);
        } else {
          console.warn("No vehicle types data received");
        }
      } catch (error) {
        console.error("Failed to fetch vehicle types:", error);
      }
    };

    getVhicalTypeName();
    fetchFuelTypes();
  }, []);

  useEffect(() => {
    // const getUservehicledetail = async () => {
    //   try {
    //     const response = await Authapi.getUservehicledetail();
    //     if (response.status === 200) {
    //       const Vehicle = response.Vehicle;
    //       // console.log(Vehicle.vehicle_owner);
    //       // console.log(Vehicle.vehicle_owner);
    //       // console.log(Vehicle.vehicle_owner === '1');
    //       const vehicleOwnerMapped =
    //         Vehicle.vehicle_owner == "1"
    //           ? "contract_name"
    //           : "third_party_carrier";
    //       // console.log(vehicleOwnerMapped);
    //       setFormData({
    //         vehicle_type_id: Vehicle.vehicle_type_id || "",
    //         vehicle_description: Vehicle.vehicle_description || "",
    //         driver_name: Vehicle.driver_name || "",
    //         vehicle_name: Vehicle.vehicle_name || "",
    //         phone_no: Vehicle.phone_no || "",
    //         vehicle_license_expire_date:
    //           Vehicle.vehicle_license_expire_date || "",
    //         fuel_type_id: Vehicle.fuel_type_id || "",
    //         vehicle_tare_weight: Vehicle.vehicle_tare_weight || "",
    //         vehicle_owner: vehicleOwnerMapped || "",
    //         contract_id: Vehicle.contract_id || "",
    //       });
    //     }
    //   } catch (error) {
    //     console.error("Error fetching company details:", error);
    //   }
    // };

    const getUservehicledetail = async () => {
      try {
        const response = await Authapi.getUservehicledetail();
        
        if (response?.status === 200 && response?.vehicle) {
          const { vehicle } = response;
    
          setFormData((prevData) => ({
            contract_id: vehicle.contract_id || prevData.contract_id || "",
            vehicle_type_id: vehicle.vehicle_type_id || prevData.vehicle_type_id || "",
            tip_id: vehicle.tip_id || prevData.tip_id || "",
            user_tip_id: vehicle.user_tip_id || prevData.user_tip_id || "",
            vehicle_description: vehicle.vehicle_description || prevData.vehicle_description || "",
            vehicle_reg: vehicle.vehicle_reg || prevData.vehicle_reg || "",
            vehicle_name: vehicle.vehicle_name || prevData.vehicle_name || "",
            phone_no: vehicle.phone_no || prevData.phone_no || "",
            vehicle_license: vehicle.vehicle_license || prevData.vehicle_license || "",
            vehicle_license_expire_date: vehicle.vehicle_license_expire_date || prevData.vehicle_license_expire_date || "",
            vehicle_address_1: vehicle.vehicle_address_1 || prevData.vehicle_address_1 || "",
            vehicle_address_2: vehicle.vehicle_address_2 || prevData.vehicle_address_2 || "",
            vehicle_address_3: vehicle.vehicle_address_3 || prevData.vehicle_address_3 || "",
            vehicle_address_4: vehicle.vehicle_address_4 || prevData.vehicle_address_4 || "",
            vehicle_postcode: vehicle.vehicle_postcode || prevData.vehicle_postcode || "",
            vehicle_owner: vehicle.vehicle_owner || prevData.vehicle_owner || "",
            vehicle_emissions: vehicle.vehicle_emissions || prevData.vehicle_emissions || "",
            vehicle_ppm: vehicle.vehicle_ppm || prevData.vehicle_ppm || "",
            vehicle_load: vehicle.vehicle_load || prevData.vehicle_load || "",
            vehicle_tare_weight: vehicle.vehicle_tare_weight || prevData.vehicle_tare_weight || "",
            fuel_type_id: vehicle.fuel_type_id || prevData.fuel_type_id || "",
            driver_name: vehicle.driver_name || prevData.driver_name || "",
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!validateForm()) return;
  //   // Map the vehicle_owner to the appropriate database value
  //   const vehicleOwnerValue =
  //     formData.vehicle_owner === "contract_name" ? 1 : 2;

  //   try {
  //     const response = await Authapi.userVehicleDetails({
  //       vehicle_type_id: formData.vehicle_type_id,
  //       vehicle_description: formData.vehicle_description,
  //       driver_name: formData.driver_name,
  //       vehicle_name: formData.vehicle_name,
  //       phone_no: formData.phone_no,
  //       vehicle_license_expire_date: formData.vehicle_license_expire_date,
  //       fuel_type_id: formData.fuel_type_id,
  //       vehicle_tare_weight: formData.vehicle_tare_weight,
  //       vehicle_owner: vehicleOwnerValue,
  //       contract_id: formData.contract_id,
  //     });

  //     if (response.status === 200) {
  //       // Swal.fire({
  //       //   icon: "success",
  //       //   title: "Vehicle Details Submitted",
  //       //   text: "Your vehicle details have been successfully submitted.",
  //       //   confirmButtonText: "OK",
  //       // }).then(() => {
  //       // });
  //       sessionStorage.setItem(
  //         "successMessage",
  //         "Depot Setup Complete! Your Depot has been successfully registered."
  //       );

  //       navigate("/success");
  //     } else {
  //       throw new Error(response.message || "Failed to submit vehicle details");
  //     }
  //   } catch (error) {
  //     console.error("Vehicle submission error:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Submission Failed",
  //       text:
  //         error.message ||
  //         "Failed to submit vehicle details. Please try again.",
  //       confirmButtonText: "OK",
  //     });
  //   }
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!validateForm()) return;

  //   // Map the vehicle_owner to database value (1 = contract_name, 2 = third_party_carrier)
  //   const vehicleOwnerValue =
  //     formData.vehicle_owner === "contract_name" ? 1 : 2;

  //   try {
  //     const response = await Authapi.userVehicleDetails({
  //       contract_id: formData.contract_id,
  //       vehicle_type_id: formData.vehicle_type_id,
  //       tip_id: formData.tip_id,
  //       user_tip_id: formData.user_tip_id,
  //       vehicle_description: formData.vehicle_description,
  //       vehicle_reg: formData.vehicle_reg,
  //       vehicle_name: formData.vehicle_name,
  //       phone_no: formData.phone_no,
  //       vehicle_license: formData.vehicle_license,
  //       vehicle_license_expire_date: formData.vehicle_license_expire_date,
  //       vehicle_address_1: formData.vehicle_address_1,
  //       vehicle_address_2: formData.vehicle_address_2,
  //       vehicle_address_3: formData.vehicle_address_3,
  //       vehicle_address_4: formData.vehicle_address_4,
  //       vehicle_postcode: formData.vehicle_postcode,
  //       vehicle_owner: vehicleOwnerValue,
  //       vehicle_emissions: formData.vehicle_emissions,
  //       vehicle_ppm: formData.vehicle_ppm,
  //       vehicle_load: formData.vehicle_load,
  //       vehicle_tare_weight: formData.vehicle_tare_weight,
  //       fuel_type_id: formData.fuel_type_id,
  //       driver_name: formData.driver_name,
  //     });

  //     if (response.status === 200) {
  //       sessionStorage.setItem(
  //         "successMessage",
  //         "Depot Setup Complete! Your Depot has been successfully registered."
  //       );
  //       navigate("/success");
  //     } else {
  //       throw new Error(
  //         response.message || "Failed to submit vehicle details."
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Vehicle submission error:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Submission Failed",
  //       text:
  //         error.message ||
  //         "An unexpected error occurred while submitting vehicle details. Please try again.",
  //       confirmButtonText: "OK",
  //     });
  //   }
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   if (!validateForm()) return;
  
  //   // Map vehicle_owner to appropriate database value
  //   const vehicleOwnerValue = formData.vehicle_owner === "contract_name" ? 1 : 2;
  
  //   try {
  //     const response = await Authapi.userVehicleDetails({
  //       vehicle_type_id: formData.vehicle_type_id,
  //       vehicle_description: formData.vehicle_description,
  //       driver_name: formData.driver_name,
  //       vehicle_name: formData.vehicle_name,
  //       phone_no: formData.phone_no,
  //       vehicle_license_expire_date: formData.vehicle_license_expire_date,
  //       fuel_type_id: formData.fuel_type_id,
  //       vehicle_tare_weight: formData.vehicle_tare_weight,
  //       vehicle_owner: vehicleOwnerValue,
  //       contract_id: formData.contract_id,
        
  //       // ✅ Add Address Fields
  //       vehicle_address_1: formData.vehicle_address_1,
  //       vehicle_address_2: formData.vehicle_address_2,
  //       vehicle_address_3: formData.vehicle_address_3,
  //       vehicle_address_4: formData.vehicle_address_4,
  //       vehicle_postcode: formData.vehicle_postcode,
  //     });
  
  //     if (response.status === 200) {
  //       sessionStorage.setItem(
  //         "successMessage",
  //         "Depot Setup Complete! Your Depot has been successfully registered."
  //       );
  //       navigate("/success");
  //     } else {
  //       throw new Error(response.message || "Failed to submit vehicle details");
  //     }
  //   } catch (error) {
  //     console.error("Vehicle submission error:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Submission Failed",
  //       text: error.message || "Failed to submit vehicle details. Please try again.",
  //       confirmButtonText: "OK",
  //     });
  //   }
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   if (!validateForm()) return;
  
  //   // Map vehicle_owner to appropriate database value
  //   const vehicleOwnerValue = formData.vehicle_owner === "contract_name" ? 1 : 2;
  
  //   try {
  //     const response = await Authapi.userVehicleDetails({
  //       contract_id: formData.contract_id,
  //       vehicle_type_id: formData.vehicle_type_id,
  //       tip_id: formData.tip_id,
  //       user_tip_id: formData.user_tip_id,
  //       vehicle_description: formData.vehicle_description,
  //       vehicle_reg: formData.vehicle_reg,
  //       vehicle_name: formData.vehicle_name,
  //       phone_no: formData.phone_no,
  //       vehicle_license: formData.vehicle_license,
  //       vehicle_license_expire_date: formData.vehicle_license_expire_date,
  //       vehicle_address_1: formData.vehicle_address_1,
  //       vehicle_address_2: formData.vehicle_address_2,
  //       vehicle_address_3: formData.vehicle_address_3,
  //       vehicle_address_4: formData.vehicle_address_4,
  //       vehicle_postcode: formData.vehicle_postcode,
  //       vehicle_owner: vehicleOwnerValue,
  //       vehicle_emissions: formData.vehicle_emissions,
  //       vehicle_ppm: formData.vehicle_ppm,
  //       vehicle_load: formData.vehicle_load,
  //       vehicle_tare_weight: formData.vehicle_tare_weight,
  //       fuel_type_id: formData.fuel_type_id,
  //       driver_name: formData.driver_name,
  //     });
  
  //     if (response.status === 200) {
  //       sessionStorage.setItem(
  //         "successMessage",
  //         "Depot Setup Complete! Your Depot has been successfully registered."
  //       );
  //       navigate("/success");
  //     } else {
  //       throw new Error(response.message || "Failed to submit vehicle details");
  //     }
  //   } catch (error) {
  //     console.error("Vehicle submission error:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Submission Failed",
  //       text: error.message || "Failed to submit vehicle details. Please try again.",
  //       confirmButtonText: "OK",
  //     });
  //   }
  // };
   const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return; // Ensure the form is valid before proceeding

  // Map vehicle_owner to appropriate database value
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
      vehicle_owner: vehicleOwnerValue,
      vehicle_emissions: formData.vehicle_emissions,
      vehicle_ppm: formData.vehicle_ppm,
      vehicle_load: formData.vehicle_load,
      vehicle_tare_weight: formData.vehicle_tare_weight,
      fuel_type_id: formData.fuel_type_id,
      driver_name: formData.driver_name,
    });

    // Check if the request was successful
    if (response.status === 200 || response?.data?.success) {
      Swal.fire({
        icon: "success",
        title: "Depot Setup Complete!",
        text: "Your Depot has been successfully registered.",
        confirmButtonText: "OK",
      }).then(() => {
        sessionStorage.setItem(
          "successMessage",
          "Depot Setup Complete! Your Depot has been successfully registered."
        );
        navigate("/success");
      });
    } else {
      throw new Error(response?.message || "Failed to submit vehicle details");
    }
  } catch (error) {
    console.error("Vehicle submission error:", error);

    Swal.fire({
      icon: "error",
      title: "Submission Failed",
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
      <h2 className="header">Vehicle</h2>
      <p className="firstcontent">
        Please fill the form below to set up a Vehicle! Add as many details as
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
          <h5 className="title">Vehicle details</h5>
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
                  <select
                    className="form-control company"
                    name="vehicle_type_id"
                    value={formData.vehicle_type_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Vehicle Type</option>
                    {vehicletype.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.vehicle_type_name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.vehicle_type_id && (
                  <small className="text-danger">
                    {errors.vehicle_type_id}
                  </small>
                )}
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
                  <input
                    value={formData.vehicle_description}
                    type="text"
                    className="form-control company"
                    name="vehicle_description"
                    onChange={handleChange}
                  />
                </div>
                {/* {errors.vehicle_description && (
                  <small className="text-danger">
                    {errors.vehicle_description}
                  </small>
                )} */}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Vehicle Registration No :</label>
                <div className="input-with-icon">
                  <Tooltip title="Add the vehicle driver name if known" arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                  <input
                    value={formData.vehicle_reg} // ✅ Corrected value
                    className="form-control company"
                    type="text"
                    name="vehicle_reg"
                    onChange={handleChange}
                  />
                  {/* <input
                    value={formData.vehicle_description}
                    type="text"
                    className="form-control"
                    name="vehicle_description"
                    onChange={handleChange}
                  /> */}
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
                  <input
                    value={formData.driver_name}
                    className="form-control company"
                    type="text"
                    name="driver_name"
                    onChange={handleChange}
                  />
                </div>
                {/* {errors.driver_name && (
                  <small className="text-danger">{errors.driver_name}</small>
                )} */}
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
                  <input
                    value={formData.vehicle_name}
                    className="form-control company"
                    type="text"
                    name="vehicle_name"
                    onChange={handleChange}
                  />
                </div>
                {errors.vehicle_name && (
                  <small className="text-danger">{errors.vehicle_name}</small>
                )}
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
                  <input
                    value={formData.phone_no}
                    className="form-control company"
                    type="text"
                    name="phone_no"
                    onChange={handleChange}
                  />
                </div>
                {errors.phone_no && (
                  <small className="text-danger">{errors.phone_no}</small>
                )}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Carrier License No</label>
                <div className="input-with-icon">
                  <Tooltip title="Add the Carrier company's phone number" arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                  <input
                    value={formData.vehicle_license}
                    className="form-control company"
                    type="text"
                    name="vehicle_license"
                    onChange={handleChange}
                  />
                </div>
                {/* {errors.phone_no && (
                  <small className="text-danger">{errors.phone_no}</small>
                )} */}
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
                  <input
                    value={formData.vehicle_license_expire_date}
                    type="date"
                    className="form-control company"
                    name="vehicle_license_expire_date"
                    onChange={handleChange}
                  />
                </div>
                {errors.vehicle_license_expire_date && (
                  <small className="text-danger">
                    {errors.vehicle_license_expire_date}
                  </small>
                )}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Carriers Address 1:</label>
                <div className="input-with-icon">
                  <Tooltip title="Add the Carrier company's phone number" arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                  <input
                    value={formData.vehicle_address_1}
                    className="form-control company"
                    type="text"
                    name="vehicle_address_1"
                    onChange={handleChange}
                  />
                </div>
               
              </div>
              <div className="form-group col-md-6">
                <label>Carriers Address 2:</label>
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
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Carriers Address 3:</label>
                <div className="input-with-icon">
                  <Tooltip title="Add the Carrier company's phone number" arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                  <input
                    value={formData.vehicle_address_3}
                    className="form-control company"
                    type="text"
                    name="vehicle_address_3"
                    onChange={handleChange}
                  />
                </div>
               
              </div>

              <div className="form-group col-md-6">
                <label>Carriers Address 4:</label>
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

            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Carriers Postcode :</label>
                <div className="input-with-icon">
                  <Tooltip title="Add the Carrier company's phone number" arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                  {/* <input
                    // value={formData.}
                    className="form-control company"
                    type="text"
                    name=""
                    onChange={handleChange}
                  /> */}
                  <input
  value={formData.vehicle_postcode}
  className="form-control company"
  type="text"
  name="vehicle_postcode"
  onChange={handleChange}
/>
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
                  <select
                    value={formData.fuel_type_id}
                    className="form-control company"
                    name="fuel_type_id"
                    onChange={handleChange}
                  >
                    <option value="">Select Fuel Type</option>
                    {fuelTypes.map((fuelType) => (
                      <option key={fuelType.id} value={fuelType.id}>
                        {fuelType.fuel_type_name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.fuel_type_id && (
                  <small className="text-danger">{errors.fuel_type_id}</small>
                )}
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
                  <input
                    value={formData.vehicle_tare_weight}
                    className="form-control company"
                    type="text"
                    name="vehicle_tare_weight"
                    onChange={handleChange}
                  />
                </div>
                {errors.vehicle_tare_weight && (
                  <small className="text-danger">
                    {errors.vehicle_tare_weight}
                  </small>
                )}
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
                  <select
                    value={formData.vehicle_owner || ""}
                    className="form-control company"
                    name="vehicle_owner"
                    onChange={handleChange}
                  >
                    <option value="">Select Owner</option>
                    <option value="contract_name">Contract Name</option>
                    <option value="third_party_carrier">
                      Third Party Carrier
                    </option>
                  </select>
                </div>
                {errors.vehicle_owner && (
                  <small className="text-danger">{errors.vehicle_owner}</small>
                )}
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
        >
          Previous step
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
            submit
          </Tooltip>
        </button>
      </div>
    </>
  );
};

export default VehicleForm;
