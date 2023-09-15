import { Navbar, NavbarBrand, NavbarText } from "reactstrap";

import logo from "../logo-dark.svg";
import UserInfo from "../components/UserInfo";

const Header = () => {
  return (
    <Navbar color="dark" dark className="justify-content-between px-3">
      <NavbarBrand href="/" className="d-flex align-items-center">
        <img
          alt="logo"
          src={logo}
          style={{
            height: 40,
          }}
          className="me-3"
        />
        Hackerrank Tests
      </NavbarBrand>
      <NavbarText>
        <UserInfo />
      </NavbarText>
    </Navbar>
  );
};

export default Header;
