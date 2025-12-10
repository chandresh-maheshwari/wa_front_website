import React, { useState, useEffect } from "react";
import Authapi from "../../Authapi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Stepper from "react-stepper-horizontal";
import "./Company.css";
import Expired from "../CheckTokenExpier";
import Navlayout from "../../Wa-Frontend/NavLayout";
import Tooltip from "@mui/material/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import customSelectStyles from "../../CustomSelectStyles";
import Select from "react-select";
import { RotatingLines } from "react-loader-spinner";


const VehicleForm = () => {
  const [formData, setFormData] = useState({
    contract_id: "",
    site_name: "",
    site_description: "",
    site_address_1: "",
    site_address_2: "",
    site_address_3: "",
    site_address_4: "",
    site_phone_no: "",
    site_email: "",
    site_postcode: "",
    district_council_id: "",
    county_id: "",
    origin_id: "",

    job_code: "",
    job_type_id: "",
    client_name: "",
    // purchase_order: "",
    job_description: "",
    job_code: "",
  });

  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(3);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const [fuelTypes, setFuelTypes] = useState([]);
  const [vehicleOwner, setVehicleOwner] = useState([]);
  const [vehicletype, setVehicleType] = useState([]);

  const [countytypes, setCountyTypes] = useState([]);
  const [districtCouncil, setDistrictCouncilData] = useState([]);
  const [origin, setOriginData] = useState([]);
  const [jobtype, setJobTypeData] = useState([]);
  const [SubContractCompany, setSubContractCompanyData] = useState([]);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: "" });

    if (name === "site_phone_no") {
      if (/^\d{0,12}$/.test(value)) {
        setFormData({ ...formData, [name]: value });

        if (value.length === 0) {
          setErrors({
            ...errors,
            site_phone_no: "Site Telephone is required"
          });
        } else if (value.length < 10) {
          setErrors({
            ...errors,
            site_phone_no: "Phone number must be at least 10 digits"
          });
        } else {
          setErrors({ ...errors, site_phone_no: "" });
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Phone number validation
    if (!formData.site_phone_no) {
      newErrors.site_phone_no = "Site Telephone is required.";
    } else if (!/^\d{10,12}$/.test(formData.site_phone_no)) {
      newErrors.site_phone_no = "Phone number must be between 10 and 12 digits.";
    }

    // Only validate required fields
    if (!formData.site_name) {
      newErrors.site_name = "Site Name is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };


  const handleDistrictCouncilChange = (selectedOption) => {
    setFormData({ ...formData, district_council_id: selectedOption ? selectedOption.value : "" });

    setErrors({ ...errors, district_council_id: "" });

  };

  const handleCountyChange = (selectedOption) => {
    setFormData({ ...formData, county_id: selectedOption ? selectedOption.value : "" });
  };



  const handleRegionChange = (selectedOption) => {
    setFormData({ ...formData, origin_id: selectedOption ? selectedOption.value : "" });

    setErrors({ ...errors, origin_id: "" });

  };

  const handleJobTypeChange = (selectedOption) => {
    setFormData({ ...formData, job_type_id: selectedOption ? selectedOption.value : "" });

    setErrors({ ...errors, job_type_id: "" });

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

  useEffect(() => {
    // getUserDepotTypeName();
    getcountyName();
    getDistrictCouncildata();
    getOrigindata();
    getJobTypedata();
    getSubContractCompanydata();
  }, []);

  const getcountyName = async () => {

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


  const getDistrictCouncildata = async () => {
    try {
      // alert(21123);
      // console.log("asdasdasd");
      const data = await Authapi.getDistrictCouncildata();
      // console.log("Fuel types data:", data);
      if (data && data.length > 0) {
        // setFuelTypes(response);
        const options = data.map((districtCouncil) => ({
          value: districtCouncil.id,
          label: districtCouncil.name,
        }));
        setDistrictCouncilData(options);
      } else {
        console.warn("No fuel types data received");
      }
    } catch (error) {
      console.error("Failed to fetch fuel types:", error);
    }
  };

  const getOrigindata = async () => {
    try {
      // alert(21123);
      // console.log("asdasdasd");
      const data = await Authapi.getOrigindata();
      // console.log("Fuel types data:", data);
      if (data && data.length > 0) {
        // setFuelTypes(response);
        const options = data.map((origin) => ({
          value: origin.id,
          label: origin.name,
        }));
        setOriginData(options);
      } else {
        console.warn("No fuel types data received");
      }
    } catch (error) {
      console.error("Failed to fetch fuel types:", error);
    }
  };

  const getJobTypedata = async () => {
    try {
      // alert(21123);
      // console.log("asdasdasd");
      const data = await Authapi.getJobTypedata();
      // console.log("Fuel types data:", data);
      if (data && data.length > 0) {
        // setFuelTypes(response);
        const options = data.map((origin) => ({
          value: origin.id,
          label: origin.job_type_name,
        }));
        setJobTypeData(options);
      } else {
        console.warn("No fuel types data received");
      }
    } catch (error) {
      console.error("Failed to fetch fuel types:", error);
    }
  };


  const getSubContractCompanydata = async () => {
    try {
      // alert(21123);
      // console.log("asdasdasd");
      const data = await Authapi.getSubContractCompanydata();
      // console.log("Fuel types data:", data);
      if (data && data.length > 0) {
        // setFuelTypes(response);
        const options = data.map((subcontractcompany) => ({
          value: subcontractcompany.id,
          label: subcontractcompany.company_name,
        }));
        setSubContractCompanyData(options);
      } else {
        console.warn("No fuel types data received");
      }
    } catch (error) {
      console.error("Failed to fetch fuel types:", error);
    }
  };

  // const fetchFuelTypes = async () => {
  //   try {
  //     const data = await Authapi.getfualtypesdata();
  //     // console.log("Fuel types data:", data);
  //     if (data && data.length > 0) {
  //       // setFuelTypes(response);
  //       const options = data.map((fualType) => ({
  //         value: fualType.id,
  //         label: fualType.fuel_type_name,
  //       }));
  //       setFuelTypes(options);
  //     } else {
  //       console.warn("No fuel types data received");
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch fuel types:", error);
  //   }
  // };

  // useEffect(() => {
  //   const message = sessionStorage.getItem("successMessage");
  //   if (message) {
  //     setSuccessMessage(message);
  //     // Clear the message after it's displayed
  //     sessionStorage.removeItem("successMessage");

  //     // Remove the success message after 30 seconds
  //     setTimeout(() => {
  //       setSuccessMessage("");
  //     }, 10000); // 30 seconds timeout
  //   }


  //   getVhicalTypeName();
  //   fetchFuelTypes();
  // }, []);

  // const getVhicalTypeName = async () => {
  //   try {
  //     const data = await Authapi.userVehicleTypes();

  //     if (data && data.length > 0) {

  //       const options = data.map((vehicleType) => ({
  //         value: vehicleType.id,
  //         label: vehicleType.vehicle_type_name,
  //       }));
  //       setVehicleType(options);
  //     } else {
  //       console.warn("No vehicle types data received");
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch vehicle types:", error);
  //   }
  // };

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        // console.log(formData);
        const response = await Authapi.getUserContractdetail();
        // console.log("Contract details:", response);

        if (response.status === 200 && response.contract) {
          // Update the formData with contract_id
          setFormData((prevData) => ({
            ...prevData,
            contract_id: response.contract.id || "", // Correct contract ID mapping
            contract_name: response.contract.contract_name || "", // Correct contract ID mapping
          }));
          // console.log(formData);
        } else {
          console.warn("No contract data received");
        }
      } catch (error) {
        console.error("Failed to fetch contract details:", error);
      }
    };

    fetchContractDetails();
  }, []);


  useEffect(() => {
    const getUserSitedetail = async () => {
      // console.log(formData);


      try {
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
        // console.log(formData.contract_id);
        const response = await Authapi.getUserSitedetail(formData.contract_id);
        if (response?.status === 200 && response?.site_job) {
          // console.log("AAAAAAAAAAAAAAAAAAAAAAAA");
          // console.log(response.site_job.site_name);
          setFormData({
            // contract_id: response.site_job.contract_id || "",
            // contract_name: response.site_job.contract_name || "",
            site_name: response.site_job.site_name || "",
            site_description: response.site_job.site_description || "",
            site_address_1: response.site_job.site_address_1 || "",
            site_address_2: response.site_job.site_address_2 || "",
            site_address_3: response.site_job.site_address_3 || "",
            site_address_4: response.site_job.site_address_4 || "",
            site_phone_no: response.site_job.site_phone_no || "",
            site_email: response.site_job.site_email || "",
            site_postcode: response.site_job.site_postcode || "",
            district_council_id: response.site_job.district_council_id || "",
            county_id: response.site_job.county_id || "",
            origin_id: response.site_job.origin_id || "",

            job_code: response.site_job.job_code || "",
            job_type_id: response.site_job.job_type_id || "",
            client_name: response.site_job.client_name || "",
            // purchase_order: response.site_job.purchase_order || "",
            job_description: response.site_job.job_description || "",
            job_code: response.site_job.job_code || "",
          });
        }
      } catch (error) {
        console.error("Error fetching Site and Job Details:", error);
      }
    };

    //   getUserSitedetail();
    // }, []);

    if (formData.contract_id) {  // Only fetch site details if contract_id is available
      getUserSitedetail();
    }
  }, [formData.contract_id]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await Authapi.userSiteDetails({
        contract_id: formData.contract_id,
        contract_name: formData.contract_name,
        site_name: formData.site_name,
        site_description: formData.site_description,
        site_address_1: formData.site_address_1,
        site_address_2: formData.site_address_2,
        site_address_3: formData.site_address_3,
        site_address_4: formData.site_address_4,
        site_phone_no: formData.site_phone_no,
        site_email: formData.site_email,
        site_postcode: formData.site_postcode,
        district_council_id: formData.district_council_id,
        county_id: formData.county_id,
        origin_id: formData.origin_id,

        job_code: formData.job_code,
        job_type_id: formData.job_type_id,
        client_name: formData.client_name,
        // purchase_order: formData.purchase_order,
        job_description: formData.job_description,
        job_code: formData.job_code,
      });

      // Check if the request was successful
      if (response.status === 200 || response?.data?.success) {
        setLoading(false);
        sessionStorage.setItem("successMessage", "Site and Job Details have been successfully saved.");
        navigate("/success");
      } else {
        setLoading(false);
        throw new Error(response?.message || "Failed to submit Site and Job Details");
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error?.response?.data?.message || error.message || "Failed to submit Site and Job Details. Please try again.",
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
    { title: "Site" },
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
          <h5 className="title">Site and Job Details</h5>
          <p className="description">
            Please complete all sections.
          </p>

          <form onSubmit={handleSubmit}>
            <label className="section-datatable-title">Add Site</label>

            <div className="form-row">
              <div className="form-group col-md-6">
                <div className="input-with-icon">
                  <label className="label" htmlFor="contractName">
                    Contract
                  </label>
                  <Tooltip title="Select the contract name from the drop-down menu." arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                </div>
                {/* {console.log('WWWWWWWWWWWWWWWWWWWWWW')}
                {console.log(formData)} */}
                <div className="field">
                  {/* {console.log(formData.contract_name)} */}
                  <input
                    type="text"
                    className="form-control company"
                    id="contract_name"
                    name="contract_name"
                    value={formData.contract_name}
                    // placeholder="Contract Name"
                    disabled
                  />
                </div>
              </div>
              <div className="form-group col-md-6">
                <div className="input-with-icon">
                  <label className="label">Site Name</label>
                  <Tooltip title="Add the name of the Site" arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                </div>
                <div className="field">
                  {/* {console.log(formData)} */}
                  <input
                    value={formData.site_name}
                    className="form-control company"
                    type="text"
                    name="site_name"
                    onChange={handleChange}
                  />
                  {errors.site_name && (
                    <small className="text-danger">{errors.site_name}</small>
                  )}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <div className="input-with-icon">
                  <label className="label">Description</label>
                  <Tooltip title="Enter a description for the vehicle" arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                </div>
                <div className="field">
                  <input
                    value={formData.site_description}
                    type="text"
                    className="form-control company"
                    name="site_description"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group col-md-6">
                <div className="input-with-icon">
                  <label className="label">Address Line 1</label>
                  <Tooltip title="Add the site address." arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                </div>
                <div className="field">
                  <input
                    value={formData.site_address_1}
                    className="form-control company"
                    type="text"
                    name="site_address_1"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <div className="input-with-icon">
                  <label className="label">Address Line 2</label>
                  <Tooltip title="Add the site address." arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                </div>
                <div className="field">
                  <input
                    value={formData.site_address_2}
                    className="form-control company"
                    type="text"
                    name="site_address_2"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group col-md-6">
                <div className="input-with-icon">
                  <label className="label">Address Line 3</label>
                  <Tooltip title="Add the site address." arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                </div>
                <div className="field">
                  <input
                    value={formData.site_address_3}
                    className="form-control company"
                    type="text"
                    name="site_address_3"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <div className="input-with-icon">
                  <label className="label">Address Line 4</label>
                  <Tooltip title="Add the site address." arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                </div>
                <div className="field">
                  <input
                    value={formData.site_address_4}
                    className="form-control company"
                    type="text"
                    name="site_address_4"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group col-md-6">
                <div className="input-with-icon">
                  <label className="label">Phone No</label>
                  <Tooltip title="Add the site telephone number." arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                </div>
                <div className="field">
                  <input
                    value={formData.site_phone_no}
                    className={`form-control company ${errors.site_phone_no ? "is-invalid" : ""}`}
                    type="tel"
                    name="site_phone_no"
                    onChange={handleChange}
                    placeholder="Site Telephone"
                  />
                  {errors.site_phone_no && (
                    <small className="text-danger">{errors.site_phone_no}</small>
                  )}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <div className="input-with-icon">
                  <label className="label">Email</label>
                  <Tooltip title="Add the email address of the person responsible for the Site or Waste Accountant." arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                </div>
                <div className="field">
                  <input
                    value={formData.site_email}
                    className="form-control company"
                    type="site_email"
                    name="site_email"
                    onChange={handleChange}
                  />
                  {errors.site_email && (
                    <small className="text-danger">{errors.site_email}</small>
                  )}
                </div>
              </div>

              <div className="form-group col-md-6 ">
                <div className="input-with-icon">
                  <label className="label">Postcode</label>
                  <Tooltip title="Add the postcode for the Site." arrow>
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
                    name="site_postcode"
                    value={formData.site_postcode}
                    onChange={handleChange}
                  />
                  {errors.site_postcode && <small className="text-danger">{errors.site_postcode}</small>}
                </div>
              </div>
            </div>

            <div className="form-row">
              {/* <div className="form-group col-md-6 ">
                <div className="input-with-icon">
                  <label className="label">District Council</label>
                  <Tooltip title="Select the District Council where the site is located. If you don't know the district coucil, please visit https://www.gov.uk/find-local-council" arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                </div>
                <div className="field">
                  <Select
                    className="searchable_dropdown"
                    options={districtCouncil}
                    // value={formData.countyId}
                    value={districtCouncil.find(option => option.value === formData.district_council_id)}
                    onChange={handleDistrictCouncilChange}
                    placeholder="Select County"
                    isSearchable
                    styles={customSelectStyles}
                  />
                  {errors.district_council_id && <small className="text-danger">{errors.district_council_id}</small>}
                </div>
              </div> */}
              <div className="form-group col-md-6">
                <div className="input-with-icon">
                  <label className="label">County</label>
                  <Tooltip title="Select the county." arrow>
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
                    value={countytypes.find(option => option.value === formData.county_id)}
                    onChange={handleCountyChange}
                    placeholder="Select County"
                    isSearchable
                    styles={customSelectStyles}
                  />
                  {errors.county_id && <small className="text-danger">{errors.county_id}</small>}
                </div>
              </div>

              <div className="form-group col-md-6">
                <div className="input-with-icon">
                  <label className="label">Region</label>
                  <Tooltip title="Select Region" arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                </div>
                <div className="field">
                  <Select
                    className="searchable_dropdown"
                    options={origin}
                    // value={formData.countyId}
                    value={origin.find(option => option.value === formData.origin_id)}
                    onChange={handleRegionChange}
                    placeholder="Select Region"
                    isSearchable
                    styles={customSelectStyles}
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              {/* <div className="form-group col-md-6">
                <div className="input-with-icon">
                  <label className="label">Region</label>
                  <Tooltip title="Select Region" arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                </div>
                <div className="field">
                  <Select 
                    className="searchable_dropdown"
                    options={origin}
                    // value={formData.countyId}
                    value={origin.find(option => option.value === formData.origin_id)}
                    onChange={handleRegionChange}
                    placeholder="Select Region"
                    isSearchable
                    styles={customSelectStyles}
                  />
                </div>
              </div> */}
              <div className="form-group col-md-6">
              </div>
            </div>

            <label className="section-datatable-title">Add Job</label>

            <div className="form-row">

              <div className="form-group col-md-6">
                <div className="input-with-icon">
                  <label className="label">Job Code</label>
                  <Tooltip title="Add a Job Code to identify the job" arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                </div>
                <div className="field">
                  <input
                    value={formData.job_code}
                    type="text"
                    className="form-control company"
                    name="job_code"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group col-md-6">
                <div className="input-with-icon">
                  <label className="label">Job Type</label>
                  <Tooltip
                    title="Select 'Job Type' from the drop-down menu. If the job type is not in the list, please select Add Job Type.."
                    arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                </div>
                <div className="field">
                  <Select
                    className="searchable_dropdown"
                    options={jobtype}
                    // value={formData.vehicle_type_id}
                    value={jobtype.find(option => option.value === formData.job_type_id)}
                    onChange={handleJobTypeChange}
                    placeholder="Select Vehicle Type"
                    isSearchable
                    styles={customSelectStyles}
                  />
                  {errors.job_type_id && (
                    <small className="text-danger">
                      {errors.job_type_id}
                    </small>
                  )}
                </div>
              </div>
            </div>


            <div className="form-row">
              <div className="form-group col-md-6">
                <div className="input-with-icon">
                  <label className="label">Client Name</label>
                  <Tooltip title="If the Contract is not in the list, please tick the 'Add Site' box and complete the fields." arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                </div>
                <div className="field">
                  <input
                    value={formData.client_name} // ✅ Corrected value
                    className="form-control company"
                    type="text"
                    name="client_name"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* <div className="form-group col-md-6">
                <div className="input-with-icon">
                  <label className="label">Purchase Order</label>
                  <Tooltip title="Add Order" arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                </div>
                <div className="field">
                  <input
                    value={formData.purchase_order}
                    className="form-control company"
                    type="text"
                    name="purchase_order"
                    onChange={handleChange}
                  />
                </div>
              </div> */}
              <div className="form-group col-md-6">
                <div className="input-with-icon">
                  <label className="label">Description</label>
                  <Tooltip title="Add Description" arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                </div>
                <div className="field">
                  <input
                    value={formData.job_description}
                    className="form-control company"
                    type="text"
                    name="job_description"
                    onChange={handleChange}
                  />
                  {errors.job_description && (
                    <small className="text-danger">{errors.job_description}</small>
                  )}
                </div>
              </div>

            </div>
            {/* <div className="form-row">

              <div className="form-group col-md-6">
                <div className="input-with-icon">
                  <label className="label">Subcontractor Company</label>
                  <Tooltip title="Select Subcontractor Company." arrow>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                    />
                  </Tooltip>
                </div>
                <div className="field">
                  <Select
                    className="searchable_dropdown"
                    options={SubContractCompany}
                    // value={formData.countyId}
                    value={SubContractCompany.find(option => option.value === formData.SubContractCompany)}
                    onChange={handleCountyChange}
                    placeholder="Select Subcontractor Company"
                    isSearchable
                    styles={customSelectStyles}
                  />
                  {errors.SubContractCompany && <small className="text-danger">{errors.SubContractCompany}</small>}
                </div>
              </div>
              <div className="form-group col-md-6">
              </div>
            </div> */}
          </form>
        </div>
      </div>
      <div className=" company-setup-container mt-0 ">
        <button
          type="button"
          className="btn btn-secondary prevbtn"
          onClick={handlePreviousClick}
        ><Tooltip title="Click 'Previous' to go back and Update your Depot details." arrow>
            <span>Previous Step</span>
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
            <span>Submit</span>
          </Tooltip>
        </button>
      </div>
    </>
  );
};

export default VehicleForm;
