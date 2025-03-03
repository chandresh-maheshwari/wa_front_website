import { useLocation, useParams, Link,Outlet } from 'react-router-dom';
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

            console.log("API Response:", response);

            const email = response?.data?.user?.email ||
                response?.user?.email ||
                response?.email;

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
    const toggleLoginPopup = () => {  
        setShowLoginPopup(!showLoginPopup);
      };
    
    const handlePurchaseSubmit = async (productName, amount, stripid) => {
        const token = localStorage.getItem("WAauthToken");
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Please Log In',
                text: 'You need to be logged in to make a purchase.',
                showConfirmButton: true,
                showCancelButton: true,
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Show the login popup when "OK" is clicked
                    toggleLoginPopup();
                  }
            });
            return;
        }

        try {
            // Get user email first
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
            Swal.fire({
                title: 'Processing...',
                text: 'Please wait while we set up your payment.',
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Replace the fetch call with the Authapi function
            const response = await Authapi.createCheckoutSession(productName, amount, email);

            if (!response.status) {
                throw new Error(response.message || 'Failed to create checkout session');
            }

            window.location.href = response.url;

        } catch (error) {
            console.error("Purchase Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Payment Error',
                text: error.message || 'There was an error processing your payment. Please try again.',
                background: '#f8f9fa',
                showConfirmButton: true,
                confirmButtonText: 'OK'
            });
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
        }
        // try {
        //     const response = await Authapi.Alldynamicpageget(currentMenu);
        //     // console.log(response.results.contact_us.ordering)

        //     // console.log(response.results)
        //     if (response.status === true) {
        //         ls("data", response.results);

        //         // console.log(response.results)
        //         setStatus(response.results);
        //         setHomesection(response.results.home_section.post_store[0]['Data']);
        //         setTransforming(response.results.page_section.post_store[0]['Data']);
        //         // console.log(response.results.about_us.post_store);
        //         // const dynamicTitles = response.results.about_us.post_store.flatMap(
        //         //   (post) =>
        //         //     Object.keys(post)
        //         //       .filter((key) => key.startsWith("Title"))
        //         //       .map((key) => post[key])
        //         //     );
        //         // console.log(dynamicTitles);
        //         // setTitles(dynamicTitles);
        //         // const dynamicDescriptions =
        //         //   response.results.about_us.post_store.flatMap((post) =>
        //         //     Object.keys(post)
        //         //       .filter((key) => key.startsWith("Description"))
        //         //       .map((key) => post[key])
        //         //   );
        //         // setDescription(dynamicDescriptions);
        //         // console.log(response.results.about_us.post_store);

        //         // Extract Titles
        //         const dynamicTitles = response.results.about_us.post_store.flatMap(
        //             (post) =>
        //                 Object.keys(post.Data)  // Access 'Data' property directly
        //                     .filter((key) => key.startsWith("Title"))  // Filter by keys that start with 'Title'
        //                     .map((key) => post.Data[key])  // Get the corresponding value for each 'Title'
        //         );

        //         // console.log(dynamicTitles);
        //         setTitles(dynamicTitles);

        //         // Extract Descriptions
        //         const dynamicDescriptions = response.results.about_us.post_store.flatMap((post) =>
        //             Object.keys(post.Data)  // Access 'Data' property directly
        //                 .filter((key) => key.startsWith("Description"))  // Filter by keys that start with 'Description'
        //                 .map((key) => post.Data[key])  // Get the corresponding value for each 'Description'
        //         );

        //         setDescription(dynamicDescriptions);

        //     } else {
        //         console.error("Invalid response structure:", response);
        //     }
        // } 
        catch (error) {
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

    // const renderCards = () => {
    //     // console.log(4444444444444444444444444444444444444444444444444444444444444444444444);
    //     // console.log(statu.our_products?.post_store);
    //     return statu.post_store.map((card, index) => {
    //         // Destructure and extract relevant fields from the Data object
    //         // console.log(card.data.Information_section_1)
    //         const feesSection3 = card.data.Fees_section_3 || {};
    //         const infoSection1 = card.data.Information_section_1 || {};
    //         const serviceSection2 = card.data.Service_section_2 || {};
    //         const feessection3 = card.data.Fees_section_3 || {};
    //         const purchaseButtonSection = card.data.Purchase_button_section_4 || {};

    //         // Check if there's any content to display (excluding the Field_slug values)
    //         const hasContent =
    //             infoSection1.Information1 ||
    //             infoSection1.Information2 ||
    //             infoSection1.Information3 ||
    //             infoSection1.Information4 ||
    //             infoSection1.Information5 ||
    //             serviceSection2.Service1 ||
    //             serviceSection2.Service2 ||
    //             feesSection3.Monthlyfee ||
    //             feessection3.Montlyfeecardtext1 ||
    //             feessection3.Montlyfeecardtext1 ||
    //             purchaseButtonSection.Amount ||
    //             purchaseButtonSection.Buttonbackgroundcolor ||
    //             purchaseButtonSection.Buttoncolor ||
    //             purchaseButtonSection.Buttontext;

    //         if (!hasContent) return null;

    //         return (
    //             <div className={`col-lg-4`} id={`card${index + 1}`} key={card.Id}>
    //                 <div className={`card-liner-card-${index + 1}`} id="card-liner-card"></div>
    //                 <div className={`card${index + 1} card`}>
    //                     {/* {console.log(card['Data'].Modelsectionpackagesection)} */}
    //                     {/* <span className="medaltype">{card.Post_name}</span> */}
    //                     <span className="medaltype">{card['data'].Modelsectionpackagesection}</span>
    //                     <div className={`card${index + 1}-text`}>
    //                         {/* Render Information Section */}
    //                         {/* {console.log(infoSection1)} */}
    //                         {[infoSection1.Information1, infoSection1.Information2, infoSection1.Information3, infoSection1.Information4, infoSection1.Information5].map((text, i) => (
    //                             text && (
    //                                 <p style={cardTextStyle} key={i} className='cardtext'>
    //                                     <img src={righticon} className={`card${index + 1}righticon`} alt={`Icon ${i + 1}`} style={cardTextImageStyle} />
    //                                     {text}
    //                                 </p>
    //                             )
    //                         ))}
    //                         {/* {infoSection1.Information1 || infoSection1.Information2 || infoSection1.Information3 || infoSection1.Information4 || infoSection1.Information5 ? <div className="card-liner-inside"></div> : null} */}

    //                         {/* {infoSection1.Information1 && (
    //                 <p style={cardTextStyle} key="info1" className="cardtext">
    //                   <img
    //                     src={righticon}
    //                     className={`card${index + 1}righticon`}
    //                     alt="Icon 1"
    //                     style={cardTextImageStyle}
    //                   />
    //                   {infoSection1.Information1}
    //                 </p>
    //               )}
    //               {infoSection1.Information2 && (
    //                 <p style={cardTextStyle} key="info2" className="cardtext">
    //                   <img
    //                     src={righticon}
    //                     className={`card${index + 1}righticon`}
    //                     alt="Icon 2"
    //                     style={cardTextImageStyle}
    //                   />
    //                   {infoSection1.Information2}
    //                 </p>
    //               )}
    //               {infoSection1.Information3 && (
    //                 <p style={cardTextStyle} key="info3" className="cardtext">
    //                   <img
    //                     src={righticon}
    //                     className={`card${index + 1}righticon`}
    //                     alt="Icon 3"
    //                     style={cardTextImageStyle}
    //                   />
    //                   {infoSection1.Information3}
    //                 </p>
    //               )}
    //               {infoSection1.Information4 && (
    //                 <p style={cardTextStyle} key="info4" className="cardtext">
    //                   <img
    //                     src={righticon}
    //                     className={`card${index + 1}righticon`}
    //                     alt="Icon 4"
    //                     style={cardTextImageStyle}
    //                   />
    //                   {infoSection1.Information4}
    //                 </p>
    //               )}
    //               {infoSection1.Information5 && (
    //                 <p style={cardTextStyle} key="info5" className="cardtext">
    //                   <img
    //                     src={righticon}
    //                     className={`card${index + 1}righticon`}
    //                     alt="Icon 5"
    //                     style={cardTextImageStyle}
    //                   />
    //                   {infoSection1.Information5}
    //                 </p>
    //               )} */}
    //                         {Object.values(infoSection1).some((text) => text) && (
    //                             <div className="card-liner-inside"></div>
    //                         )}
    //                     </div>

    //                     <div className={`card${index + 1}-sec-2-text`}>
    //                         {/* Render Service Section */}
    //                         {serviceSection2.Service1 && (
    //                             <p style={cardTextStyle}>
    //                                 <img
    //                                     src={plushicon}
    //                                     className={`card${index + 1}plushicon`}
    //                                     alt="Add On Icon"
    //                                     style={cardTextImageStyle}
    //                                 />
    //                                 {serviceSection2.Service1}
    //                             </p>
    //                         )}
    //                         {serviceSection2.Service1 && <div className="card-liner-inside-2"></div>}

    //                         <div className={`card-${index + 1}-sec-3`}>
    //                             {/* Render Monthly Fee */}
    //                             {feesSection3.Monthlyfee && (
    //                                 <p className={`card${index + 1}-sec-3-text1`}>
    //                                     {feesSection3.Monthlyfee}
    //                                 </p>
    //                             )}
    //                             {[feessection3.Montlyfeecardtext1, feessection3.Montlyfeecardtext2].map((text, i) => (
    //                                 text && (
    //                                     <p style={cardTextStyle} key={i} className='cardtext'>
    //                                         <img
    //                                             src={plushicon}
    //                                             className={`card${index + 1}plushicon`}
    //                                             alt="Add On Icon"
    //                                             style={cardTextImageStyle}
    //                                         />
    //                                         {text}
    //                                     </p>
    //                                 )
    //                             ))}

    //                             {/* Render Service 2 */}
    //                             {serviceSection2.Service2 && (
    //                                 <p className={`card${index + 1}-sec-3-text`}>
    //                                     <img
    //                                         src={plushicon}
    //                                         className={`card${index + 1}plushicon`}
    //                                         alt="Add On Icon"
    //                                         style={cardTextImageStyle}
    //                                     />
    //                                     {serviceSection2.Service2}
    //                                 </p>
    //                             )}
    //                         </div>

    //                     </div>
    //                     {/* style={{ position: 'absolute', bottom: '13px', left: '0', right: '0' }} */}
    //                     {purchaseButtonSection.Buttontext && (
    //                         <div className="text-center purchase-btn">
    //                             {/* <button
    //                                 role="link"
    //                                 className="btn w-50"
    //                                 style={{
    //                                     backgroundColor: purchaseButtonSection.Buttonbackgroundcolor || '#40bedd',
    //                                     color: purchaseButtonSection.Buttoncolor || '#ffffff',
    //                                 }}
    //                             // onMouseOver={(e) => {
    //                             //   e.target.style.backgroundColor = card.data.Buttonhovercolor || '#17bee8';
    //                             // }}
    //                             // onMouseOut={(e) => {
    //                             //   e.target.style.backgroundColor = card.data.Buttonbackgroundcolor || '#40bedd';
    //                             // }}

    //                             > */}
    //                             <button
    //                                 role="link"
    //                                 className="btn w-50"
    //                                 style={{
    //                                     backgroundColor: purchaseButtonSection.Buttonbackgroundcolor || '#40bedd',
    //                                     color: purchaseButtonSection.Buttoncolor || '#ffffff',
    //                                 }}
    //                                 // onMouseOver={(e) => {
    //                                 //   e.target.style.backgroundColor = card.Buttonhovercolor || '#17bee8';
    //                                 // }}
    //                                 // onMouseOut={(e) => {
    //                                 //   e.target.style.backgroundColor = card.Buttonbackgroundcolor || '#40bedd';
    //                                 // }}

    //                                 onClick={() => handlePurchaseSubmit(card['data'].Modelsectionpackagesection, purchaseButtonSection.Amount, purchaseButtonSection.Stripid)}
    //                             >
    //                                 {`${purchaseButtonSection.Buttontext} - ${purchaseButtonSection.Amount}`}
    //                             </button>
    //                         </div>
    //                     )}
    //                 </div>
    //             </div>
    //         );
    //     });
    // };


    const renderCards = () => {
        // console.log(statu.our_products?.post_store);
        return statu.post_store.map((card, index) => {
          // Destructure and extract relevant fields from the Data object
          const feesSection = card.data.Fees_section || {};
          const infoSection1 = card.data.Package_info || {};
          const serviceSection = card.data.Package_services || {};
          const feessection = card.data.Fees_section || {};
          const purchaseButtonSection = card.data.Purchase_button || {};
    
          // Check if there's any content to display (excluding the Field_slug values)
          const hasContent =
            infoSection1.Information1 ||
            infoSection1.Information2 ||
            infoSection1.Information3 ||
            infoSection1.Information4 ||
            infoSection1.Information5 ||
            serviceSection.Service1 ||
            serviceSection.Service2 ||
            feesSection.Monthlyfee ||
            feessection.Montlyfeecardtext1 ||
            feessection.Montlyfeecardtext1 ||
            purchaseButtonSection.Amount ||
            purchaseButtonSection.Buttonbackgroundcolor ||
            purchaseButtonSection.Buttoncolor ||
            purchaseButtonSection.Buttontext;
    
          if (!hasContent) return null;
    
          return (
            <div className={`col-lg-4`} id={`card${index + 1}`} key={card.Id}>
              <div className={`card-liner-card-${index + 1}`} id="card-liner-card"></div>
              <div className={`card${index + 1} card`}>
                <span className="medaltype">{card['data'].Packagename}</span>
                <div className={`card${index + 1}-text`}>
                  {/* Render Information Section */}
                  {[infoSection1.Information1, infoSection1.Information2, infoSection1.Information3, infoSection1.Information4, infoSection1.Information5].map((text, i) => (
                    text && (
                      <p style={cardTextStyle} key={i} className='cardtext'>
                        <img src={righticon} className={`card${index + 1}righticon`} alt={`Icon ${i + 1}`} style={cardTextImageStyle} />
                        {text}
                      </p>
                    )
                  ))}
                  {Object.values(infoSection1).some((text) => text) && (
                    <div className="card-liner-inside"></div>
                  )}
                </div>
    
                <div className={`card${index + 1}-sec-2-text`}>
                  {/* Render Service Section */}
                  {serviceSection.Service1 && (
                    <p style={cardTextStyle}>
                      <img
                        src={plushicon}
                        className={`card${index + 1}plushicon`}
                        alt="Add On Icon"
                        style={cardTextImageStyle}
                      />
                      {serviceSection.Service1}
                    </p>
                  )}
                  {serviceSection.Service1 && <div className="card-liner-inside-2"></div>}
    
                  <div className={`card-${index + 1}-sec-3`}>
                    {/* Render Monthly Fee */}
                    {feesSection.Monthlyfee && (
                      <p className={`card${index + 1}-sec-3-text1`}>
                        {feesSection.Monthlyfee}
                      </p>
                    )}
                    {[feessection.Montlyfeecardtext1, feessection.Montlyfeecardtext2].map((text, i) => (
                      text && (
                        <p style={cardTextStyle} key={i} className='cardtext'>
                          <img
                            src={plushicon}
                            className={`card${index + 1}plushicon`}
                            alt="Add On Icon"
                            style={cardTextImageStyle}
                          />
                          {text}
                        </p>
                      )
                    ))}
    
                    {/* Render Service 2 */}
                    {serviceSection.Service2 && (
                      <p className={`card${index + 1}-sec-3-text`}>
                        <img
                          src={plushicon}
                          className={`card${index + 1}plushicon`}
                          alt="Add On Icon"
                          style={cardTextImageStyle}
                        />
                        {serviceSection.Service2}
                      </p>
                    )}
                  </div>
    
                </div>
                {purchaseButtonSection.Buttontext && (
                  <div className="text-center purchase-btn">
                    <button
                      role="link"
                      className="btn w-50"
                      style={{
                        backgroundColor: purchaseButtonSection.Buttonbackgroundcolor || '#40bedd',
                        color: purchaseButtonSection.Buttoncolor || '#ffffff',
                      }}    
                      onClick={() => handlePurchaseSubmit(card['data'].Packagename, purchaseButtonSection.Amount, purchaseButtonSection.Stripid)}
                    >
                      {`${purchaseButtonSection.Buttontext} - $${purchaseButtonSection.Amount}`}
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

                        <div className="row" style={{ marginBottom: "6%" }}>
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
            {/* {console.log(currentMenu === 'Our Products')} */}

            {currentMenu === 'Our Products' && statu.page_status === 1 && topbardata.length > 0 ? (
                <section className="packages-sec" id="package_section">
                    {/* {console.log(333)} */}
                    <div className="container mt-2">
                        <div className="waste-management-service-title">
                            {/* <h4>{statu.our_products?.page_description}</h4> */}
                            <h4>{statu.page_description}</h4>

                        </div>
                        <div className="row">{renderCards()}</div>
                        {statu.page_status === 1 && (
                            <div className="row mt-5">
                                <div className="col-12">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/menu/contact-us")}
                                        className="btn sky-blue-btn mb-5"
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
            {/* {console.log(topbardata.length > 0)} */}

            {currentMenu === 'Contact Us' && statu.page_status === 1 && topbardata.length > 0 ? (
                <section className="lets-talk-sec" id="package_section">
                    <div className="container" id="sec-10">
                        <div className="contactusswction">
                            <form id="contactForm">
                                <div className="row ">
                                    <div className="col-12">
                                        <h4 className="letstallktitle">
                                            {/* {console.log(statu.post_store[0]['data'].Title)} */}
                                            {/* {statu.contact_us?.post_store[0]?.Title} */}
                                            {statu.post_store[0]['data'].Title}
                                        </h4>
                                        <div className="inputgroup">
                                            {statu.post_store[0]['data']?.Description}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    {/* {console.log(statu.post_store)} */}
                                    {statu?.post_store.map((item, index) => (
                                        <div className="col-md-6" key={index}>
                                            <div className="inputgroup">
                                                <label>{item['data'].Label}</label>
                                                {/* {item.Label === "Tell us what you need" ? ( */}
                                                {item['data'].Label === "Tell us what you need" ? (
                                                    <textarea
                                                        className='form-control'
                                                        name={`field${index}`}
                                                        rows="4"
                                                        onChange={(e) => handleInputChange(e, index)}
                                                    />
                                                ) : item.type === "tel" ? (
                                                    <input0
                                                        className='form-control'
                                                        name={`field${index}`}
                                                        type="tel"
                                                        onChange={(e) => handleInputChange(e, index)}
                                                    />
                                                ) : (
                                                    <input
                                                        className='form-control'
                                                        name={`field${index}`}
                                                        type={item.Type}
                                                        onChange={(e) => handleInputChange(e, index)}
                                                    />
                                                )}
                                                {errors[`label${index}`] && <span style={{ color: 'red' }}>{errors[`label${index}`]}</span>}
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
                                        Send my message
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
                    {statu.page_description}</h2>
                        <div className="clients-grid">
                            {statu.post_store.map((item, index) => (
                                <div key={item.Id} className="client-logo">
                                    {/* {console.log(item.data)} */}
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

            {/* {currentMenu === 'Page Section' && statu.page_status === 1 && topbardata.length > 0 ? (

                <section className="page-section" id="transforming_section">
                    <div className="container p-5 transforming_section_container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="transfo">

                                    <h5 className="text-center transforming ">
                                        {statu.page_description}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row p-5">
                            <div className="col-md-5">
                                <h5 className="transfotext1 for-waste">
                                    {console.log(Transforming)}

                                    {Transforming.Pagesectiontitle1} <br />
                                    <b>{Transforming.Pagesectiontitle2}</b>
                                </h5>

                                <p className="transfotextdes1">
                                    {Transforming.Pagesectiondescription}
                                </p>
                            </div>
                            <div className="col-md-2 stretch-line">

                                <img
                                    src={statu.image}
                                    // src={homeimg}
                                    width="60px"
                                    className="strech"
                                    alt="strech"
                                />
                            </div>
                            <div className="col-md-5">
                                <h5 className="transfotext2 for-waste">

                                    {Transforming.Pagesectiontitle1} <br />
                                    <b>{Transforming.Pagesectiontitle2}</b>
                                </h5>

                                <p className="transfotextdes2">
                                    {Transforming.Pagesectiondescription}
                                </p>
                                <br />
                            </div>
                        </div>
                    </div>
                </section>
            ) : null
            } */}
 {showLoginPopup && (
                  <Popup isOpen={showLoginPopup} onClose={toggleLoginPopup} onLoginSuccess={handleLoginSuccess} />
              )}
              <Outlet />

        </>
    );
};


const Popup = ({ isOpen, onClose, onLoginSuccess }) => {
    if (!isOpen) return null;
  console.log("Popup is call")
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
  
export default MenuPage;
