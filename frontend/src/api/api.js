import axios from "axios";
import { toast } from "react-toastify";

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
      toast.error(
        `${endpoint} adresine ${reqType} isteği gönderilirken bir hata ile karşılaşıldı: ${err.message}`
      );
      throw err;
    });
};

export let serverAPI = axios.create({
  baseURL: "http://localhost:3001/",
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_SERVER_API_KEY}`,
  },
});

export const doServerRequest = ({ reqType, endpoint, payload, config }) => {
  return hrAPI[reqType](endpoint, payload || config, payload && config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      toast.error(
        `${endpoint} adresine ${reqType} isteği gönderilirken bir hata ile karşılaşıldı: ${err.message}`
      );
      throw err;
    });
};
