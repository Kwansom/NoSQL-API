const express = require("express");
const db = require("./config/connection");
const mongoose = require("mongoose"); // mongoose for interacting with mongoDB
const routes = require("./routes");
//Require model
const { Thought, User } = require("./models");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});