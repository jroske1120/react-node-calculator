const express = require("express");
// const pool = require('../modules/pool');
const router = express.Router();

router.get("/", (req, res) => {
  console.log("req.body is", req.body);
});

router.post("/", (req, res) => {
  console.log("req.body is", req.body);
});

module.exports = router;