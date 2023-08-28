import { Navbar, NavbarBrand } from "reactstrap";

import logo from "../logo-dark.svg";

const Header = () => {
  return (
    <Navbar className="my-2" color="dark" dark>
      <NavbarBrand href="/">
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
