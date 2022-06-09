const express = require("express");
const session = require("express-session");
const res = require("express/lib/response");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

var nodemailer = require("nodemailer");
const { allowedNodeEnvironmentFlags } = require("process");
const { Client } = require("pg/lib");

const dbPass = fs.readFileSync("pass.txt");

const client = new Client({
  user: "defaultuser",
  host: "localhost",
  database: "Synoptic",
  password: dbPass.toString(),
  port: 5432,
});
client.connect();

app.use(
  express.static("public", {
    extensions: ["html", "htm"],
  })
);

function presentFile(route, destination) {
  {
    app.get(route, (req, res) => {
      res.sendFile(path.join(__dirname, destination));
    });
  }
}

// presentFile("/", "index");
// app.get("/", (req, res) => {
//   res.redirect("/index");
// });

app.listen(port, () => console.log("listening"));
