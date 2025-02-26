/* eslint-disable import/no-anonymous-default-export */
import Config from "./Config";
import axios from "axios";
import ls from "local-storage";

// export default new (class AuthApi {
//     setHeaders(type) {
//         let authToken =
//             ls.get("authToken") &&
//                 ls.get("authToken") !== null &&
//                 ls.get("authToken") !== false
//                 ? ls.get("authToken")
//                 : "";
//         axios.defaults.headers[type]["Content-Type"] = "multipart/form-data";
//         // axios.defaults.headers[type]['Content-Type'] = 'application/json;charset=utf-8';
//         axios.defaults.headers[type]["Access-Control-Allow-Origin"] = "*";
//         axios.defaults.headers[type]["Authorization"] = `Bearer ${authToken}`;
//     }

export default new (class AuthApi {
  setHeaders(type) {
    let authToken = ls.get("authToken") || "";
    axios.defaults.headers[type]["Content-Type"] = "application/json";
    axios.defaults.headers[type]["Authorization"] = authToken
      ? `Bearer ${authToken}`
      : "";
    axios.defaults.headers[type]["Access-Control-Allow-Origin"] = "*";
  }

  async Toppageget() {
    try {
      const url = `${Config.apiurl}${Config.apis.Toppageget}`;
      this.setHeaders("get");
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      if (error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch company details"
        );
      } else {
        throw new Error(
          "An error occurred while fetching company details. Please try again later!"
        );
      }
    }
  }

  async Footerpageget() {
    try {
      const url = `${Config.apiurl}${Config.apis.Footerpageget}`;
      this.setHeaders("get");
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async Navbarpageget() {
    try {
      const url = `${Config.apiurl}${Config.apis.Navbarpageget}`;
      this.setHeaders("get");
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async notfoundpageget() {
    try {
      const url = `${Config.apiurl}${Config.apis.notfoundpageget}`;
      this.setHeaders("get");
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async dynamicpageget(pagename) {
    try {
      const url = Config.apiurl + Config.apis.dynamicpageget + pagename;
      this.setHeaders("get");
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async Alldynamicpageget() {
    try {
      const url = Config.apiurl + Config.apis.Alldynamicpageget;
      this.setHeaders("get");
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async Alldynamicpagegetnav() {
    try {
      const url = Config.apiurl + Config.apis.Alldynamicpagegetnav;
      this.setHeaders("get");
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async login(userData) {
    try {
      const url = Config.waapiurl + Config.authApis.login;
      this.setHeaders("post");
      const response = await axios.post(url, userData);
      console.log("API response:", response.data);

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      if (error.response) {
        return error.response.data.message;
      } else {
        return "An error occurred, Please try again later!";
      }
    }
  }

  async logout(userData) {
    try {
      const url = Config.waapiurl + Config.authApis.logout;
      this.setHeaders("post");

      const authToken = ls.get("WAauthToken") || "";

      const response = await axios.post(url, userData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("API response:", response.data);

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      if (error.response) {
        return error.response.data.message;
      } else {
        return "An error occurred, Please try again later!";
      }
    }
  }

  async getUser(userData) {
    try {
      const url = Config.waapiurl + Config.authApis.getUser;
      this.setHeaders("get");

      const authToken = ls.get("WAauthToken") || "";

      const response = await axios.get(url, userData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("API response:", response.data);

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      if (error.response) {
        return error.response.data.message;
      } else {
        return "An error occurred, Please try again later!";
      }
    }
  }

  async contactdatapost(formData) {
    console.log(formData);
    const formDataapi = {
      name: formData.field0,
      email: formData.field1,
      description: formData.field2,
      contact_number: formData.field3,
    };
    try {
      const url = `${Config.apiurl}${Config.apis.contactdatapost}`;
      this.setHeaders("post");
      const response = await axios.post(url, formDataapi, {
        headers: {
          "Content-Type":
            formData instanceof FormData
              ? "multipart/form-data"
              : "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async stripeCheckoutSuccess(sessionId) {
    try {
      const url = `${Config.waapiurl}${Config.authApis.stripeCheckoutSuccess}`;
      this.setHeaders("post");

      const authToken = ls.get("WAauthToken") || "";

      const response = await axios.post(
        url,
        { session_id: sessionId },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Stripe Checkout Success response:", response.data);

      // Check if the response contains the expected structure
      if (response.data && response.data.status === true) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to store session ID");
      }
    } catch (error) {
      console.error("Stripe Checkout Success API Error:", error);
      if (error.response) {
        throw new Error(
          error.response.data.message || "Payment verification failed"
        );
      } else {
        throw new Error(
          "An error occurred while verifying payment. Please try again later!"
        );
      }
    }
  }

  async submitCompanyDetails(formData) {
    try {
      const url = `${Config.waapiurl}${Config.authApis.userCompanyDetails}`;
      this.setHeaders("post");

      const authToken = ls.get("WAauthToken") || "";
      console.log("Auth Token:", authToken);

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Company details submitted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      if (error.response) {
        throw new Error(
          error.response.data.message || "Failed to submit company details"
        );
      } else {
        throw new Error(
          "An error occurred while submitting company details. Please try again later!"
        );
      }
    }
  }

  // ====================

  async getfualtypesdata() {
    try {
      const url = `${Config.waapiurl}${Config.authApis.getfualtypesdata}`;
      this.setHeaders("get");

      const authToken = ls.get("WAauthToken") || "";
      console.log("Auth Token:", authToken);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      if (error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch fule type details"
        );
      } else {
        throw new Error(
          "An error occurred while fetching fule type details. Please try again later!"
        );
      }
    }
  }

  async getUserDepotTypeName() {
    try {
      const url = `${Config.waapiurl}${Config.authApis.getUserDepotTypeName}`;
      this.setHeaders("get");

      const authToken = ls.get("WAauthToken") || "";
      console.log("Auth Token:", authToken);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // async getUserDepotTypeName() {
  //     try {
  //         const url = `${Config.waapiurl}${Config.authApis.getUserDepotTypeName}`;
  //         this.setHeaders("get");

  //         const authToken = ls.get("WAauthToken") || "";
  //         console.log("Auth Token:", authToken);

  //         const response = await axios.get(url, {
  //             headers: {
  //                 'Authorization': `Bearer ${authToken}`,
  //                 'Content-Type': 'application/json',
  //             }
  //         });
  //         return response.data;
  //     } catch (error) {
  //         console.error("API Error:", error);
  //         throw error;
  //     }
  // }
  // async getUserDepotTypeName() {
  //     try {
  //         // Get the authentication token from localStorage
  //         const authToken = ls.get("WAauthToken") || "";
  //         console.log("Auth Token in localStorage:", authToken);  // Debug log to check the token

  //         // Check if the auth token exists
  //         if (!authToken) {
  //             console.error("No auth token found. Please log in again.");
  //             throw new Error("Authentication token is missing.");
  //         }

  //         // Remove any extra spaces or formatting issues in the token
  //         const cleanedAuthToken = authToken.trim();
  //         if (!cleanedAuthToken) {
  //             console.error("The token is invalid. Please log in again.");
  //             throw new Error("The token is invalid.");
  //         }

  //         // Set the request headers for the API
  //         this.setHeaders("get");  // Ensure this function is correctly setting headers
  //         console.log("Setting headers for request...");

  //         // Construct the API URL
  //         const url = `${Config.waapiurl}${Config.authApis.getUserDepotTypeName}`;
  //         console.log("API URL:", url);  // Debug log to check the constructed URL

  //         // Make the API request with the Authorization header
  //         const response = await axios.get(url, {
  //             headers: {
  //                 'Authorization': `Bearer ${cleanedAuthToken}`,  // Using the cleaned token
  //                 'Content-Type': 'application/json',
  //             }
  //         });

  //         // Log the response from the server
  //         console.log("API Response:", response);

  //         // Return the response data if successful
  //         if (response && response.data) {
  //             return response.data;
  //         } else {
  //             throw new Error("Failed to fetch depot types. No data received.");
  //         }

  //     } catch (error) {
  //         // Log detailed error information for debugging
  //         console.error("API Error:", error.response ? error.response.data : error.message || error);
  //         throw error;  // Rethrow the error to be handled by the calling function
  //     }
  // }

  // ===============================
  async submitContractDetails(formData) {
    try {
      const url = `${Config.waapiurl}${Config.authApis.userContractDetails}`;
      this.setHeaders("post");

      const authToken = ls.get("WAauthToken") || "";
      console.log("Auth Token:", authToken);

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Company details submitted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      if (error.response) {
        throw new Error(
          error.response.data.message || "Failed to submit company details"
        );
      } else {
        throw new Error(
          "An error occurred while submitting company details. Please try again later!"
        );
      }
    }
  }

  async getLatestCompanyDetails() {
    try {
      const url = `${Config.waapiurl}${Config.authApis.getLatestCompanyDetails}`;
      this.setHeaders("get");

      const authToken = ls.get("WAauthToken") || ""; // Retrieve the auth token
      console.log("Auth Token:", authToken);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Add the token to the headers
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async submitDepotDetails(formData) {
    try {
      const url = `${Config.waapiurl}${Config.authApis.userDepotDetails}`;
      this.setHeaders("post");

      const authToken = ls.get("WAauthToken") || "";
      console.log("Auth Token:", authToken);

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Company details submitted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      if (error.response) {
        throw new Error(
          error.response.data.message || "Failed to submit company details"
        );
      } else {
        throw new Error(
          "An error occurred while submitting company details. Please try again later!"
        );
      }
    }
  }

  async getuserContractDetails() {
    try {
      const url = `${Config.waapiurl}${Config.authApis.getLatestContractDetails}`;
      this.setHeaders("get");

      const authToken = ls.get("WAauthToken") || "";
      console.log("Auth Token:", authToken);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
  async getusercompanydetail() {
    const maxRetries = 3;
    let attempt = 0;
  
    while (attempt < maxRetries) {
      try {
        const url = `${Config.waapiurl}${Config.authApis.getusercompanydetail}`;
        this.setHeaders("get");
  
        const authToken = ls.get("WAauthToken") || "";
        console.log("Auth Token:", authToken);
  
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
  
        if (response.status === 200) {
          return response.data;
        } else {
          console.error(`Unexpected response status: ${response.status}`);
        }
      } catch (error) {
        console.error("API Error:", error);
  
        if (error.response && error.response.status >= 500) {
          // Retry for server errors
          attempt++;
          console.log(`Retrying... (${attempt}/${maxRetries})`);
          continue;
        }
  
        throw error; // Re-throw if it's not a server error
      }
    }
  
    throw new Error("Failed to fetch company details after multiple attempts");
  }










 
  async userVehicleDetails(formData) {
    try {
      const url = `${Config.waapiurl}${Config.authApis.userVehicleDetails}`;
      this.setHeaders("post");

      const authToken = ls.get("WAauthToken") || "";
      console.log("Auth Token:", authToken);

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Company details submitted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      if (error.response) {
        throw new Error(
          error.response.data.message || "Failed to submit company details"
        );
      } else {
        throw new Error(
          "An error occurred while submitting company details. Please try again later!"
        );
      }
    }
  }

  // async getusercompanydetail() {
  //   try {
  //     const url = `${Config.waapiurl}${Config.authApis.getusercompanydetail}`;
  //     this.setHeaders("get");

  //     const authToken = ls.get("WAauthToken") || "";
  //     console.log("Auth Token:", authToken);

  //     const response = await axios.get(url, {
  //       headers: {
  //         Authorization: `Bearer ${authToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error("API Error:", error);
  //     throw error;
  //   }
  // }

  async getUserContractdetail() {
    try {
      const url = `${Config.waapiurl}${Config.authApis.getUserContractdetail}`;
      this.setHeaders("get");

      const authToken = ls.get("WAauthToken") || "";
      console.log("Auth Token:", authToken);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async getUserDepotdetail() {
    try {
      const url = `${Config.waapiurl}${Config.authApis.getUserDepotdetail}`;
      this.setHeaders("get");

      const authToken = ls.get("WAauthToken") || "";
      console.log("Auth Token:", authToken);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async countynameget() {
    try {
      const url = `${Config.waapiurl}${Config.authApis.getcountyname}`;
      this.setHeaders("get");

      const authToken = ls.get("WAauthToken") || "";
      console.log("Auth Token:", authToken);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async userVehicleTypes() {
    try {
      const url = `${Config.waapiurl}${Config.authApis.userVehicleTypes}`;
      this.setHeaders("get");
  
      const authToken = ls.get("WAauthToken") || "";
      console.log("Auth Token:", authToken);
  
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
})();

// class RequestQueue {
//   constructor() {
//     this.queue = [];
//     this.isProcessing = false;
//   }

//   addRequest(requestFunc) {
//     this.queue.push(requestFunc);
//     this.processQueue();
//   }

//   async processQueue() {
//     if (this.isProcessing) return;
//     this.isProcessing = true;

//     while (this.queue.length > 0) {
//       const requestFunc = this.queue.shift();
//       try {
//         await requestFunc();
//       } catch (error) {
//         console.error("Request failed:", error);
//       }
//     }

//     this.isProcessing = false;
//   }
// }

// // Usage
// const requestQueue = new RequestQueue();
// requestQueue.addRequest(() =>Config.authApis.getusercompanydetail());

// function throttle(func, limit) {
//   let inThrottle;
//   return function(...args) {
//     if (!inThrottle) {
//       func.apply(this, args);
//       inThrottle = true;
//       setTimeout(() => (inThrottle = false), limit);
//     }
//   };
// }

// // Usage
// const throttledGetUserCompanyDetail = throttle(() => {
//   Config.authApis.getusercompanydetail();
// }, 1000);

// function debounce(func, wait) {
//   let timeout;
//   return function(...args) {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func.apply(this, args), wait);
//   };
// }

// // Usage
// const debouncedGetUserCompanyDetail = debounce(() => {
//   Config.authApis.getusercompanydetail();
// }, 300);
