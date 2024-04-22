import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // Replace this with your base URL
});

export default axiosInstance;
