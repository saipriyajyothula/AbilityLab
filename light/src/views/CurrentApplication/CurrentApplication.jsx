import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import Websocket from 'react-websocket';

import Card from "components/Card/Card.jsx";

import {ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, Label} from "recharts";

//import $ from "jquery";

var chartstatus = 'up';

var chartFlag = false;

var chartPoint = {x1: 0, y1: 0, x2: 0, y2: 0};

class CurrentApplication extends Component{
//  state = {bubbleChart:{catches: [{x: 0, h: 2, s: 200}, {x: 0.38, h: 1, s: 260}, {x: 2.4792, h: 1.3, s: 400}, {x: 3.56, h: 1.25, s: 280}, {x: 1.34, h: 0.5, s: 500}, {x: 4, h: 1.8, s: 200}], goals: [{x: 3.5, h: 0.6, s: 240}, {x: 1.5, h: 0.9, s: 220}, {x: 0.5, h: 1.4, s: 250}, {x: 2.5, h: 0.5, s: 210}, {x: 2.9, h: 1.6, s: 260}, {x: 1.2, h: 0.4, s: 230}]}, event: {status: 'up', x: 0, y: 0}, styles: {position: 'fixed', top: 0, left: 0, width: 0, height: 0}};
    state = {bubbleChart:{catches: [], goals: []}, event: {status: 'up', x: 0, y: 0}, styles: {position: 'fixed', top: 0, left: 0, width: 0, height: 0}};

    handleMouseDown(e){
        chartstatus = 'down';
        chartFlag = false;
        if(e!=null){
            chartPoint.x1 = e.xValue;
            chartPoint.y1 = e.yValue;
        }
        else{
            chartPoint.x1 = 'not set';
        }
    }

    handleMouseMove(e){
        if(chartstatus == 'down'||chartstatus == 'down move'){
            if(e!=null){
                if(chartPoint.x1=='not set'){
                    chartPoint.x1 = e.xValue;
                    chartPoint.y1 = e.yValue;
                }
                chartPoint.x2 = e.xValue;
                chartPoint.y2 = e.yValue;
            }
            chartstatus = 'down move';
        }
    }
    
    handleMouseUp(e){
        if(chartstatus=='down move'){
            chartFlag = true;
        }
        else if(chartstatus=='down'){
            chartFlag = true;
            chartPoint = {x1: 0, y1: 0, x2: 0, y2: 0};
        }
        chartstatus = 'up';
    }

    handleDivMouseDown(e){
        var status = this.state.event.status;
        if(status=='up'){
//            console.log(e.nativeEvent);
            this.setState({event: {status: 'down', x: e.nativeEvent.clientX, y: e.nativeEvent.clientY}});
        }
    }

    handleDivMouseMove(e){
        var status = this.state.event.status;
        if(status == 'down'||status == 'down move'){
//            console.log(e.nativeEvent);
            var tempevent = this.state.event;
            var tempwidth = e.nativeEvent.clientX-tempevent.x;
            var tempheight = e.nativeEvent.clientY-tempevent.y;
            var templeft = tempevent.x;
            var temptop = tempevent.y;
            if(tempwidth<0){
                tempwidth = Math.abs(tempwidth);
                templeft = e.nativeEvent.clientX;
            }
            if(tempheight<0){
                tempheight = Math.abs(tempheight);
                temptop = e.nativeEvent.clientY;
            }
            this.setState({styles: {position: 'fixed', width: tempwidth, height: tempheight, border: "1px solid #aaa", opacity: 0.5, background: "#ddd", left: templeft, top: temptop}, event: {status: 'down move', x: tempevent.x, y: tempevent.y}});
        }
    }

    handleDivMouseUp(e){
        if(this.state.event.status=='down'){
            this.setState({event: {status: 'up', x: 0, y: 0}, styles: {position: 'fixed', top: 0, left: 0, width: 0, height: 0}});
        }
        else{
            this.setState({event: {status: 'up', x: 0, y: 0}});
            chartstatus = 'up';
            chartFlag = true;
        }
//        console.log(chartPoint);
        fetch('/api/soccerPenalty/setChartRect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(chartPoint),
          })
          .then((response) => {
//              console.log(response);
          })
          .catch(error => console.error('Error:', error));
    }

  handleData(data) {
    let result = JSON.parse(data);
//    console.log(result);
    this.setState({bubbleChart: {catches: result.catches, goals: result.goals}});
  }

  render() {
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
                  <div className='mouseArea' onMouseDown={this.handleDivMouseDown.bind(this)} onMouseMove={this.handleDivMouseMove.bind(this)} onMouseUp={this.handleDivMouseUp.bind(this)}>
            <ResponsiveContainer width="100%" height={500} className="chartContainer">
            <ScatterChart margin={{top: 20, right: 20, bottom: 20, left: 0}} onMouseDown={this.handleMouseDown.bind(this)} onMouseUp={this.handleMouseUp.bind(this)} onMouseMove={this.handleMouseMove.bind(this)}>
                <XAxis type="number" dataKey={'x'} name='X-Position' domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]}>
                <Label value="X-Position" position="insideBottom"/>
                </XAxis>
                <YAxis type="number" domain={[0, 2]} ticks={[0, 0.5, 1, 1.5, 2]} dataKey={'h'} name='Height'>
                <Label value="Height" angle={-90} offset={25} position="insideLeft"/>
                </YAxis>
                <ZAxis dataKey={'s'} range={[100, 800]} name='Speed'/>
                <CartesianGrid />
                <Tooltip cursor={{strokeDasharray: '3 3'}}/>
                <Legend align='right'/>
                <Scatter name='Save' data={this.state.bubbleChart.catches} fill='#4cdb2b' opacity= {0.7}/>
                <Scatter name='Miss' data={this.state.bubbleChart.goals} fill='#ff002e' opacity={0.7}/>
            </ScatterChart>
            </ResponsiveContainer>
                  <div id="trackDiv" style={this.state.styles}></div></div>
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