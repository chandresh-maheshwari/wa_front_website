import { Outlet, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from 'react';
import Authapi from '../Authapi';
import Login from '../components/Login/Login';
import { FaUserAlt, FaUserCircle } from "react-icons/fa";
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import Swal from 'sweetalert2';

const Navlayout = () => {
    const navigate = useNavigate();
    const [topbardata, setTopbardata] = useState([]);
    const [userData, setUserData] = useState(null); 
    const [statu, setStatus] = useState([]);
    const [buttonData, setButtonData] = useState({});
    const [pagegetnav, setPagegetnav] = useState({});
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const allowedPageNames = Array.isArray(pagegetnav)
        ? pagegetnav.map(item => item.page_name)
        : [];

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

    useEffect(() => {
        const savedUserData = localStorage.getItem('userData');
        const savedLoginStatus = localStorage.getItem('isLoggedIn');
        
        if (savedUserData && savedLoginStatus === 'true') {
            setUserData(JSON.parse(savedUserData)); 
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }

        fetchData();
        hardik();
    }, []);

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
                        <Link
                            className="nav-link"
                            id="menu-item"
                            to={`/menu/${item.replace(/\s+/g, '-').toLowerCase()}`}
                            // to={`https://${item}`}
                            state={{ menuName: item }}
                        >
                            {item}
                        </Link>
                    </li>
                </div>
            ));
    };

    const renderLoginButton = () => {
        return Object.entries(buttonData).map(([buttonNum, data]) => {
            console.log("DATA=>");
            console.log(data[data?.Field_Slug_buttontitle2]);
            if (isLoggedIn && data[data?.Field_Slug_buttontitle2] === 'Login') {
                return null;
            }
            if (data[data?.Field_Slug_buttontitle2] === 'Login') {
                return (
                    <button
                        key={buttonNum}
                        type="button"
                        className="btn btn-outline-light"
                        onClick={toggleLoginPopup}
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
    
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-white" id="menu">
                <div className="container">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {renderMenuItems()}
                        </ul>
                        <form className="d-flex">
                            {renderContactUsButtons()} 
                            {!isLoggedIn && renderLoginButton()}
                        </form>
                        {isLoggedIn && userData && (
                            <div className="user-dropdown-container" ref={dropdownRef} style={{color:'white'}}>
                                <div className="user-icon" onClick={toggleDropdown}>
                                    {userData.avatar ? (
                                        <img src={userData.avatar} alt="User Avatar" className="user-avatar" />
                                    ) : (
                                        <FaUserCircle size={30} />
                                    )}
                                    <span className="user-name">{userData.username}</span>
                                    {isDropdownOpen ? <MdArrowDropUp /> : <MdArrowDropDown />}
                                </div>

{/* {console.log(isDropdownOpen)} */}
                                {isDropdownOpen && (
                                    <div className="dropdown-menu">
                                        <button onClick={handleViewProfile}>View Profile</button>
                                        <button onClick={handleEditProfile}>Edit Profile</button>
                                        {/* <button onClick={handleDashboard}>Go to dashboard</button> */}
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
        </>
    );
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






