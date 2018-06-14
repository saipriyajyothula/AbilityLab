import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import Websocket from 'react-websocket';

import Card from "components/Card/Card.jsx";
var zingchart = require('zingchart');
//var ZingChart = require('zingchart-react').core;
var $ = require("jquery");

class ZingChart extends Component{
    render(){
        return (
            <div id={this.props.id}></div>
        );
    }
    //Called after the render function.
    componentDidMount(){  
        zingchart.render({
            id : this.props.id,
            width: (this.props.width || 600),
            height: (this.props.height || 400),
            data : this.props.data
        });
        zingchart.click = function(p) {
          console.log('click', p);
        }
    }
    //Used to check the values being passed in to avoid unnecessary changes.
    shouldComponentUpdate = function(nextProps, nextState){
        //Lazy object comparison
        return !(JSON.stringify(nextProps.data) === JSON.stringify(this.props.data)) ;
    }
    componentWillUpdate = function(nextProps){
        zingchart.exec(this.props.id, 'setdata', {
            data : nextProps.data
        })
    }
}

class CurrentApplication extends Component{
  state = {bubbleChart:[]};

  handleData(data) {
    let result = JSON.parse(data);
    this.setState({bubbleChart:{
      "type": "bubble",
      "scale-x": {
        "values": "0:4.5:0.25",
        "label": {
          "text": "X - Position"
        }
      },
      "scale-y": {
        "values": "0:2:0.25",
        "label": {
          "text": "Height"
        }
      },
      "plotarea":{
        "background-image" : "human.png",
        "background-fit" : "y",
        "background-repeat" : "no-repeat"
      },

      "series": [
        {
          "values":result.catches,
          "marker":{  //Apply marker styling locally.
            "background-color":"#4cdb2b", /* hexadecimal or RGB value */
            "border-color":"#bcffad",
            "border-width":2, /* in pixels */
            "alpha":0.7
          },
          "tooltip":{
            "text":"Ball Saved:<br>X-axis: %scale-key-value<br>Height: %node-value<br>Speed: %node-size-value",
            "font-color":"white",
            "font-family":"Arial, sanfserif",
            "border-radius": "6px",
            "border-width":2
          }
        },
        {
          "values":result.goals,
          "marker":{  //Apply marker styling locally.
            "background-color":"#ff002e", /* hexadecimal or RGB value */
            "border-color":"#ff5a51",
            "border-width":2, /* in pixels */
            "alpha":0.7
          },
          "tooltip":{
            "text":"Ball Missed:<br>X-axis: %scale-key-value<br>Height: %node-value<br>Speed: %node-size-value",
            "font-color":"white",
            "font-family":"Arial, sanfserif",
            "border-radius": "6px",
            "border-width":2
          }
        }
      ]
    } });

  }

  render() {
    console.log(this.state.bubbleChart);
    return (
      <div className="content">
      <Websocket
      url={`ws://${window.location.host}/socket/websocket`}
      onMessage={this.handleData.bind(this)}
      />
      <Grid fluid>
      <Row>
      <Col md={12}>
      <Card
      title="Application In Use"
      category="Soccer Penalty"
      ctTableFullWidth
      ctTableResponsive
      content={
        <ZingChart id="chart1"
        height="500px"
        width="100%"
        data= {this.state.bubbleChart} />
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