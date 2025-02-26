import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Authapi from '../Authapi';
import righticon from './img/righticon.png';
import plushicon from './img/plush.png';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import ls from 'local-storage';
import { Navigate } from 'react-router-dom';
import Login from './Login/Login';
import { loadStripe } from '@stripe/stripe-js';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
const stripePromise = loadStripe('pk_test_51P4GXaAvL6Jnl0r3yHDSV2zN0JrGRt2UFxn217kqw9JFFBXe4K1n5xZHGfsKaIicVfUBAP5ch0TBIO8C8cI3ijQv00bNWJynzK');

const MenuPage = () => {

    const location = useLocation();
    const { menuName } = useParams();
    const [currentMenu, setCurrentMenu] = useState('');
    const [topbardata, setTopbardata] = useState([]);
    const [status, setStatus] = useState([]);
    const [titles, setTitles] = useState([]);
    const [description, setDescription] = useState([]);
    const [errors, setErrors] = useState({});
    const [sessionId, setSessionId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);

    const navigate = useNavigate();

    const cardTextStyle = {
        display: 'flex',
        alignItems: 'center',
        margin: '0',
        fontSize: "medium",
    };

    const cardTextImageStyle = {
        marginRight: '10px',
    };

    useEffect(() => {
        const menuTitle = location.state?.menuName ||
            menuName.split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

        setCurrentMenu(menuTitle);
    }, [location, menuName]);

    useEffect(() => {
        fetchData();
    }, [currentMenu]);
  useEffect(() => {
    if (sessionId) {
      stripePromise
        .then((stripe) => {
          stripe.redirectToCheckout({ sessionId });
        })
        .catch((error) => {
          console.error("Error redirecting to checkout:", error);
        });
    }
  }, [sessionId]);
    const fetchData = async () => {
        try {
            const response = await Authapi.dynamicpageget(currentMenu);
            if (response.status === true) {
                setTopbardata(response.page.post_store || []);
                setStatus(response.page);

                const dynamicTitles = response.page.post_store.flatMap(post =>
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

  
const handlePurchaseSubmit = async (productName, amount) => {
    const token = localStorage.getItem("WAauthToken");
    if (!token) {
        Swal.fire({
            icon: 'warning',
            title: 'Please Log In',
            text: 'You need to be logged in to make a purchase.',
            showConfirmButton: true,          
            showCancelButton: true,
            cancelButtonText: 'Cancel'
        });
        return;
    }

    try {
        let email = userEmail;
        if (!email) {
            email = await getUserEmail();
            if (!email) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Could not retrieve user email. Please try again.',
                });
                return;
            }
        }

        // Show loading state
        Swal.fire({
            title: 'Processing...',
            text: 'Please wait while we set up your payment.',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await fetch('http://walara.localhost.com/admin/api/create-checkout-session', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-XSRF-TOKEN": getCookie('XSRF-TOKEN')
            },
            credentials: 'include',
            body: JSON.stringify({
                product_name: productName,
                amount: parseFloat(amount),
                email: email,
                success_url: `${window.location.origin}/company?payment_status=success`,
                cancel_url: `${window.location.origin}/menu/our-products?payment_status=failed`
            })
        });

        const data = await response.json();
        
        if (!data.status) {
            throw new Error(data.message || data.error || 'Failed to create checkout session');
        }

        // Close loading dialog before redirect
        Swal.close();

        // Redirect to Stripe checkout
        window.location.href = data.url;

    } catch (error) {
        console.error("Purchase Error:", error);
        Swal.fire({
            icon: 'error',
            title: 'Payment Error',
            text: error.message || 'There was an error processing your payment. Please try again.',
            background: '#f8f9fa',
            showConfirmButton: true,
            confirmButtonText: 'OK'
        }).then(() => {
            // Redirect to products page on error
            window.location.href = `${window.location.origin}/menu/our-products?payment_status=failed`;
        });
    }
};

// Helper function to get CSRF cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Function to map product name to the corresponding price_id
const getPriceIdFromProductName = (productName) => {
    // Replace with your actual product-price mapping
    const priceMapping = {
        "product_1": "price_1JYvT4F29HgYWjxWLzXWvSov", // Example price_id for product_1
        "product_2": "price_1JYvT4F29HgYWjxWLzXWvSo", // Example price_id for product_2
        // Add more products as needed
    };

    return priceMapping[productName] || null;
};

const getUserEmail = async () => {
    try {
        const token = ls.get("WAauthToken");
        
        if (!token) {
            console.log("No auth token found");
            return;
        }

        const response = await Authapi.getUser({
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });

        // Log the full response to see its structure
        console.log("API Response:", response);

        // Try different possible response structures
        const email = response?.data?.user?.email || // If response has data.user.email
                     response?.user?.email ||        // If response has user.email directly
                     response?.email;                // If response has email directly

        console.log("Extracted Email:", email);
        
        if (email) {
            setUserEmail(email);
            return email;
        } else {
            console.log("Email not found in response structure");
            console.log("Response structure:", JSON.stringify(response, null, 2));
        }

    } catch (error) {
        console.error("Error in getUserEmail:", error);
    }
};

    return (
        <>
            {currentMenu === 'About Us' && status.page_status === 1 && topbardata.length > 0 ? (
                <section className="page-section" id="package_section">
                    <div className="container type-1">
                        <div className="row">
                            <div className="col-12">
                                <div className="sec-8-heading">
                                    <h1 className="text-center mb-4" id='About-us'>{currentMenu}</h1>
                                </div>
                            </div>
                        </div>

                        <div className="row" style={{ marginBottom: "6%" }}>
                            <div className="col-md-3">
                                <div className="content-box">
                                    {titles.map((title, index) => (
                                        <div key={index}>
                                            {typeof title === 'string' ? (
                                                <h5 className="title-sm">{title}</h5>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-md-9">
                                <div className="content-box">
                                    {Array.isArray(description) ? (
                                        description.map((descItem, index) => (
                                            typeof descItem === 'string' ? <p key={index}>{descItem}</p> : null
                                        ))
                                    ) : (
                                        <p>{description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ) : currentMenu === 'About Us' && status.page_status === 0 ? (
                <div className="text-center"> 404 Page Not Found</div>
            ) : null}

            {currentMenu === 'Our Products' && status.page_status === 1 && topbardata.length > 0 ? (
                <section className="packages-sec" id="package_section">
                    <div className="container mt-2 mb-5">
                        <div className="row">
                            <div className="col-12 waste-management-service-title ">
                                <h4>{status.page_description}</h4>
                            </div>
                        </div>
                        <div className="row mt-5">
                            {topbardata.map((card, index) => (
                                <div className={`col-lg-4`} id={`card${index + 1}`} key={card.id}>
                                    <div className={`card-liner-card-${index + 1}`} id='card-liner-card'></div>
                                    <div className={`card${index + 1} card`} style={{ position: 'relative', paddingBottom: '101px', height: '100%' }}>
                                        {typeof card.data.Title1 === 'string' && <span className='medaltype'>{card.data.Title1}</span>}
                                        <div className={`card${index + 1}-text`}>
                                            {[card.data.Cardtext1, card.data.Cardtext2, card.data.Cardtext3, card.data.Cardtext4, card.data.Cardtext5].map((text, i) => (
                                                typeof text === 'string' && (
                                                    <p style={cardTextStyle} key={i} className='cardtext'>
                                                        <img src={righticon} className={`card${index + 1}righticon`} alt={`Icon ${i + 1}`} style={cardTextImageStyle} />
                                                        {text}
                                                    </p>
                                                )
                                            ))}
                                            {card.data.Cardtext1 || card.data.Cardtext2 || card.data.Cardtext3 || card.data.Cardtext4 || card.data.Cardtext5 ? <div className="card-liner-inside"></div> : null}
                                        </div>
                                        <div className={`card${index + 1}-sec-2-text`}>
                                            {typeof card.data.Cardtextlight1 === 'string' && (
                                                <p style={cardTextStyle}>
                                                    <img src={plushicon} className={`card${index + 1}plushicon`} alt="Add On Icon" style={cardTextImageStyle} />
                                                    {card.data.Cardtextlight1}
                                                </p>
                                            )}
                                            {card.data.Cardtextlight1 ? <div className="card-liner-inside-2"></div> : null}
                                            <div className={`card-${index + 1}-sec-3`}>
                                                {typeof card.data.Montlyfeetext === 'string' && <p className={`card${index + 1}-sec-3-text1`}>{card.data.Montlyfeetext}</p>}
                                                {[card.data.Montlyfeecardtext1, card.data.Montlyfeecardtext2].map((text, i) => (
                                                    typeof text === 'string' && (
                                                        <p className={`card${index + 1}-sec-3-text`} key={i}>
                                                            <img src={plushicon} className={`card${index + 1}plushicon`} alt={`Icon ${i + 1}`} style={cardTextImageStyle} />
                                                            {text}
                                                        </p>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {/* Purchase button with absolute positioning */}
                                        {card.data.Buttontext && (
                                            <div className="text-center " style={{ position: 'absolute', bottom: '13px', left: '0', right: '0' }}>
                                                <button
                                                role="link" 
                                                    className="btn w-50"
                                                    style={{
                                                        backgroundColor: card.data.Buttonbackgroundcolor || '#40bedd',
                                                        color: card.data.Buttontextcolor || '#ffffff',
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.target.style.backgroundColor = card.data.Buttonhovercolor || '#17bee8';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.target.style.backgroundColor = card.data.Buttonbackgroundcolor || '#40bedd';
                                                    }}
                                                    onClick={() => handlePurchaseSubmit(card.data.Title1, card.data.Amount)}
                                                >
                                                    {`${card.data.Buttontext} - $${card.data.Amount}`}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {ls("data").about_us.page_status === 1 && (
                            <div className="row">
                                <div className="col-12 mt-5">
                                    <button type="button" onClick={() => navigate("/menu/contact-us")} className="btn sky-blue-btn">Contact Us</button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            ) : currentMenu === 'Our Products' && status.page_status === 0 ? (
                <div className="text-center"> 404 Page Not Found</div>
            ) : null}

            {
                currentMenu === 'Contact Us' && status.page_status === 1 && topbardata.length > 0 ? (
                    <section className="lets-talk-sec" id="package_section">
                        <div className="container" id="sec-10">
                            <div className="row">
                                <div className="col-12">
                                    <div className="sec-8-heading">
                                        <h1 className="text-center mb-4">{currentMenu}</h1>
                                    </div>
                                </div>
                            </div>
                            <div className='contactusswction'>
                                <form id="contactForm">
                                    <div className='row'>
                                        {topbardata.map((item, index) => (
                                            <div className='col-12' key={index}>
                                                <h4 className="letstallktitle">{item.data.Title}</h4>
                                                <div className="inputgroup">
                                                    {item.data.Description}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="row">
                                        {topbardata.map((item, index) => (
                                            <div className='col-md-6' key={index}>
                                                <div className="inputgroup">
                                                    <label>{item.data.Label}</label>
                                                    {item.data.Label === "Tell us what you need" ? (
                                                        <textarea
                                                            className='form-control'
                                                            name={`field${index}`}
                                                            rows="4"
                                                            onChange={(e) => handleInputChange(e, index)}
                                                        />
                                                    ) : item.data.type === "tel" ? (
                                                        <input
                                                            className='form-control'
                                                            name={`field${index}`}
                                                            type="tel"
                                                            onChange={(e) => handleInputChange(e, index)}
                                                            value={item.data?.Value}
                                                        />
                                                    ) : (
                                                        <input
                                                            className='form-control'
                                                            name={`field${index}`}
                                                            type="text"
                                                            onChange={(e) => handleInputChange(e, index)}
                                                            value={item.data?.Value}
                                                        />
                                                    )}
                                                    {errors[`label${index}`] && (
                                                        <span style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>
                                                            {errors[`label${index}`]}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-12">
                                            <button type="submit" onClick={handleSubmit} className="btn w-auto sky-blue-btn-sendmeasge">Send my message</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                ) : null
            }
        </>
    );
};

export default MenuPage;
