/* eslint-disable import/no-anonymous-default-export */
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
            this.setHeaders("get");
            const response = await axios.get(url, {
                headers: {
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
            this.setHeaders("get");
            const response = await axios.get(url, {
                headers: {
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
            this.setHeaders("get");
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
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
        try {
            const url = Config.apiurl + Config.apis.dynamicpageget + pagename;
            this.setHeaders("get");
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
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
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }


    async contactdatapost(formData) {
        console.log(formData)
        const formDataapi = {
            name: formData.field0,
            email: formData.field1,
            description: formData.field2,
            contact_number: formData.field3
        }
        try {
            const url = `${Config.apiurl}${Config.apis.contactdatapost}`;
            this.setHeaders("post");
            const response = await axios.post(url, formDataapi, {
                headers: {
                    'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }


})();
