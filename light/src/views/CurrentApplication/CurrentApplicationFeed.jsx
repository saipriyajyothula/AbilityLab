import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";

import Card from "components/Card/Card.jsx";
var ZingChart = require('zingchart-react').core;
var myValues3 = [
  { text : "First Series", values : [ [5,2], [8,1], [2,6], [9,1] ] },
  { text : "Second Series", values : [ [8,3], [2,8], [6,9], [3,5] ] },
  { text : "Third Series", values : [ [18,3], [22,8], [16,9], [13,5] ] },
  { text : "Fourth Series", values : [ [18,3], [12,8], [26,9], [32,5] ] },
];
var i = 0;
window.feed1 = function(callback) {
  fetch('/api/soccerPenalty/current/catch', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  .then((response) => response.json())
  .then((result) => {
    console.log(result);
    var tick = {};
    if(result.catches.length > i){
      tick.plot0 = result.catches[i];
      tick.plot1 =[0,0,0];
    }else{
      tick.plot0 =[0 ,0,0];
    }



    i++;
    console.log(JSON.stringify(tick));
    callback(JSON.stringify(tick));
  });



};

window.feed2 = function(callback) {
  fetch('/api/soccerPenalty/current/catch', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  .then((response) => response.json())
  .then((result) => {
    console.log(result);
    var tick = {};


    if(result.goals.length > i){
      tick.plot1 = result.goals[i];
      tick.plot0 =[0,0,0];
    }else{
      tick.plot1 =[0,0,0];
    }

    i++;
    console.log(JSON.stringify(tick));
    callback(JSON.stringify(tick));
  });



};


var bubbleChart = {
  "type": "bubble",
  "refresh":{
    "type":"feed",
    "transport":"js",
    "url":"feed1()",
    "interval":1000,
    "adjustScale":true
  },
  "refresh":{
    "type":"feed",
    "transport":"js",
    "url":"feed2()",
    "interval":1000,
    "adjustScale":true
  },
  "plot":{
    "animation":{
        "effect":"ANIMATION_FADE_IN"
    }
  },
  "series": [
    {
        "values": [],
        "marker":{  //Apply marker styling locally.
          "background-color":"#4cdb2b", /* hexadecimal or RGB value */
          "border-color":"#bcffad",
          "border-width":2, /* in pixels */
          "alpha":0.7
        }

    },
    {
        "values": [],
        "marker":{  //Apply marker styling locally.
          "background-color":"#ff002e", /* hexadecimal or RGB value */
          "border-color":"#ff5a51",
          "border-width":2, /* in pixels */
          "alpha":0.7
        }
    }

    ]

};





class CurrentApplication extends Component{
  state = {result:[], bubbleChart:[]};


  render() {
    console.log(this.state.bubbleChart);
    return (
      <div className="content">
      <Grid fluid>
      <Row>
      <Col md={12}>
      <Card
      title="Application In Use"
      category="Soccer Penalty"
      ctTableFullWidth
      ctTableResponsive
      content={
        <ZingChart id="chart1" width="100%" data= {bubbleChart}/>
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
