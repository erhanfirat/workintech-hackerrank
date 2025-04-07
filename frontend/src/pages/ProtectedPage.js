import { useSelector } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";

const ProtectedPage = ({ PageComponent }) => {
  let location = useLocation();
  const userAuthenticated = useSelector((s) => !!s.user.token);

  return userAuthenticated ? (
    <PageComponent />
  ) : (
    <Redirect
      to={{
        pathname: "/login",
        state: { referrer: location.pathname },
      }}
    />
  );
};
export default ProtectedPage;
