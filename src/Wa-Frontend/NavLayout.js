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
            if (data.buttontitle === 'Login') {
                return null;
            }

            if (data.buttontitle === 'Contact Us') {
                return (
                    <button
                        key={buttonNum}
                        type="button"
                        className="btn btn-outline-light"
                        onClick={() => {
                            if (data.buttonlink) {
                                window.location.href = data.buttonlink;
                            }
                        }}
                        id={`button${buttonNum}`}
                        style={{
                            backgroundColor: data.buttonbackgroundcolor || '',
                            color: data.buttontextcolor || '',
                            marginLeft: '10px'
                        }}
                    >
                        {data.buttontitle}
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
            if (response.status === true) {
                const data = response.page.post_store[0].data || {};
                const menuData = Object.entries(data)
                    .filter(([key]) => key.startsWith('menu'))
                    .sort((a, b) => {
                        const numA = parseInt(a[0].replace('menu', ''));
                        const numB = parseInt(b[0].replace('menu', ''));
                        return numA - numB;
                    })
                    .map(([key, value]) => ({ [key]: value }));

                const buttonData = {};
                Object.entries(data).forEach(([key, value]) => {
                    if (key.startsWith('Button')) {
                        const buttonNum = key.replace(/[^0-9]/g, '');
                        if (!buttonData[buttonNum]) {
                            buttonData[buttonNum] = {};
                        }
                        const propertyName = key.replace(buttonNum, '');
                        buttonData[buttonNum][propertyName.toLowerCase()] = value;
                    }
                });
                setTopbardata(menuData);
                setButtonData(buttonData);
                setStatus(response.page)
               
            } else {
                console.error('Invalid response structure:', response);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const toggleLoginPopup = () => {
        setShowLoginPopup(!showLoginPopup);
    };

    const handleLoginSuccess = (data) => {
        setUserData(data);
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(data));
        setShowLoginPopup(false);
        console.log('Login successful:', data);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleLogout = async () => {
        try {
            const response = await Authapi.logout(); 
            console.log('Logout successful:', response); 
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
            if (isLoggedIn && data.buttontitle === 'Login') {
                return null;
            }
    
            if (data.buttontitle === 'Login') {
                return (
                    <button
                        key={buttonNum}
                        type="button"
                        className="btn btn-outline-light"
                        onClick={toggleLoginPopup}
                        id={`button${buttonNum}`}
                        style={{
                            backgroundColor: data.buttonbackgroundcolor || '',
                            color: data.buttontextcolor || '',
                            marginLeft: '10px'
                        }}
                    >
                        {data.buttontitle}
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
                                    <span className="user-name">{userData.name}</span>
                                    {isDropdownOpen ? <MdArrowDropUp /> : <MdArrowDropDown />}
                                </div>

                                {isDropdownOpen && (
                                    <div className="dropdown-menu">
                                        <button onClick={handleViewProfile}>View Profile</button>
                                        <button onClick={handleEditProfile}>Edit Profile</button>
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

