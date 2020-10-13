const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

router.post("/", (req, res) => {
  let info = req.body;
  //Convert values to numbers for calculating
  let num1 = Number(info.firstVal);
  let num2 = Number(info.secondVal);
  //Send calculation elements and solution to db
  let calculation = `${info.firstVal} ${info.operator} ${info.secondVal}`;
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
    .query(queryText, [calculation + " = " + solution().toFixed(2)])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

router.get("/", (req, res) => {
  let queryText = `SELECT * FROM "history" ORDER BY "id" DESC LIMIT 10;`
  pool.query(queryText)
      .then((result) => {
          res.send(result.rows)
      }).catch((error) => {
          console.log(error);
          res.sendStatus(500);
      })
})
module.exports = router;