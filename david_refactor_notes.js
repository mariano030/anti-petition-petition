///////// DAVID's RESTRUCTURE SUGGESTIONS
// how you might split index.js an reorganize it a bit / tidy it up

// login test for every route - any route other than get/post for login/register

// logged out -> register

// middleware for locked cases

// middleware works for all request methods GET, POST, ...


// instead of bloating a middleware with multiple purposes use one middleware for one purpose!
// needs to run for the majority - so can run for every request
app.use(function (res, req, next) {
    //blablabla runs for every single request
    // using same url for get and post
    if (!req.session.id && req.url != "/login" && req.url != "/register") {
        res.redirect("/register");
    } else {
        next();
    }
});

// limit this middleware to funky // use funky as a prefix for all other routes that are closed off ("/funky/register") 
app.use("/funky",funciton (req,res,next)) {
    if (req.session.ud){

    }
}


// routes are essentilly middlewares, can use next() but usually are not used for that - but as endpoint

app.use(function (res, req, next) {
    //blablabla runs for every single request
    // using same url for get and post
    if (!req.session.id && req.url != "/login" && req.url != "/register") {
        res.redirect("/register");
    } else {
        next();
    }
}, function);


//write middleware as functions with descriptive name at a glace you can see how the routes work - put them in a middleware.js 

const requreLoggedOutUser = function();

app.get ("/register", requireLoggedOutUser, (req,res) => {
    res.sendStatus(200);
})





const requireNoSignature = function (req,res, next) {
    if (req.session.signatureId) {
        res.redirect("/thanks")
    } else {
        next();
    }
}


const requireignature = function (req, res, next) {
    if (!req.session.signatureId) {
        res.redirect("/petition");
    } else {
        next();
    }
};


app.get("/signers", requireignature, (req,res) => {
    // bla bla normal stuff
})



exports.secureCookies = function(req,res,next) {
    res.set("x-frame-options", "DENY");
    res.locals.csrfToken = req.csrfToken();
    res.locals.loggedIn = req.session.id  // attach the logged in information to res.locals!! get it on every template (like Token)
    next();
}



// if you are moving the routes to another file - seperate files by uses - logged in / logged out...

// profile/edit

// require module for side effects - 



//  proflie_routes.js ###########
const express = require("express");
const router = express.Router(); // object that has get & post methods - mini express app that does not have listen...


router.get("/example", (req,res) => {
    // routing
})

// in in dex.js :
const profileRouter = require("profile_router")

app.use("/profile", profileRouter); // in profile_routes.js it's "/" then (already in "/profile")




