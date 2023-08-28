import axios from "axios";

const token =
  "c6241c9f051397356b1e9432d226286ae42c134d7fb3d0aa5c752d6fc45ea955";

export let API = axios.create({
  baseURL: "https://www.hackerrank.com/x/api/v3/",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

