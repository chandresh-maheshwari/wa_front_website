import homeimg from "../Images/Rectangle 4.png";
// import quoteimage1 from '../Images/Vector (1).png';
// import sliderilmg1 from '../Images/Rectangle 36.png';
// import sliderilmg3 from '../Images/Rectangle 22.png';
// import sliderilmg2 from '../Images/Rectangle 9.png';
// import About from './Aboutus/Aboutus';
import Contact from "./Contactus/Contact us";
// import buldingimag from '../Images/bulding.png';
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
// import OurProducts from './Our Products/OurProducts';
import { useNavigate, Link } from "react-router-dom";
import Authapi from "../Authapi";
import plushicon from "./Ourproductimages/plush.png";
import righticon from "./Ourproductimages/righticon.png";
import Swal from "sweetalert2";
import ls from "local-storage";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51P4GXaAvL6Jnl0r3yHDSV2zN0JrGRt2UFxn217kqw9JFFBXe4K1n5xZHGfsKaIicVfUBAP5ch0TBIO8C8cI3ijQv00bNWJynzK');

const Home = () => {
  const cardTextStyle = {
    display: "flex",
    alignItems: "center",
    margin: "0",
    fontSize: "medium",
  };

  const cardTextImageStyle = {
    marginRight: "10px",
  };
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const [sliderRef, setSliderRef] = useState(null);
  const [homesection, setHomesection] = useState({});
  const [Transforming, setTransforming] = useState({});
  const [titles, setTitles] = useState([]);
  const [description, setDescription] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [statu, setStatus] = useState({});
  const [userEmail, setUserEmail] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

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
  }, []);
  // console.log(statu)
  const fetchData = async () => {
    try {
      const response = await Authapi.Alldynamicpageget();
      // console.log(response.results.contact_us.ordering)

      // console.log(response.results)
      if (response.status === true) {
        ls("data", response.results);

        // console.log(response.results.transforming_waste_industry.post_store[0]['Data'].Pagesectiontitle1)
        setStatus(response.results);
        setHomesection(response.results.home_section.post_store[0]['Data']);
        setTransforming(response.results.transforming_waste_industry.post_store);
        // console.log(Transforming);
        // const dynamicTitles = response.results.about_us.post_store.flatMap(
        //   (post) =>
        //     Object.keys(post)
        //       .filter((key) => key.startsWith("Title"))
        //       .map((key) => post[key])
        //     );
        // console.log(dynamicTitles);
        // setTitles(dynamicTitles);
        // const dynamicDescriptions =
        //   response.results.about_us.post_store.flatMap((post) =>
        //     Object.keys(post)
        //       .filter((key) => key.startsWith("Description"))
        //       .map((key) => post[key])
        //   );
        // setDescription(dynamicDescriptions);
        // console.log(response.results.about_us.post_store);

        // Extract Titles
        const dynamicTitles = response.results.about_us.post_store.flatMap(
          (post) =>
            Object.keys(post.Data)  // Access 'Data' property directly
              .filter((key) => key.startsWith("Title"))  // Filter by keys that start with 'Title'
              .map((key) => post.Data[key])  // Get the corresponding value for each 'Title'
        );

        // console.log(dynamicTitles);
        setTitles(dynamicTitles);

        // Extract Descriptions
        const dynamicDescriptions = response.results.about_us.post_store.flatMap((post) =>
          Object.keys(post.Data)  // Access 'Data' property directly
            .filter((key) => key.startsWith("Description"))  // Filter by keys that start with 'Description'
            .map((key) => post.Data[key])  // Get the corresponding value for each 'Description'
        );

        setDescription(dynamicDescriptions);

      } else {
        console.error("Invalid response structure:", response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const fetchData = async () => {
  //     try {
  //         const response = await Authapi.Alldynamicpageget();

  //         // Sort the results based on the ordering number
  //         const sortedResults = response.results.sort((a, b) => a.orderingNumber - b.orderingNumber);
  //         console.log(sortedResults); // Log the sorted results

  //         if (response.status === true) {
  //             ls("data", sortedResults);
  //             setStatus(sortedResults);
  //             setHomesection(sortedResults.home_section.post_store[0]);
  //             setTransforming(sortedResults.transforming_waste_industry.post_store);

  //             const dynamicTitles = sortedResults.about_us.post_store.flatMap(post =>
  //                 Object.keys(post)
  //                     .filter(key => key.startsWith('Title'))
  //                     .map(key => post[key])
  //             );
  //             setTitles(dynamicTitles);
  //             const dynamicDescriptions = sortedResults.about_us.post_store.flatMap(post =>
  //                 Object.keys(post)
  //                     .filter(key => key.startsWith('Description'))
  //                     .map(key => post[key])
  //             );
  //             setDescription(dynamicDescriptions);
  //         } else {
  //             console.error('Invalid response structure:', response);
  //         }
  //     } catch (error) {
  //         console.log(error);
  //     }
  // };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleContainerClick = (event) => {
    if (event.target === event.currentTarget) {
      sliderRef.current.slickPause();
    }
  };

  const settings = {
    //   dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  const handleInputChange = (event, index) => {
    const { value, name } = event.target;
    const newErrors = { ...errors };
    // console.log(event.target.type === "tel");
    if (event.target.type === "tel" && name.includes("field")) {
      let cleanedValue = value.replace(/\D/g, "");
      if (cleanedValue.length > 10) {
        cleanedValue = cleanedValue.slice(0, 10);
      }

      event.target.value = cleanedValue;
      if (cleanedValue.length === 10) {
        newErrors[`label${index}`] = "";
      } else {
        newErrors[`label${index}`] = "";
      }
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

    statu.contact_us?.post_store.forEach((item, index) => {
      const value = document.querySelector(`[name="field${index}"]`).value;
      formData[`field${index}`] = value;
      if (item.Type === "tel") {
        const cleanedValue = value.replace(/\D/g, "");
        if (!value) {
          // newErrors[`label${index}`] = "Phone number must be 10 digits";
          newErrors[`label${index}`] = "This field is required";
        } else if (cleanedValue.length !== 10) {
          // newErrors[`label${index}`] = "";
          newErrors[`label${index}`] = "Phone number must be 10 digits";
        } else {
          newErrors[`label${index}`] = "";
        }
      } else if (item.Type === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors[`label${index}`] = "This field is required";
        } else if (!emailPattern.test(value)) {
          newErrors[`label${index}`] = "Please enter a valid email address";
        } else {
          newErrors[`label${index}`] = "";
        }
      } else if (!value) {
        newErrors[`label${index}`] = "This field is required";
      } else {
        newErrors[`label${index}`] = "";
      }
    });

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
    } else {
      Swal.fire({
        title: "Submitting...",
        html: "Please wait while we process your request.",
        allowOutsideClick: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        const response = await Authapi.contactdatapost(formData);
        if (response && response.status === true) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Form submitted successfully!",
            background: "#f8f9fa",
            showConfirmButton: true,
            confirmButtonText: "OK",
          }).then(() => {
            const form = document.getElementById("contactForm");
            if (form) {
              form.reset();
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to submit form. Please try again!",
            background: "#f8f9fa",
            showConfirmButton: true,
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while submitting the form.",
          background: "#f8f9fa",
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
      }
    }
  };

  // const renderCards = () => {
  //   // console.log(statu.our_products?.post_store)
  //   return statu.our_products?.post_store.map((card, index) => {
  //     const hasContent =
  //       card.Title1 ||
  //       card.Cardtext1 ||
  //       card.Cardtext2 ||
  //       card.Cardtext3 ||
  //       card.Cardtext4 ||
  //       card.Cardtext5 ||
  //       card.Cardtextlight1 ||
  //       card.Montlyfeetext ||
  //       card.Montlyfeecardtext1 ||
  //       card.Montlyfeecardtext2;
  //     if (!hasContent) return null;

  //     return (
  //       <div className={`col-lg-4`} id={`card${index + 1}`} key={card.id}>
  //         <div
  //           className={`card-liner-card-${index + 1}`}
  //           id="card-liner-card"
  //         ></div>
  //         <div className={`card${index + 1} card `}>
  //           {card.Title1 && <span className="medaltype">{card.Title1}</span>}
  //           <div className={`card${index + 1}-text`}>
  //             {[
  //               card.Cardtext1,
  //               card.Cardtext2,
  //               card.Cardtext3,
  //               card.Cardtext4,
  //               card.Cardtext5,
  //             ].map(
  //               (text, i) =>
  //                 text && (
  //                   <p style={cardTextStyle} key={i} className="cardtext">
  //                     <img
  //                       src={righticon}
  //                       className={`card${index + 1}righticon`}
  //                       alt={`Icon ${i + 1}`}
  //                       style={cardTextImageStyle}
  //                     />
  //                     {text}
  //                   </p>
  //                 )
  //             )}
  //             {card.Cardtext1 ||
  //               card.Cardtext2 ||
  //               card.Cardtext3 ||
  //               card.Cardtext4 ||
  //               card.Cardtext5 ? (
  //               <div className="card-liner-inside"></div>
  //             ) : null}
  //           </div>
  //           <div className={`card${index + 1}-sec-2-text`}>
  //             {card.Cardtextlight1 && (
  //               <p style={cardTextStyle}>
  //                 <img
  //                   src={plushicon}
  //                   className={`card${index + 1}plushicon`}
  //                   alt="Add On Icon"
  //                   style={cardTextImageStyle}
  //                 />
  //                 {card.Cardtextlight1}
  //               </p>
  //             )}
  //             {card.Cardtextlight1 ? (
  //               <div className="card-liner-inside-2"></div>
  //             ) : null}
  //             <div className={`card-${index + 1}-sec-3`}>
  //               {card.Montlyfeetext && (
  //                 <p className={`card${index + 1}-sec-3-text1`}>
  //                   {card.Montlyfeetext}
  //                 </p>
  //               )}
  //               {[card.Montlyfeecardtext1, card.Montlyfeecardtext2].map(
  //                 (text, i) =>
  //                   text && (
  //                     <p className={`card${index + 1}-sec-3-text`} key={i}>
  //                       <img
  //                         src={plushicon}
  //                         className={`card${index + 1}plushicon`}
  //                         alt={`Icon ${i + 1}`}
  //                         style={cardTextImageStyle}
  //                       />
  //                       {text}
  //                     </p>
  //                   )
  //               )}
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   });
  // };

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

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



  
  const handlePurchaseSubmit = async (productName, amount, price_id) => {
    // console.log(productName);
    // console.log(amount);
    // console.log(price_id);
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
        // Handle login redirect if needed
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
      const response = await Authapi.createCheckoutSession(productName, amount, email, price_id);

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

  const renderCards = () => {
    // console.log(statu.our_products?.post_store);
    return statu.our_products?.post_store.map((card, index) => {
      // Destructure and extract relevant fields from the Data object
      const feesSection = card.Data.Fees_section || {};
      const infoSection1 = card.Data.Package_info || {};
      const serviceSection = card.Data.Package_services || {};
      const feessection = card.Data.Fees_section || {};
      const purchaseButtonSection = card.Data.Purchase_button || {};

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
            {/* {console.log(card['Data'].Modelsectionpackagesection)} */}
            {/* <span className="medaltype">{card.Post_name}</span> */}
            <span className="medaltype">{card['Data'].Packagename}</span>
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
              {/* {infoSection1.Information1 || infoSection1.Information2 || infoSection1.Information3 || infoSection1.Information4 || infoSection1.Information5 ? <div className="card-liner-inside"></div> : null} */}

              {/* {infoSection1.Information1 && (
                <p style={cardTextStyle} key="info1" className="cardtext">
                  <img
                    src={righticon}
                    className={`card${index + 1}righticon`}
                    alt="Icon 1"
                    style={cardTextImageStyle}
                  />
                  {infoSection1.Information1}
                </p>
              )}
              {infoSection1.Information2 && (
                <p style={cardTextStyle} key="info2" className="cardtext">
                  <img
                    src={righticon}
                    className={`card${index + 1}righticon`}
                    alt="Icon 2"
                    style={cardTextImageStyle}
                  />
                  {infoSection1.Information2}
                </p>
              )}
              {infoSection1.Information3 && (
                <p style={cardTextStyle} key="info3" className="cardtext">
                  <img
                    src={righticon}
                    className={`card${index + 1}righticon`}
                    alt="Icon 3"
                    style={cardTextImageStyle}
                  />
                  {infoSection1.Information3}
                </p>
              )}
              {infoSection1.Information4 && (
                <p style={cardTextStyle} key="info4" className="cardtext">
                  <img
                    src={righticon}
                    className={`card${index + 1}righticon`}
                    alt="Icon 4"
                    style={cardTextImageStyle}
                  />
                  {infoSection1.Information4}
                </p>
              )}
              {infoSection1.Information5 && (
                <p style={cardTextStyle} key="info5" className="cardtext">
                  <img
                    src={righticon}
                    className={`card${index + 1}righticon`}
                    alt="Icon 5"
                    style={cardTextImageStyle}
                  />
                  {infoSection1.Information5}
                </p>
              )} */}
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
            {/* style={{ position: 'absolute', bottom: '13px', left: '0', right: '0' }} */}
            {purchaseButtonSection.Buttontext && (
              <div className="text-center purchase-btn">
                {/* <button
                  role="link"
                  className="btn w-50"
                  style={{
                    backgroundColor: purchaseButtonSection.Buttonbackgroundcolor || '#40bedd',
                    color: purchaseButtonSection.Buttoncolor || '#ffffff',
                  }}
                // onMouseOver={(e) => {
                //   e.target.style.backgroundColor = card.data.Buttonhovercolor || '#17bee8';
                // }}
                // onMouseOut={(e) => {
                //   e.target.style.backgroundColor = card.data.Buttonbackgroundcolor || '#40bedd';
                // }}

                >
                  {`${purchaseButtonSection.Buttontext} - ${purchaseButtonSection.Amount}`}
                </button> */}
                {/* {console.log(purchaseButtonSection.Stripid)} */}
                <button
                  role="link"
                  className="btn w-50"
                  style={{
                    backgroundColor: purchaseButtonSection.Buttonbackgroundcolor || '#40bedd',
                    color: purchaseButtonSection.Buttoncolor || '#ffffff',
                  }}
                  // onMouseOver={(e) => {
                  //   e.target.style.backgroundColor = card.Buttonhovercolor || '#17bee8';
                  // }}
                  // onMouseOut={(e) => {
                  //   e.target.style.backgroundColor = card.Buttonbackgroundcolor || '#40bedd';
                  // }}

                  onClick={() => handlePurchaseSubmit(card['Data'].Packagename, purchaseButtonSection.Amount, purchaseButtonSection.Stripid)}
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


  const renderSections = () => {
    const sections = [
      {
        condition: statu.home_section?.status === 1,
        ordering: statu.home_section?.ordering || 0,
        content: (
          <section className="homesection">
            <div className="container">
              <div className="home">
                <div className="row">
                  <div className="col-sm-2">
                    {/* {console.log(homesection.Tell_me_more_button_section?.Homesectionbuttontitle)} */}
                    <img
                      src={homesection?.Homesectionimage}
                      alt="homeimg"
                      className="homeimg"
                    />
                  </div>
                  <div className="col-sm-10">
                    <div className="homefont">
                      {/* {console.log(homesection)} */}
                      <h4>{homesection?.Homesectiontitle}</h4>
                    </div>
                    <p
                      className="home-p-font"
                      style={{
                        Color: "rgb(173, 173, 173)",
                        maxWidth: "46%",
                        marginBottom: "27px",
                      }}
                    >
                      {homesection?.Homesectiondescription}
                    </p>
                    <button type="button" className="btn" id="tellmemore"
                      style={{
                        backgroundColor: homesection.Tell_me_more_button_section?.Homesectionbuttonbackgroundcolor || '',
                        color: homesection.Tell_me_more_button_section?.Homesectionbuttontextcolor || '',
                      }}>
                      {homesection.Tell_me_more_button_section?.Homesectionbuttontitle}
                    </button>
                    {/* {console.log(homesection.HomeSectionTitle)} */}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ),
      },
      {
        condition: statu.transforming_waste_industry?.status === 1,
        ordering: statu.transforming_waste_industry?.ordering || 0,
        content: (
          <section className="page-section" id="transforming_section">
            <div className="container p-5 transforming_section_container">
              <div className="row">
                <div className="col-md-12">
                  <div className="transfo">

                    <h5 className="text-center transforming ">
                      {statu.transforming_waste_industry?.page_description}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row p-5 justify-content-center">
                {Transforming[0]?.Data && !Transforming[1]?.Data && (
                  <div className="col-md-8 text-center">
                    <h5 className="for-waste centered-text">
                      {Transforming[0]?.Data?.Pagesectiontitle1} <br />
                      <b>{Transforming[0]?.Data?.Pagesectiontitle2}</b>
                    </h5>
                    <p className="transfotextdes1 centered-text">
                      {Transforming[0]?.Data?.Pagesectiondescription}
                    </p>
                  </div>
                )}
                {Transforming[1]?.Data && !Transforming[0]?.Data && (
                  <div className="col-md-8 text-center">
                    <h5 className="for-waste">
                      {Transforming[1]?.Data?.Pagesectiontitle1} <br />
                      <b>{Transforming[1]?.Data?.Pagesectiontitle2}</b>
                    </h5>
                    <p className="transfotextdes2 centered-text">
                      {Transforming[1]?.Data?.Pagesectiondescription}
                    </p>
                  </div>
                )}
                {Transforming[0]?.Data && Transforming[1]?.Data && (
                  <>
                    <div className="col-md-5">
                      <h5 className="transfotext1 for-waste">
                        {Transforming[0]?.Data?.Pagesectiontitle1} <br />
                        <b>{Transforming[0]?.Data?.Pagesectiontitle2}</b>
                      </h5>
                      <p className="transfotextdes1">
                        {Transforming[0]?.Data?.Pagesectiondescription}
                      </p>
                    </div>
                    <div className="col-md-2 stretch-line">
                      <img
                        src={statu.transforming_waste_industry?.image}
                        width="60px"
                        className="strech"
                        alt="strech"
                      />
                    </div>
                    <div className="col-md-5">
                      <h5 className="transfotext2 for-waste">
                        {Transforming[1]?.Data?.Pagesectiontitle1} <br />
                        <b>{Transforming[1]?.Data?.Pagesectiontitle2}</b>
                      </h5>
                      <p className="transfotextdes2">
                        {Transforming[1]?.Data?.Pagesectiondescription}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        ),
      },
      {
        condition: statu.quote_section_1?.status === 1,
        ordering: statu.quote_section_1?.ordering || 0,
        content: (
          <section className="qute-sec" id="testimonial_section">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <div className="sec-3-text">
                    {/* {console.log(statu.qute_section_1?.post_store[0]['Data'].Qutesectionimage)} */}
                    <img
                      // src={
                      //   statu.qute_section_1?.post_store[0]?.Qutesectionimage
                      // }
                      src={
                        statu.quote_section_1?.post_store[0]['Data'].Quotesectionimage
                      }
                      className="quoteimage1"
                      alt="quoteimage1"
                    />
                  </div>
                  <div className="sec-3-text2">
                    <p className="text-light">
                      {statu.quote_section_1?.post_store[0]['Data']?.Quotesectiontitle}{" "}
                      <br />
                      <span
                        className="text-secondary"
                        style={{ fontSize: "medium" }}
                      >
                        {
                          statu.quote_section_1?.post_store[0]['Data']
                            ?.Quotesectiondescription
                        }
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ),
      },
      {
        condition: statu.quote_section_2?.status === 1,
        ordering: statu.quote_section_2?.ordering || 0,
        content: (
          <section className="qute-sec" id="testimonial_section">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <div className="sec-3-text">
                    <img
                      src={
                        statu.quote_section_2?.post_store[0]['Data']?.Quotesectionimage
                      }
                      className="quoteimage1"
                      alt="quoteimage1"
                    />
                  </div>
                  <div className="sec-3-text2">
                    <p className="text-light">
                      {statu.quote_section_2?.post_store[0]['Data']?.Quotesectiontitle}{" "}
                      <br />
                      <span
                        className="text-secondary"
                        style={{ fontSize: "medium" }}
                      >
                        {
                          statu.quote_section_2?.post_store[0]['Data']
                            ?.Quotesectiondescription
                        }
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ),
      },
      {
        condition: statu.our_products?.status === 1,
        ordering: statu.our_products?.ordering || 0,
        content: (
          <section className="packages-sec" id="package_section">
            <div className="container mt-2">
              <div className="waste-management-service-title">
                <h4>{statu.our_products?.page_description}</h4>
              </div>
              <div className="row">{renderCards()}</div>
              {statu.contact_us?.page_status === 1 && (
                <div className="row mt-5">
                  <div className="col-12">
                    <button
                      type="button"
                      onClick={() => navigate("/menu/contact-us")}
                      className="btn sky-blue-btn"
                    >
                      Contact Us
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        ),
      },
      {
        condition: statu.why_choose_wa?.status === 1,
        ordering: statu.why_choose_wa?.ordering || 0,
        content: (
          <section className="why_choose_section">
            <div className="container p-5">
              <div className="row">
                <div className="col-md-12">
                  <div className="transfo">
                    <h5 className="text-center">
                      {statu.why_choose_wa?.page_description}
                    </h5>
                  </div>
                </div>
              </div>
            </div>

            <div className="container type-2">
              <div className="row justify-content-center">
                {statu.why_choose_wa?.post_store.map((item, index) => {
                  const postCount = statu.why_choose_wa?.post_store.length;
                  const isSinglePost = postCount === 1;
                  const isTwoPosts = postCount === 2;
                  const isThreePosts = postCount === 3;

                  return (
                    <div
                      className={`col ${isSinglePost ? "col-12" : "col-md-6 col-sm-6 col-xs-3"} 
                                  ${isSinglePost ? "center-text no-border" : ""} 
                                  ${isTwoPosts ? "no-bottom-border" : ""} 
                                  ${isThreePosts ? "no-top-right-border" : ""} 
                                  ${isThreePosts && index === 2 ? "mx-auto" : ""} 
                                  ${index % 2 === 0 ? "text-end" : "text-start"}`}
                      key={item.id}
                    >
                      <h5 className={`for-waste ${isTwoPosts ? "margin-top-5" : ""} ${isSinglePost ? "center-text" : ""}`}>
                        {item['Data'].Title}
                      </h5>
                      <p style={{ marginTop: "25px" }} className={isSinglePost ? "center-text" : ""}>
                        {item['Data'].Description.split("\r\n").map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ),
      },
      {
        condition: statu.who_use_wa?.status === 1,
        ordering: statu.who_use_wa?.ordering || 0,
        content: (
          <section className="why-section" id="logo_section">
            <div className="container" onClick={handlePlayPause}>
              <div className="sliderconatainer">
                <h2 className="font-weight-light slider-heading text-center">
                  {statu.who_use_wa?.page_description}
                  {/* {console.log(statu.why_section?.post_store[0]['Data'])} */}
                  {/* {console.log(statu.why_section?.post_store)} */}
                  {/* {console.log(statu.why_section?.post_store[0]['Data'])} */}
                </h2>
                <div className="slider-container">
                  {isPlaying ? "" : ""}
                  <div onClick={handleContainerClick}>
                    <Slider
                      ref={(slider) => setSliderRef(slider)}
                      {...settings}
                    >
                      {statu.who_use_wa?.post_store.map((item, index) => (
                        <div key={item.id}>
                          {/* {console.log(item['Data'].Image)} */}
                          <Link to={item['Data'].Link}>
                          <img
                            src={item['Data'].Image}
                            className="sliderimages"
                            alt={`Logo ${index + 1}`}
                          />
                          </Link>
                        </div>
                      ))}
                    </Slider>
                  </div>
                  <button
                    type="submit"
                    onClick={() => navigate("/OurProducts")}
                    className="btn w-auto blue-btn-Find-out-More"
                  >
                    Find out More
                  </button>
                </div>
              </div>
            </div>
          </section>
        ),
      },
      {
        condition: statu.tell_me_more_section?.status === 1,
        ordering: statu.tell_me_more_section?.ordering || 0,
        content: (
          <section className="tellmemore">
            <div className="container">
              <h4 className="tellmemoretitle">
                {/* {console.log(statu.tell_me_more_section)} */}
                {statu.tell_me_more_section?.post_store[0]['Data']?.Title}
              </h4>
              <div className="row">
                <div className="col-12">
                  {console.log(statu.tell_me_more_section?.post_store[0]['Data']?.Buttonbackgroundcolor + ' !important')}
                  <button
                    type="submit"
                    className="btn w-auto sky-blue-btn-tellmemore"
                    style={{
                      backgroundColor: statu.tell_me_more_section?.post_store[0]['Data']?.Buttonbackgroundcolor + ' !important' || '',
                      color: statu.tell_me_more_section?.post_store[0]['Data']?.Buttontextcolor || '',
                    }}>
                    {statu.tell_me_more_section?.post_store[0]['Data']?.Buttontext}
                  </button>
                </div>
              </div>
            </div>
          </section>
        ),
      },
      {
        condition: statu.about_us?.status === 1,
        ordering: statu.about_us?.ordering || 0,
        content: (
          <section className="page-section" id="package_section">
            <div className="container type-1">
              <div className="row">
                <div className="col-12">
                  <div className="sec-8-heading">
                    <h1 id="About-us">
                      {statu.about_us?.page_name}
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
        ),
      },
      {
        condition: statu.page_image_section?.status === 1,
        ordering: statu.page_image_section?.ordering || 0,
        content: (
          <section className="imagesection" id="parallaximagesection">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 p-0">
                  <div
                    className="parallax-img"
                    style={{
                      backgroundImage: `url(${statu.page_image_section?.image})`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </section>
        ),
      },
      {
        condition: statu.contact_us?.status === 1,
        ordering: statu.contact_us?.ordering || 0,
        content: (
          <section className="lets-talk-sec" id="package_section">
            <div className="container" id="sec-10">
              <div className="contactusswction">
                <form id="contactForm">
                  <div className="row ">
                    <div className="col-12">
                      <h4 className="letstallktitle">
                        {/* {statu.contact_us?.post_store[0]?.Title} */}
                        {statu.contact_us?.post_store[0]['Data']?.Title}
                      </h4>
                      <div className="inputgroup">
                        {statu.contact_us?.post_store[0]['Data']?.Description}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {statu.contact_us?.post_store.map((item, index) => (
                      <div className="col-md-6" key={index}>
                        <div className="inputgroup">
                          <label>{item['Data'].Label}</label>
                          {/* {item.Label === "Tell us what you need" ? ( */}
                          {item['Data'].Label === "Tell us what you need" ? (
                            <textarea
                              className='form-control'
                              name={`field${index}`}
                              rows="4"
                              onChange={(e) => handleInputChange(e, index)}
                            />
                          ) : item.type === "tel" ? (
                            <input
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
                  {/* <div className="row">
                    {statu.contact_us?.post_store.map((item, index) => (
                      <div className="col-md-6" key={index}>
                        <div className="inputgroup">
                          <label>{item.Label}</label>
                          {item.Label === "Tell us what you need" ? (
                            <textarea
                              className="form-control"
                              name={`field${index}`}
                              rows="4"
                              onChange={(e) => handleInputChange(e, index)}
                            />
                          ) : item.type === "tel" ? (
                            <input
                              className="form-control"
                              name={`field${index}`}
                              type="tel"
                              onChange={(e) => handleInputChange(e, index)}
                            />
                          ) : (
                            <input
                              className="form-control"
                              name={`field${index}`}
                              type={item.Type}
                              onChange={(e) => handleInputChange(e, index)}
                            />
                          )}
                          {errors[`label${index}`] && (
                            <span style={{ color: "red" }}>
                              {errors[`label${index}`]}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div> */}
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
        ),
      },
    ];

    const orderedSections = sections
      .filter((section) => section.condition)
      .sort((a, b) => a.ordering - b.ordering);

    return orderedSections.map((section, index) => (
      <div key={index}>{section.content}</div>
    ));
  };

  return <>{renderSections()}</>;
};

export default Home;

