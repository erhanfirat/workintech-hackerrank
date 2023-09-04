import axios from "axios";
import { toast } from "react-toastify";

export let API = axios.create({
  baseURL: "https://www.hackerrank.com/x/api/v3/",
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_HACKERRANK_API_KEY}`,
  },
});

export const doRequest = ({ reqType, endpoint, payload, config }) => {
  return API[reqType](endpoint, payload || config, payload && config)
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
