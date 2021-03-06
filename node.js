const express = require("express");
const session = require("express-session");
const res = require("express/lib/response");
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const app = express();
const port = 3000;

// const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded({ extended: true }));

var nodemailer = require("nodemailer");
const { allowedNodeEnvironmentFlags } = require("process");

const dbPass = fs.readFileSync("pass.txt");

const client = new Client({
  user: "defaultuser",
  host: "localhost",
  database: "Synoptic",
  password: dbPass.toString(),
  port: 5432,
});
client.connect();

const emailPass = fs.readFileSync("emailPass.txt");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "james.sparling.test.email@gmail.com",
    pass: emailPass.toString(),
  },
});

app.use(
  express.urlencoded({
    // Allow body objects of any type
    extended: true,
  })
);

app.use(
  express.static("public", {
    extensions: ["html", "htm"],
  })
);

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
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

// app.get("/editmap", (req, res) => {
//   if (req.session.admin == true) {
//     res.sendFile(path.join(__dirname, "/admin/editMap.html"));
//   } else {
//     res.send(
//       "Please sign in as an admin user. <br><a href='/signin'>Sign In</a>"
//     );
//   }
// });

app.get("/isAdmin", (req, res) => {
  res.send(req.session.admin);
});

app.get("/signout", (req, res) => {
  if (req.session.loggedin == true) {
    req.session.destroy();
  }
});

app.post("/signin", (req, res) => {
  if (req.body.email && req.body.password) {
    client.query(
      "SELECT profile_ID, pass, admin FROM profiles WHERE email = $1",
      [req.body.email],
      (err, dbRes) => {
        if (err) {
          console.log(err.stack);
        } else {
          if (dbRes.rows[0] && req.body.password == dbRes.rows[0].pass) {
            console.log("Sigining in: " + req.body.email);

            // express-session setup
            req.session.loggedin = true;
            req.session.email = req.body.email;
            req.session.profile_id = dbRes.rows[0].profile_id;
            req.session.admin = dbRes.rows[0].admin;
            if (req.session.admin) {
              console.log("^ Admin user!");
            }

            res.redirect("/");
          } else {
            console.log("Incorrect email or password");
            res.send(
              'Incorrect email or password <br> <a href="/signin"><- go back</a>'
            );
          }
        }
      }
    );
  }
});

app.post("/signup", (req, res) => {
  if (req.body.email && req.body.password && req.body.password2) {
    if (req.body.password != req.body.password2) {
      res.send('Passwords do not match! <br> <a href="/signup"><- go back</a>');
    } else {
      client.query(
        "INSERT INTO profiles(email, pass) VALUES ($1, $2) RETURNING *",
        // [req.body.email, req.body.pass],
        [req.body.email, req.body.password],
        (err, dbRes) => {
          if (err) {
            console.log(err.stack);
            if (err.constraint == "profiles_email_key") {
              console.log("User with email already exists");
              res.send(
                "User with email " +
                  req.body.email +
                  ' already exists. <br> <a href="/signup"><- go back</a>'
              );
            } else {
              console.log(err.stack);
            }
          } else {
            console.log("New user created");
            console.log(dbRes.rows[0]);

            var mailOptions = {
              from: "james.sparling.test.email@gmail.com",
              to: dbRes.rows[0].email,
              subject: "Account created!",
              text:
                "You have successfully created an account with the email: " +
                dbRes.rows[0].email,
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent: " + info.response);
              }
            });

            req.session.loggedin = true;
            req.session.email = dbRes.rows[0].email;
            req.session.profile_id = dbRes.rows[0].profile_id;
            req.session.admin = dbRes.rows[0].admin;

            // Temporary solution. User is still created even if continue is not pressed.
            res.send(
              'By clicking continue you agree to accept our <a href="/privacy">privacy permissions</a> <br> <a href="/">Continue...</a>'
            );
          }
        }
      );
    }
  }
});

app.get("/getData", (req, res) => {
  if (req.session.loggedin == true) {
    client.query("SELECT type, data FROM polygons", (err, dbRes) => {
      if (err) {
        console.log(err.stack);
      } else {
        res.send(dbRes.rows);
      }
    });
  }
});

app.post("/newPoly", (req, res) => {
  if (req.session.admin == true) {
    if ((req.body.poly, req.body.polyType)) {
      client.query(
        "INSERT INTO polygons(type, data) VALUES ($1, $2)",
        [req.body.polyType, req.body.poly],
        (err, dbRes) => {
          if (err) {
            console.log(err.stack);
          } else {
            console.log("New poly received");
            res.sendStatus(200);
          }
        }
      );
    }
  } else {
    res.status(404).send({ error: "Not an admin" });
  }
});

app.listen(port, () => console.log("listening"));
