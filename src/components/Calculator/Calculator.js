import React, { Component } from "react";
import axios from "axios";

class Calculator extends Component {
  state = {
    displayValue: "0",
    operator: null,
    firstVal: "",
    secondVal: "",
    nextVal: false,
    calculation: [],
  };

  componentDidMount() {
    this.fetchHistory();
  }
  fetchHistory = () => {
    axios
      .get("/api/calculator")
      .then((response) => {
        this.setState({
          // ...this.state,
          calculation: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  addCalculation = (firstVal, operator, secondVal) => {
    console.log("sending calculation", `${firstVal} ${operator} ${secondVal}`);
    axios
      .post("/api/calculator", { ...this.state })
      .then((response) => {
        console.log(response);
        this.fetchHistory();
      })
      .catch((error) => {
        console.log(error);
      });
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
        this.addCalculation(firstVal, operator, secondVal);
        console.log(this.state);
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
      default:
        return this.state;
    }
  };

  render() {
    const buttons = [
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
        <div style={styles.outerCalculator}>
          <h2>Calculator</h2>
          <div style={styles.calculatorContainer}>
            <h4 style={styles.calculatorTitle}>
              JOEL <span style={styles.model}>SZL-2020</span>
            </h4>
            <div style={styles.calcInput}>{this.state.displayValue}</div>
            <div style={styles.numberContainer}>
              <button style={styles.largeButton}>CLEAR</button>
              <button style={styles.largeButton}>DELETE</button>
              <br />
              {buttons.map((button, index) => (
                <button
                  key={index}
                  style={styles.smallButton}
                  onClick={() => this.handleClick(button)}
                >
                  {button}
                </button>
              ))}
              <br />
            </div>
          </div>
          <ul>
            {this.state.calculation.map((calc) => (
              <li key={calc.id}>{calc.calculation}</li>
            ))}
          </ul>
        </div>
      </>
    );
  }
}

const styles = {
  calculatorTitle: {
    color: "white",
    fontSize: "19px",
    margin: "2px 0px 12px 0px",
    textAlign: "center",
    padding: "0px",
  },
  model: {
    color: "#b07080",
  },
  calcInput: {
    padding: "2px 36px 2px 10px",
    borderRadius: "5px",
    width: "75%",
    // font-family: "Changa", sans-serif,
    fontSize: "25px",
    textAlign: "right",
    margin: "10px",
    backgroundColor: "white",
  },
  numberContainer: {
    textAlign: "center",
  },
  calculatorContainer: {
    border: "2px solid #000000",
    backgroundColor: "#434b60",
    padding: "25px 0px 50px 0px",
    borderRadius: "5px",
    margin: "auto",
    width: "300px",
    minWidth: "200px",
  },
  smallButton: {
    margin: "6px 4px",
    padding: "15px 40px 15px 20px",
    width: "2.8%",
    backgroundColor: "#9897a4",
    border: "1.5px groove #2a2a38",
    borderRadius: "5px",
    color: "white",
    fontSize: "20px",
  },
  largeButton: {
    margin: "3px 4px",
    padding: "5px 20px",
    width: "135px",
    backgroundColor: "#9897a4",
    border: "1.5px groove #2a2a38",
    borderRadius: "5px",
    color: "white",
    fontSize: "20px",
  },
};
export default Calculator;