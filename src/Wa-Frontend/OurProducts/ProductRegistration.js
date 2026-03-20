import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Tooltip from "@mui/material/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import Authapi from "../../Authapi";
import "../../components/companypage/Company.css";

const initialFormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const initialErrors = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const ProductRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);

  const Loader = () => (
    <div className="loader-overlay single-loader">
      <div className="spinner-border text-primary" role="status" aria-label="Loading" />
    </div>
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await Authapi.useregister({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (!response || !response.user) {
        throw new Error(
          typeof response === "string" ? response : response?.message || "Registration failed"
        );
      }

      await Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "Your account has been created successfully.",
        confirmButtonText: "OK",
      });

      setFormData(initialFormData);
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message || "Something went wrong. Please try again.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="company-setup-container abcd mb-0 mt-5">
        <div className="steps-content mt-3">
          <div className="p-4 content">
            <h5 className="title">Registration Details</h5>
            <p className="description">Please complete all sections to create your account.</p>

            <form onSubmit={handleSubmit} className="company-form">
              <div className="form-row">
                <div className="form-group col-md-6">
                  <div className="input-with-icon">
                    <label className="label" htmlFor="username">
                      Username
                    </label>
                    <Tooltip title="Choose a username for your account" arrow>
                      <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                    </Tooltip>
                  </div>
                  <div className="field">
                    <input
                      type="text"
                      className={`form-control company ${formErrors.username ? "is-invalid" : ""}`}
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Username"
                    />
                    {formErrors.username && (
                      <div className="invalid-feedback">{formErrors.username}</div>
                    )}
                  </div>
                </div>

                <div className="form-group col-md-6">
                  <div className="input-with-icon">
                    <label className="label" htmlFor="email">
                      Email
                    </label>
                    <Tooltip title="Enter your email address" arrow>
                      <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                    </Tooltip>
                  </div>
                  <div className="field">
                    <input
                      type="email"
                      className={`form-control company ${formErrors.email ? "is-invalid" : ""}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                    />
                    {formErrors.email && (
                      <div className="invalid-feedback">{formErrors.email}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <div className="input-with-icon">
                    <label className="label" htmlFor="password">
                      Password
                    </label>
                    <Tooltip title="Password must be at least 6 characters" arrow>
                      <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                    </Tooltip>
                  </div>
                  <div className="field">
                    <input
                      type="password"
                      className={`form-control company ${formErrors.password ? "is-invalid" : ""}`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                    />
                    {formErrors.password && (
                      <div className="invalid-feedback">{formErrors.password}</div>
                    )}
                  </div>
                </div>

                <div className="form-group col-md-6">
                  <div className="input-with-icon">
                    <label className="label" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <Tooltip title="Re-enter the same password" arrow>
                      <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                    </Tooltip>
                  </div>
                  <div className="field">
                    <input
                      type="password"
                      className={`form-control company ${formErrors.confirmPassword ? "is-invalid" : ""}`}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm Password"
                    />
                    {formErrors.confirmPassword && (
                      <div className="invalid-feedback">{formErrors.confirmPassword}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="company-setup-container mt-1">
                <button type="submit" className="btn next btn-primary">
                  Submit Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductRegistration;
