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

var availableGames = ['soccerpenalty', 'SoccerPenalty', 'Bridge', 'Stadium', 'StadiumPenalty', 'StadiumPenaltyLeap'];

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
    state = {bubbleChart:{catches: [], goals: []}, event: {status: 'up', x: 0, y: 0}, styles: {position: 'fixed', top: 0, left: 0, width: 0, height: 0}, currentPatient: {PatientId: '', FirstName: 'Select patient name', LastName: ''}, currentGame: 'Select game', startMenu: 'visible', level: 3, adaptiveDifficulty: true, difficulty: 2, shootDistance: 4, ballSpeed: 15, maxHeight: 0.5, soccerPaused: true, gameControls: 'hidden', volume: 100, customMenu: 'hidden', timeWarp: false, wheelchairMode: false, bridgeStats: {playerDamage: [{x: 2, y: 1.25, z: 1, value: 0, name: "Player Damage"}], dragonDamage: [{x: 3.3, y: 1.75, z: 1, value: 0, name: "Dragon Damage"}], dodges: [{x: 3.8, y: 1.75, z: 1, value: 0, name: "Dodges"}], leftShield: {miss: [{x: 0.3, y: 1.2, z: 1, value: 0, name: "Left Shield Reflects"}], hit: [{x: 1.05, y: 1.05, z: 1, value: 0, name: "Left Shield Hits"}]}, rightShield: {miss: [{x: 2.95, y: 1.05, z: 1, value: 0, name: "Right Shield Reflects"}], hit: [{x: 3.7, y: 1.2, z: 1, value: 0, name: "Right Shield Hits"}]}, leftFoot: {miss: [{x: 1, y: 0.2, z: 1, value: 0, name: "Left Foot Misses"}], hit: [{x: 0.5, y: 0.2, z: 1, value: 0, name: "Left Foot Hits"}]}, rightFoot: {miss: [{x: 3.5, y: 0.2, z: 1, value: 0, name: "Right Foot Misses"}], hit: [{x: 3, y: 0.2, z: 1, value: 0, name: "Right Foot Hits"}]}}};

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
            this.setState({startMenu: 'hidden', gameControls: 'visible'});
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
        this.setState({startMenu: 'visible', gameControls: 'hidden'});
        
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


  componentDidMount(){
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
      display={'visible'}
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
      display='visible'
      ctTableResponsive
      content={
                  <Row>
                  <Col md={8}>
                      <Card
                          title="Level"
                          ctTableResponsive
                          content={
                              <div>
                                  
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
      display={this.state.gameControls}
      ctTableResponsive
      content={
          <form>
              <Row>
                  <Col md={6}>
                      <Button bsStyle="info" fill onClick={this.setPaused.bind(this)}>
                          Play/Pause
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
                                          <FormGroup value={this.state.level}>
                                              <Radio name="radioGroup" value={0} label="Easy (Level 2)" number={0} onClick={this.handleDifficultyChange.bind(this)} disabled={this.state.adaptiveDifficulty}>
                                              </Radio>
                                              <Radio name="radioGroup" value={1} label="Medium (Level 5)" number={1} onClick={this.handleDifficultyChange.bind(this)} disabled={this.state.adaptiveDifficulty}>
                                              </Radio>
                                              <Radio name="radioGroup" value={2} label="Hard (Level 9)" number={2} onClick={this.handleDifficultyChange.bind(this)} disabled={this.state.adaptiveDifficulty} defaultChecked>
                                              </Radio>
                                              <Radio name="radioGroup" value={3} label="Custom" number={3} onClick={this.handleDifficultyChange.bind(this)} disabled={this.state.adaptiveDifficulty}>
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
                          label='Maximum height'
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
                          label='Volume'
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
                                              label='Shoot distance'
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
                                              label='Ball speed'
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
      display={'hidden'}
      ctTableResponsive
      content={
          <form>
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
                                              <ControlLabel>Select level</ControlLabel>
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
                                          <FormGroup value={this.state.difficulty}>
                                              <Radio name="radioGroup" value={0} label="Easy (Level 1)" number={0} onClick={this.handleDifficultyChange.bind(this)} disabled={this.state.adaptiveDifficulty}>
                                              </Radio>
                                              <Radio name="radioGroup" value={1} label="Medium (Level 5)" number={1} onClick={this.handleDifficultyChange.bind(this)} disabled={this.state.adaptiveDifficulty}>
                                              </Radio>
                                              <Radio name="radioGroup" value={2} label="Hard (Level 9)" number={2} onClick={this.handleDifficultyChange.bind(this)} disabled={this.state.adaptiveDifficulty} defaultChecked>
                                              </Radio>
                                              <Radio name="radioGroup" value={3} label="Custom" number={3} onClick={this.handleDifficultyChange.bind(this)} disabled={this.state.adaptiveDifficulty}>
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
                          label='Maximum height'
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
                          label='Volume'
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
                                              label='Shoot distance'
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
                                              label='Ball speed'
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
          
      </Grid>
      </div>
    );
  }
}
export default CurrentApplication;
