const express = require("express");
const db = require("./db");

const app = express();

// HANDLEBARS SETUP
const hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

//// MIDDLEWARE ''''''''''''''''''''''''''''''''''''''''''''''''''''''

app.use(require("cookie-parser")());
app.use(express.static("public"));
app.use(
    express.urlencoded({
        extended: false,
    })
);

//// VARIABLES
let body = "";

//// ROUTES -----------------------------------------------------------

app.get("/public", (res, req) => {
    console.log("public served, make static though");
});

app.post("/petition", (req, res) => {
    /* 
    redirects to /thanks if there is a cookie
    do insert of submitted data into database
    if there is an error, petition.handlebars is rendered with an error message
    if there is no error
        sets cookie to remember
        redirects to thank you page

    */
    //res.render("petition");
    console.log("post ist da!");
    console.log(req.body);
    // actually I think this is supposed to be a .catch thingy
    if (
        req.body.first.length <= 1 ||
        req.body.last.length <= 1 ||
        req.body.sig.length <= 4
    ) {
        console.log("error, der user versucht uns zu bescheißen");
    } else {
        db.addSigner(req.body.first, req.body.last, req.body.sig).then(
            console.log("a user signed!")
        );
    }

    // req.on("data", (chunk) => { THIS IS NOT EXPRESS!!!
});

app.get("/petition", (req, res) => {
    /* 
    redirects to /thanks if there is a cookie
    do insert of submitted data into database
    if there is an error, petition.handlebars is rendered with an error message
    if there is no error
        sets cookie to remember
        redirects to thank you page

    */
    console.log("petition get serving");
    res.render("petition", {
        layout: "script",
    });
});

// app.get("/thanks", (req, res) => {
//     /*

//     redirects to /petition if there is no cookie
//     render thanks.handlebars

//     */
//     //console.log("getting the cities");
//     //db.getCities().then((results) => {
//     //    console.log("results: ", results);
//     //});
// });

app.get("/signers", (req, res) => {
    /*
    
    redirects to /petition if there is no cookie
    get the first and last of every signer from the database and pass them to signers.handlebars

    */
    console.log("signers served");
    res.render("signers", {
        layout: "main",
    });
});

app.listen(3000, () => console.log("petition up and runing"));

//         req.on("data", (chunk) => {
//             body += chunk;
//         });

// ///
//       req.on("end", () => {
//             //let { color, text } = qs.parse(body);
//             //console.log("color", color, "text", text);
//             const parsedBody = qs.parse(body);

// wili mentioned a db querry count (or smth) for the number of co-signers
