import "./Login.css";
import { FaRegEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AuthApi from "../../Authapi";
import Tooltip from "@mui/material/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { RotatingLines } from "react-loader-spinner";

const Login = ({ onLoginSuccess, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [email, setEmail] = useState("");
  const [ragisterusername, setRagisterusername] = useState("");
  const [ragisterpassword, setRagisterPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Login function
  const handleSignInClick = async () => {
    try {
      setLoading(true);
      const userData = { username, password };
      const data = await AuthApi.login(userData);
      if (!data || !data.user || !data.token) {
        throw new Error(data);
      }
      localStorage.setItem('WAauthToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      // Check if this login was triggered by a purchase
      const purchaseIntent = localStorage.getItem('purchaseIntent');
      
      // Call onLoginSuccess with the user data
      onLoginSuccess(data.user);
      
      // Close the popup
      onClose();
      
    } catch (error) {
      console.error('There was a problem with the login request:', error);
      Swal.fire({
        title: 'Login Failed',
        text: error.message || 'Please check your username and password.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignInClick();
  };

  // Register function
  const handleSignUPClick = async () => {
    try {
      // Validate input fields
      if (!ragisterusername.trim() || !ragisterpassword.trim() || !email.trim()) {
        Swal.fire({
          title: "Registration Failed",
          text: "All fields are required.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
  
      // Prepare registration data
      const registerUserData = {
        username: ragisterusername,
        password: ragisterpassword,
        email: email,
      };
  
      // Send registration request
      const registerResponse = await AuthApi.useregister(registerUserData);
      // console.log("Registration response data:", registerResponse);
  
      if (!registerResponse || !registerResponse.user) {
        throw new Error(registerResponse);
      }
  
      setLoading(true);
      // After successful registration, log the user in
      const loginData = await AuthApi.login({
        username: ragisterusername,
        password: ragisterpassword,
      });
      // console.log("Login response data:", loginData);
  // 
      if (!loginData || !loginData.user || !loginData.token) {
        throw new Error(loginData);
      }
  
      // Store authentication token and user data
      localStorage.setItem("WAauthToken", loginData.token);
      localStorage.setItem("userData", JSON.stringify(loginData.user));
  
      // Update the application state with the logged-in user
      onLoginSuccess(loginData.user);
      await Swal.fire({
        title: "Registration and Login Successful!",
        text: "Welcome!",
        icon: "success",
        confirmButtonText: "OK",
      });
  
      // window.location.reload();
    } catch (error) {
      console.error("Error during registration and login:", error);
      Swal.fire({
        title: "Error",
        text: error || "An unexpected error occurred. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // Loader component for display
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

  return (
    <div className="flip-container-loader">
      {loading && <Loader />} {/* Show the loader when loading is true */}
      <div className={`flipper ${flipped ? "flip" : ""}`}>
        {/* LOGIN FORM */}
        <div className="front signin-box">
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
          <h2 className="slim-logo">
            <img
              src="https://laravel.wasteaccountant.com/admin/images/WasteAccountant_LOGO.png"
              alt="Logo"
              width="100%"
            />
          </h2>
          <h2 className="signin-title-primary">Welcome back!</h2>
          <h3 className="signin-title-secondary">Sign in to continue.</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-group">
                <Tooltip title="Enter your Username" arrow>
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="info-icon login auth-icon"
                  />
                </Tooltip>
                <input
                  type="text"
                  className="form-control abc"
                  placeholder="Username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group mg-b-50">
              <div className="input-group">
                <Tooltip title="Enter your password" arrow>
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="info-icon login auth-icon"
                  />
                </Tooltip>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control password-field"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="input-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaRegEye />}
                </span>
              </div>
            </div>

            <button className="btn btn-primary btn-block btn-signin">
              Sign In
            </button>
          </form>

          <p className="text-center year mt-3">© 2025</p>
          <p className="text-center">
            <a className="text-info">Lost Your Password..?</a>
          </p>
          <p className="text-center ABC">
            Don't have an account?{" "}
            <a className="text-info" onClick={() => setFlipped(true)}>
              Sign Up
            </a>
          </p>
        </div>

        {/* REGISTER FORM */}
        <div className="back signin-box">
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
          <h2 className="slim-logo">
            <img
              src="https://laravel.wasteaccountant.com/admin/images/WasteAccountant_LOGO.png"
              alt="Logo"
              width="100%"
            />
          </h2>
          <h2 className="signin-title-primary">Create Account</h2>
          <h3 className="signin-title-secondary">Sign up to get started.</h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUPClick();
            }}
          >
            <div className="form-group">
              <div className="input-group input-with-icon">
                <Tooltip title="Select a username for your account" arrow>
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="info-icon auth-icon"
                  />
                </Tooltip>
                <input
                  type="text"
                  className="form-control abc"
                  placeholder="Username"
                  value={ragisterusername}
                  onChange={(e) => setRagisterusername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group mg-b-50">
              <div className="input-group input-with-icon">
                <Tooltip title="Add your contact email address" arrow>
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="info-icon auth-icon"
                  />
                </Tooltip>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group mg-b-50">
              <div className="input-group input-with-icon">
                <Tooltip title="Select a password. It should be a mix of letters, numbers and symbols." arrow>
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="info-icon auth-icon"
                  />
                </Tooltip>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control password-field"
                  placeholder="Password"
                  required
                  value={ragisterpassword}
                  onChange={(e) => setRagisterPassword(e.target.value)}
                />
                <span
                  className="input-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaRegEye />}
                </span>
              </div>
            </div>

            <button className="btn btn-primary btn-block btn-signin">
              Sign Up
            </button>
          </form>

          <p className="text-center">
            Already have an account?{" "}
            <a className="text-info" onClick={() => setFlipped(false)}>
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
