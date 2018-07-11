import React, { Component } from "react";

class CustomSlider extends Component {
  render() {
    const { number, label, min, max, step, value, ...rest } = this.props;
    return (
      <div>
        <label className="label slider-label" htmlFor={number}>{label}</label>
        <input
          className="slider"
          id={number}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          {...rest}
        />
      </div>
    );
  }
}

export default CustomSlider;
