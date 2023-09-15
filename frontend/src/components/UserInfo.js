import { useSelector } from "react-redux";
import MD5 from "crypto-js/md5";

const UserInfo = () => {
  const user = useSelector((s) => s.user.user);

  const userEmailHash = MD5(user?.email);

  return (
    <div className="d-flex align-items-center">
      <img
        src={`https://www.gravatar.com/avatar/${userEmailHash}`}
        className="gravatar me-2"
      />
      <div>
        <div>{user?.Name}</div>
        <div className="fs-7">{user?.title}</div>
      </div>
    </div>
  );
};

export default UserInfo;
