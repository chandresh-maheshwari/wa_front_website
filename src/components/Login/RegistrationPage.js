import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Tooltip from "@mui/material/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import Authapi from "../../Authapi";
import "../../components/companypage/Company.css";
// import Navlayout from "../../Wa-Frontend/NavLayout";

const initialFormData = {
  username: "",
  email: "",
  password: "",
};

const initialErrors = {
  username: "",
  email: "",
  password: "",
};

const RegistrationPage = () => {
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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePurchaseAfterRegistration = async (price_id, trail_days) => {
    setLoading(true);

    try {
        // ---------------- Subscription check logic ----------------
        try {
            const subscriptionCheck = await Authapi.checkUserSubscription();
            
            const subscription =
                subscriptionCheck?.subscription ||
                subscriptionCheck?.data?.subscription ||
                subscriptionCheck?.data ||
                null;

            const hasSubscription =
                subscriptionCheck?.hasSubscription === true ||
                subscriptionCheck?.status === true ||
                subscriptionCheck?.data?.hasSubscription === true ||
                (!!subscription && !!subscription.user_id);

            const trialEndsAt =
                subscription?.trial_ends_at ||
                subscription?.trial_end ||
                subscription?.trialEndsAt;
            const endsAt = subscription?.ends_at || subscription?.ended_at;
            const stripeStatus = subscription?.stripe_status || subscription?.status;

            const today = new Date();
            const isTrialActive =
                trialEndsAt &&
                !isNaN(new Date(trialEndsAt).getTime()) &&
                new Date(trialEndsAt) >= today;
            const isStatusActive =
                stripeStatus === "active" ||
                stripeStatus === "trialing" ||
                stripeStatus === "active_trialing";
            const isEnded =
                endsAt &&
                !isNaN(new Date(endsAt).getTime()) &&
                new Date(endsAt) <= today;

            const hasValidSubscription =
                hasSubscription && (isTrialActive || isStatusActive) && !isEnded;

            if (hasValidSubscription) {
                // User has active subscription or active trial; decide where to resume based on existing data
                let nextPath = "/company";

                try {
                    const [companyRes, contractRes, depotRes] = await Promise.allSettled([
                        Authapi.getusercompanydetail(),
                        Authapi.getUserContractdetail(),
                        Authapi.getUserDepotdetail(),
                    ]);

                    const isOk = (res) =>
                        res &&
                        (res.status === 200 ||
                            res.status === true ||
                            res.status === "success");

                    const hasCompany =
                        companyRes.status === "fulfilled" &&
                        isOk(companyRes.value) &&
                        !!(
                            companyRes.value?.company ||
                            companyRes.value?.companies ||
                            companyRes.value?.data
                        );

                    const hasContract =
                        contractRes.status === "fulfilled" &&
                        isOk(contractRes.value) &&
                        !!(
                            contractRes.value?.contract ||
                            contractRes.value?.contracts ||
                            contractRes.value?.data
                        );

                    const hasDepot =
                        depotRes.status === "fulfilled" &&
                        isOk(depotRes.value) &&
                        !!(
                            depotRes.value?.depots ||
                            depotRes.value?.depot ||
                            depotRes.value?.data
                        );

                    if (hasCompany && hasContract && hasDepot) {
                        nextPath = "/site";
                    } else if (hasCompany && hasContract) {
                        nextPath = "/depot";
                    } else if (hasCompany) {
                        nextPath = "/contract";
                    }
                } catch (progressCheckError) {
                    console.error("Progress check failed, defaulting to company page", progressCheckError);
                }

                Swal.close();
                navigate(nextPath);
                setLoading(false);
                return;
            }
        } catch (subscriptionError) {
            console.log("No active subscription found, proceeding to payment");
            Swal.close();
        }

        Swal.close();
        setLoading(false); // Hide the React component loader so it doesn't overlap with the Swal popup loader
        Swal.fire({
            title: "Processing...",
            text: "Please wait while we set up your payment.",
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        const response = await Authapi.createsub(price_id, trail_days);
        window.location.href = response.checkout_url;
    } catch (error) {
        console.error("Purchase Error:", error);
        Swal.fire({
            icon: "error",
            title: "Payment Error",
            text:
                error.message ||
                "There was an error processing your payment. Please try again.",
            background: "#f8f9fa",
            showConfirmButton: true,
            confirmButtonText: "OK",
        });
        setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Register the user
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

      // After successful registration, log the user in
      const loginData = await Authapi.login({
        username: formData.username.trim(),
        password: formData.password,
      });

      if (!loginData || !loginData.user || !loginData.token) {
        throw new Error("Failed to log in after registration");
      }

      // Store authentication token and user data
      localStorage.setItem("WAauthToken", loginData.token);
      localStorage.setItem("userData", JSON.stringify(loginData.user));
      localStorage.setItem("isLoggedIn", "true");

      // Tell auto purchase that user just registered successfully
      sessionStorage.setItem('justRegistered', 'true');

      // Update the application state with the logged-in user
      window.dispatchEvent(new Event('userLogin'));

      const purchaseIntentStr = localStorage.getItem('purchaseIntent');
      if (purchaseIntentStr) {
        // Clear intent and return url
        const { price_id, trail_days } = JSON.parse(purchaseIntentStr);
        localStorage.removeItem('purchaseIntent');
        localStorage.removeItem('returnUrl');

        // Execute purchase flow directly
        await handlePurchaseAfterRegistration(price_id, trail_days);
      } else {
        await Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Your account has been created and you are now logged in.",
          confirmButtonText: "OK",
        });

        setFormData(initialFormData);
        
        const returnUrl = localStorage.getItem("returnUrl") || "/";
        localStorage.removeItem("returnUrl");
        navigate(returnUrl);
      }

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
      <div className="company-setup-container abcd mb-0 mt-5 pt-5 pb-5 w-50 m-auto">
        <div className="steps-content mt-3">
          <div className="p-4 content">
            <h5 className="title">Create Account</h5>
            <p className="description">Sign up to get started.</p>

            <form onSubmit={handleSubmit} className="company-form">
              <div className="">
                <div className="form-group col-md-12 mb-3">
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

                <div className="form-group col-md-12 mb-3">
                  <div className="input-with-icon">
                    <label className="label" htmlFor="email">
                      Email
                    </label>
                    <Tooltip title="Add your contact email address" arrow>
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

                <div className="form-group col-md-12 mb-3">
                  <div className="input-with-icon">
                    <label className="label" htmlFor="password">
                      Password
                    </label>
                    <Tooltip title="Select a password. It should be a mix of letters, numbers and symbols." arrow>
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
              </div>

              <div className="company-setup-container mt-1 pt-3 d-flex justify-content-center">
                <button type="submit" className="btn next btn-primary px-5">
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationPage;
