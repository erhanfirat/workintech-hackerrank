import { useState } from "react";
import { API } from "./api";

export const useAxios = ({
  initialData,
  reqType,
  endpoint,
  payload,
  config,
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(initialData);
  const [err, setErr] = useState();

  const doRequest = ({ instantePayload, instantConfig }) => {
    setLoading(true);
    return API[reqType](
      endpoint,
      instantePayload || payload || instantConfig || config,
      (payload || instantePayload) && (instantConfig || config)
    )
      .then((res) => {
        setData(res.data);
        return res.data;
      })
      .catch((err) => {
        setErr(err);
        throw err;
      })
      .finally(() => setLoading(false));
  };

  return [data, doRequest, loading, err];
};
