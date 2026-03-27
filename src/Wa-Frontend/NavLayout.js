import './Wa-Frontend.css';
import { Outlet, Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from 'react';
import Authapi from '../Authapi';
import Login from '../components/Login/Login';
import { FaUserAlt, FaUserCircle } from "react-icons/fa";
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import Swal from 'sweetalert2';

const Navlayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [topbardata, setTopbardata] = useState([]);
    const [userData, setUserData] = useState(null); 
    const [statu, setStatus] = useState([]);
    const [buttonData, setButtonData] = useState({});
    const [pagegetnav, setPagegetnav] = useState({});
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [userRole, setUserRole] = useState(null);
    const [isFrontCreated, setIsFrontCreated] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [hasCompanyUser, setHasCompanyUser] = useState(false);
    const allowedPageNames = Array.isArray(pagegetnav)
        ? pagegetnav.map(item => item.page_name)
        : [];
    const [isLoading, setIsLoading] = useState(false);
    const baseUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    const baseUrlFront = `${window.location.protocol}//${window.location.host}`;

    const renderContactUsButtons = () => {
        return Object.entries(buttonData).map(([buttonNum, data]) => {
            if (data[data[`Field_Slug_buttontitle${buttonNum}`]] === 'Login') {
                return null;
            }

            if (data[data[`Field_Slug_buttontitle${buttonNum}`]] === 'Contact Us') {
                return (
                    <button
                        key={buttonNum}
                        type="button"
                        className="btn btn-outline-light"
                        onClick={() => {
                            if (data[data[`Field_Slug_buttonlink${buttonNum}`]]) {
                                window.location.href = data[data[`Field_Slug_buttonlink${buttonNum}`]];
                            }
                        }}
                        id={`button${buttonNum}`}
                        style={{
                            backgroundColor: data[data[`Field_Slug_buttonbackgroundcolor${buttonNum}`]] || '',
                            color: data[data[`Field_Slug_buttontextcolor${buttonNum}`]] || '',
                            marginLeft: '10px'
                        }}
                    >
                        {data[data[`Field_Slug_buttontitle${buttonNum}`]]}
                    </button>
                );
            }
            return null;
        });
    };

    const renderFreeTrialButton = () => {
    return (
        <button
            type="button"
            className="btn btn-warning"
            // style={{ marginLeft: '10px' }}
            onClick={() => {
                // window.location.href = "http://localhost:3000/menu/our-products";
                window.location.href = `${baseUrlFront}/menu/our-products`;
            }}
             style={{
                backgroundColor: "rgb(44, 157, 212)",
                color: "rgb(255, 255, 255)",
                marginLeft: '10px',
                borderColor: "rgb(255, 255, 255)"
            }}
        >
            Free Trial
            
        </button>
    );
};

    useEffect(() => {
        const savedUserData = localStorage.getItem('userData');
        const savedLoginStatus = localStorage.getItem('isLoggedIn');

        const initializeUser = async () => {
            if (savedUserData && savedLoginStatus === 'true') {
                setUserData(JSON.parse(savedUserData));
                setIsLoggedIn(true);
            } else {
                setUserData(null);
                setIsLoggedIn(false);
                setHasCompanyUser(false);
            }
        };

        initializeUser();
        fetchData();
        hardik();

        // Listen for login event
        const handleUserLogin = async () => {
            const updatedUserData = localStorage.getItem('userData');
            const updatedLoginStatus = localStorage.getItem('isLoggedIn');
            if (updatedUserData && updatedLoginStatus === 'true') {
                setUserData(JSON.parse(updatedUserData));
                setIsLoggedIn(true);
                // When explicitly logging in via event (from popup), we can check company access and redirect 
                // OR we can just let handleLoginSuccess handle the navigation.
            } else {
                setUserData(null);
                setIsLoggedIn(false);
                setHasCompanyUser(false);
            }
        };
        window.addEventListener('userLogin', handleUserLogin);
        return () => {
            window.removeEventListener('userLogin', handleUserLogin);
        };
    }, []);

    const getUserEmail = async () => {
        try {
            const token = localStorage.getItem("WAauthToken");

            if (!token) {
                return {};
            }

            const response = await Authapi.getUser({
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            const email =
                response?.data?.user?.email || response?.user?.email || response?.email;
            const Role = response?.user?.user_type_id;
            const is_front_created = response?.user?.is_front_created;

            setUserRole(Role);
            setIsFrontCreated(is_front_created);
            if (email) {
                setUserEmail(email);
            }

            return { email, Role, is_front_created };
        } catch (error) {
            console.error("Error in getUserEmail:", error);
            return {};
        }
    };

    const checkCompanyAccess = async () => {
        try {
            const companyRes = await Authapi.getusercompanydetail();
            console.log("checkCompanyAccess response:", companyRes);

            const companyUsers =
                companyRes?.company_users ||
                companyRes?.data?.company_users ||
                companyRes?.companyUsers ||
                companyRes?.data?.companyUsers;

            const companyData =
                companyRes?.company ||
                companyRes?.companies ||
                companyRes?.data?.company ||
                companyRes?.data?.companies;

            const hasCompanyUsers =
                Array.isArray(companyUsers) ? companyUsers.length > 0 : !!companyUsers;
            const hasCompany =
                Array.isArray(companyData) ? companyData.length > 0 : !!companyData;

            const isOk =
                companyRes &&
                (companyRes.status === 200 ||
                    companyRes.status === true ||
                    companyRes.status === "success");

            const finalHasCompanyUser = Boolean(isOk && (hasCompanyUsers || hasCompany));
            console.log("checkCompanyAccess resolved hasCompanyUser:", finalHasCompanyUser);

            setHasCompanyUser(finalHasCompanyUser);
            return finalHasCompanyUser;
        } catch (error) {
            console.error("checkCompanyAccess error:", error);
            setHasCompanyUser(false);
            return false;
        }
    };

    const hardik = async () => {
        const response = await Authapi.Alldynamicpagegetnav();
        if (response.status === true) {
            setPagegetnav(response.data)
        }
    }

    const fetchData = async () => {
        try {
            const response = await Authapi.Navbarpageget();
            if (response && response.status === true) {
                const postStore = response.page?.post_store;
                if (postStore && Array.isArray(postStore) && postStore.length > 0) {
                    const firstPost = postStore[0]['data'];
                    if (firstPost) {
                        const buttonData = {};
                        
                        ['ContactUsButton', 'LoginButton'].forEach(buttonKey => {
                            const buttonGroup = firstPost[buttonKey];
                            if (buttonGroup) {
                                Object.entries(buttonGroup).forEach(([key, value]) => {
                                    // Extract the button number from the field slug
                                    const buttonNum = key.match(/\d+/)?.[0];
                                    if (buttonNum) {
                                        if (!buttonData[buttonNum]) {
                                            buttonData[buttonNum] = {};
                                        }
                                        // Use the original key directly
                                        buttonData[buttonNum][key] = value;
                                    }
                                });
                            }
                        });

                        setButtonData(buttonData);
                        setStatus(response.page);
                    } else {
                        console.error('First post is null or does not contain data:', firstPost);
                    }
                } else {
                    console.error('Post store is empty, null, or not an array:', postStore);
                }
            } else {
                console.error('Invalid response structure or status is false:', response);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const toggleLoginPopup = () => {
        setShowLoginPopup(!showLoginPopup);
    };

    const handleLoginSuccess = (data) => {
        setUserData(data);
        setIsLoggedIn(true);
        // setIsDropdownOpen(true);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(data));
        setShowLoginPopup(false);
        // console.log('Login successful:', data);
        // Immediately refresh company access so dropdown reflects new state without refresh
        checkCompanyAccess();
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleLogout = async () => {
        try {
            const response = await Authapi.logout(); 
            // console.log('Logout successful:', response); 
            setUserData(null);
            setIsLoggedIn(false);
            setHasCompanyUser(false);
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userData');
            localStorage.removeItem('WAauthToken');
            Swal.fire("Logged Out", "You have been logged out successfully!", "success"); 
            navigate('/');
            
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };


    const handleViewProfile = () => {
        navigate('/');
    };

    const handleEditProfile = () => {
        navigate('/');
    };

    // const handleMyAccount = async () => {
    //     try {
    //         setIsLoading(true);
    //         const result = await getUserEmail();
    //         const Role = result?.Role;
    //         const is_front_created = result?.is_front_created;

    //         if (Role === 2 || is_front_created === 1) {
    //             try {
    //                 const companyRes = await Authapi.getusercompanydetail();
    //                 const companyUsers =
    //                     companyRes?.company_users ||
    //                     companyRes?.data?.company_users ||
    //                     companyRes?.companyUsers ||
    //                     companyRes?.data?.companyUsers;
    //                 const hasCompanyUser = Array.isArray(companyUsers)
    //                     ? companyUsers.length > 0
    //                     : !!companyUsers;
    //                 const isOk =
    //                     companyRes &&
    //                     (companyRes.status === 200 ||
    //                         companyRes.status === true ||
    //                         companyRes.status === "success");

    //                 if (isOk && hasCompanyUser) {
    //                     const dynamicHost = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    //                     const token = localStorage.getItem("WAauthToken");
    //                     window.location.href = `${dynamicHost}/admin/user/dashboard/?token=${token}`;
    //                     return;
    //                 }

    //                 // If no company user found, prompt to purchase/ create company
    //                 Swal.fire({
    //                     icon: "info",
    //                     title: "Action Required",
    //                     html: "Purchase plan and create company after that you access admin panel",
    //                     confirmButtonText: "OK",
    //                 });
    //             } catch (companyError) {
    //                 console.error("Company check failed:", companyError);
    //                 // Gracefully fall back to the same action-required guidance
    //                 Swal.fire({
    //                     icon: "info",
    //                     title: "Action Required",
    //                     html: "Purchase plan and create company after that you access admin panel",
    //                     confirmButtonText: "OK",
    //                 });
    //             }
    //         } else {
    //             Swal.fire({
    //                 icon: "warning",
    //                 title: "Access Denied",
    //                 text: "You need a company account to access the admin panel.",
    //             });
    //         }
    //     } catch (error) {
    //         console.error("handleMyAccount error:", error);
    //         Swal.fire({
    //             icon: "error",
    //             title: "Error",
    //             text: "Something went wrong. Please try again.",
    //         });
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const handleMyAccount = async () => {
        try {
            setIsLoading(true);

            // Re-validate role/front flags (optional safety)
            const result = await getUserEmail();
            const Role = result?.Role;
            const is_front_created = result?.is_front_created;

            // if (!(Role === 2 || is_front_created === 1)) {
            //     Swal.fire({
            //         icon: "warning",
            //         title: "Access Denied",
            //         text: "You need a company account to access the admin panel.",
            //     });
            //     return;
            // }

            if (!hasCompanyUser) {
                // Button should not be visible without company, but double-check
                Swal.fire({
                    icon: "warning",
                    title: "Access Denied",
                    text: "You need a company to access the admin panel.",
                });
                return;
            }

            const dynamicHost = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
            const token = localStorage.getItem("WAauthToken");
            window.location.href = `${dynamicHost}/admin/user/dashboard/?token=${token}`;
        } catch (error) {
            console.error("handleMyAccount error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // const handleDashboard = async () => {
    //     const dynamicHost = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    //     const token = localStorage.getItem("WAauthToken");
    //     window.location.href = `${dynamicHost}/admin/user/dashboard/?token=${token}`;
    // };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMenuClick = (to, state) => {
        console.log(to);
        setIsLoading(true);
        navigate(to, { state });
    };

    const renderMenuItems = () => {
        if (!Array.isArray(topbardata)) {
            return null;
        }

        return allowedPageNames
            .map((item, index) => (
                <div key={index} className="d-flex align-items-center">
                    {index > 0 && (
                        <div className="line">
                            <span>|</span>
                        </div>
                    )}
                    <li className="nav-item">
                        <button
                            className="nav-link"
                            id="menu-item"
                            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                            onClick={() => handleMenuClick(
                                `/menu/${item.replace(/\s+/g, '-').toLowerCase()}`,
                                { menuName: item }
                            )}
                        >
                            {item}
                        </button>
                    </li>
                </div>
            ));
    };

    const renderLoginButton = () => {
        return Object.entries(buttonData).map(([buttonNum, data]) => {
            if (data[data?.Field_Slug_buttontitle2] === 'Login') {
                return (
                    <button
                        key={buttonNum}
                        type="button"
                        className="btn btn-outline-light"
                        // onClick={toggleLoginPopup}
                        onClick={() => {
                            // window.location.href = "http://walara.localhost.com/admin/login";
                            window.location.href = `${baseUrl}/admin/login`;
                        }}
                        id={`button${buttonNum}`}
                        style={{
                            backgroundColor: data[data?.Field_Slug_buttonbackgroundcolor2] || '',
                            color: data[data?.Field_Slug_buttontextcolor2] || '',
                            marginLeft: '10px'
                        }}
                    >
                        {data[data[`Field_Slug_buttontitle${buttonNum}`]]}
                    </button>
                );
            }
            return null;
        });
    };
    
    useEffect(() => {
        setIsLoading(true);
        const timeout = setTimeout(() => setIsLoading(false), 700); // 700ms fake loading
        return () => clearTimeout(timeout);
    }, [location]);

    return (
        <>
            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            <div className={isLoading ? "blur-content" : ""}>
                <nav className="navbar navbar-expand-lg navbar-light bg-white" id="menu">
                    <div className="container">
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                {renderMenuItems()}
                            </ul>
                            <form className="d-flex nav-form">
                                {renderContactUsButtons()} 
                                {renderFreeTrialButton()}
                                {(!isLoggedIn || window.location.pathname === '/') && renderLoginButton()}
                            </form>
                            {isLoggedIn && userData && window.location.pathname !== '/' && (
                                <div className="user-dropdown-container" ref={dropdownRef}>
                                    <div className="user-icon" onClick={toggleDropdown}>
                                        {userData.avatar ? (
                                            <img src={userData.avatar} alt="User Avatar" className="user-avatar" />
                                        ) : (
                                            <FaUserCircle size={30} />
                                        )}
                                        <span className="user-name">{userData.username}</span>
                                        {isDropdownOpen ? <MdArrowDropUp /> : <MdArrowDropDown />}
                                    </div>

                                    {isDropdownOpen && (
                                        <div className="dropdown-menu">
                                            <button onClick={handleViewProfile}>View Profile</button>
                                            <button onClick={handleEditProfile}>Edit Profile</button>
                                            {/* We can temporarily hide Go to Admin Dashboard if needed or leave it */}
                                            {hasCompanyUser && (
                                                <button onClick={handleMyAccount}>Go to Admin Dashboard</button>
                                            )}
                                            <button onClick={handleLogout}>Logout</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
                {showLoginPopup && (
                    <Popup isOpen={showLoginPopup} onClose={toggleLoginPopup} onLoginSuccess={handleLoginSuccess} />
                )}
                <Outlet />
            </div>
        </>
    );
};

const Popup = ({ isOpen, onClose, onLoginSuccess }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <Login onLoginSuccess={onLoginSuccess} onClose={onClose} />
            </div>
        </div>
    );
};

export default Navlayout;


























// import { Outlet, Link } from "react-router-dom";
// // import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from 'react';
// import Authapi from '../Authapi';

// const Navlayout = () => {
//     // const navigate = useNavigate();

//     const [topbardata, setTopbardata] = useState([]);
//     const [statu, setStatus] = useState([]);
//     const [buttonData, setButtonData] = useState({});
//     const [pagegetnav, setPagegetnav] = useState({});
//     // console.log(buttonData)

//     const allowedPageNames = Array.isArray(pagegetnav)
//         ? pagegetnav.map(item => item.page_name)
//         : [];

//     useEffect(() => {
//         fetchData();
//         getPostData()
//     }, []);

//     const getPostData = async () => {
//         const response = await Authapi.Alldynamicpagegetnav();
//         if (response.status === true) {
//             setPagegetnav(response.data)
//         }
//     }
//     // console.log(pagegetnav)

//     const fetchData = async () => {
//         try {
//             const response = await Authapi.Navbarpageget();
//             // console.log('Response:', response);
//             if (response && response.status === true) {
//                 const postStore = response.page?.post_store;
//                 if (postStore && Array.isArray(postStore) && postStore.length > 0) {
//                     const firstPost = postStore[0];
//                     if (firstPost && firstPost.data) {
//                         const data = firstPost.data;
//                         // console.log('Data keys:', Object.keys(data)); // Log all keys in the data object
                        
//                         const menuData = Object.entries(data)
//                             .filter(([key]) => key.startsWith('menu'))
//                             .sort((a, b) => {
//                                 const numA = parseInt(a[0].replace('menu', ''));
//                                 const numB = parseInt(b[0].replace('menu', ''));
//                                 return numA - numB;
//                             })
//                             .map(([key, value]) => ({ [key]: value }));

//                         const buttonData = {};
//                         Object.entries(data).forEach(([key, value]) => {
//                             if (key.toLowerCase().includes('button')) {
//                                 // console.log(`Found button key: ${key}`); // Log each button-related key
//                                 const buttonNumMatch = key.match(/\d+/);
//                                 const buttonNum = buttonNumMatch ? buttonNumMatch[0] : key; // Use key if no number
//                                 if (!buttonData[buttonNum]) {
//                                     buttonData[buttonNum] = {};
//                                 }
//                                 // Assuming value is an object with button properties
//                                 Object.entries(value).forEach(([propKey, propValue]) => {
//                                     const propertyName = propKey.replace(/\d+/g, '').replace(/\s+/g, '_').trim();
//                                     // console.log(`Processing property: ${propertyName} with value: ${propValue}`);
//                                     buttonData[buttonNum][propertyName] = propValue;
//                                 });
//                             }
//                         });
//                         // console.log('Button Data:', buttonData);
//                         setTopbardata(menuData);
//                         setButtonData(buttonData);
//                         setStatus(response.page);
//                     } else {
//                         console.error('First post is null or does not contain data:', firstPost);
//                     }
//                 } else {
//                     console.error('Post store is empty, null, or not an array:', postStore);
//                 }
//             } else {
//                 console.error('Invalid response structure or status is false:', response);
//             }
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//     };


//     const renderMenuItems = () => {
//         if (!Array.isArray(topbardata)) {
//             return null;
//         }


//         return allowedPageNames
//             .map((item, index) => {


//                 return (
//                     <div key={index} className="d-flex align-items-center">
//                         {index > 0 && (
//                             <div className="line">
//                                 <span>|</span>
//                             </div>
//                         )}
//                         <li className="nav-item">
//                             <Link
//                                 className="nav-link"
//                                 id="menu-item"
//                                 to={`/menu/${item.replace(/\s+/g, '-').toLowerCase()}`}
//                                 state={{ menuName: item }}
//                             >
//                                 {item}
//                             </Link>
//                         </li>
//                     </div>
//                 );
//             });
//     };

//     const renderButtons = () => {
//         const showContactButton = allowedPageNames.includes('Contact Us');

//         return Object.entries(buttonData).map(([buttonNum, data]) => {
//             // console.log(data);
//             if (data.Buttontitle === 'Contact Us' && !showContactButton) {
//                 return null;
//             }

//             return (
//                 <button
//                     key={buttonNum}
//                     type="button"
//                     className="btn btn-outline-light"
//                     onClick={() => data.Buttonlink ? window.location.href = data.Buttonlink : null}
//                     id={`button${buttonNum}`}
//                     style={{
//                         backgroundColor: data.Buttonbackgroundcolor || '',
//                         color: data.Buttontextcolor || '',
//                         marginLeft: '10px'
//                     }}
//                 >
//                     {data.Buttontitle || 'Default Text'}
//                 </button>
//             );
//         });
//     };

//     return (
//         <>
//             <nav className="navbar navbar-expand-lg navbar-light bg-white" id="menu">
//                 <div className="container">
//                     <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//                         <span className="navbar-toggler-icon"></span>
//                     </button>
//                     <div className="collapse navbar-collapse" id="navbarSupportedContent">
//                         <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//                             {renderMenuItems()}
//                         </ul>
//                         <form className="d-flex">
//                             {renderButtons()}
//                         </form>
//                     </div>
//                 </div>
//             </nav>
//             <Outlet />
//         </>
//     );
// };

// export default Navlayout;






