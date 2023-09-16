import { useDispatch, useSelector } from "react-redux";
import MD5 from "crypto-js/md5";
import { useCallback } from "react";
import { Button } from "reactstrap";
import { signOutAction } from "../store/reducers/userReducer";
import { useHistory } from "react-router-dom";
import SpinnerButton from "./atoms/SpinnerButton";
import { FETCH_STATES } from "../utils/constants";

const UserInfo = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((s) => s.user.user);
  const userFetchState = useSelector((s) => s.user.fetchState);

  const userAvatarURL = useCallback(() => {
    return (
      user?.profile_image_url ||
      (user?.email && `https://www.gravatar.com/avatar/${MD5(user.email)}`)
    );
  });

  const signOut = () => {
    dispatch(signOutAction());
    history.push("/");
  };

  const login = () => {
    history.push("/login");
  };

  return (
    <div className="d-flex align-items-center">
      {user && (
        <>
          <img src={userAvatarURL()} className="gravatar me-2" />
          <div>
            <div>{user?.Name}</div>
            <div className="fs-7">{user?.title}</div>
          </div>
          <Button size="sm" className="ms-3" onClick={signOut}>
            Sign Out
          </Button>
        </>
      )}
      {!user && (
        <SpinnerButton
          color="primary"
          size="sm"
          onClick={login}
          loading={userFetchState === FETCH_STATES.FETCHING}
        >
          Sign In
        </SpinnerButton>
      )}
    </div>
  );
};

export default UserInfo;
