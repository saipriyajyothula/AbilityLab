import React, { Component } from "react";
import { Grid, Row, Col , DropdownButton, MenuItem } from "react-bootstrap";
import Websocket from 'react-websocket';

import Card from "components/Card/Card.jsx";
var title = "title";
var i = 1;

class CurrentApplication extends Component{



  render() {

    return (
      <div className="content">

      <Grid fluid>
      <Row>
      <Col md={12}>
      <Card
      title="Select Session"
      
      ctTableResponsive
      content={
        <DropdownButton
      bsStyle={title.toLowerCase()}
      title={title}
      key={i}
      id={`dropdown-basic-${i}`}
    >
      <MenuItem eventKey="1">Action</MenuItem>
      <MenuItem eventKey="2">Another action</MenuItem>
      <MenuItem eventKey="3" active>
        Active Item
      </MenuItem>
      <MenuItem divider />
      <MenuItem eventKey="4">Separated link</MenuItem>
    </DropdownButton>

      }
      />
      </Col>

      </Row>
      </Grid>
      </div>
    );
  }
}
export default CurrentApplication;
