import { Navbar, NavbarBrand } from "reactstrap";

import logo from "../logo-dark.svg";

const Header = () => {
  return (
    <Navbar color="dark" dark className="px-3">
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
    </Navbar>
  );
};

export default Header;
