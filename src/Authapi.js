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
  // Helper method to set headers for the request
  setHeaders(type) {
    let authToken = ls.get("authToken") || ""; // Simplified the ternary check
    axios.defaults.headers[type]["Content-Type"] = "application/json"; // Default Content-Type is 'application/json'
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
      throw error;
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
      // console.log(response.data);
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

  // ==================Login ragistration and logout api================
  // async useregister(ragisteruserData) {
  //     try {
  //         const url = Config.waapiurl + Config.authApis.useregister;
  //         this.setHeaders("post");
  //         const response = await axios.post(url, ragisteruserData);
  //         // console.log("API response:", response.data);

  //         return response.data;
  //     } catch (error) {
  //         console.error("API Error:", error);
  //         if (error.response) {
  //             return error.response.data.message;
  //         } else {
  //             return "An error occurred, Please try again later!";
  //         }
  //     }
  // }

  async useregister(registerUserData) {
    try {
      console.log("📢 Calling API with:", registerUserData);

      const url = Config.waapiurl + Config.authApis.useregister;
      this.setHeaders("post"); // Ensure headers are set correctly
      console.log("🛠️ API URL:", url);

      const response = await axios.post(url, registerUserData);
      console.log("✅ Raw API Response:", response);

      // ✅ Ensure response and response.data are valid
      if (!response || !response.data) {
        throw new Error("Invalid API response: No data received");
      }

      return response.data;
    } catch (error) {
      console.error("❌ API Error:", error);

      if (error.response) {
        console.error("⚠️ Server Response Data:", error.response.data);
        return error.response.data.message || "API error occurred!";
      } else {
        return "An error occurred, Please try again later!";
      }
    }
  }

  // async login(userData) {
  //     try {
  //         const url = Config.waapiurl + Config.authApis.login;
  //         this.setHeaders("post");
  //         const response = await axios.post(url, userData);
  //         console.log("API response:", response.data);

  //         return response.data;
  //     } catch (error) {
  //         console.error("API Error:", error);
  //         if (error.response) {
  //             return error.response.data.message;
  //         } else {
  //             return "An error occurred, Please try again later!";
  //         }
  //     }
  // }
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

  // =======================================

  async paymentcheckouturl(userData) {
    try {
      const url = Config.waapiurl + Config.authApis.paymentcheckouturl;
      this.setHeaders("post");

      // const authToken = ls.get("WAauthToken") || "";

      const response = await axios.post(url, userData, {
        headers: {
          // Authorization: `Bearer ${authToken}`,
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
  // ==============All Company details data submit  Api=================================================

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

  async mainIndustry() {
    try {
      const url = `${Config.waapiurl}${Config.authApis.mainIndustry}`;
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

  async getMainActivity(smi_id) {
    try {
      const url = `${Config.waapiurl}${Config.authApis.getMainActivity}?smi_id=${smi_id}`;
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

  async getSubActivity(smi_id) {
    try {
      const url = `${Config.waapiurl}${Config.authApis.getSubActivity}?smi_id=${smi_id}`;
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

  async getLatestContractDetails() {
    try {
      const url = `${Config.waapiurl}${Config.authApis.getLatestContractDetails}`;
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
          error.response.data.message || "Failed to fetch contract details"
        );
      } else {
        throw new Error(
          "An error occurred while fetching contract details. Please try again later!"
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

  async getusercompanydetail() {
    const maxRetries = 3;
    let attempt = 0;

    // while (attempt < maxRetries) {
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

      // if (error.response && error.response.status >= 500) {
      //     // Retry for server errors
      //     attempt++;
      //     console.log(`Retrying... (${attempt}/${maxRetries})`);
      //     // continue;
      // }

      throw error; // Re-throw if it's not a server error
    }
    // }

    throw new Error("Failed to fetch company details after multiple attempts");
  }

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

  async getUservehicledetail() {
    try {
      const url = `${Config.waapiurl}${Config.authApis.getUservehicledetail}`;
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

  // async createCheckoutSession(productName, amount, email, price_id,trail_days) {
  //     try {
  //         const url = Config.waapiurl + Config.authApis.createCheckoutSession;
  //         this.setHeaders("post");
  //         const response = await axios.post(url, {
  //             product_name: productName,
  //             amount: parseFloat(amount),
  //             email: email,
  //             price_id: price_id,
  //             trail_days :trail_days

  //         }, {
  //             headers: {
  //                 'Content-Type': 'application/json',
  //             },
  //         });
  //         return response.data;
  //     } catch (error) {
  //         console.error("API Error:", error);
  //         throw error;
  //     }
  // }

  async createsub(price_id, trail_days) {
    try {
      const url = Config.waapiurl + Config.authApis.createsub;
      this.setHeaders("post");
      const authToken = ls.get("WAauthToken") || "";
      const response = await axios.post(
        url,
        {
          // product_name: productName,
          // amount: parseFloat(amount),
          // email: email,
          price_id,
          trail_days: trail_days,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const checkoutUrl = response.data.checkout_url;
      return response.data;
      // Redirect user to Stripe Checkout
      // window.location.href = checkoutUrl;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
  async getDistrictCouncildata() {
    try {
      const url = `${Config.waapiurl}${Config.authApis.getDistrictCouncildata}`;
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
          error.response.data.message ||
            "Failed to fetch District Council details"
        );
      } else {
        throw new Error(
          "An error occurred while fetching District Council details. Please try again later!"
        );
      }
    }
  }

  async getOrigindata() {
    try {
      const url = `${Config.waapiurl}${Config.authApis.getOrigindata}`;
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
          error.response.data.message ||
            "Failed to fetch District Council details"
        );
      } else {
        throw new Error(
          "An error occurred while fetching Origin details. Please try again later!"
        );
      }
    }
  }

  async getJobTypedata() {
    try {
      const url = `${Config.waapiurl}${Config.authApis.getJobTypedata}`;
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
          error.response.data.message ||
            "Failed to fetch District Council details"
        );
      } else {
        throw new Error(
          "An error occurred while fetching Job Type details. Please try again later!"
        );
      }
    }
  }

  async getSubContractCompanydata() {
    try {
      const url = `${Config.waapiurl}${Config.authApis.getSubContractCompanydata}`;
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
          error.response.data.message ||
            "Failed to fetch District Council details"
        );
      } else {
        throw new Error(
          "An error occurred while fetching Job Type details. Please try again later!"
        );
      }
    }
  }

  async userSiteDetails(formData) {
    try {
      const url = `${Config.waapiurl}${Config.authApis.userSiteDetails}`;
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

  // async getUserSitedetail(contract_id) {
  //     try {
  //         const url = `${Config.waapiurl}${Config.authApis.getUserSitedetail}`;
  //         this.setHeaders("get");

  //         const authToken = ls.get("WAauthToken") || "";
  //         console.log("Auth Token:", authToken);

  //         const response = await axios.get(url, {
  //             headers: {
  //                 Authorization: `Bearer ${authToken}`,
  //                 "Content-Type": "application/json",
  //             },
  //         });
  //         return response.data;
  //     } catch (error) {
  //         console.error("API Error:", error);
  //         throw error;
  //     }
  // }

  async getUserSitedetail(contract_id) {
    try {
      const url = `${Config.waapiurl}${Config.authApis.getUserSitedetail}`;
      this.setHeaders("post"); // Set headers for POST request

      const authToken = ls.get("WAauthToken") || "";
      console.log("Auth Token:", authToken);

      // Prepare the payload with contract_id
      const data = { contract_id };

      // Make the POST request with the payload
      const response = await axios.post(url, data, {
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
