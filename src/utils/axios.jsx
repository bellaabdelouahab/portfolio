import axios from "axios";
// get api from .env
const API = process.env.BACKEND_API;
console.log("API", API);
// ----------------------------------------------------------------------
const axiosInstance = axios.create({
  baseURL: API,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    // "ngrok-auth": "true",
    // "ngrok-skip-browser-warning": "69420",
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  },
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);
export default axiosInstance;
