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

var bubbleChart = {
  "type": "bubble",
  "series": [
    {
      "values": [
        [1,9,59],
        [2,15,15],
        [3,21,30],
        [4,30,5],
        [5,40,35],
        [6,59,21],
        [7,60,25],
        [8,75,85],
        [9,81,87],
        [10,99,12]
      ]
    },
    {
      "values": [
        [0.9,3,18],
        [2.1,13,21],
        [3.5,25,33],
        [4.9,35,54],
        [5.3,41,59],
        [6.5,57,34],
        [7.1,61,17],
        [8.7,70,3],
        [9.2,82,28],
        [9.9,95,76]
      ]
    }
  ]
}




class CurrentApplication extends Component{
  state = {result:[], bubbleChart:[]};

  componentDidMount(){
    this.interval = setInterval( () => {

      fetch('/api/soccerPenalty/current/catch', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((result) => {
        this.setState({bubbleChart:{
          "type": "bubble",
          
          "series": [
            {
              "values":result.catches,
              "marker":{  //Apply marker styling locally.
                "background-color":"#4cdb2b", /* hexadecimal or RGB value */
                "border-color":"#bcffad",
                "border-width":2, /* in pixels */
                "alpha":0.7
              }
            },
            {
              "values":result.goals,
              "marker":{  //Apply marker styling locally.
                "background-color":"#ff002e", /* hexadecimal or RGB value */
                "border-color":"#ff5a51",
                "border-width":2, /* in pixels */
                "alpha":0.7
              }
            }
          ]
        } });
      });
    },1000)

  };
  componentWillUnmount() {
    clearInterval(this.interval);
  }




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
        <ZingChart id="chart1" width="100%" data= {this.state.bubbleChart}/>
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
