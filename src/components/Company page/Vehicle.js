import React, { useState, useEffect } from "react";
import "./Vehicle.css";
import Authapi from "../../Authapi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Stepper, Step } from "react-form-stepper";
import "./Company.css";

const VehicleForm = () => {
  const [formData, setFormData] = useState({
    vehicle_type_id: "",
    vehicle_description: "",
    driver_name: "",
    vehicle_name: "",
    phone_no: "",
    vehicle_license_expire_date: "",
    fuel_type_id: "",
    vehicle_tare_weight: "",
    vehicle_owner: "",
    contract_id: "",
  });
  const [fuelTypes, setFuelTypes] = useState([]);
  const [activeStep, setActiveStep] = useState(4);
  const [vehicletype, setVehicleType] = useState([]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // const handlePreviousClick = () => {
  //   navigate("/depot");
  // };

  const handlePreviousClick = async () => {
    try {
      const response = await Authapi.getUserDepotdetail();
      console.log(response);

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
        console.log("Redirecting to /depot");
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
    const fetchFuelTypes = async () => {
      try {
        const response = await Authapi.getfualtypesdata();
        console.log("Fuel types data:", response);
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
        console.log("Vehicle types data:", response);

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
    const getUservehicledetail = async () => {
      try {
        const response = await Authapi.getUservehicledetail();
        if (response.status === 200) {
          const Vehicle = response.Vehicle;
          setFormData({

            vehicle_type_id: Vehicle.vehicle_type_id || "",
            vehicle_description: Vehicle.vehicle_description || "",
            driver_name: Vehicle.driver_name || "",
            vehicle_name: Vehicle.vehicle_name || "",
            phone_no: Vehicle.phone_no || "",
            vehicle_license_expire_date: Vehicle.vehicle_license_expire_date || "",
            fuel_type_id: Vehicle.fuel_type_id || "",
            vehicle_tare_weight: Vehicle.vehicle_tare_weight || "",
            vehicleOwnerValue: Vehicle.vehicleOwnerValue || "",
            contract_id: Vehicle.contract_id || "",
          });
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    getUservehicledetail();
  }, []);

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        const response = await Authapi.getUserContractdetail();
        console.log("Contract details:", response);

        if (response.status === 200 && response.contract) {
          // Update the formData with contract_id
          setFormData((prevData) => ({
            ...prevData,
            contract_id: response.contract.id || "", // Correct contract ID mapping
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

    // Map the vehicle_owner to the appropriate database value
    const vehicleOwnerValue =
      formData.vehicle_owner === "contract_name" ? 1 : 2;

    try {
      const response = await Authapi.userVehicleDetails({
        vehicle_type_id: formData.vehicle_type_id,
        vehicle_description: formData.vehicle_description,
        driver_name: formData.driver_name,
        vehicle_name: formData.vehicle_name,
        phone_no: formData.phone_no,
        vehicle_license_expire_date: formData.vehicle_license_expire_date,
        fuel_type_id: formData.fuel_type_id,
        vehicle_tare_weight: formData.vehicle_tare_weight,
        vehicle_owner: vehicleOwnerValue,
        contract_id: formData.contract_id,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Vehicle Details Submitted",
          text: "Your vehicle details have been successfully submitted.",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/success");
        });
      } else {
        throw new Error(response.message || "Failed to submit vehicle details");
      }
    } catch (error) {
      console.error("Vehicle submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error.message ||
          "Failed to submit vehicle details. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <>
      <h2 className="header">Vehicle</h2>
      <p className="firstcontent">
        Please fill the form below to set up a Vehicle! Add as many details as
        required and proceed.
      </p>
      <div className="container abcd mt-5">
        <Stepper activeStep={activeStep} onStepClick={handleStepChange}>
          <Step label="Company" />
          <Step label="Contract" />
          <Step label="Depot" />
          <Step label="Vehicle" />
          <Step label="Completed" />

        </Stepper>
        <div className="pro-under-border"></div>
        <div className="p-4 content">
          <h5 className="title">Vehicle details</h5>
          <p className="description">
            Please fill your information so we can get in touch with you.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group col-md-6">
                {/* <label>Vehicle Type</label>
                <input
                  className="form-control company"
                  type="text"
                  name="vehicle_type_id"
                  onChange={handleChange}
                /> */}
                <label>Vehicle Type</label>
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

              <div className="form-group col-md-6">
                <label>Vehicle Description</label>
                <input
                  value={formData.vehicle_description}
                  type="text"
                  className="form-control company"
                  name="vehicle_description"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Vehicle Driver Name</label>
                <input
                  value={formData.driver_name}
                  className="form-control company"
                  type="text"
                  name="driver_name"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group col-md-6">
                <label>Carriers Name</label>
                <input
                  value={formData.vehicle_name}
                  className="form-control company"
                  type="text"
                  name="vehicle_name"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Phone No</label>
                <input
                  value={formData.phone_no}
                  className="form-control company"
                  type="text"
                  name="phone_no"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group col-md-6">
                <label>Carrier's License Expiry Date</label>
                <input
                  value={formData.vehicle_license_expire_date}
                  type="date"
                  className="form-control company"
                  name="vehicle_license_expire_date"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Vehicle Fuel Type</label>
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

              <div className="form-group col-md-6">
                <label>Vehicle Tare Weight</label>
                <input
                  value={formData.vehicle_tare_weight}
                  className="form-control company"
                  type="text"
                  name="vehicle_tare_weight"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Vehicle Owner</label>
                <select
                  value={formData.vehicle_owner}
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

              {/* <div className="form-group col-md-6">
                <label>Contract ID</label>
                <input
                  className="form-control company"
                  type="text"
                  name="contract_id"
                  onChange={handleChange}
                />
              </div> */}


              <div className="form-group col-md-6">
                <label className="label" htmlFor="contractName">
                  Contract ID
                </label>
                <input
                  type="text"
                  className="form-control company"
                  id="contractName"
                  name="contract_id"
                  value={formData.contract_id || ""}
                  placeholder="Contract ID"
                  disabled
                />
              </div>
            </div>
            {/* <div className="form-actions">
              <button type="button">Previous step</button>
              <button type="submit">Submit</button>
            </div> */}
          </form>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-6">
            <button
              type="button"
              className="btn btn-secondary formbtn vhicalbuttons "
              onClick={handlePreviousClick}
            >
              Previous step
            </button>
          </div>
          <div className="col-6">
            <button
              type="button"
              className="btn next btn-primary formbtn next1 vhicalbuttons submit"
              onClick={handleSubmit}
            >
              submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleForm;
