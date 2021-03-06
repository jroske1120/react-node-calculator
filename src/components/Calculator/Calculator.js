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
          calculation: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addCalculation = (firstVal, operator, secondVal) => {
    axios
      .post("/api/calculator", { ...this.state })
      .then((response) => {
        this.fetchHistory();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //   Handles the click of any button
  handleClick = (input) => {
    const { displayValue, operator, firstVal, secondVal, nextVal } = this.state;

    switch (input) {
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
          displayValue: displayValue === "0" ? input : displayValue + input,
        });
        if (!nextVal) {
          this.setState({
            firstVal: firstVal + input,
          });
        } else {
          this.setState({
            secondVal: secondVal + input,
          });
        }
        break;
      case "+":
      case "-":
      case "x":
      case "/":
        //This sets the operator, as well as prevent two operators from being entered
        this.setState({
          operator: input,
          nextVal: true,
          displayValue:
            (operator !== null
              ? // This allows the operator to be changed
                displayValue.substr(0, displayValue.length - 1)
              : displayValue) + input,
        });
        break;

      case ".":
        //This adds decimal to a value and prevents multiple decimals
        if ((!firstVal.includes(".") && !nextVal) || (!secondVal.includes(".") && nextVal ) ) {
          let decimal = displayValue.slice(-1); //gets last character
          this.setState({
            displayValue: decimal !== "." ? displayValue + input : displayValue,
          });
          if (!nextVal) {
            this.setState({
              firstVal: firstVal + input,
            });
          } else {
            this.setState({
              secondVal: secondVal + input,
            });
          }
        }
        break;

      case "=":
        //sends values to server to be calculated, and resets state
        if (operator && firstVal !== "" && secondVal !== "") {
          this.addCalculation(firstVal, operator, secondVal);
          this.setState({
            displayValue: "0",
            operator: null,
            firstVal: "",
            secondVal: "",
            nextVal: false,
          });
        }
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
          displayValue:
            displayValue.length < 2 ? "0" : displayValue.slice(0, -1),
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
          <center>
          <h1>Joel's Calculator</h1>
          <div style={styles.calculatorContainer}>
            <div style={styles.calcInput}>{this.state.displayValue}</div>
            <div style={styles.numberContainer}>
              {/* I wanted some buttons styled differently, so
                I mapped two different arrays of them */}
              {bigButtons.map((button, input) => (
                <button
                  key={input}
                  style={styles.largeButton}
                  onClick={() => this.handleClick(button)}
                >
                  {button}
                </button>
              ))}
              <br />
              {buttons.map((button, input) => (
                <button
                  key={input}
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
            <ul 
                  style={styles.history}
                  >
              {this.state.calculation.map((calc) => (
                <li key={calc.id}>{calc.calculation}</li>
              ))}
            </ul>
          </div>
          </center>
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
    margin: "5px 13px",
    backgroundColor: "white",
  },
  numberContainer: {
    textAlign: "center",
  },
  calculatorContainer: {
    border: "4px groove gray",
    backgroundColor: "#352655",
    padding: "25px 0px 30px",
    borderRadius: "20px",
    margin: "auto",
    width: "300px",
    minWidth: "200px",
  },
  smallButton: {
    margin: "6px 4px",
    padding: "15px 40px 15px 20px",
    width: "2.8%",
    backgroundColor: "#61bfa5",
    border: "1px groove gray",
    borderRadius: "10px",
    color: "#352655",
    fontSize: "30px",
    fontWeight: "bold",
  },
  largeButton: {
    margin: "3px 4px",
    padding: "5px 20px",
    width: "135px",
    backgroundColor: "#d96976",
    border: "1px groove gray",
    borderRadius: "5px",
    color: "#352655",
    fontSize: "20px",
    fontWeight: "bold",
  },
  history: {
    listStyle: "none",
  }
};
export default Calculator;
