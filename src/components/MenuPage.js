import { useLocation, useParams, Link, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Authapi from '../Authapi';
import righticon from './img/righticon.png';
import plushicon from './img/plush.png';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import ls from 'local-storage';
import Login from '../components/Login/Login';
import { Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import Expired from "../components/CheckTokenExpier";
import Navlayout from '../Wa-Frontend/NavLayout';
const stripePromise = loadStripe('pk_test_51P4GXaAvL6Jnl0r3yHDSV2zN0JrGRt2UFxn217kqw9JFFBXe4K1n5xZHGfsKaIicVfUBAP5ch0TBIO8C8cI3ijQv00bNWJynzK');

const MenuPage = () => {
    const location = useLocation();
    const { menuName } = useParams();
    const [currentMenu, setCurrentMenu] = useState('');
    const [topbardata, setTopbardata] = useState([]);
    // const [status, setStatus] = useState([]);
    const [titles, setTitles] = useState([]);
    const [description, setDescription] = useState([]);
    const [errors, setErrors] = useState({});
    const [isPlaying, setIsPlaying] = useState(true);
    const [sliderRef, setSliderRef] = useState(null);
    const [homesection, setHomesection] = useState({});
    // const [Transforming, setTransforming] = useState({});
    const [formData, setFormData] = useState({});
    const [statu, setStatus] = useState({});
    const [userEmail, setUserEmail] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [Transforming, setTransforming] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isFrontCreated, setIsFrontCreated] = useState(null);




    const navigate = useNavigate();

    // const getUserEmail = async () => {
    //     try {
    //         const token = ls.get("WAauthToken");

    //         if (!token) {
    //             console.log("No auth token found");
    //             return;
    //         }

    //         const response = await Authapi.getUser({
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         console.log("API Response:", response);

    //         const email = response?.data?.user?.email ||
    //             response?.user?.email ||
    //             response?.email;

    //         console.log("Extracted Email:", email);

    //         if (email) {
    //             setUserEmail(email);
    //             return email;
    //         } else {
    //             console.log("Email not found in response structure");
    //             console.log("Response structure:", JSON.stringify(response, null, 2));
    //         }

    //     } catch (error) {
    //         console.error("Error in getUserEmail:", error);
    //     }
    // };

    const getUserEmail = async () => {
        try {
            const token = ls.get("WAauthToken");

            if (!token) {
                // console.log("No auth token found");
                return {};
            }

            const response = await Authapi.getUser({
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            console.log("API Response:", response);

            const email =
                response?.data?.user?.email || response?.user?.email || response?.email;
            const Role = response?.user?.user_type_id;
            const is_front_created = response?.user?.is_front_created;

            console.log("Extracted Email:", email);
            console.log("Extracted Email:", Role);

            setUserRole(Role);
            setIsFrontCreated(is_front_created);
            if (email) {
                setUserEmail(email);
                return { email, Role, is_front_created }; // Return both
            } else {
                // console.log("Email not found in response structure");
                // console.log("Response structure:", JSON.stringify(response, null, 2));
            }
        } catch (error) {
            console.error("Error in getUserEmail:", error);
        }
    };
    const toggleLoginPopup = () => {
        setShowLoginPopup(!showLoginPopup);
    };

    // const handlePurchaseSubmit = async (productName, amount, stripid) => {
    //     const token = localStorage.getItem("WAauthToken");
    //     if (!token) {
    //         Swal.fire({
    //             icon: 'warning',
    //             title: 'Please Log In',
    //             text: 'You need to be logged in to make a purchase.',
    //             showConfirmButton: true,
    //             showCancelButton: true,
    //             cancelButtonText: 'Cancel'
    //         }).then((result) => {
    //             if (result.isConfirmed) {
    //                 // Show the login popup when "OK" is clicked
    //                 toggleLoginPopup();
    //             }
    //         });
    //         return;
    //     }

    //     try {
    //         // Get user email first
    //         let email = userEmail;
    //         if (!email) {
    //             email = await getUserEmail();
    //             if (!email) {
    //                 Swal.fire({
    //                     icon: 'error',
    //                     title: 'Error',
    //                     text: 'Could not retrieve user email. Please try again.',
    //                 });
    //                 return;
    //             }
    //         }
    //         Swal.fire({
    //             title: 'Processing...',
    //             text: 'Please wait while we set up your payment.',
    //             allowOutsideClick: false,
    //             showConfirmButton: false,
    //             didOpen: () => {
    //                 Swal.showLoading();
    //             }
    //         });

    //         // Replace the fetch call with the Authapi function
    //         const response = await Authapi.createCheckoutSession(productName, amount, email);

    //         if (!response.status) {
    //             throw new Error(response.message || 'Failed to create checkout session');
    //         }

    //         window.location.href = response.url;

    //     } catch (error) {
    //         console.error("Purchase Error:", error);
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Payment Error',
    //             text: error.message || 'There was an error processing your payment. Please try again.',
    //             background: '#f8f9fa',
    //             showConfirmButton: true,
    //             confirmButtonText: 'OK'
    //         });
    //     }
    // };
    const handlePurchaseSubmit = async (price_id, trail_days) => {
        const token = localStorage.getItem("WAauthToken");
        if (!token) {
            // Store purchase intent in localStorage
            localStorage.setItem('purchaseIntent', JSON.stringify({ price_id, trail_days }));
            toggleLoginPopup();
            return;
        }
        setLoading(true);
        try {
            console.log("submit");
            console.log(userEmail);
            let email = userEmail;
            let Role = userRole
            let is_front_created = isFrontCreated
                ;
            if (!email) {
                const result = await getUserEmail();
                console.log("testing");
                console.log(result);
                email = result.email;
                Role = result.Role;
                is_front_created = result.is_front_created;
                if (!email) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Could not retrieve user email. Please try again.",
                    });
                    return;
                }
            }
            console.log("AAAAAAAAAAAAAAAAAAAAAAA");
            // console.log(8);
            // console.log(Role !== 2);
            // console.log(is_front_created);
            // console.log(is_front_created === 0);
            // console.log(8 !== 2 || is_front_created === 0);
            console.log("BBBBBBBBBBBBBBBBBBB");

            // if (Role !== 2) {
            if (Role !== 2 || is_front_created === 0) {
                Swal.fire({
                    icon: "warning",
                    title: "Access Denied",
                    // text: "You are not the right user to access this feature.",
                    // text: "You are not authenticate user. please logout and signup / login as company user.",
                    html: `You are not authenticate user.<br>
                            Please logout and signup / login as company user.`,
                    confirmButtonText: "OK",
                });
                setLoading(false);
                setUserRole(null);
                setUserEmail(null);

                return;
            }
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
        } finally {
            setLoading(false);
        }
    };

    const handleLoginSuccess = (data) => {
        // setUserData(data);
        setIsLoggedIn(true);
        // setIsDropdownOpen(true);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(data));
        setShowLoginPopup(false);
        // console.log('Login successful:', data);
    };


    useEffect(() => {
        const menuTitle = location.state?.menuName ||
            menuName.split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

        console.log(menuTitle);
        setCurrentMenu(menuTitle);
    }, [location, menuName]);

    useEffect(() => {
        if (sliderRef) {
            if (isPlaying) {
                sliderRef.slickPlay();
            } else {
                sliderRef.slickPause();
            }
        }
    }, [sliderRef, isPlaying]);

    useEffect(() => {
        fetchData();
    }, [currentMenu]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await Authapi.dynamicpageget(currentMenu);
            if (response.status === true) {
                // console.log(response.page.post_store);
                setTopbardata(response.page.post_store || []);
                setTransforming(response.page.post_store);

                setStatus(response.page);
                const dynamicTitles = response.page.post_store.flatMap(post =>
                    // console.log(post);
                    Object.keys(post.data)
                        .filter(key => key.startsWith('Title'))
                        .map(key => post.data[key])
                );
                setTitles(dynamicTitles);

                const dynamicDescriptions = response.page.post_store.flatMap(post =>
                    Object.keys(post.data)
                        .filter(key => key.startsWith('Description'))
                        .map(key => post.data[key])
                );
                setDescription(dynamicDescriptions);
            } else {
                navigate("/Nopage");
            }
        } catch (error) {
            if (error.status === 404) {
                navigate("/Nopage");
            }
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (event, index) => {
        const { value, name } = event.target;
        const newErrors = { ...errors };
        if (topbardata[index]?.data?.Type === "tel" && name.includes("field")) {
            let cleanedValue = value.replace(/\D/g, "");
            if (cleanedValue.length > 10) {
                cleanedValue = cleanedValue.slice(0, 10);
            }
            event.target.value = cleanedValue;
            newErrors[`label${index}`] = cleanedValue.length === 10 ? "" : "";
        } else {
            if (value) {
                newErrors[`label${index}`] = "";
            }
        }
        setErrors(newErrors);
    };

    const renderCards = () => {
        // console.log("XXXXXXXXXXXXXXXXX");
        // console.log(statu?.post_store);
        return statu?.post_store.map((card, index) => {
            const feesSection = card.data.FeesSection || {};
            const infoSection1 = card.data.PackageInfo || {};
            const serviceSection = card.data.PackageServices || {};
            const purchaseButtonSection = card.data.PurchaseButton || {};

            const hasContent =
                infoSection1?.[infoSection1?.Field_Slug_information1] ||
                infoSection1?.[infoSection1?.Field_Slug_information2] ||
                infoSection1?.[infoSection1?.Field_Slug_information3] ||
                infoSection1?.[infoSection1?.Field_Slug_information4] ||
                infoSection1?.[infoSection1?.Field_Slug_information5] ||
                serviceSection?.[serviceSection?.Field_Slug_service1] ||
                serviceSection?.[serviceSection?.Field_Slug_service2] ||
                feesSection?.[feesSection?.Field_Slug_monthlyfee] ||
                feesSection?.[feesSection?.Field_Slug_monthlyfeecardtext1] ||
                feesSection?.[feesSection?.Field_Slug_monthlyfeecardtext2] ||
                purchaseButtonSection?.[purchaseButtonSection?.Field_Slug_amount] ||
                purchaseButtonSection?.[purchaseButtonSection?.Field_Slug_buttonbackgroundcolor] ||
                purchaseButtonSection?.[purchaseButtonSection?.Field_Slug_buttoncolor] ||
                purchaseButtonSection?.[purchaseButtonSection?.Field_Slug_buttontext];

            if (!hasContent) return null;

            return (
                <div className={`col-lg-4`} id={`card${index + 1}`} key={card.Id}>
                    <div
                        className={`card-liner-card-${index + 1}`}
                        id="card-liner-card"
                    ></div>
                    <div className={`card${index + 1} card`}>
                        <span className="medaltype">{card?.data?.[card?.data?.Field_Slug_packagename]}</span>
                        <div className={`card${index + 1}-text`}>
                            {/* Render Information Section */}
                            {[
                                infoSection1?.[infoSection1?.Field_Slug_information1],
                                infoSection1?.[infoSection1?.Field_Slug_information2],
                                infoSection1?.[infoSection1?.Field_Slug_information3],
                                infoSection1?.[infoSection1?.Field_Slug_information4],
                                infoSection1?.[infoSection1?.Field_Slug_information5],
                            ].map(
                                (text, i) =>
                                    text && (
                                        <p className="card-text-container cardtext" key={i}>
                                            <img
                                                src={righticon}
                                                className={`card${index + 1}righticon card-text-image`}
                                                alt={`Icon ${i + 1}`}
                                            />
                                            {text}
                                        </p>
                                    )
                            )}

                            {Object.values(infoSection1).some((text) => text) && (
                                <div className="card-liner-inside"></div>
                            )}
                        </div>

                        <div className={`card${index + 1}-sec-2-text`}>
                            {/* Render Service Section */}
                            {serviceSection?.[serviceSection?.Field_Slug_service1] && (
                                <p className="card-text-container">
                                    <img
                                        src={plushicon}
                                        className={`card${index + 1}plushicon card-text-image`}
                                        alt="Add On Icon"
                                    />
                                    {serviceSection?.[serviceSection?.Field_Slug_service1]}
                                </p>
                            )}
                            {serviceSection?.[serviceSection?.Field_Slug_service1] && (
                                <div className="card-liner-inside-2"></div>
                            )}

                            <div className={`card-${index + 1}-sec-3`}>

                                {feesSection?.[feesSection?.Field_Slug_monthlyfee] && (
                                    <p className={`card${index + 1}-sec-3-text1`}>
                                        {feesSection?.[feesSection?.Field_Slug_monthlyfee]}
                                    </p>
                                )}
                                {[
                                    feesSection?.[feesSection?.Field_Slug_monthlyfeecardtext1],
                                    feesSection?.[feesSection?.Field_Slug_monthlyfeecardtext2]
                                ].map(
                                    (text, i) =>
                                        text && (
                                            <p className="card-text-container cardtext" key={i}>
                                                <img
                                                    src={plushicon}
                                                    className={`card${index + 1}plushicon card-text-image`}
                                                    alt="Add On Icon"
                                                />
                                                {text}
                                            </p>
                                        )
                                )}

                                {/* Render Service 2 */}
                                {serviceSection?.[serviceSection?.Field_Slug_service2] && (
                                    <p className={`card${index + 1}-sec-3-text`}>
                                        <img
                                            src={plushicon}
                                            className={`card${index + 1}plushicon card-text-image`}
                                            alt="Add On Icon"
                                        />
                                        {serviceSection?.[serviceSection?.Field_Slug_service2]}
                                    </p>
                                )}
                            </div>
                        </div>
                        {purchaseButtonSection?.[purchaseButtonSection?.Field_Slug_buttontext] && (
                            <div className="text-center purchase-btn">
                                <button
                                    role="link"
                                    className="btn w-50 purchase-button"
                                    onClick={() =>
                                        handlePurchaseSubmit(
                                            card?.data.Packagename,
                                            purchaseButtonSection?.[purchaseButtonSection?.Field_Slug_amount],
                                            purchaseButtonSection?.[purchaseButtonSection?.Field_Slug_stripid]
                                        )
                                    }
                                >
                                    {`${purchaseButtonSection?.[purchaseButtonSection?.Field_Slug_buttontext]} - $${purchaseButtonSection?.[purchaseButtonSection?.Field_Slug_amount]}`}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            );
        });
    };



    const handleSubmit = async (event) => {
        event.preventDefault();
        const newErrors = {};
        const formData = {};

        topbardata.forEach((item, index) => {
            const value = document.querySelector(`[name="field${index}"]`).value;
            formData[`field${index}`] = value;

            if (!value) {
                newErrors[`label${index}`] = "This field is required";
            } else {
                if (item.data.Type === "tel") {
                    const cleanedValue = value.replace(/\D/g, "");
                    if (cleanedValue.length !== 10) {
                        newErrors[`label${index}`] = "Phone number must be 10 digits";
                    } else {
                        newErrors[`label${index}`] = "";
                    }
                }
                else if (item.data.Type === "email") {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(value)) {
                        newErrors[`label${index}`] = "Please enter a valid email address";
                    } else {
                        newErrors[`label${index}`] = "";
                    }
                } else {
                    newErrors[`label${index}`] = "";
                }
            }
        });

        if (Object.values(newErrors).some(error => error)) {
            setErrors(newErrors);
            return;
        }
        Swal.fire({
            title: 'Submitting...',
            html: 'Please wait while we process your request.',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            const response = await Authapi.contactdatapost(formData);
            if (response && response.status === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Form submitted successfully!',
                    background: '#f8f9fa',
                    showConfirmButton: true,
                    confirmButtonText: 'OK'
                }).then(() => {
                    const form = document.getElementById('contactForm');
                    if (form) {
                        form.reset();
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to submit form. Please try again!',
                    background: '#f8f9fa',
                    showConfirmButton: true,
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while submitting the form.',
                background: '#f8f9fa',
                showConfirmButton: true,
                confirmButtonText: 'OK'
            });
        }
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleContainerClick = (event) => {
        if (event.target === event.currentTarget) {
            sliderRef.current.slickPause();
        }
    };

    const settings = {
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    };

    return (
        <>
            <Navlayout />
            <Expired />
            {isLoading ? (
                <div className="loading-overlay">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* {console.log(statu)} */}
                    {currentMenu === 'About Us' && statu.page_status === 1 && topbardata.length > 0 ? (
                        <section className="page-section" id="package_section">
                            <div className="container type-1">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="sec-8-heading">
                                            <h1 id="About-us">
                                                {/* {statu.about_us?.page_name} */}
                                                {statu.page_name}
                                            </h1>
                                        </div>
                                    </div>
                                </div>

                                <div className="row about-section-row">
                                    <div className="col-md-3">
                                        <div className="content-box">
                                            {/* {console.log(titles)} */}

                                            {titles.map((title, index) => (
                                                <div key={index}>
                                                    {/* {console.log(title)} */}
                                                    <h5 className="title-sm">{title}</h5>
                                                    <p></p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="content-box">
                                            {Array.isArray(description) ? (
                                                description.map((descItem, index) => (
                                                    <p key={index}>{descItem}</p>
                                                ))
                                            ) : (
                                                <p>{description}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ) : currentMenu === 'About Us' && statu.page_status === 0 ? (
                        <div className="text-center"> 404 Page Not Found</div>
                    ) : null}

                    {currentMenu === 'Our Products' && statu.page_status === 1 && topbardata.length > 0 ? (
                        <section className="packages-sec" id="package_section">
                            <div className="container mt-2">
                                <div className="waste-management-service-title">
                                    <h4>{statu.page_description}</h4>

                                </div>
                                <div className="row">{renderCards()}</div>
                                {statu.page_status === 1 && (
                                    <div className="row mt-5">
                                        <div className="col-12 contact-us-package">
                                            <button
                                                type="button"
                                                onClick={() => navigate("/menu/contact-us")}
                                                className="btn sky-blue-btn mb-5 contact-us-package"
                                            >
                                                Contact Us
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    ) : currentMenu === 'Our Products' && statu.page_status === 0 ? (
                        <div className="text-center"> 404 Page Not Found</div>
                    ) : null}

                    {currentMenu === 'Contact Us' && statu.page_status === 1 && topbardata.length > 0 ? (
                        <section className="lets-talk-sec" id="package_section">
                            <div className="container" id="sec-10">
                                <div className="contactusswction">
                                    <form id="contactForm">
                                        <div className="row ">
                                            <div className="col-12">
                                                <h4 className="letstallktitle">
                                                    {statu?.post_store[0].data?.[statu?.post_store[0].data?.Field_Slug_title]}
                                                </h4>
                                                <div className="inputgroup">
                                                    {statu?.post_store[0].data?.[statu?.post_store[0].data?.Field_Slug_description]}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            {statu?.post_store.map((item, index) => (
                                                <div className="col-md-6" key={index}>
                                                    <div className="inputgroup">
                                                        <label>{item.data?.[item.data?.Field_Slug_label]}</label>
                                                        {item.data?.[item.data?.Field_Slug_type] === "Textarea" ? (

                                                            <textarea
                                                                className="form-control"
                                                                name={`field${index}`}
                                                                rows="4"
                                                                onChange={(e) => handleInputChange(e, index)}
                                                            />
                                                        ) : (
                                                            <input
                                                                className="form-control"
                                                                name={`field${index}`}
                                                                type={item.data.Type}
                                                                onChange={(e) => handleInputChange(e, index)}
                                                            />
                                                        )}

                                                        {errors[`label${index}`] && (
                                                            <span className="error-message">
                                                                {errors[`label${index}`]}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </form>

                                    <div className="row mt-3 ">
                                        <div className="col-12">
                                            <button
                                                type="submit"
                                                onClick={handleSubmit}
                                                className="btn w-auto sky-blue-btn-sendmeasge"
                                            >
                                                {/* Send my message */}
                                                {statu?.button_name}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ) : null
                    }

                    {/* {console.log(currentMenu)} */}
                    {currentMenu === 'Who Use WA' && statu.page_status === 1 ? (
                        <section className="clients-section" id="clients_section">
                            <div className="container sliderconatainer">
                                <h2 className="font-weight-light slider-heading text-center">
                                    {statu.page_description}
                                </h2>
                                <div className="clients-grid">
                                    {statu.post_store.map((item, index) => (
                                        <div key={item.Id} className="client-logo">
                                            {item.data && item.data.Link ? (
                                                <Link to={item.data.Link}>
                                                    <img
                                                        src={item.data.Image}
                                                        alt={`Client ${index + 1}`}
                                                        className="client-image sliderimages"
                                                    />
                                                </Link>
                                            ) : item.data ? (
                                                <img
                                                    src={item.data.Image}
                                                    alt={`Client ${index + 1}`}
                                                    className="client-image sliderimages"
                                                />
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    ) : null}


                    {currentMenu === 'Transforming Waste Industry' && statu.page_status === 1 && topbardata.length > 0 ? (
                        <section className="page-section" id="transforming_section">
                            <div className="container p-5 transforming_section_container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="transfo">
                                            <h5 className="text-center transforming ">
                                                {statu?.page_description}
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="container">
                                <div className="row p-5 justify-content-center">
                                    {Transforming[0]?.data && !Transforming[1]?.data && (
                                        <div className="col-md-8 text-center">
                                            <h5 className="for-waste centered-text">
                                                {Transforming[0]?.data?.[Transforming[0]?.data?.Field_Slug_pagesectiontitle1]} <br />
                                                <b>{Transforming[0]?.data?.[Transforming[0]?.data?.Field_Slug_pagesectiontitle2]}</b>
                                            </h5>
                                            <p className="transfotextdes1 centered-text">
                                                {Transforming[0]?.data?.[Transforming[0]?.data?.Field_Slug_pagesectiondescription]}
                                            </p>
                                        </div>
                                    )}
                                    {Transforming[1]?.data && !Transforming[0]?.data && (
                                        <div className="col-md-8 text-center">
                                            <h5 className="for-waste">
                                                {Transforming[1]?.data?.[Transforming[1]?.data?.Field_Slug_pagesectiontitle1]} <br />
                                                <b>{Transforming[1]?.data?.[Transforming[1]?.data?.Field_Slug_pagesectiontitle2]}</b>
                                            </h5>
                                            <p className="transfotextdes2 centered-text">
                                                {Transforming[1]?.data?.[Transforming[1]?.data?.Field_Slug_pagesectiondescription]}
                                            </p>
                                        </div>
                                    )}
                                    {Transforming[0]?.data && Transforming[1]?.data && (
                                        <>
                                            <div className="col-md-5">
                                                <h5 className="transfotext1 for-waste">
                                                    {Transforming[0]?.data?.[Transforming[0]?.data?.Field_Slug_pagesectiontitle1]} <br />
                                                    <b>{Transforming[0]?.data?.[Transforming[0]?.data?.Field_Slug_pagesectiontitle2]}</b>
                                                </h5>
                                                <p className="transfotextdes1">
                                                    {Transforming[0]?.data?.[Transforming[0]?.data?.Field_Slug_pagesectiondescription]}
                                                </p>
                                            </div>
                                            <div className="col-md-2 stretch-line">
                                                <img
                                                    src={statu?.image}
                                                    width="60px"
                                                    className="strech"
                                                    alt="strech"
                                                />
                                            </div>
                                            <div className="col-md-5">
                                                <h5 className="transfotext2 for-waste">
                                                    {Transforming[1]?.data?.[Transforming[1]?.data?.Field_Slug_pagesectiontitle1]} <br />
                                                    <b>{Transforming[1]?.data?.[Transforming[1]?.data?.Field_Slug_pagesectiontitle2]}</b>
                                                </h5>
                                                <p className="transfotextdes2">
                                                    {Transforming[1]?.data?.[Transforming[1]?.data?.Field_Slug_pagesectiondescription]}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </section>
                    ) : null}

                    {showLoginPopup && (
                        <Popup isOpen={showLoginPopup} onClose={toggleLoginPopup} onLoginSuccess={handleLoginSuccess} />
                    )}
                    <Outlet />
                </>
            )}
        </>
    );
};


const Popup = ({ isOpen, onClose, onLoginSuccess }) => {
    if (!isOpen) return null;
    console.log("Popup is call")
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <Login onLoginSuccess={onLoginSuccess} onClose={onClose} />
            </div>
        </div>
    );
};

export default MenuPage;
