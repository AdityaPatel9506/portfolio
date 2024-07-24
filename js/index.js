const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require('dotenv').config(); // Import dotenv to load environment variables

const formDir = path.join(__dirname, '../public');
const formPath = path.join(__dirname, '../public/html/index.html');
const form = express();

form.use(express.static(formDir));
form.use(bodyParser.urlencoded({ extended: true }));

form.get("/", function(req, res) {
    res.sendFile(formPath);
});

form.post("/", function(req, res) {
    const firstname = req.body.firstname;
    const email = req.body.mailId;
    const query = req.body.query;

    // Configure the transport using environment variables
    var transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // Email to the user
    var mailOptions1 = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: `Thanks for contacting me, ${firstname}`,
        text: "Thanks for contacting me.",
    };

    // Email to the admin
    var mailOptions2 = {
        from: process.env.FROM_EMAIL,
        to: process.env.TO_EMAIL,
        subject: "New Query Received",
        text: `Name: ${firstname}\n\nQuery:\n\n${query}`,
    };

    // Send email to user
    transporter.sendMail(mailOptions1, function(err, info) {
        if (err) {
            console.log("Error sending email to user:", err);
        } else {
            console.log("Email sent to user:", info.response);
        }
    });

    // Send email to admin
    transporter.sendMail(mailOptions2, function(err, info) {
        if (err) {
            console.log("Error sending email to admin:", err);
        } else {
            console.log("Email sent to admin:", info.response);
            res.redirect("/");
        }
    });
});

form.listen(3000, function() {
    console.log("Server started on port 3000");
});
