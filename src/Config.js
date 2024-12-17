/* eslint-disable import/no-anonymous-default-export */

export default {


  apiurl: process.env.NODE_ENV === "development"
    ? "http://wafront.localhost.com/"
    // : "https://hrmsapi.cherrypiksoftware.com/",
    : "http://hrmsstagingapi.cherrypiksoftware.com/",

  apis: {
    Toppageget: 'api/page/Top Page',
    Footerpageget: 'api/page/Footer',
    Navbarpageget: 'api/page/Navbar',
    dynamicpageget: 'api/page/',
    notfoundpageget: 'api/page/Page Not Found',

    Alldynamicpageget: 'api/pages',
    contactdatapost: 'api/contact-page-store',
  },
};
