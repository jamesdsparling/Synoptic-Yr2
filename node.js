const express = require("express");
const session = require("express-session");
const res = require("express/lib/response");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

var nodemailer = require("nodemailer");
const { allowedNodeEnvironmentFlags } = require("process");

function presentFile(route, destination) {
  {
    app.get(route, (req, res) => {
      res.sendFile(path.join(__dirname, destination));
    });
  }
}

presentFile("/", "userPages/index.html");
presentFile("/about", "userPages/about.html");

app.listen(port, () => console.log("listening"));
