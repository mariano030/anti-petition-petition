const express = require("express");
const db = require("./db");
const { compare, hash } = require("./bc");
const app = express();
const cookieSession = require("cookie-session");

// HANDLEBARS SETUP
const hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

//// MIDDLEWARE ''''''''''''''''''''''''''''''''''''''''''''''''''''''

app.use(require("cookie-parser")());
///
const csurf = require("csurf");

app.use(express.static("public"));

app.use(
    // what does that do again???
    express.urlencoded({
        extended: false,
    })
);

//// SESSION MIDDLEWARE
app.use(
    cookieSession({
        secret:
            process.env.SESSION_SECRET ||
            `The fat is in the fire, a fryer made of chicken wire.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
///
app.use(csurf());

app.use(function (req, res, next) {
    res.locals.csrfToken = req.csrfToken(); // make csurf token available for every route
    next();
});

app.use(function (req, res, next) {
    console.log("### sreq.url/ session ", req.url, req.session);
    next();
});

//// VARIABLES
let body = "";

//// ROUTES -----------------------------------------------------------

app.get("/public", (res, req) => {
    console.log("public served, make static though");
});

app.post("/register", (req, res) => {
    // req.
    // get user info from req.
    // hash password
    // store user information in db - return id
    // create session with user id
    // redirect to /petition if hasing and db INSERT
    //
    // in case of error: redirect to /register or re-render with error message! {{#if errorx}}
    if (req.session && req.session.id) {
        res.redirect("/thanks");
    }
    console.log("req.body.email", req.body.email);
    console.log("req.body.first", req.body.first);
    console.log("req.body.last", req.body.last);
    console.log("req.body.password", req.body.password);
    const { first, last, email, password } = req.body; // this working?
    console.log("hash hash");
    hash(password)
        .then((hashedPw) => {
            // create user now
            db.createUser(first, last, email, hashedPw)
                .then((lastAdded) => {
                    //user added
                    console.log("user added - id", lastAdded.rows[0]);
                    // create a session
                    req.session.id = lastAdded.rows[0].id;
                    console.log(req.session.id);
                    res.redirect("/profile");
                })
                .catch((err) => {
                    // problem adding user
                    console.log("could not add to db:", err);
                    res.render("register", {
                        loggedOut: true,
                        loggedIn: false,
                        error:
                            "I just can't. An error occured, please try again. ",
                    });
                });
        })
        .catch((err) => {
            // cant't hash
            console.log("error prsent: ", err);
            res.render("register", {
                loggedOut: true,
                loggedIn: false,
                error: "An error occured, please try again. Hash?",
            });
        });

    // db.checkEmailUnique(req.body.email)
    //     .then()
    //     .catch(
    //     );
});

app.get("/register", (req, res) => {
    if (!req.session.id) {
        console.log("req.session.id present:", req.session.id);
        res.render("register", {
            loggedOut: true,
        });
        return;
    } else {
        res.redirect("/thanks");
    }
});

app.post("/profile", (req, res) => {
    // insert profile data to user_profiles or skip if empty
    if (req.body.age || req.body.city || req.body.url) {
        console.log("at least one entered");
        // check if req.body.url starts with http
        let url = "";
        if (!req.body.url.startsWith("http")) {
            console.log("did NOT start with http");
            url = "http://" + req.body.url;
            console.log("url", url);
        } else if (req.body.url.startsWith("http")) {
            console.log("did start with http");
            url = req.body.url;
        }
        db.addUserProfileData(
            req.body.age,
            req.body.city,
            url,
            req.session.id
        ).then(res.redirect("/petition"));
    } else {
        console.log("none entered");
        res.redirect("/petition");
    }
});

app.get("/login", (req, res) => {
    if (req.session.id) {
        res.redirect("/petition");
    }
    res.render("login", {
        loggedOut: true,
    });
});
app.post("/login", (req, res) => {
    db.getUserPw(req.body.email)
        .then((results) => {
            const { password, id } = results.rows[0];
            console.log("password for luca", password);
            compare(req.body.password, password)
                .then((result) => {
                    console.log("result is ", result);
                    if (result) {
                        req.session.id = id;

                        db.getSignatureByUserId(id)
                            .then(() => res.redirect("/thanks"))
                            .catch((err) => {
                                console.log(err);
                            });
                        console.log("req.session.id", req.session.id);
                        console.log("correct pw entered");
                        console.log("id???", results);

                        res.redirect("/thanks");
                        // store user id in cookie DONE!
                        // do db query to see if signed
                        //      if yes
                        //          sig.id into cookie
                        //          redirect to /thanks
                        //      if not
                        //          redirect to petition
                    } else {
                        console.log("falsches pw drinne");
                        res.redirect("/login", error);
                    }
                })
                .catch((err) => {
                    console.log("CATCH ROUTE", err);
                    res.render("login");
                });
        })
        .catch((error) => {
            console.log(error);
            console.log("req.body.email", req.body.email);
            console.log("req.body.password", req.body.password);
            res.render("login", { error });
        });

    // get the user's stored hashed password from the db using the user's email address

    // pass the hashed password to COMPARE along with the password the user typed in the input field
    //     if they match, COMPARE returns a boolean value of true
    //         store the userId in a cookie
    //         do a db query to find out if they've signed
    //             if yes, you want to put their sigId in a cookie & redirect to /thanks
    //             if not, redirect to /petition
    //     if they don't match, COMPARE returns a boolean value of false & re-render with an error message

    // get users info email and password from req.body
    // got ot the database and check if user is registered and if so get the user's password hash
    // compare to see if plain text Pw is a match for username(email)
    // compare returns true: pw matches, create cookie session
    //      redirect to /petition - already signed? - built a chart
    // compare returns true: pw DOES NOT match
    // OPTION 2:
    // find out from the databvase if the user has signed the petition if yes redirect to thank you if no redirect to peition
    // case compare returns false:
    // rerender login with an error message
    //case email does not exisit in db: rerender login with error msg, write generic msg
    // logout route?? - set cookie session to null
});

app.post("/edit", (req, res) => {
    hash(req.body.password).then((hashedPw) => {
        db.updateUsersData(
            req.session.id,
            req.body.first,
            req.body.last,
            req.body.email,
            hashedPw
        )
            .then(() => {
                console.log(req.body);
                db.updateUsersProfile(req.body.age, req.body);
                res.render("edit", { user_profile: editData, loggedIn: true });
            })
            .catch((err) => {
                console.log(err);
                db.getUsersProfileData(req.session.id)
                    .then((result) => {
                        console.log(result.rows[0]);
                        res.render("edit", {
                            user_profile: result.rows[0],
                            loggedIn: true,
                            loggedOut: false,
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.render("edit", {
                            user_profile: result.rows[0],
                            loggedIn: true,
                            error: err,
                        });
                    });
            });
    });
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
    // if (
    //     // req.body.first.length <= 1 ||
    //     //req.body.last.length <= 1 ||
    //     //req.body.sig.length <= 1
    // ) {
    //     console.log("error, der user versucht uns zu bescheißen");
    //     //res.render("TRY AND FOOL SOMEONE ELSE,  PLEASE");
    // } else {
    //console.log("req.body.session.id", req.body.session.id);
    console.log("req.session.id", req.session.id);
    db.addSignature(req.body.sig, req.session.id)
        .then((result) => {
            //console.log("results.rows", results.rows);
            //console.log("result...id", result.rows[0].id);
            console.log("a user signed!");
            // is this even necessary req.session.id = result.rows[0].id;
            //res.cookie()
            console.log("do we even get here?");
            res.redirect("/thanks");
        })
        .catch((err) => {
            console.log(err);
            console.log("oooh, so this happens then???!");
            res.redirect("/signers");
        });
});

app.get("/profile", (req, res) => {
    res.render("profile", {
        loggedIn: true,
    });
});

app.get("/petition", (req, res) => {
    db.getSignatureByUserId(req.session.id)
        .then((result) => {
            console.log("RESULTTT", result);
            if (result.rowCount == 0) {
                res.render("petition", {
                    layout: "script",
                    loggedIn: true,
                });
            }
            //res.redirect("/thanks");
            // did the person sign already???
        })
        .catch(() => {
            console.log("petition get served");
            res.render("thanks", {
                layout: "script",
                loggedIn: true,
                loggedOut: false,
            });
        });
});

app.get("/thanks", (req, res) => {
    const signatureId = req.session.id; //req.session.signatureId;

    // happy thinking
    db.getSignatureByUserId(signatureId)
        .then((result) => {
            //console.log("database querry awnser:", result);
            if (result.rows && result.rows[0].signature) {
                console.log("result.rows[0]", result.rows[0].signature);
                const imgSignature = result.rows[0].signature;
                db.getSignersCount()
                    .then((result) => {
                        console.log(result);
                        const signersCount = result.rows[0].count; //
                        console.log("signerCount", signersCount);
                        res.render("thanks", {
                            layout: "main",
                            signersCount,
                            imgSignature,
                            loggedIn: true,
                        });
                    })
                    .catch((err) => console.log(err));
            } else {
                // not signed yet
                res.redirect("/petition");
            }
        })
        .catch((err) => {
            res.redirect("/petition");
            console.log("no signature found for ID");
            console.log(
                "§§§§§§§§§§§§§§§§§ an error occured on the /thanks route ",
                err
            );
        });
    /*

    redirects to /petition if there is no cookie
    render thanks.handlebars

    */
});

app.get("/signers", (req, res) => {
    /*
    
    redirects to /petition if there is no cookie
    get the first and last of every signer from the database and pass them to signers.handlebars

    */
    console.log("###################### signers ###########################s");
    if (!req.session.id) {
        res.redirect("/petition");
        return;
    }
    db.getSignersInfo()
        .then((result) => {
            const signersInfos = result.rows;
            console.log("getSignersInfo", result);
            res.render("signers", {
                signersInfos,
                loggedIn: true,
            });
        })
        .catch((err) => console.log(err));
});

//let editData = {};

app.get("/edit", (req, res) => {
    if (req.session.id) {
        db.getUsersProfileData(req.session.id)
            .then((result) => {
                console.log(result.rows[0]);
                editData = result.rows[0];
                res.render("edit", {
                    user_profile: result.rows[0],
                    loggedIn: true,
                    loggedOut: false,
                });
            })
            .catch((err) => {
                console.log(err);
                res.render("edit", {
                    loggedIn: true,
                    error: err,
                });
            });
    } else {
        res.redirect("/register");
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.render("logged-out", {
        layout: "main",
        loggedOut: true,
    });
});

app.listen(process.env.PORT || 3000, () =>
    console.log("~~~~~~~~~~ petition up and runing ~~~~~~~~~~")
);

//         req.on("data", (chunk) => {
//             body += chunk;
//         });

// ///
//       req.on("end", () => {
//             //let { color, text } = qs.parse(body);
//             //console.log("color", color, "text", text);
//             const parsedBody = qs.parse(body);

// wili mentioned a db querry count (or smth) for the number of co-signers

// what are we going to build?!

/////////////////////
// is user logged in?

// has user signed already?
