import axios from "axios";
 
export const getAxiosInstance = () =>
  axios.create({
    baseURL: `${'https://mveledziso-pmt.onrender.com/swagger/index.html'}`,
    headers: {
      "Content-Type": "application/json",
    timeout: 30000,  
    },
  });