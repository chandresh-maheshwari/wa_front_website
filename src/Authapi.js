/* eslint-disable import/no-anonymous-default-export */
// import config from "../../Config";
import Config from "./Config";
import axios from "axios";
import ls from "local-storage";

export default new (class AuthApi {
    setHeaders(type) {
        let authToken =
            ls.get("authToken") &&
                ls.get("authToken") !== null &&
                ls.get("authToken") !== false
                ? ls.get("authToken")
                : "";
        axios.defaults.headers[type]["Content-Type"] = "multipart/form-data";
        // axios.defaults.headers[type]['Content-Type'] = 'application/json;charset=utf-8';
        axios.defaults.headers[type]["Access-Control-Allow-Origin"] = "*";
        axios.defaults.headers[type]["Authorization"] = `Bearer ${authToken}`;
    }


    async Toppageget() {
        try {
            const url = `${Config.apiurl}${Config.apis.Toppageget}`;
            // const token = ls('Token');
            this.setHeaders("get");
            const response = await axios.get(url, {
                headers: {
                    // Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
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
            // const token = ls('Token');
            this.setHeaders("get");
            const response = await axios.get(url, {
                headers: {
                    // Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
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
            // const token = ls('Token');
            this.setHeaders("get");
            const response = await axios.get(url, {
                headers: {
                    // Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }

    async dynamicpageget(pagename) {
        // console.log(pagename);
        try {
            // const url = `${Config.apiurl}${Config.apis.dynamicpageget}${pagename}`;
            const url = Config.apiurl + Config.apis.dynamicpageget + pagename;
            // const token = ls('Token');
            this.setHeaders("get");
            const response = await axios.get(url, {
                headers: {
                    // Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }


})();
