// import Swal from "sweetalert2";

// export const checkTokenExpiry = () => {
//   const token = localStorage.getItem("WAauthToken");

//   if (!token) {
//     return;
//   }

//   try {
//     const decodedToken = JSON.parse(atob(token.split(".")[1]));
//     const expiryTime = decodedToken.exp * 1000;
//     const currentTime = Date.now();

//     if (currentTime >= expiryTime) {
//       Swal.fire({
//         title: "Session Expired",
//         text: "Your session has expired. Please log in again.",
//         icon: "error",
//         confirmButtonText: "Log In",
//       }).then(() => {
//         localStorage.removeItem("WAauthToken");
//         localStorage.removeItem("userData");
//       });
//     }
//   } catch (error) {
//     console.error("Error while checking token expiry:", error);
//   }
// };

// export const StartTokenExpiryCheck = () => {
//   setInterval(() => {
//     checkTokenExpiry();
//   }, 1 * 60 * 1000);
// };









// import { useState, useEffect } from "react";
// import Swal from "sweetalert2";
// import Authapi from "../Authapi";
// import localStorage from "local-storage";
// import { jwtDecode } from "jwt-decode";

// const Expired = () => {
//     const [isTokenExpired, setIsTokenExpired] = useState(false);
//     const [hasShownPopup, setHasShownPopup] = useState(false);

//     const checkTokenExpiry = () => {
//         const token = localStorage.get("Token");
//         // console.log("Token: ", token);

//         if (!token) {
//             setIsTokenExpired(true);
//             return;
//         }

//         try {
//             const decodedToken = jwtDecode(token);
//             // console.log("Decoded Token: ", decodedToken);

//             const currentTime = Date.now() / 1000;
//             if (decodedToken.exp < currentTime) {
//                 setIsTokenExpired(true);
//             }
//         } catch (error) {
//             console.error("Error decoding token:", error);
//             setIsTokenExpired(true);
//         }
//     };


//     const regenerateToken = async () => {
//         try {
//             let formData = {
//                 user_id: localStorage("user").id
//             };
//             const newToken = await Authapi.refreshToken1(formData);
//             console.log("New Token: ", newToken.data.add_token);

//             if (newToken.data.add_token) {
//                 localStorage("Token", newToken.data.add_token);
//                 setIsTokenExpired(false);
//                 Swal.fire("Success", "Your session has been refreshed!", "success");
//                 window.location.reload();
//             } else {
//                 Swal.fire("Error", "Failed to regenerate token. Please try again.", "error");
//             }
//         } catch (error) {
//             console.error("Error refreshing token: ", error);
//             Swal.fire("Error", "Failed to regenerate token. Please try again.", "error");
//         }
//     };

//     useEffect(() => {
//         checkTokenExpiry();
//     }, []);


//     // if (isTokenExpired) {
//     //     Swal.fire({
//     //         title: "Session Expired",
//     //         text: "Your session has expired. Do you want to continue?",
//     //         icon: "warning",
//     //         showCancelButton: true,
//     //         confirmButtonText: "Continue",
//     //         cancelButtonText: "Cancel",
//     //     }).then((result) => {
//     //         console.log(result);
//     //         if (result.isConfirmed === true) {
//     //             regenerateToken();
//     //         }
//     //     });
//     // }

//     if (isTokenExpired && !hasShownPopup) {
//         setHasShownPopup(true);
//         Swal.fire({
//             title: "Session Expired",
//             text: "Your session has expired. Do you want to continue?",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonText: "Continue",
//             cancelButtonText: "Cancel",
//         }).then((result) => {
//             // console.log(result);
//             if (result.isConfirmed === true) {
//                 regenerateToken();
//             }
//         });
//     }

//     // useEffect(() => {

//     // }, []);

//     return null;
// };

// export default Expired;



import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Authapi from "../Authapi";
import { jwtDecode } from "jwt-decode";
import { Outlet, useNavigate } from "react-router-dom";
import Login from '../components/Login/Login';
import Navlayout from '../Wa-Frontend/NavLayout';
import { handleLogout } from '../Wa-Frontend/NavLayout';
import ls from "local-storage";

const Expired = () => {
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const authToken = ls.get("WAauthToken");
  //   if (!authToken) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Authentication Required",
  //       text: "Please login to continue.",
  //       confirmButtonText: "OK",
  //     }).then(() => {
  //       // navigate("/login");
  //     });
  //     return;
  //   }
  // }, []);
  // Function to check token expiry
  const checkTokenExpiry = () => {
    const token = localStorage.getItem("WAauthToken"); // Use native localStorage
    if (!token) {
      setIsTokenExpired(true);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds

      // Assuming the token's `iat` (issued at) is in seconds
      const tokenExpiryTime = decodedToken.iat + 1800; // 120 seconds = 2 minutes

      if (currentTime >= tokenExpiryTime) {
        setIsTokenExpired(true);
        // Call handleLogout when the token is expired
        // handleLogout(setUserData, setIsLoggedIn, navigate);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      setIsTokenExpired(true);
    }
  };

  // Effect to check for token expiration immediately when the component is mounted
  useEffect(() => {
    checkTokenExpiry();
    // Set an interval to check for token expiration every second (1000ms)
    const interval = setInterval(() => {
      checkTokenExpiry();
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    const savedLoginStatus = localStorage.getItem('isLoggedIn');

    if (savedUserData && savedLoginStatus === 'true') {
      setUserData(JSON.parse(savedUserData));
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    // fetchData();
    // hardik();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await Authapi.logout();
      // console.log('Logout successful:', response); 
      setUserData(null);
      setIsLoggedIn(false);
      localStorage.setItem('isLoggedIn', 'false'); 
      // localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userData');
      localStorage.removeItem('WAauthToken');
      // Swal.fire("Logged Out", "You have been logged out successfully!", "success");
      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been logged out successfully!",
        background: "#f8f9fa",
        showConfirmButton: true,
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload(true);

      });
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };



  // Effect to show the popup when token expires
  useEffect(() => {
    // alert(hasShownPopup);
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    // alert(isLoggedIn=='true');
    if (isTokenExpired && !hasShownPopup && isLoggedIn == 'true') {
      setHasShownPopup(true);
      Swal.fire({
        title: "Session Expired",
        text: "Your session has expired. Do you want to continue?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          toggleLoginPopup();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          handleLogout();
        }
      });
    }
  }, [isTokenExpired, hasShownPopup, isLoggedIn]);

  const handleLoginSuccess = (data) => {
    setHasShownPopup(true);

    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true'); // Use native localStorage
    localStorage.setItem('userData', JSON.stringify(data)); // Use native localStorage
    setShowLoginPopup(false);
  };

  const toggleLoginPopup = () => {
    setShowLoginPopup(!showLoginPopup);
  };

  const Popup = ({ isOpen, onClose, onLoginSuccess }) => {
    if (!isOpen) return null;
    return (
      <div className="popup-overlay" style={popupOverlayStyles}>
        <div className="popup-content" style={popupContentStyles}>
          <Login onLoginSuccess={onLoginSuccess} onClose={onClose} />
        </div>
      </div>
    );
  };

  return (
    <>
      {/* <Navlayout /> */}
      {showLoginPopup && (
        <Popup isOpen={showLoginPopup} onClose={toggleLoginPopup} onLoginSuccess={handleLoginSuccess} />
      )}
      <Outlet />
    </>
  );
};

const popupOverlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  overflowY: 'auto',
};

const popupContentStyles = {
  backgroundColor: 'white',
  borderRadius: '5px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
};

export default Expired;
