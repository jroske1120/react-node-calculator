import React, { Component } from "react";

class Calculator extends Component {
  state = {
    displayValue: "0",
    operator: null,
    firstVal: "",
    secondVal: "",
  };

  handleClick = (index) => {
    console.log("clicked", index);
  };

  render() {
    const buttons = [
      "CLR",
      "DEL",
      "7",
      "8",
      "9",
      "/",
      "4",
      "5",
      "6",
      "x",
      "1",
      "2",
      "3",
      "-",
      "0",
      ".",
      "=",
      "+",
    ];
    return (
      <div>
        {buttons.map((button, index) => (
          <button key={index} onClick={()=>this.handleClick(button)}>
            {button}
          </button>
        ))}
      </div>
    );
  }
}
export default Calculator;