import axios from "axios";
import { toast } from "react-hot-toast";
import { STORE_TOKEN } from "../utils/constants";

export const REQ_TYPES = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
};

export let hrAPI = axios.create({
  baseURL: "https://www.hackerrank.com/x/api/v3/",
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_HACKERRANK_API_KEY}`,
  },
});

export const doHRRequest = ({ reqType, endpoint, payload, config }) => {
  return hrAPI[reqType](endpoint, payload || config, payload && config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(
        `Hackerrank/${endpoint} adresine ${reqType} isteği gönderilirken bir hata ile karşılaşıldı: ${errorMessage}`
      );
      throw err;
    });
};

export let srAPI;

export const generateSrApi = () => {
  const token = localStorage.getItem(STORE_TOKEN);
  if (token) {
    srAPI = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 30000,
    });
  } else {
    srAPI = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL,
      timeout: 30000,
    });
  }

  srAPI.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        window.dispatchEvent(new CustomEvent("tokenExpired"));
      }
      return Promise.reject(error);
    }
  );
};

generateSrApi();

export const doSRRequest = ({ reqType, endpoint, payload, config }) => {
  return srAPI[reqType](endpoint, payload || config, payload && config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(
        `${process.env.REACT_APP_SERVER_URL}${endpoint} adresine ${reqType} isteği gönderilirken bir hata ile karşılaşıldı: ${errorMessage}`
      );
      throw err;
    });
};

export const doSRRequestResponse = ({ reqType, endpoint, payload, config }) => {
  return srAPI[reqType](endpoint, payload || config, payload && config);
};
