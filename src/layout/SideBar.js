import { NavLink } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";

const activeNavLink = {
  backgroundColor: "#fffff !important",
  color: "rgb(13,110,253) !important",
};

const SideBar = () => {
  return (
    <div className="side-bar p-3 ">
      <Nav vertical>
        <NavItem>
          <NavLink
            to={"/"}
            className={(isActive) => `nav-link ${isActive ? "active" : ""}`}
            exact
          >
            Ana Sayfa
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            to={"/tests"}
            className={(isActive) => `nav-link ${isActive ? "active" : ""}`}
            exact
          >
            Tests
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  );
};

export default SideBar;
