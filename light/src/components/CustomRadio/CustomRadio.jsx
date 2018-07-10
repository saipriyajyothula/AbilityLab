import React, { Component } from "react";

class CustomRadio extends Component {
  render() {
    const { number, label, option, name, ...rest } = this.props;

    if(number==0){
        return (
          <div className="radio radio-inline nopaddingleft">
            <input id={number} name={name} type="radio" value={option} {...rest} />
            <label htmlFor={number}>{label}</label>
          </div>
        );
    }
      
    return (
      <div className="radio radio-inline">
        <input id={number} name={name} type="radio" value={option} {...rest} />
        <label htmlFor={number}>{label}</label>
      </div>
    );
  }
}

export default CustomRadio;
