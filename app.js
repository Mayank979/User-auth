const express = require("express"),
      mongoose = require("mongoose");

let app = express();

app.get("/", (req, res) => {
  res.send("Home");
});

app.listen(8000, () => {
  console.log("Server running at port 8000");
})
