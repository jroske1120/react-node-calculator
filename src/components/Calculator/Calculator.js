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
    allowDecimal: true,
  };

  componentDidMount() {
    this.fetchHistory();
    this.interval = setInterval(() => {
      this.fetchHistory();
    }, 1000);
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

  //   Handles the click of any button
  handleClick = (index) => {
    const { displayValue, operator, firstVal, secondVal, nextVal } = this.state;

    switch (index) {
      // If a number is pressed, it is added to displayValue
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
        //This logic determines if numbers are set to first or second values
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
        //This sets the operator, as well as prevent two operators from being entered
        if (!operator) {
          this.setState({
            operator: index,
            nextVal: true,
            displayValue:
              (operator !== null
                ? // This allows the operator to be changed
                  displayValue.substr(0, displayValue.length - 1)
                : displayValue) + index,
          });
        }
        break;

      case ".":
        //This adds decimal to a value and prevents multiple decimals
        if (!displayValue.includes(".")) {
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
        }
        break;
      case "=":
        //sends values to server to be calculated, and resets state
        this.addCalculation(firstVal, operator, secondVal);
        this.setState({
          displayValue: "0",
          operator: null,
          firstVal: "",
          secondVal: "",
          nextVal: false,
        });
        break;
      case "CLEAR":
        //This resets state
        this.setState({
          displayValue: "0",
          operator: null,
          firstVal: "",
          secondVal: "",
          nextVal: false,
        });
        break;

      case "DELETE":
        //This removes the last char from display
        this.setState({
          displayValue: displayValue.slice(0, -1),
        });
        if (!nextVal) {
          this.setState({
            firstVal: firstVal.slice(0, -1),
          });
        } else {
          this.setState({
            secondVal: secondVal.slice(0, -1),
          });
        }
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
    const bigButtons = ["CLEAR", "DELETE"];
    return (
      <>
        <div>
          <h1>Calculator</h1>
          <div style={styles.calculatorContainer}>
            <div style={styles.calcInput}>{this.state.displayValue}</div>
            <div style={styles.numberContainer}>
              {/* I wanted some buttons styled differently, so
                I mapped two different arrays of them */}
              {bigButtons.map((button, index) => (
                <button
                  key={index}
                  style={styles.largeButton}
                  onClick={() => this.handleClick(button)}
                >
                  {button}
                </button>
              ))}
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
          <div>
            <h1>Past 10 Calculations</h1>
            <ul>
              {this.state.calculation.map((calc) => (
                <li key={calc.id}>{calc.calculation}</li>
              ))}
            </ul>
          </div>
        </div>
      </>
    );
  }
}

const styles = {
  calcInput: {
    padding: "2px 36px 2px 10px",
    borderRadius: "5px",
    border: "1px groove gray",
    width: "75%",
    fontFamily: `serif`,
    fontSize: "25px",
    textAlign: "right",
    alignItems: "center",
    margin: "13px",
    backgroundColor: "white",
  },
  numberContainer: {
    textAlign: "center",
  },
  calculatorContainer: {
    border: "4px groove gray",
    backgroundColor: "#2e465d",
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
    backgroundColor: "black",
    border: "1px groove gray",
    borderRadius: "5px",
    color: "white",
    fontSize: "30px",
    fontWeight: "bold",
  },
  largeButton: {
    margin: "3px 4px",
    padding: "5px 20px",
    width: "135px",
    backgroundColor: "#aa2365",
    border: "1px groove gray",
    borderRadius: "5px",
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
  },
};
export default Calculator;