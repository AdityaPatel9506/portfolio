const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const nodemailer = require("nodemailer");
require('dotenv').config(); // Import dotenv to load environment variables

const formDir = path.join(__dirname, '../public');
const mail = 'adityapatel9506@gmail.com';
const formpath = path.join(__dirname, '../public/html/index.html');
const form = express();

form.use(express.static(formDir));
form.use(bodyparser.urlencoded({ extended: "true" }));

form.get("/", function(req, res) {
    res.sendFile(formpath);
});

form.post("/", function(req, res) {
    const firstname = req.body.firstname;
    const email = req.body.mailId;
    const query = req.body.query;
    
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: 'adityapatel9506@gmail.com',
            pass: process.env.EMAIL_PASSWORD, // Use the password from the environment variable
        },
    });
 
    var mailOptions1 = {
        from: "adityapatel9506@gmail.com",
        to: email,
        subject: "Thanks for contacting us, " + firstname,
        text: "Thanks for contacting us"
    };

    var mailOptions2 = {
        from: "adityapatel9506@gmail.com",
        to: "adityapatel9506@gmail.com",
        subject: "Aditya",
        text: `Name: ${firstname}
        
        Query:
        
        ${query}`
    };

    transporter.sendMail(mailOptions1, function(err, info) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });

    transporter.sendMail(mailOptions2, function(err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log("Query received");
        }
    });
});

form.listen(3000, function() {
    console.log("Server started on port 3000");
});
