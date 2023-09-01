import { NavLink } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";

const activeNavLink = {
  backgroundColor: "#fffff !important",
  color: "rgb(13,110,253) !important",
};

const SideBar = () => {
  return (
    <div className="side-bar">
      <Nav vertical>
        <NavItem>
          <NavLink
            to={"/"}
            className={(isActive) => `nav-link ${isActive ? "active" : ""}`}
            exact
          >
            A<span className="hide-on-mouseout">na Sayfa</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            to={"/tests"}
            className={(isActive) => `nav-link ${isActive ? "active" : ""}`}
            exact
          >
            T<span className="hide-on-mouseout">ests</span>
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  );
};

export default SideBar;
