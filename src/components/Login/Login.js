// import './Login.css';
// import { FaRegEye, FaEyeSlash, FaTimes } from "react-icons/fa";
// import { useState } from 'react';
// import Swal from 'sweetalert2';
// import { useNavigate } from 'react-router-dom';
// import AuthApi from '../../Authapi';

// const Login = ({ onLoginSuccess, onClose }) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLoginClick = async () => {
//     try {
//       console.log('Attempting to log in with:', { username, password });

//       const userData = { username, password };
//       const data = await AuthApi.login(userData);

//       console.log('Login response data:', data);

//       if (!data || !data.user || !data.token) {
//         throw new Error('User data or token is missing in the response');
//       }

//       localStorage.setItem('WAauthToken', data.token);
//       localStorage.setItem('userData', JSON.stringify(data.user));

//       onLoginSuccess(data.user);

//       await Swal.fire({
//         title: 'Login Successful!',
//         text: 'Welcome back!',
//         icon: 'success',
//         confirmButtonText: 'OK',
//       });

//        window.location.reload();
//       //  const navigate = useNavigate();
//       //  navigate(0);
//       // navigate('/');
//       // window.location.reload(true);
//       // window.location.assign(window.location.href);
//       // window.location.replace(window.location.href);

//     } catch (error) {
//       console.error('There was a problem with the login request:', error);
//       Swal.fire({
//         title: 'Login Failed',
//         text: error.message || 'Please check your username and password.',
//         icon: 'error',
//         confirmButtonText: 'Try Again',
//       });
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     handleLoginClick();
//   };

//   return (
//     <div className="signin-box">
//       <button className="close-button" onClick={onClose}>
//         <FaTimes />
//       </button>
//       <h2 className="slim-logo">
//         <img src="https://laravel.wasteaccountant.com/admin/images/WasteAccountant_LOGO.png" alt="Logo" width="100%" />
//       </h2>
//       <h2 className="signin-title-primary">Welcome back!</h2>
//       <h3 className="signin-title-secondary">Sign in to continue.</h3>

//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <div className="input-group">
//             <input
//               type="text"
//               className="form-control abc"
//               placeholder="Username"
//               required
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="form-group mg-b-50">
//           <div className="input-group">
//             <input
//               type={showPassword ? "text" : "password"}
//               className="form-control"
//               placeholder="Password"
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <span className="input-icon" onClick={() => setShowPassword(!showPassword)}>
//               {showPassword ? <FaEyeSlash /> : <FaRegEye />}
//             </span>
//           </div>
//         </div>

//         <button className="btn btn-primary btn-block btn-signin">
//           Sign In
//         </button>
//       </form>

//       <p className="text-center year mt-3">
//         © 2025
//       </p>
//       <p className="text-center">
//         <a className="text-info">Lost Your Password..?</a>
//       </p>
//       <p className="text-center ABC">
//         Don't have an account?{' '}
//         <a className="text-info">
//           Sign Up
//         </a>
//       </p>
//     </div>
//   );
// };

// export default Login;
import "./Login.css";
import { FaRegEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AuthApi from "../../Authapi";

const Login = ({ onLoginSuccess, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [email, setEmail] = useState("");
  const [ragisterusername, setRagisterusername] = useState("");
  const [ragisterpassword, setRagisterPassword] = useState("");

  const navigate = useNavigate();

  // const handleSignInClick = async () => {
  //   try {
  //     console.log("Attempting to log in with:", { username, password });

  //     const userData = { username, password };
  //     const data = await AuthApi.login(userData);

  //     console.log("Login response data:", data);

  //     if (!data || !data.user || !data.token) {
  //       throw new Error("User data or token is missing in the response");
  //     }

  //     localStorage.setItem("WAauthToken", data.token);
  //     localStorage.setItem("userData", JSON.stringify(data.user));

  //     onLoginSuccess(data.user);

  //     await Swal.fire({
  //       title: "Login Successful!",
  //       text: "Welcome back!",
  //       icon: "success",
  //       confirmButtonText: "OK",
  //     });

  //     window.location.reload();
  //   } catch (error) {
  //     console.error("There was a problem with the login request:", error);
  //     Swal.fire({
  //       title: "Login Failed",
  //       text: error.message || "Please check your username and password.",
  //       icon: "error",
  //       confirmButtonText: "Try Again",
  //     });
  //   }
  // };

  const handleSignInClick = async () => {
    try {
      console.log('Attempting to log in with:', { username, password });

      const userData = { username, password };
      const data = await AuthApi.login(userData);

      console.log('Login response data:', data);

      if (!data || !data.user || !data.token) {
        throw new Error('User data or token is missing in the response');
      }


      localStorage.setItem('WAauthToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));


      onLoginSuccess(data.user);


      await Swal.fire({
        title: 'Login Successful!',
        text: 'Welcome back!',
        icon: 'success',
        confirmButtonText: 'OK',
      });

       window.location.reload();
      //  const navigate = useNavigate();
      //  navigate(0); 
      // navigate('/');
      // window.location.reload(true);
      // window.location.assign(window.location.href);
      // window.location.replace(window.location.href);


    } catch (error) {
      console.error('There was a problem with the login request:', error);
      Swal.fire({
        title: 'Login Failed',
        text: error.message || 'Please check your username and password.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignInClick();
  };

  // const handleSignUPClick = async () => {
  //   try {
  //     console.log("Attempting to log in with:", { ragisterusername, ragisterpassword, email });

  //     const ragisteruserData = { ragisterusername, ragisterpassword, email };
  //     const ragisterdata = await AuthApi.useregister(ragisteruserData);

  //     // if (!ragisterdata || !ragisterdata.user || !ragisterdata.email) {
  //     //   throw new Error('User data or token is missing in the response');
  //     // }

  //     console.log("Login response data:", ragisterdata);
  //     // onLoginSuccess(ragisterdata.user);

  //     await Swal.fire({
  //       title: "ragister Successful!",
  //       text: "Thank You for Ragister!",
  //       icon: "success",
  //       confirmButtonText: "OK",
  //     });

     
  //   } catch (error) {
  //     console.error("There was a problem with the login request:", error);
  //     Swal.fire({
  //       title: "Login Failed",
  //       text: error.message || "Please check your username and password.",
  //       icon: "error",
  //       confirmButtonText: "Try Again",
  //     });
  //   }
  // };
  const handleSignUPClick = async () => {
    try {
      // Validate inputs before making an API request
      if (!ragisterusername.trim() || !ragisterpassword.trim() || !email.trim()) {
        Swal.fire({
          title: "Registration Failed",
          text: "All fields are required.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
  
      const registerUserData = {
        username: ragisterusername, 
       password: ragisterpassword, 
        email: email,
      };
  
      console.log("Sending registration data:", registerUserData);
  
      const response = await AuthApi.useregister(registerUserData);
  
      console.log("Registration response data:", response);
  
      if (!response || !response.user) {
        throw new Error("User registration failed. Please try again.");
      }
  
      await Swal.fire({
        title: "Registration Successful!",
        text: "Thank you for registering!",
        icon: "success",
        confirmButtonText: "OK",
      });
  
      setFlipped(false);
  
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        title: "Registration Failed",
        text: error.response?.data?.message || "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };
  
  return (
    <div className="flip-container">
      <div className={`flipper ${flipped ? "flip" : ""}`}>
        {/* 🔵 LOGIN FORM */}
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
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
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
              <div className="input-group">
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

            {/* <div className="form-group mg-b-50">
              <div className="input-group">
                <input type="email" className="form-control" name='email' placeholder="Email" required />
              </div>
            </div> */}
            <div className="form-group mg-b-50">
              <div className="input-group">
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
              <div className="input-group">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  required
                  value={ragisterpassword}
                  onChange={(e) => setRagisterPassword(e.target.value)}
                />
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
