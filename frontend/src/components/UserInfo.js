import { useDispatch, useSelector } from "react-redux";
import MD5 from "crypto-js/md5";
import { useCallback } from "react";
import { Button } from "reactstrap";
import { signOutAction } from "../store/reducers/userReducer";
import { useHistory } from "react-router-dom";

const UserInfo = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((s) => s.user.user);

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

  console.log(user);

  return (
    <div className="d-flex align-items-center">
      {user && (
        <>
          <img src={userAvatarURL()} className="gravatar me-2" />
          <div>
            <div>{user?.Name}</div>
            <div className="fs-7">{user?.title}</div>
          </div>
          <Button size="sm" className="ms-2" onClick={signOut}>
            Sign Out
          </Button>
        </>
      )}
      {!user && (
        <Button color="primary" size="sm" onClick={login}>
          Sign In
        </Button>
      )}
    </div>
  );
};

export default UserInfo;
