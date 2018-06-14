import React, { Component } from "react";
import { Grid, Row, Col, Table, FormGroup, ControlLabel, FormControl } from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';


const thArray = ["First Name", "Last Name", "id"];
const products = [];
const columns = [{
  dataField: 'PatientId',
  text: 'ID'
}, {
  dataField: 'FirstName',
  text: 'First Name'
}, {
  dataField: 'LastName',
  text: 'Last Name'
}];

class Patients extends Component {
  state = {patients:[], newID: '', newFirstName: '', newLastName: '', warningTop: '', warningBottom: ''};

  checkValidity = (data) => {
    if(data.newID == ''){
        this.setState({warningBottom: 'Enter the patient ID.'});
        return false;
    }
    if(data.newFirstName == ''){
        this.setState({warningBottom: 'Enter the first name of the patient.'});
        return false;
    }
    if(data.newLastName == ''){
        this.setState({warningBottom: 'Enter the last name of the patient.'});
        return false;
    }
    for(var i=0; i<data.patients.length; i++){
        if(data.patients[i].PatientId==data.newID){
            this.setState({warningBottom: 'Duplicate patient ID.'});
            return false;
        }
    }
    return true;
 }

  addPatient = () => {
      if(this.checkValidity(this.state)){
          fetch('/api/soccerPenalty/addPatient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.state),
          })
          .then((response) => {
              console.log(response);
              this.setState(function(prevState){
                  prevState.patients.push({PatientId: prevState.newID, FirstName: prevState.newFirstName, LastName: prevState.newLastName});
                  return {patients: prevState.patients, newFirstName: '', newLastName: '', newID: '', warningTop: '', warningBottom: ''};
              });
          })
          .then(() => console.log(this.state))
          .catch(error => console.error('Error:', error));
      }
  }
  
  setFirstName(e){
      this.setState({newFirstName: e.target.value});
  }
  
  setLastName(e){
      this.setState({newLastName: e.target.value});
  }

  setID(e){
      this.setState({newID: e.target.value});
  }

  handleEdit(oldVal, newVal, row, column){
      if(newVal == ''){
          if(column.dataField=="FirstName"){              
              this.setState({warningTop: 'Enter the first name of the patient.'});
          }
          else if(column.dataField=="LastName"){
              this.setState({warningTop: 'Enter the last name of the patient.'});
          }
      }
      else if(oldVal == newVal){
          this.setState({warningTop: ''});
      }
      else{
          fetch('/api/soccerPenalty/modifyPatient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({newValue: newVal, column: column.dataField, PatientID: row.PatientId}),
          })
          .then((response) => {
              console.log(response);
              this.setState(function(prevState){
                  for(var i=0; i<prevState.patients.length; i++){
                      if(prevState.patients[i].PatientId == row.PatientId){
                          if(column.dataField=="FirstName"){
                              prevState.patients[i].FirstName = newVal;
                              return prevState;
                          }
                          else if(column.dataField=="LastName"){
                              prevState.patients[i].LastName = newVal;
                              return prevState;
                          }
                      }
                  }
                  return prevState;
              });
              this.setState({warningTop: ''});
          })
          .then(() => console.log(this.state))
          .catch(error => console.error('Error:', error));
      }
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
      this.setState({patients});
      console.log(patients);
    });
  }
  render() {
    return (
      <div className="content">
        <Grid fluid>

        <Row>
          <Col md={12}>
            <Card
              title="Patient Information"
              content={
                <div>
                <div className="col-md-12">
                    <p className="text-danger">{this.state.warningTop}</p>
                </div>
                <BootstrapTable keyField='PatientId'
                data={ this.state.patients }
                columns={ columns }
                striped
                hover
                condensed
                bordered={ false }
                cellEdit={ cellEditFactory({
                  mode: 'dbclick',
                  blurToSave: true,
                  beforeSaveCell: this.handleEdit.bind(this)
                }) }
                />
                
                </div>
              }
            />
          </Col>
        </Row>

          <Row>
            <Col md={12}>
              <Card
                title="Add New Patient"
                content={
                  <form>
                  <FormInputs
                    ncols={["col-md-2", "col-md-5", "col-md-5"]}
                    properties={[
                      {
                        label: "User Id",
                        type: "text",
                        bsClass: "form-control",
                        placeholder: "ID",
                        value: this.state.newID,
                        onChange: this.setID.bind(this),
                      },
                      {
                        label: "First name",
                        type: "text",
                        bsClass: "form-control",
                        placeholder: "First name",
                        value: this.state.newFirstName,
                        onChange: this.setFirstName.bind(this),
                      },
                      {
                        label: "Last name",
                        type: "text",
                        bsClass: "form-control",
                        placeholder: "Last name",
                        value: this.state.newLastName,
                        onChange: this.setLastName.bind(this),
                      }

                    ]}
                  />
                    <div className="typo-line col-md-10">
                        <p className="text-danger">{this.state.warningBottom}</p>
                    </div>
                    <div className="col-md-2">
                    <Button bsStyle="info" pullRight fill type="submit" onClick={this.addPatient}>
                      Add Patient
                    </Button>
                    </div>
                    <div className="clearfix" />
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

export default Patients;
