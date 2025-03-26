/* eslint-disable import/no-anonymous-default-export */

export default {


  // apiurl: process.env.NODE_ENV === "development"
  //   ? "http://wa_front.localhost.com/"
  //   // : "https://hrmsapi.cherrypiksoftware.com/",
  //   : "https://front.wasteaccountant.com/",


  apiurl: process.env.NODE_ENV === "development"
    ? "http://wa_front.localhost.com/"
    // : "https://hrmsapi.cherrypiksoftware.com/",
    : "https://front.wasteaccountant.com/",

  waapiurl: process.env.NODE_ENV === "development"
    ? "http://walara.localhost.com/admin/"
    // : "https://hrmsapi.cherrypiksoftware.com/",
    : "https://laravel.wasteaccountant.com/admin/",

  // apis for wa-front website
  apis: {

    Toppageget: 'api/page/Top Page',
    Footerpageget: 'api/page/Footer',
    Navbarpageget: 'api/page/Navbar',
    dynamicpageget: 'api/page/',
    notfoundpageget: 'api/page/Page Not Found',

    Alldynamicpageget: 'api/pages',
    contactdatapost: 'api/contact-page-store',
    Alldynamicpagegetnav: 'api/page-status-data',

  },

  // Apis for payment integration 
  authApis: {  
    login: "api/apilogin",
    logout: "api/userlogout",
    getUser : "api/user",
    useregister : "api/useregister",
    stripeCheckoutSuccess : "api/stripe/checkout/success",
    userCompanyDetails: "api/user-company-details" ,
    userContractDetails: "api/user-contract-details",
    getLatestCompanyDetails: "api/get_latest_user_company",
    userDepotDetails: "api/user_depot_details",
    getLatestContractDetails: "api/user_latest_contract_get",
    userVehicleDetails: "api/userVehicleDetails",
    getfualtypesdata : "api/user_getfualtypesdata",
    getUserDepotTypeName : "api/user_getDepotTypeName",
    getusercompanydetail : "api/user_company_details_get",
    getUserContractdetail : "api/user-contract-details_get",
    getUserDepotdetail : "api/user_depot_details_get",
    getcountyname : "api/user_getCountyName",
    userVehicleTypes : "api/user_getVehicleTypeDetails",
    getUservehicledetail : "api/user_vehicle_details_get",
    createCheckoutSession : "api/create-checkout-session",
    mainIndustry : "api/mainIndustry",
    getMainActivity: "api/getMainActivity",
    getSubActivity: "api/getSubActivity",

    getDistrictCouncildata: "api/get-district-council",
    getOrigindata: "api/get-origin",
    getJobTypedata: "api/get-job-types",
    getSubContractCompanydata: "api/subcontract_company",
    userSiteDetails: "api/user_details_site_job_store",
    getUserSitedetail : "api/user_latest_site_and_job_get",


  },
};
