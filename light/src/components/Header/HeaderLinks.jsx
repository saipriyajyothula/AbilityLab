import React, { Component } from "react";
import { NavItem, Nav, NavDropdown, MenuItem } from "react-bootstrap";

class HeaderLinks extends Component {
  render() {

    return (
      <div>
        <Nav>
          <NavItem eventKey={1} href="?#/dashboard">
            <i className="fa fa-dashboard" />
            <p className="hidden-lg hidden-md">Dashboard</p>
          </NavItem>
        </Nav>

      </div>
    );
  }
}

export default HeaderLinks;
