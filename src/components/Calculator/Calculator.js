import React, { Component } from "react";

class Calculator extends Component {
  state = {
    displayValue: "0",
    operator: null,
    firstVal: "",
    secondVal: "",
    nextVal: false,
  };

  handleClick = (index) => {
    console.log("clicked", this.state.displayValue);
    const { displayValue, operator, firstVal, secondVal, nextVal } = this.state;

    switch (index) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        this.setState({
          displayValue: displayValue === "0" ? index : displayValue + index,
        });
        if (!nextVal) {
          this.setState({
            firstVal: firstVal + index,
          });
        } else {
          this.setState({
            secondVal: secondVal + index,
          });
        }
        break;
      case "+":
      case "-":
      case "x":
      case "/":
        this.setState({
          operator: index,
          nextVal: true,
          displayValue:
            (operator !== null
              ? displayValue.substr(0, displayValue.length - 1)
              : displayValue) + index,
        });
        break;

      case ".":

      //return to prevent double decimals like 4.4.4
        let decimal = displayValue.slice(-1); //gets last character
        this.setState({
          displayValue: decimal !== "." ? displayValue + index : displayValue,
        });
        if (!nextVal) {
          this.setState({
            firstVal: firstVal + index,
          });
        } else {
          this.setState({
            secondVal: secondVal + index,
          });
        }
        break;
      case "=":
        //call POST to server
        console.log(this.state)
        this.setState({
          displayValue: "0",
          operator: null,
          firstVal: "",
          secondVal: "",
          nextVal: false,
        });
        break;
      case "CLR":
        this.setState({
          displayValue: "0",
          operator: null,
          firstVal: "",
          secondVal: "",
          nextVal: false,
        });
        break;

      case "DEL":
        let string = displayValue.toString();
        let backspace = string.substr(0, string.length - 1);
        let length = string.length;
        this.setState({
          displayValue: length === 1 ? "0" : backspace,
        });
        break;
    }
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
      <>
        <div>{this.state.displayValue}</div>
        <div>
          {buttons.map((button, index) => (
            <button key={index} onClick={() => this.handleClick(button)}>
              {button}
            </button>
          ))}
        </div>
        <div>
            <h2>History</h2>
            <p>{this.state.firstVal}</p>
            <p>{this.state.operator}</p>
            <p>{this.state.secondVal}</p>
            </div>
      </>
    );
  }
}
export default Calculator;