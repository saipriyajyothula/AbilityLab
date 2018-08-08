import React, { Component } from "react";
import { Grid, Row, Col, DropdownButton, MenuItem, FormGroup, ControlLabel, FormControl} from "react-bootstrap";
import Websocket from 'react-websocket';

import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";
import Radio from "components/CustomRadio/CustomRadio.jsx";
import Slider from "components/CustomSlider/CustomSlider.jsx";

import {ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, Label, LabelList} from "recharts";

//import $ from "jquery";

var chartstatus = 'up';

var chartFlag = false;

var chartPoint = {x1: 0, y1: 0, x2: 0, y2: 0};

var availableGames = ['SoccerPenalty', 'Bridge'];

class CustomTooltip extends Component{
  propTypes: {
    type: PropTypes.string,
    payload: PropTypes.array,
    label: PropTypes.string,
  }

  getIntroOfPage(payload) {
      return payload[0].payload.name;
  }

  render() {
    const { active } = this.props;

    if (active) {
      const { payload, label } = this.props;
      return (
        <div className="custom-tooltip">
          <p>{this.getIntroOfPage(payload)}</p>
        </div>
      );
    }

    return null;
  }
}


class CurrentApplication extends Component{
//  state = {bubbleChart:{catches: [{x: 0, h: 2, s: 200}, {x: 0.38, h: 1, s: 260}, {x: 2.4792, h: 1.3, s: 400}, {x: 3.56, h: 1.25, s: 280}, {x: 1.34, h: 0.5, s: 500}, {x: 4, h: 1.8, s: 200}], goals: [{x: 3.5, h: 0.6, s: 240}, {x: 1.5, h: 0.9, s: 220}, {x: 0.5, h: 1.4, s: 250}, {x: 2.5, h: 0.5, s: 210}, {x: 2.9, h: 1.6, s: 260}, {x: 1.2, h: 0.4, s: 230}]}, event: {status: 'up', x: 0, y: 0}, styles: {position: 'fixed', top: 0, left: 0, width: 0, height: 0}};
    state = {bubbleChart:{catches: [], goals: []}, event: {status: 'up', x: 0, y: 0}, styles: {position: 'fixed', top: 0, left: 0, width: 0, height: 0}, currentPatient: {PatientId: '', FirstName: 'Select patient name', LastName: ''}, currentGame: 'Select game', startMenu: 'visible', level: 3, adaptiveDifficulty: true, difficulty: 1, shootDistance: 4, ballSpeed: 15, maxHeight: 0.5, soccerPaused: true, soccerGameControls: 'hidden', bridgeGameControls: 'visible', volume: 100, customMenu: 'hidden', timeWarp: false, wheelchairMode: false, bridgeStats: {playerDamage: [{x: 2, y: 1.25, z: 1, value: 0, name: "Player Damage"}], dragonDamage: [{x: 3.3, y: 1.75, z: 1, value: 0, name: "Dragon Damage"}], dodges: [{x: 3.8, y: 1.75, z: 1, value: 0, name: "Dodges"}], leftShield: {miss: [{x: 0.3, y: 1.2, z: 1, value: 0, name: "Left Shield Dragon Hits"}], hit: [{x: 1.05, y: 1.05, z: 1, value: 0, name: "Left Shield Blocks"}]}, rightShield: {miss: [{x: 2.95, y: 1.05, z: 1, value: 0, name: "Right Shield Dragon Hits"}], hit: [{x: 3.7, y: 1.2, z: 1, value: 0, name: "Right Shield Blocks"}]}, leftFoot: {miss: [{x: 1, y: 0.2, z: 1, value: 0, name: "Left Foot Misses"}], hit: [{x: 0.5, y: 0.2, z: 1, value: 0, name: "Left Foot Hits"}]}, rightFoot: {miss: [{x: 3.5, y: 0.2, z: 1, value: 0, name: "Right Foot Misses"}], hit: [{x: 3, y: 0.2, z: 1, value: 0, name: "Right Foot Hits"}]}}, dragonControl: 1, locationControl: 1, oppositeControl: 0, clockwiseControl: 0, dragonDifficulty: 1, showTrajectory: true, easyPickup: true, widthStep: 25, greenWidth: 3, grayWidth: 3, bridgeWidth: 6, stepsWidth: 4};

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
      if(result.GameId=="soccerPenalty"){
          if(result.message=="updateScore"){
              this.setState({bubbleChart: {catches: result.data.catches, goals: result.data.goals}});
          }
          else if(result.message=="updateLevel"){
              this.setState({level: result.level, difficulty: result.difficulty});
          }
          else if(result.message=="updatePlayPause"){
              this.setState({soccerPaused: result.isPaused});
              console.log("soccerPaused", result.isPaused);
          }
          else if(result.message=="killed"){
              this.setState({startMenu: "visible", soccerGameControls: "hidden"});
          }
      }
      else if(result.GameId=="bridge"){
          if(result.message=="updatePlayerStatistics"){
              const bridgeStats = this.state.bridgeStats;
              bridgeStats.playerDamage[0].value = result.data.playerDamage;
              bridgeStats.dragonDamage[0].value = result.data.dragonDamage;
              bridgeStats.dodges[0].value = result.data.dodges;
              bridgeStats.leftShield.miss[0].value = result.data.leftShieldReflects;
              bridgeStats.leftShield.hit[0].value = result.data.leftShieldHits;
              bridgeStats.rightShield.miss[0].value = result.data.rightShieldReflects;
              bridgeStats.rightShield.hit[0].value = result.data.rightShieldHits;
              bridgeStats.leftFoot.hit[0].value = result.data.leftFootHits;
              bridgeStats.leftFoot.miss[0].value = result.data.leftFootMisses;
              bridgeStats.rightFoot.hit[0].value = result.data.rightFootHits;
              bridgeStats.rightFoot.miss[0].value = result.data.rightFootMisses;
              this.setState({bridgeStats: bridgeStats});
          }
          else if(result.message=="killed"){
              this.setState({startMenu: "visible", bridgeGameControls: "hidden"});
          }
      }
  }
    
  createDropDown(title, i, data){
        let menulist = [];
        if(data=='patients'){
            if(this.state.hasOwnProperty("patients")){
                data = this.state.patients;
            }
            else{
                data = [];
            }
            for(var j=0; j<data.length; j++){
                menulist.push(<MenuItem key={data[j].PatientId} eventKey={data[j]}>{data[j].FirstName + " " + data[j].LastName}</MenuItem>);
            }
            return (
                <DropdownButton  
                    title={this.state.currentPatient.FirstName + " " + this.state.currentPatient.LastName}
                    key={i}
                    id={`dropdown-basic-${i}`} onSelect={this.dropSelect.bind(this)}>
                    {menulist}
                </DropdownButton>);
        }
        else if(data=='games'){
            data = availableGames;
            for(var j=0; j<data.length; j++){
                menulist.push(<MenuItem key={data[j]} eventKey={{'selectedGame': data[j]}}>{data[j]}</MenuItem>);
            }
            return (
                <DropdownButton  
                    title={this.state.currentGame}
                    key={i}
                    id={`dropdown-basic-${i}`} onSelect={this.dropSelect.bind(this)}>
                    {menulist}
                </DropdownButton>);
        }
        else{
            for(var j=0; j<data.length; j++){
                menulist.push(<MenuItem key={data[j]} eventKey={data[j]}>{data[j]}</MenuItem>);
            }
            return (
                <DropdownButton  
                    title={title}
                    key={i}
                    id={`dropdown-basic-${i}`} onSelect={this.dropSelect.bind(this)}>
                    {menulist}
                </DropdownButton>);
        }
        
    }

    dropSelect(e, evt){
        if(e.hasOwnProperty('PatientId')){
            this.setState({currentPatient: e});
        }
        else if(e.hasOwnProperty('selectedGame')){
            this.setState({currentGame: (e.selectedGame)});
        }
        else{
            console.log(e);
        }
//        console.log(evt.target);
    }

    launchGame(){
        if((this.state.currentGame!= 'Select game')&&(this.state.currentPatient!= 'Select patient name')){
            fetch('/api/soccerPenalty/launchApplication', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({currentGame: this.state.currentGame, currentPatient: this.state.currentPatient.PatientId}),
              })
              .then((response) => {
              })
              .catch(error => console.error('Error:', error));
            if(this.state.currentGame.toLowerCase()=="soccerpenalty"){
                this.setState({startMenu: 'hidden', soccerGameControls: 'visible'});
            }
            else if(this.state.currentGame.toLowerCase()=="bridge"){
                this.setState({startMenu: 'hidden', bridgeGameControls: 'visible'});
            }
        }
        else{
            console.log('error');
        }
    }

    quitGame(){
        fetch('/api/soccerPenalty/killApplication', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({currentGame: this.state.currentGame, currentPatient: this.state.currentPatient.PatientId}),
          })
          .then((response) => {
          })
          .catch(error => console.error('Error:', error));
        if(this.state.currentGame.toLowerCase()=="soccerpenalty"){
            this.setState({startMenu: 'visible', soccerGameControls: 'hidden'});
        }
        else if(this.state.currentGame.toLowerCase()=="bridge"){
            this.setState({startMenu: 'visible', bridgeGameControls: 'hidden'});
        }
        
    }

    setPaused(){
        const paused = this.state.soccerPaused;
        this.setState({soccerPaused: !paused});
        fetch('/api/soccerPenalty/current/setPaused', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({value: !paused}),
          })
          .then((response) => {
          })
          .catch(error => console.error('Error:', error));
    }

    handleLevelChange(e){
        const level = parseInt(e.target.value);
        if(level>=0 && level<=10){
            this.setState({ level: e.target.value });
            fetch('/api/soccerPenalty/current/setLevel', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({value: level}),
              })
              .then((response) => {
              })
              .catch(error => console.error('Error:', error));
        }
    }

    changeAdaptiveDifficulty(){
        const ad = this.state.adaptiveDifficulty;
        this.setState({adaptiveDifficulty: !ad});
        if(!ad){
            this.setState({customMenu: 'hidden'});
        }
        else{
            if(this.state.difficulty==3){
                this.setState({customMenu: 'visible'});
            }
        }
        fetch('/api/soccerPenalty/current/setAdaptiveDifficulty', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({value: !ad}),
          })
          .then((response) => {
          })
          .catch(error => console.error('Error:', error));
        
    }

    handleDifficultyChange(e){
        const difficulty = e.target.value;
        if(this.state.difficulty!=difficulty){
            if(difficulty==3){
                this.setState({customMenu: 'visible'});
            }
            else{
                this.setState({customMenu: 'hidden'});
            }
            this.setState({ difficulty: difficulty});
            fetch('/api/soccerPenalty/current/setDifficultyLevel', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({value: difficulty}),
              })
              .then((response) => {
              })
              .catch(error => console.error('Error:', error));
        }
    }

    handleDragonControl(e){
        const dragonControl = e.target.value;
        if(this.state.dragonControl!=dragonControl){
            this.setState({ dragonControl: dragonControl});
            fetch('/api/bridge/current/DragonMovement', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({value: dragonControl}),
              })
              .then((response) => {
              })
              .catch(error => console.error('Error:', error));
        }
    }

        handleLocationControl(e){
        const locationControl = e.target.value;
        if(this.state.locationControl!=locationControl){
            this.setState({ locationControl: locationControl});
            fetch('/api/bridge/current/DragonPosition', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({value: locationControl}),
              })
              .then((response) => {
              })
              .catch(error => console.error('Error:', error));
        }
    }

        handleOppositeControl(e){
        const oppositeControl = e.target.value;
        if(this.state.oppositeControl!=oppositeControl){
            this.setState({ oppositeControl: oppositeControl});
            fetch('/api/bridge/current/ByPositionOrientation', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({value: oppositeControl}),
              })
              .then((response) => {
              })
              .catch(error => console.error('Error:', error));
        }
    }

        handleClockwiseControl(e){
        const clockwiseControl = e.target.value;
        if(this.state.clockwiseControl!=clockwiseControl){
            this.setState({ clockwiseControl: clockwiseControl});
            fetch('/api/bridge/current/OnHitDirection', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({value: clockwiseControl}),
              })
              .then((response) => {
              })
              .catch(error => console.error('Error:', error));
        }
    }

    handleDragonDifficulty(e){
        const dragonDifficulty = e.target.value;
        if(this.state.dragonDifficulty!=dragonDifficulty){
            this.setState({ dragonDifficulty: dragonDifficulty});
            fetch('/api/bridge/current/DragonDifficulty', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({value: dragonDifficulty}),
              })
              .then((response) => {
              })
              .catch(error => console.error('Error:', error));
        }
    }
    
        changeTrajectory(){
        const st = this.state.showTrajectory;
        this.setState({showTrajectory: !st});
        fetch('/api/bridge/current/TrajectorySetting', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({value: !st}),
          })
          .then((response) => {
          })
          .catch(error => console.error('Error:', error));
        
    }

        changePickup(){
        const pickup = this.state.easyPickup;
        this.setState({easyPickup: !pickup});
        fetch('/api/bridge/current/EasyShieldMode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({value: !pickup}),
          })
          .then((response) => {
          })
          .catch(error => console.error('Error:', error));
        
    }

     changeShootDistance(e){
         const sd = this.state.shootDistance;
         this.setState({ shootDistance: e.target.value});
         fetch('/api/soccerPenalty/current/setShootDistance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({value: sd}),
          })
          .then((response) => {
          })
          .catch(error => console.error('Error:', error));
        
    }
    
    changeBallSpeed(e){
         const bs = this.state.ballSpeed;
         this.setState({ ballSpeed: e.target.value});
         fetch('/api/soccerPenalty/current/setBallSpeed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({value: bs}),
          })
          .then((response) => {
          })
          .catch(error => console.error('Error:', error));
        
    }
    
    changeMaxHeight(e){
         const mh = this.state.maxHeight;
         this.setState({ maxHeight: e.target.value});
         fetch('/api/soccerPenalty/current/setMaximumHeight', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({value: mh}),
          })
          .then((response) => {
          })
          .catch(error => console.error('Error:', error));
        
    }

    changeVolume(e){
         const v = this.state.volume;
         this.setState({ volume: e.target.value});
         fetch('/api/soccerPenalty/current/setVolume', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({value: v}),
          })
          .then((response) => {
          })
          .catch(error => console.error('Error:', error));
        
    }

    changeWheelchairMode(){
        const wc = this.state.wheelchairMode;
        this.setState({wheelchairMode: !wc});
        fetch('/api/soccerPenalty/current/setWheelchairMode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({value: !wc}),
          })
          .then((response) => {
          })
          .catch(error => console.error('Error:', error));
        
    }

    changeTimeWarp(){
        const tw = this.state.timeWarp;
        this.setState({timeWarp: !tw});
        fetch('/api/soccerPenalty/current/setTimeWarpMode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({value: !tw}),
          })
          .then((response) => {
          })
          .catch(error => console.error('Error:', error));
        
    }

    increaseGreenWidth(){
        const greenWidth = this.state.greenWidth;
        if(greenWidth<7){
            this.setState({greenWidth: (greenWidth+1)});
        }
        fetch('/api/bridge/current/PlatformsWidth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({woodBridge: this.state.bridgeWidth, stoneBridge: this.state.stepsWidth, platform1: this.state.grayWidth, platform2: greenWidth}),
          })
          .then((response) => {
          })
          .catch(error => console.error('Error:', error));
    }

    decreaseGreenWidth(){
        const greenWidth = this.state.greenWidth;
        if(greenWidth>1){
            this.setState({greenWidth: (greenWidth-1)});
        }
        fetch('/api/bridge/current/PlatformsWidth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({woodBridge: this.state.bridgeWidth, stoneBridge: this.state.stepsWidth, platform1: this.state.grayWidth, platform2: greenWidth}),
          })
          .then((response) => {
          })
          .catch(error => console.error('Error:', error));
    }
    
  componentDidMount(){
    
    fetch('/api/currentApplication', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((data) => {
      if(data.isAppRunning){
          if(data.GameId=="soccerPenalty"){
            this.setState({soccerGameControls: 'visible', startMenu: 'hidden', currentGame: "SoccerPenalty"});
          }
          else if(data.GameId=="bridge"){
            this.setState({bridgeGameControls: 'visible', startMenu: 'hidden', currentGame: "Bridge"});
          }
      }
    });  
      
    fetch('/patients', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((patients) => {
      this.setState({patients: patients});
    });
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
      display={this.state.startMenu}
      title="Start Menu"
      ctTableResponsive
      content={   
            <form>
                      <Row>
                          <Col md={3}>
                              {this.createDropDown('Select patient name', 1, 'patients')}
                          </Col>
                          <Col md={3}>
                              {this.createDropDown('Select game', 2, 'games')}
                          </Col>
                          <Col md={2}>
                              <Button bsStyle="info" fill onClick={this.launchGame.bind(this)}>
                                  Launch game
                              </Button>
                          </Col>
                      </Row>
                 
            </form>
      }
      />
      </Col>
      </Row>
          
      <Row>
      <Col md={12}>
      <Card
      title="Application In Use"
      category="Soccer Penalty"
      display={this.state.soccerGameControls}
      ctTableFullWidth
      ctTableResponsive
      content={
                  <div className='mouseArea' onMouseDown={this.handleDivMouseDown.bind(this)} onMouseMove={this.handleDivMouseMove.bind(this)} onMouseUp={this.handleDivMouseUp.bind(this)}>
            <ResponsiveContainer width="100%" height={500} className="chartContainer">
            <ScatterChart margin={{top: 20, right: 20, bottom: 20, left: 0}} onMouseDown={this.handleMouseDown.bind(this)} onMouseUp={this.handleMouseUp.bind(this)} onMouseMove={this.handleMouseMove.bind(this)}>
                <XAxis type="number" dataKey={'x'} name='X-Position' domain={[0, 4]} ticks={[0, 1, 2, 3, 4]}>
                <Label value="X-Position" offset={-5} position="insideBottom"/>
                <Label value="Player's left" offset={-5} position="insideBottomLeft"/>
                <Label value="Player's right" offset={-5} position="insideBottomRight"/>
                </XAxis>
                <YAxis type="number" domain={[0, 2]} ticks={[0, 0.5, 1, 1.5, 2]} dataKey={'h'} name='Height'>
                <Label value="Height" angle={-90} offset={25} position="insideLeft"/>
                </YAxis>
                <ZAxis dataKey={'s'} range={[100, 800]} name='Speed'/>
                <CartesianGrid />
                <Tooltip cursor={{strokeDasharray: '3 3'}}/>
                <Legend align='right' verticalAlign='top' height={25}/>
                <Scatter name='Save' data={this.state.bubbleChart.catches} fill='#4cdb2b' opacity= {0.7}/>
                <Scatter name='Miss' data={this.state.bubbleChart.goals} fill='#ff002e' opacity={0.7}/>
            </ScatterChart>
            </ResponsiveContainer>
                  <div id="trackDiv" style={this.state.styles}></div></div>
      }
      />
      </Col>

      <Col md={12}>
      <Card
      title="Application In Use"
      category="Bridge"
      display={this.state.bridgeGameControls}
      ctTableResponsive
      content={
                  <Row>
                  <Col md={8}>
                      <Card
                          title="Top View"
                          ctTableResponsive
                          content={
                              <div className="top-view">
                                          <div className="green-width">
                                              <Row>
                                                  <Col md={5}>
                                                  </Col>
                                                  <Col md={3}>
                                                  <Button className="increment-button" bsStyle="info" onClick={this.decreaseGreenWidth.bind(this)}>
                                                      -
                                                  </Button>
                                                  {" "+this.state.greenWidth+" "}
                                                  <Button className="increment-button" bsStyle="info" onClick={this.increaseGreenWidth.bind(this)}>
                                                      +
                                                  </Button>
                                                  </Col>
                                                  <Col md={4}>
                                                  </Col>
                                              </Row>
                                          </div>
                                          <div className="green-side" style={{height: this.state.widthStep*this.state.greenWidth+"px"}}>
                                          </div>
                                          <div className="bridge">
                                          </div>
                                          <div className="steps">
                                              <div className="right-steps">
                                              </div>
                                              <div className="left-steps">
                                              </div>
                                              <div className="right-steps">
                                              </div>
                                              <div className="left-steps">
                                              </div>
                                          </div>
                                      
                                          <div className="gray-side">
                                          </div>
                                      
                              </div>
                          }
                        />
                  </Col>
                  <Col md={4}>
                      <Card
                          title="Player Statistics"
                          ctTableResponsive
                          content={
                              <div>
                                  <ResponsiveContainer width="100%" height={500} className="statContainer">
                                    <ScatterChart margin={{top: 20, right: 20, bottom: 20, left: 0}}>
                                        <XAxis type="number" dataKey={'x'} domain={[0, 4]} hide={true}>
                                        </XAxis>
                                        <YAxis type="number" domain={[0, 2]} dataKey={'y'} hide={true}>
                                        </YAxis>
                                        <ZAxis dataKey={'z'} range={[500, 500]} hide={true}/>
                                        <Tooltip cursor={false} content={<CustomTooltip/>}/>
                                        <Scatter data={this.state.bridgeStats.playerDamage} fill='#ff002e' opacity= {0.7}>
                                            <LabelList dataKey="value" position="inside" fill ="#fff"/>
                                        </Scatter>
                                        <Scatter data={this.state.bridgeStats.dodges} fill='#ba2bdb' opacity= {0.7}>
                                            <LabelList dataKey="value" position="inside" fill ="#fff"/>
                                        </Scatter>
                                        <Scatter data={this.state.bridgeStats.dragonDamage} fill='#db622b' opacity= {0.7}>
                                            <LabelList dataKey="value" position="inside" fill ="#fff"/>
                                        </Scatter>
                                        <Scatter data={this.state.bridgeStats.rightShield.miss} fill='#4cdb2b' opacity= {0.7}>
                                            <LabelList dataKey="value" position="inside" fill ="#fff"/>
                                        </Scatter>
                                        <Scatter data={this.state.bridgeStats.rightShield.hit} fill='#2b4cdb' opacity= {0.7}>
                                            <LabelList dataKey="value" position="inside" fill ="#fff"/>
                                        </Scatter>
                                        <Scatter data={this.state.bridgeStats.leftShield.miss} fill='#4cdb2b' opacity= {0.7}>
                                            <LabelList dataKey="value" position="inside" fill ="#fff"/>
                                        </Scatter>
                                        <Scatter data={this.state.bridgeStats.leftShield.hit} fill='#2b4cdb' opacity= {0.7}>
                                            <LabelList dataKey="value" position="inside" fill ="#fff"/>
                                        </Scatter>
                                        <Scatter data={this.state.bridgeStats.rightFoot.hit} fill='#4cdb2b' opacity= {0.7}>
                                            <LabelList dataKey="value" position="inside" fill ="#fff"/>
                                        </Scatter>
                                        <Scatter data={this.state.bridgeStats.rightFoot.miss} fill='#ff002e' opacity= {0.7}>
                                            <LabelList dataKey="value" position="inside" fill ="#fff"/>
                                        </Scatter>
                                        <Scatter data={this.state.bridgeStats.leftFoot.hit} fill='#4cdb2b' opacity= {0.7}>
                                            <LabelList dataKey="value" position="inside" fill ="#fff"/>
                                        </Scatter>
                                        <Scatter data={this.state.bridgeStats.leftFoot.miss} fill='#ff002e' opacity= {0.7}>
                                            <LabelList dataKey="value" position="inside" fill ="#fff"/>
                                        </Scatter>
                                    </ScatterChart>
                                  </ResponsiveContainer>
                              </div>
                          }
                        />                      
                  </Col>
              </Row>
      }
      />
      </Col>  
          
      </Row>
          
      <Row>
      <Col md={12}>
      <Card
      title="Game Controls"
      display={this.state.soccerGameControls}
      ctTableResponsive
      content={
          <form>
              <Row>
                  <Col md={6}>
                      <Button bsStyle="info" fill onClick={this.setPaused.bind(this)}>
                          {this.state.soccerPaused?"Play":"Pause"}
                      </Button>
                  </Col>
                  <Col md={6}>
                      <Button bsStyle="info" pullRight fill onClick={this.quitGame.bind(this)}>
                          Quit Game
                      </Button>
                  </Col>
              </Row>
              <Row>
                  <Col md={7}>
                      <Card
                          title="Level"
                          ctTableResponsive
                          content={
                              <div>
                                  <Row>
                                      <Col md={6} className="topMargin">
                                          <Checkbox label='Adaptive Difficulty' checked={this.state.adaptiveDifficulty} number={4} onClick={this.changeAdaptiveDifficulty.bind(this)}>
                                          </Checkbox>
                                      </Col>
                                      <Col md={6}>
                                          <FormGroup>
                                              <ControlLabel>Select level (0-10)</ControlLabel>
                                              <FormControl
                                                type="number"
                                                value={this.state.level}
                                                onChange={this.handleLevelChange.bind(this)}
                                                disabled={this.state.adaptiveDifficulty}
                                              />
                                            </FormGroup>
                                      </Col>
                                  </Row>
                                  <Row>
                                      <Col md={12}>
                                          <FormGroup>
                                              <Radio name="radioGroup" value={0} label="Easy (Level 2)" number={0} onClick={this.handleDifficultyChange.bind(this)} disabled={this.state.adaptiveDifficulty} checked={this.state.difficulty==0}>
                                              </Radio>
                                              <Radio name="radioGroup" value={1} label="Medium (Level 5)" number={1} onClick={this.handleDifficultyChange.bind(this)} disabled={this.state.adaptiveDifficulty} checked={this.state.difficulty==1}>
                                              </Radio>
                                              <Radio name="radioGroup" value={2} label="Hard (Level 9)" number={2} onClick={this.handleDifficultyChange.bind(this)} disabled={this.state.adaptiveDifficulty} checked={this.state.difficulty==2}>
                                              </Radio>
                                              <Radio name="radioGroup" value={3} label="Custom" number={3} onClick={this.handleDifficultyChange.bind(this)} disabled={this.state.adaptiveDifficulty} checked={this.state.difficulty==3}>
                                              </Radio>
                                          </FormGroup>
                                      </Col>
                                  </Row>
                              </div>
                          }
                          />
                  </Col>
                  <Col md={3} className='topMargin'>
                      <Checkbox label='Wheelchair mode' checked={this.state.wheelchairMode} number={5} onClick={this.changeWheelchairMode.bind(this)}>
                      </Checkbox>
                  </Col>
                  <Col md={2} className='topMargin'>
                      <Checkbox label='Time Warp' checked={this.state.timeWarp} number={6} onClick={this.changeTimeWarp.bind(this)}>
                      </Checkbox>
                  </Col>
                  <Col md={5}>
                      <Slider
                          label={'Maximum height: '+this.state.maxHeight}
                          number={7} 
                          min={0.2}
                          max={2.0}
                          step={0.01}
                          value={this.state.maxHeight}
                          onChange={this.changeMaxHeight.bind(this)}>
                      </Slider>
                  </Col>
                  <Col md={5}>
                      <Slider
                          label={'Volume: '+this.state.volume}
                          number={8} 
                          min={0}
                          max={100}
                          step={1}
                          value={this.state.volume}
                          onChange={this.changeVolume.bind(this)}>
                      </Slider>
                  </Col>
              </Row>
              <Row>
                  <Col md={7}>
                      <Card
                          title="Custom"
                          ctTableResponsive
                          display={this.state.customMenu}
                          content={
                              <div>
                                  <Row>
                                      <Col md={6}>
                                          <Slider
                                              label={'Shoot distance: '+this.state.shootDistance}
                                              number={9} 
                                              min={0}
                                              max={10}
                                              step={0.1}
                                              value={this.state.shootDistance}
                                              onChange={this.changeShootDistance.bind(this)}>
                                          </Slider>
                                      </Col>
                                      <Col md={6}>
                                          <Slider
                                              label={'Ball speed: '+this.state.ballSpeed}
                                              number={10} 
                                              min={1} 
                                              max={40}
                                              step={0.5}
                                              value={this.state.ballSpeed}
                                              onChange={this.changeBallSpeed.bind(this)}>
                                          </Slider>
                                      </Col>
                                  </Row>
                              </div>
                          }
                          />
                  </Col>
              </Row>
          </form>
      }
      />
      </Col>

      </Row>

      <Row>
      <Col md={12}>
      <Card
      title="Game Controls"
      display={this.state.bridgeGameControls}
      ctTableResponsive
      content={
          <form>
              <Row>
                  <Col md={7}>
                      <Card
                          title="Dragon Controller"
                          ctTableResponsive
                          content={
                              <div>
                                  <Row>
                                      <Col md={12}>
                                          <FormGroup>
                                              <Row>
                                                  <Radio name="dragonControl" value={0} label="Pick dragon location" number={11} onClick={this.handleDragonControl.bind(this)} checked={this.state.dragonControl==0}>
                                                  </Radio>
                                              </Row>
                                              <Row>
                                                  <Col md={1}>
                                                  </Col>
                                                  <Radio name="locationControl" value={1} label="1" number={15} onClick={this.handleLocationControl.bind(this)} disabled={this.state.dragonControl!=0} checked={this.state.locationControl==1}>
                                                  </Radio>
                                                  <Radio name="locationControl" value={2} label="2" number={16} onClick={this.handleLocationControl.bind(this)} disabled={this.state.dragonControl!=0} checked={this.state.locationControl==2}>
                                                  </Radio>
                                                  <Radio name="locationControl" value={3} label="3" number={17} onClick={this.handleLocationControl.bind(this)} disabled={this.state.dragonControl!=0} checked={this.state.locationControl==3}>
                                                  </Radio>
                                                  <Radio name="locationControl" value={4} label="4" number={18} onClick={this.handleLocationControl.bind(this)} disabled={this.state.dragonControl!=0} checked={this.state.locationControl==4}>
                                                  </Radio>
                                              </Row>
                                              <Row>
                                                  <Radio name="dragonControl" value={2} label="Move based on player location" number={12} onClick={this.handleDragonControl.bind(this)} checked={this.state.dragonControl==2}>
                                                  </Radio>
                                              </Row>
                                              <Row>
                                                  <Col md={1}>
                                                  </Col>
                                                  <Radio name="oppositeControl" value={0} label="Opposite player" number={19} onClick={this.handleOppositeControl.bind(this)} disabled={this.state.dragonControl!=2} checked={this.state.oppositeControl==0}>
                                                  </Radio>
                                                  <Radio name="oppositeControl" value={1} label="Same as player" number={20} onClick={this.handleOppositeControl.bind(this)} disabled={this.state.dragonControl!=2} checked={this.state.oppositeControl==1}>
                                                  </Radio>
                                              </Row>
                                              <Row>
                                                  <Radio name="dragonControl" value={1} label="Move on dragon hit" number={13} onClick={this.handleDragonControl.bind(this)} checked={this.state.dragonControl==1}>
                                                  </Radio>
                                              </Row>
                                              <Row>
                                                  <Col md={1}>
                                                  </Col>
                                                  <Radio name="clockwiseControl" value={0} label="Clockwise" number={21} onClick={this.handleClockwiseControl.bind(this)} disabled={this.state.dragonControl!=1} checked={this.state.clockwiseControl==0}>
                                                  </Radio>
                                                  <Radio name="clockwiseControl" value={1} label="Counter clockwise" number={22} onClick={this.handleClockwiseControl.bind(this)} disabled={this.state.dragonControl!=1} checked={this.state.clockwiseControl==1}>
                                                  </Radio>
                                              </Row>
                                              <Row>
                                                  <Radio name="dragonControl" value={3} label="Random" number={14} onClick={this.handleDragonControl.bind(this)} checked={this.state.dragonControl==3}>
                                                  </Radio>
                                              </Row>
                                          </FormGroup>
                                      </Col>
                                  </Row>
                              </div>
                          }
                          />
                  </Col>
                  <Col md={5}>
                      <Card
                          title="Difficulty"
                          ctTableResponsive
                          content={
                              <div>
                                  <Row>
                                      <Col md={12}>
                                          <FormGroup>
                                              <Row>
                                                  <Radio name="dragonDifficulty" value={0} label="Easy" number={23} onClick={this.handleDragonDifficulty.bind(this)} checked={this.state.dragonDifficulty==0}>
                                                  </Radio>
                                                  <Radio name="dragonDifficulty" value={1} label="Medium" number={24} onClick={this.handleDragonDifficulty.bind(this)} checked={this.state.dragonDifficulty==1}>
                                                  </Radio>
                                                  <Radio name="dragonDifficulty" value={2} label="Hard" number={25} onClick={this.handleDragonDifficulty.bind(this)} checked={this.state.dragonDifficulty==2}>
                                                  </Radio>
                                              </Row>
                                              <Row>
                                                  <Col md={1}>
                                                  </Col>
                                                  <Checkbox label='Show projectile trajectory' checked={this.state.showTrajectory} number={26} onClick={this.changeTrajectory.bind(this)}>
                                                  </Checkbox>
                                              </Row>
                                              <Row>
                                                  <Col md={1}>
                                                  </Col>
                                                  <Checkbox label='Easy shield pickup' checked={this.state.easyPickup} number={27} onClick={this.changePickup.bind(this)}>
                                                  </Checkbox>
                                              </Row>
                                          </FormGroup>
                                      </Col>
                                  </Row>
                              </div>
                          }
                          />
                      <Row>
                          <Col md={4}>
                          </Col>
                          <Col md={4}>
                              <Button bsStyle="info" fill onClick={this.quitGame.bind(this)}>
                                  Quit Game
                              </Button>
                          </Col>
                          <Col md={4}>
                          </Col>
                      </Row>
                  </Col>
              </Row>
          </form>
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
