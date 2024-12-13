/* eslint-disable import/no-anonymous-default-export */

export default {


  apiurl: process.env.NODE_ENV === "development"
    ? "http://wafront.localhost.com/"
    // : "https://hrmsapi.cherrypiksoftware.com/",
    : "http://hrmsstagingapi.cherrypiksoftware.com/",

  apis: {
    // login: 'api/login',
    // LoginExToken: 'api/refresh',
    Toppageget:'api/page/Top Page',
    Footerpageget:'api/page/Footer',
    Navbarpageget:'api/page/Navbar',
    dynamicpageget:'api/page/',

  },
};
