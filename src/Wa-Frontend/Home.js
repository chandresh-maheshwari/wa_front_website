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
import { loadStripe } from "@stripe/stripe-js";
import Login from "../components/Login/Login";
import { Outlet } from "react-router-dom";
import Navlayout from "./NavLayout";
// import Expired from "../components/CheckTokenExpier"; //working code for check token expire
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const stripePromise = loadStripe(
  "pk_test_51P4GXaAvL6Jnl0r3yHDSV2zN0JrGRt2UFxn217kqw9JFFBXe4K1n5xZHGfsKaIicVfUBAP5ch0TBIO8C8cI3ijQv00bNWJynzK"
);

const carouselResponsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1200 }, items: 1 },
  desktop: { breakpoint: { max: 1200, min: 992 }, items: 1 },
  tablet: { breakpoint: { max: 992, min: 768 }, items: 1 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 1 }
};

// Helper to return posts ordered by their `ordering` field
const getOrderedPosts = (section) => {
  if (!section || !Array.isArray(section.post_store)) return [];
  return [...section.post_store].sort(
    (a, b) => (a.ordering || 0) - (b.ordering || 0)
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const [sliderRef, setSliderRef] = useState(null);
  const [homesection, setHomesection] = useState({});
  const [Transforming, setTransforming] = useState({});
  const [titles, setTitles] = useState([]);
  const [description, setDescription] = useState([]);
  const [formdata, setFormdata] = useState({});
  const [errors, setErrors] = useState({});
  const [statu, setStatus] = useState({});
  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isFrontCreated, setIsFrontCreated] = useState(null);
  // const [userRoleData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingPurchaseData, setPendingPurchaseData] = useState(null);
  const [priceDetails, setPriceDetails] = useState({});

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
    fetchdata();
  }, []);

  useEffect(() => {
    const fetchAllPriceDetails = async () => {
      if (statu.our_products?.post_store) {
        const pricePromises = statu.our_products.post_store.map(async (card) => {
          const purchaseButtonSection = card.data.PurchaseButton || {};
          const priceId = purchaseButtonSection?.[purchaseButtonSection?.Field_Slug_stripid];

          if (priceId) {
            try {
              const details = await fetchPriceDetails(priceId);
              if (details) {
                setPriceDetails(prev => ({
                  ...prev,
                  [priceId]: details
                }));
              }
            } catch (error) {
              console.error('Error fetching price details:', error);
            }
          }
        });

        await Promise.all(pricePromises);
      }
    };

    fetchAllPriceDetails();
  }, [statu.our_products?.post_store]);

  const fetchPriceDetails = async (priceId) => {
    try {
      const response = await Authapi.fetchPriceDetails(priceId);
      return response;
    } catch (error) {
      console.error('Error fetching price details:', error);
      return null;
    }
  };

  const fetchdata = async () => {
    try {
      const response = await Authapi.Alldynamicpageget();
      // console.log(response.results.contact_us.ordering)

      // console.log(response.results)
      if (response.status === true) {
        ls("data", response.results);

        // console.log(response.results.transforming_waste_industry.post_store[0]['data'].Pagesectiontitle1)
        setStatus(response.results);
        setHomesection(response.results.home_section.post_store[0]["data"]);
        // Ensure transforming posts are ordered
        const transformingPosts = Array.isArray(
          response.results.transforming_waste_industry.post_store
        )
          ? [...response.results.transforming_waste_industry.post_store].sort(
            (a, b) => (a.ordering || 0) - (b.ordering || 0)
          )
          : [];
        setTransforming(transformingPosts);
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

        // Extract Titles OLD CODE START
        // const dynamicTitles = response.results.about_us.post_store.flatMap(
        //   (post) =>
        //     Object.keys(post.data) // Access 'data' property directly
        //       .filter((key) => key.startsWith("Field_Slug_title")) // Filter by keys that start with 'Title'
        //       .map((key) => post.data[key]) // Get the corresponding value for each 'Title'
        // );
        // Extract Titles OLD CODE END

        // Use ordered posts for About Us section
        const orderedAboutPosts = Array.isArray(
          response.results.about_us.post_store
        )
          ? [...response.results.about_us.post_store].sort(
            (a, b) => (a.ordering || 0) - (b.ordering || 0)
          )
          : [];

        const dynamicTitles = orderedAboutPosts.flatMap((post) => {
          const data = post.data;
          const titleKey = data.Field_Slug_title; // This gives 'Title'
          return data[titleKey] ? [data[titleKey]] : [];
        });

        // console.log(dynamicTitles);
        setTitles(dynamicTitles);

        // Extract Descriptions OLD CODE START
        // const dynamicDescriptions =
        //   response.results.about_us.post_store.flatMap(
        //     (post) =>
        //       Object.keys(post.data) // Access 'data' property directly
        //         .filter((key) => key.startsWith("Description")) // Filter by keys that start with 'Description'
        //         .map((key) => post.data[key]) // Get the corresponding value for each 'Description'
        //   );
        // Extract Descriptions OLD CODE END
        const dynamicDescriptions = orderedAboutPosts.flatMap((post) => {
          const data = post.data;
          const descriptionKey = data.Field_Slug_description; // e.g., 'Description'
          return data[descriptionKey] ? [data[descriptionKey]] : [];
        });


        setDescription(dynamicDescriptions);
      } else {
        console.error("Invalid response structure:", response);
      }
    } catch (error) {
      console.log(error);
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
    //   dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  const handleInputChange = (event, index) => {
    let { value, name, type } = event.target;
    const newErrors = { ...errors };

    if (type === "tel" && name.includes("field")) {
      // Remove non-numeric characters
      let cleanedValue = value.replace(/\D/g, "");

      // Limit to 10 digits
      if (cleanedValue.length > 10) {
        cleanedValue = cleanedValue.slice(0, 10);
      }

      event.target.value = cleanedValue; // Update the input field

      // Validate phone number length
      if (cleanedValue.length === 0) {
        newErrors[`label${index}`] = "This field is required";
      } else if (cleanedValue.length !== 10) {
        newErrors[`label${index}`] = "Phone number must be 10 digits";
      } else {
        newErrors[`label${index}`] = ""; // No error
      }
    } else if (type === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      newErrors[`label${index}`] = emailPattern.test(value)
        ? ""
        : "Please enter a valid email address";
    } else {
      newErrors[`label${index}`] = value.trim() ? "" : "This field is required";
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};
    const formdata = {};

    statu.contact_us?.post_store.forEach((item, index) => {
      const value = document
        .querySelector(`[name="field${index}"]`)
        .value.trim();
      formdata[`field${index}`] = value;

      if (!value) {
        newErrors[`label${index}`] = "This field is required";
      } else if (item.data.Type === "tel") {
        // Fix: Use item.data.Type
        const cleanedValue = value.replace(/\D/g, "");
        if (cleanedValue.length !== 10) {
          newErrors[`label${index}`] = "Phone number must be 10 digits";
        }
      } else if (item.data.Type === "email") {
        // Fix: Use item.data.Type
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          newErrors[`label${index}`] = "Please enter a valid email address";
        }
      }
    });

    // If errors exist, update state
    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }

    // If no errors, submit the form
    Swal.fire({
      title: "Submitting...",
      html: "Please wait while we process your request.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await Authapi.contactdatapost(formdata);
      if (response && response.status === true) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Form submitted successfully!",
          background: "#f8f9fa",
          showConfirmButton: true,
          confirmButtonText: "OK",
        }).then(() => {
          document.getElementById("contactForm").reset();
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
  };

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

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
      let email = userEmail;
      // console.log(email);
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
          setLoading(false);
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
          // text: "You are not authenticate user.\n please logout and signup / login as company user.",
          html: `You are not authenticate user.<br>
                  Please logout and signup / login as company user.`,
          confirmButtonText: "OK",
        });
        setLoading(false);
        setUserRole(null);
        setUserEmail(null);

        return;
      }

      // Check if user has an active subscription
      Swal.fire({
        title: "Checking subscription...",
        text: "Please wait while we check your subscription status.",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const subscriptionCheck = await Authapi.checkUserSubscription();

        // Normalize subscription payload
        const subscription =
          subscriptionCheck?.subscription ||
          subscriptionCheck?.data?.subscription ||
          subscriptionCheck?.data ||
          null;

        // Determine hasSubscription from multiple possible flags
        const hasSubscription =
          subscriptionCheck?.hasSubscription === true ||
          subscriptionCheck?.status === true ||
          subscriptionCheck?.data?.hasSubscription === true ||
          (!!subscription && !!subscription.user_id);

        // Evaluate subscription validity (active or trial and not ended)
        const trialEndsAt =
          subscription?.trial_ends_at ||
          subscription?.trial_end ||
          subscription?.trialEndsAt;
        const endsAt = subscription?.ends_at || subscription?.ended_at;
        const stripeStatus = subscription?.stripe_status || subscription?.status;

        const today = new Date();
        const isTrialActive =
          trialEndsAt && !isNaN(new Date(trialEndsAt).getTime()) && new Date(trialEndsAt) >= today;
        const isStatusActive =
          stripeStatus === "active" ||
          stripeStatus === "trialing" ||
          stripeStatus === "active_trialing";
        const isEnded =
          endsAt && !isNaN(new Date(endsAt).getTime()) && new Date(endsAt) <= today;

        const hasValidSubscription = hasSubscription && (isTrialActive || isStatusActive) && !isEnded;

        if (hasValidSubscription) {
          // User has active subscription or active trial; decide where to resume based on existing data
          let nextPath = "/company";

          try {
            const [companyRes, contractRes, depotRes] = await Promise.allSettled([
              Authapi.getusercompanydetail(),
              Authapi.getUserContractdetail(),
              Authapi.getUserDepotdetail(),
            ]);

            const isOk = (res) =>
              res &&
              (res.status === 200 || res.status === true || res.status === "success");

            const hasCompany =
              companyRes.status === "fulfilled" &&
              isOk(companyRes.value) &&
              !!(
                companyRes.value?.company ||
                companyRes.value?.companies ||
                companyRes.value?.data
              );

            const hasContract =
              contractRes.status === "fulfilled" &&
              isOk(contractRes.value) &&
              !!(
                contractRes.value?.contract ||
                contractRes.value?.contracts ||
                contractRes.value?.data
              );

            const hasDepot =
              depotRes.status === "fulfilled" &&
              isOk(depotRes.value) &&
              !!(
                depotRes.value?.depots ||
                depotRes.value?.depot ||
                depotRes.value?.data
              );

            if (hasCompany && hasContract && hasDepot) {
              nextPath = "/site";
            } else if (hasCompany && hasContract) {
              nextPath = "/depot";
            } else if (hasCompany) {
              nextPath = "/contract";
            }
          } catch (progressCheckError) {
            console.error("Progress check failed, defaulting to company page", progressCheckError);
          }

          Swal.close();
          navigate(nextPath);
          setLoading(false);
          return;
        }
      } catch (subscriptionError) {
        // If subscription check fails (e.g., user doesn't have subscription), continue to payment
        console.log("No active subscription found, proceeding to payment");
        // Close the loading dialog and continue to payment flow
        Swal.close();
      }

      // Ensure any previous loading dialog is closed before showing the next one
      Swal.close();

      // User doesn't have subscription, proceed with Stripe checkout
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
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userData", JSON.stringify(data)); // Fixed key to match NavLayout
    setShowLoginPopup(false);

    // Notify other components of login
    window.dispatchEvent(new Event('userLogin'));

    // Check for purchase intent
    const purchaseIntent = localStorage.getItem('purchaseIntent');
    if (purchaseIntent) {
      const { price_id, trail_days } = JSON.parse(purchaseIntent);
      // Clear the purchase intent
      localStorage.removeItem('purchaseIntent');
      // Proceed with purchase
      handlePurchaseSubmit(price_id, trail_days);
    }
  };

  const renderCards = (orderedPosts) => {
    const posts = orderedPosts || statu.our_products?.post_store || [];
    return posts.map((card, index) => {
      const feesSection = card.data.FeesSection || {};
      const infoSection1 = card.data.PackageInfo || {};
      const serviceSection = card.data.PackageServices || {};
      const purchaseButtonSection = card.data.PurchaseButton || {};

      // Get the price ID from the purchase button section
      const priceId = purchaseButtonSection?.[purchaseButtonSection?.Field_Slug_stripid];

      // Check if there's any content to display
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

      // Modify the button text to use the fetched amount
      const buttonText = purchaseButtonSection?.[purchaseButtonSection?.Field_Slug_buttontext];
      // const amount = priceDetails[priceId]?.amount
      //   ? (priceDetails[priceId].amount / 100).toFixed(2) // Convert cents to dollars
      //   : purchaseButtonSection?.[purchaseButtonSection?.Field_Slug_amount];

       const amount = priceDetails[priceId]?.amount
        ? (priceDetails[priceId].amount / 100).toFixed(2) // Convert cents to dollars
        : 0 ;

      return (
        <div className={`col-lg-4`} id={`card${index + 1}`} key={card.Id}>
          <div
            className={`card-liner-card-${index + 1}`}
            id="card-liner-card"
          ></div>
          <div className={`card${index + 1} card`}>
            <span className="medaltype">{card?.data?.[card?.data?.Field_Slug_packagename]}</span>
            <div className={`card${index + 1}-text`}>
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
              {serviceSection?.[serviceSection?.Field_Slug_service1] && (
                <p className="card-text-container cardtext">
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

              <div className={`card-${index + 1}-sec-3 card${index + 1}-text`}>
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
                  className="btn w-50 purchase-button"
                  onClick={() =>
                    handlePurchaseSubmit(
                      purchaseButtonSection?.[purchaseButtonSection?.Field_Slug_stripid],
                      purchaseButtonSection?.[purchaseButtonSection?.Field_Slug_trialdays]
                    )
                  }
                >
                  {`${buttonText} - $${amount}`}
                </button>
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  const test = () => {
    const homesectionImageKey = homesection?.Field_Slug_homesectionimage;
    const test1 = homesection?.[homesectionImageKey];
    return (
      <>
        <img
          src={test1}
          alt="homeimg"
          className="homeimg"
        />
      </>
    );
  }
  const renderSections = () => {
    // Pre-sort all section posts by their `ordering` field
    const orderedHomePosts = getOrderedPosts(statu.home_section);
    const orderedTransformingPosts = Transforming;
    const orderedQuoteSection1Posts = getOrderedPosts(statu.quote_section_1);
    const orderedQuoteSection2Posts = getOrderedPosts(statu.quote_section_2);
    const orderedOurProductsPosts = getOrderedPosts(statu.our_products);
    const orderedWhyChoosePosts = getOrderedPosts(statu.why_choose_wa);
    const orderedWhoUseWAPosts = getOrderedPosts(statu.who_use_wa);
    const orderedTellMeMorePosts = getOrderedPosts(statu.tell_me_more_section);
    const orderedContactUsPosts = getOrderedPosts(statu.contact_us);

    const sections = [
      {
        condition: statu.home_section?.status === 1,
        ordering: statu.home_section?.ordering || 0,
        content: (
          orderedHomePosts.length > 1 ? (
            <section className="homesection">
              <div className="container">
                <Carousel
                  responsive={carouselResponsive}
                  infinite={true}
                  // autoPlay={true}
                  autoPlaySpeed={3000}
                  showDots={orderedHomePosts.length > 1}
                  arrows={false}
                >
                  {orderedHomePosts.map((post, idx) => {
                    const postData = post.data;
                    return (
                      <div className="home">
                        <div className="row">
                          <div className="col-sm-2">
                            <img
                              src={postData?.[postData?.Field_Slug_homesectionimage]}
                              alt="homeimg"
                              className="homeimg"
                            />
                          </div>
                          <div className="col-sm-10">
                            <div className="homefont">
                              <h4>
                                {postData?.[postData?.Field_Slug_homesectiontitle]}
                              </h4>
                            </div>
                            <p className="home-p-font home-description">
                              {postData?.[postData?.Field_Slug_homesectiondescription]}
                            </p>
                            <button
                              type="button"
                              className="btn"
                              id="tellmemore"
                              style={{
                                backgroundColor: postData?.TellMeMoreButtonSection?.[postData?.TellMeMoreButtonSection?.Field_Slug_homesectionbuttonbackgroundcolor],
                                color: postData?.TellMeMoreButtonSection?.[postData?.TellMeMoreButtonSection?.Field_Slug_homesectionbuttontextcolor],
                              }}
                              onClick={() => {
                                const rawUrl = statu?.home_section?.button_link;
                                window.location.href = rawUrl;
                              }}
                            >
                              {postData?.TellMeMoreButtonSection?.[postData?.TellMeMoreButtonSection?.Field_Slug_homesectionbuttontitle]}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Carousel>
              </div>
            </section>
          ) : (
            <section className="homesection">
              <div className="container">
                <div className="home">
                  <div className="row">
                    <div className="col-sm-2">
                      <img
                        src={homesection?.[homesection?.Field_Slug_homesectionimage]}
                        alt="homeimg"
                        className="homeimg"
                      />
                    </div>
                    <div className="col-sm-10">
                      <div className="homefont">
                        <h4>
                          {homesection?.[homesection?.Field_Slug_homesectiontitle]}
                        </h4>
                      </div>
                      <p className="home-p-font home-description">
                        {homesection?.[homesection?.Field_Slug_homesectiondescription]}
                      </p>
                      <button
                        type="button"
                        className="btn"
                        id="tellmemore"
                        style={{
                          backgroundColor: homesection?.TellMeMoreButtonSection?.[homesection?.TellMeMoreButtonSection?.Field_Slug_homesectionbuttonbackgroundcolor],
                          color: homesection?.TellMeMoreButtonSection?.[homesection?.TellMeMoreButtonSection?.Field_Slug_homesectionbuttontextcolor],
                        }}
                        onClick={() => {
                          const rawUrl = statu?.home_section?.button_link;
                          window.location.href = rawUrl;
                        }}
                      >
                        {homesection?.TellMeMoreButtonSection?.[homesection?.TellMeMoreButtonSection?.Field_Slug_homesectionbuttontitle]}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )
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
                    <h5 className="text-center transforming">
                      {statu.transforming_waste_industry?.page_description}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row p-5 justify-content-center">
                {orderedTransformingPosts[0]?.data && !orderedTransformingPosts[1]?.data && (
                  <div className="col-md-8 text-center">
                    <h5 className="for-waste centered-text">
                      {orderedTransformingPosts[0]?.data?.[orderedTransformingPosts[0]?.data?.Field_Slug_pagesectiontitle1]} <br />
                      <b>{orderedTransformingPosts[0]?.data?.[orderedTransformingPosts[0]?.data?.Field_Slug_pagesectiontitle2]}</b>
                    </h5>
                    <p className="transfotextdes1 centered-text">
                      {orderedTransformingPosts[0]?.data?.[orderedTransformingPosts[0]?.data?.Field_Slug_pagesectiondescription]}
                    </p>
                  </div>
                )}
                {orderedTransformingPosts[1]?.data && !orderedTransformingPosts[0]?.data && (
                  <div className="col-md-8 text-center">
                    <h5 className="for-waste">
                      {orderedTransformingPosts[1]?.data?.[orderedTransformingPosts[0]?.data?.Field_Slug_pagesectiontitle1]} <br />
                      <b>{orderedTransformingPosts[1]?.data?.[orderedTransformingPosts[0]?.data?.Field_Slug_pagesectiontitle2]}</b>
                    </h5>
                    <p className="transfotextdes2 centered-text">
                      {orderedTransformingPosts[1]?.data?.[orderedTransformingPosts[0]?.data?.Field_Slug_pagesectiondescription]}
                    </p>
                  </div>
                )}
                {orderedTransformingPosts[0]?.data && orderedTransformingPosts[1]?.data && (
                  <>
                    <div className="col-md-5">
                      <h5 className="transfotext1 for-waste">
                        {orderedTransformingPosts[0]?.data?.[orderedTransformingPosts[0]?.data?.Field_Slug_pagesectiontitle1]} <br />
                        <b>{orderedTransformingPosts[0]?.data?.[orderedTransformingPosts[0]?.data?.Field_Slug_pagesectiontitle2]}</b>
                      </h5>
                      <p className="transfotextdes1">
                        {orderedTransformingPosts[0]?.data?.[orderedTransformingPosts[0]?.data?.Field_Slug_pagesectiondescription]}
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
                        {orderedTransformingPosts[1]?.data?.[orderedTransformingPosts[0]?.data?.Field_Slug_pagesectiontitle1]} <br />
                        <b>{orderedTransformingPosts[1]?.data?.[orderedTransformingPosts[0]?.data?.Field_Slug_pagesectiontitle2]}</b>
                      </h5>
                      <p className="transfotextdes2">
                        {orderedTransformingPosts[1]?.data?.[orderedTransformingPosts[0]?.data?.Field_Slug_pagesectiondescription]}
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
                  {orderedQuoteSection1Posts.length > 1 ? (
                    <Carousel
                      responsive={carouselResponsive}
                      infinite={true}
                      // autoPlay={true}
                      // autoPlaySpeed={3000}
                      showDots={orderedQuoteSection1Posts.length > 1}
                      arrows={false}
                    >
                      {orderedQuoteSection1Posts.map((post, idx) => (
                        <div key={idx}>
                          <div className="sec-3-text quote-sec-1">
                            <img
                              src={post.data?.[post.data?.Field_Slug_quotesectionimage]}
                              className="quoteimage1"
                              alt="quoteimage1"
                            />
                          </div>
                          <div className="sec-3-text2">
                            <p className="text-light">
                              {post.data?.[post.data?.Field_Slug_quotesectiontitle]} <br />
                              <span className="text-secondary quote-description">
                                {post.data?.[post.data?.Field_Slug_quotesectiondescription]}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </Carousel>
                  ) : (
                    <div>
                      <div className="sec-3-text">
                        <img
                          src={
                            orderedQuoteSection1Posts[0]?.data?.[
                            orderedQuoteSection1Posts[0]?.data
                              ?.Field_Slug_quotesectionimage
                            ]
                          }
                          className="quoteimage1"
                          alt="quoteimage1"
                        />
                      </div>
                      <div className="sec-3-text2">
                        <p className="text-light">
                          {
                            orderedQuoteSection1Posts[0]?.data?.[
                            orderedQuoteSection1Posts[0]?.data
                              ?.Field_Slug_quotesectiontitle
                            ]
                          }{" "}
                          <br />
                          <span className="text-secondary quote-description">
                            {
                              orderedQuoteSection1Posts[0]?.data?.[
                              orderedQuoteSection1Posts[0]?.data
                                ?.Field_Slug_quotesectiondescription
                              ]
                            }
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
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
                  {orderedQuoteSection2Posts.length > 1 ? (
                    <Carousel
                      responsive={carouselResponsive}
                      infinite={true}
                      autoPlay={true}
                      autoPlaySpeed={3000}
                      showDots={orderedQuoteSection2Posts.length > 1}
                      arrows={false}
                    >
                      {orderedQuoteSection2Posts.map((post, idx) => (
                        <div key={idx}>
                          <div className="sec-3-text quote-sec-2">
                            <img
                              src={post.data?.[post.data?.Field_Slug_quotesectionimage]}
                              className="quoteimage1"
                              alt="quoteimage1"
                            />
                          </div>
                          <div className="sec-3-text2">
                            <p className="text-light">
                              {post.data?.[post.data?.Field_Slug_quotesectiontitle]} <br />
                              <span className="text-secondary quote-description">
                                {post.data?.[post.data?.Field_Slug_quotesectiondescription]}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </Carousel>
                  ) : (
                    <div>
                      <div className="sec-3-text">
                        <img
                          src={
                            orderedQuoteSection2Posts[0]?.data?.[
                            orderedQuoteSection2Posts[0]?.data
                              ?.Field_Slug_quotesectionimage
                            ]
                          }
                          className="quoteimage1"
                          alt="quoteimage1"
                        />
                      </div>
                      <div className="sec-3-text2">
                        <p className="text-light">
                          {
                            orderedQuoteSection2Posts[0]?.data?.[
                            orderedQuoteSection2Posts[0]?.data
                              ?.Field_Slug_quotesectiontitle
                            ]
                          }{" "}
                          <br />
                          <span className="text-secondary quote-description">
                            {
                              orderedQuoteSection2Posts[0]?.data?.[
                              orderedQuoteSection2Posts[0]?.data
                                ?.Field_Slug_quotesectiondescription
                              ]
                            }
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
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
              <div className="row">{renderCards(orderedOurProductsPosts)}</div>
              <div className="contact-us-package">
                <button
                  type="button"
                  className="btn sky-blue-btn Contact-us-package"
                  onClick={() => {
                    const rawUrl = statu.our_products?.button_link;
                    window.location.href = rawUrl;
                  }}
                >
                  {statu.our_products?.button_name}
                </button>
              </div>
            </div>
          </section>
        ),
      },
      {
        condition: statu.why_choose_wa?.status === 1,
        ordering: statu.why_choose_wa?.ordering || 0,
        content: (
          // <p>sdsd</p>
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
              <div className="row">
                {orderedWhyChoosePosts.map((item, index) => (
                  <div
                    className={`col col-md-6 col-sm-6 col-xs-3 ${index % 2 === 0 ? "text-end" : "text-start"
                      }`}
                    key={item.id}
                  >
                    {/* {console.log(item['Data'].Title1)} */}
                    <h5 className="for-waste">{item['data'].Title}</h5>
                    <p style={{ marginTop: "25px" }}>
                      {item['data'].Description.split("\r\n").map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                ))}
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
                </h2>
                <div className="slider-container">
                  {isPlaying ? "" : ""}
                  <div onClick={handleContainerClick}>
                    <Slider
                      ref={(slider) => setSliderRef(slider)}
                      {...settings}
                    >
                      {orderedWhoUseWAPosts.map((item, index) => (
                        <div key={item.id}>
                          <Link to={item?.data?.[item?.data?.Field_Slug_link]}>
                            <img
                              src={item?.data?.[item?.data?.Field_Slug_image]}
                              className="sliderimages"
                              alt={`Logo ${index + 1}`}
                            />
                          </Link>
                        </div>
                      ))}
                    </Slider>
                  </div>
                  <div className="blue-btn-Find-out-More-div">
                    <button
                      type="submit"
                      className="btn w-auto blue-btn-Find-out-More"
                      onClick={() => {
                        const rawUrl = statu.who_use_wa?.button_link;
                        window.location.href = rawUrl;
                      }}
                    >
                      {statu?.who_use_wa?.button_name}
                    </button>
                  </div>
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
                {orderedTellMeMorePosts[0]?.data?.[
                  orderedTellMeMorePosts[0]?.data?.Field_Slug_title
                ]}
              </h4>

            </div>
            {/* <div className="row"> */}
            {/* <div className="col-12 sky-blue-btn-tellmemore-div"> */}
            <div className="sky-blue-btn-tellmemore-div">
              <button
                type="submit"
                className="btn w-auto sky-blue-btn-tellmemore"
                // style={{
                //   backgroundColor: "#40bedd",
                //   color: "#ffffff",
                // }}
                onClick={() => {
                  const rawUrl = statu.tell_me_more_section?.button_link;
                  window.location.href = rawUrl;
                }}
              >
                {statu.tell_me_more_section?.button_name}
              </button>
            </div>
            {/* </div> */}
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
                    <h1 id="About-us">{statu.about_us?.page_name}</h1>
                  </div>
                </div>
              </div>

              <div className="row about-section-row">
                <div className="col-md-3">
                  <div className="content-box">
                    {titles.map((title, index) => (
                      <div key={index}>
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
                    className="parallax-image"
                    style={{
                      backgroundImage: `url(${statu.page_image_section?.image})`,
                    }}
                  >
                  </div>
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
                        {orderedContactUsPosts[0]?.data?.[
                          orderedContactUsPosts[0]?.data?.Field_Slug_title
                        ]}
                      </h4>
                      <div className="inputgroup">
                        {orderedContactUsPosts[0]?.data?.[
                          orderedContactUsPosts[0]?.data
                            ?.Field_Slug_description
                        ]}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {orderedContactUsPosts.map((item, index) => (
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
                      {statu.contact_us?.button_name}
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

  return (
    <>
      <Navlayout />
      {/* <Expired /> //working code for check token expire */}

      {renderSections()}
      {showLoginPopup && (
        <Popup
          isOpen={showLoginPopup}
          onClose={toggleLoginPopup}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      <Outlet />
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

export default Home;
