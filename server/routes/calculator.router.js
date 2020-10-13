const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

router.post("/", (req, res) => {
  let info = req.body;
  let num1 = Number(info.firstVal);
  let num2 = Number(info.secondVal);
  let calculation = info.firstVal + " " + info.operator + " " + info.secondVal;
  let solution = () => {
    switch (info.operator) {
      case "+":
        return num1 + num2;
      case "-":
        return num1 - num2;
      case "x":
        return num1 * num2;
      case "/":
        return num1 / num2;
      default:
        return calculation;
    }
  };
  let queryText = `INSERT INTO "history" ("calculation") VALUES ($1);`;
  pool
    .query(queryText, [calculation + " = " + solution()])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

router.get("/", (req, res) => {
});
module.exports = router;