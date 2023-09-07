import axios from "axios";
import { toast } from "react-toastify";

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
      toast.error(
        `Hackerrank/${endpoint} adresine ${reqType} isteği gönderilirken bir hata ile karşılaşıldı: ${err.message}`
      );
      throw err;
    });
};

export let srAPI = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_SERVER_API_KEY}`,
  },
});

export const doSRRequest = ({ reqType, endpoint, payload, config }) => {
  return srAPI[reqType](endpoint, payload || config, payload && config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      toast.error(
        `SERVER/${endpoint} adresine ${reqType} isteği gönderilirken bir hata ile karşılaşıldı: ${err.message}`
      );
      throw err;
    });
};
