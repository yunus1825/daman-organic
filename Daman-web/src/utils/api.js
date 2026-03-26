// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9000", // Replace with your actual base URL
  // You can also add headers, timeout, etc. here
});

export default api;
