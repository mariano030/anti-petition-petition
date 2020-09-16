///

// sequel injection
// what we are prventing with the q= params= stuff

// eval
// takes string and runs (with) it! prevent
// very old, do not use, dangerous

// setTimeout (takes string and executes after delay)
// never use a string with setTimeout

// do not user constructor iwht functions nopes!

// take user input and show to other user - problematic
// <script src="sketchy.js"></script> - can be useed and then wil be execited
// -> xxs aka cross site script
// run foreign script on other persons website

// => always escape user inputs dangerous characters ! ! ! ! !

// handlebars automatically escapes your variables (for html NOT for js)
// {{{body}}} triple {} tells handlebars NOT to espcape the text

// use a 3rd party library sanatize (to escape malicous) html stuff - IF you want to allow html in you user input (e.g. forum <b></b>)
// dompurify - widely used - ppl on github are still adding stuff (recently)

//// cookie vulnerabilities
// cookies are autmoatically sent to site you request
// 3rd part can make you make requests (with your legitimate cookies) to other site, site will think it was you ..
// new cookie attribute: sameSite:true

res.cookie("name", "value", {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true, // prevents document.cookie reading it in the browser script
    sameSize: true, // not every browser
});

// clickjacking - iframes with cookies can be used

// xfo
app.use(function (req, res, next) {
    res.set("x-frame-options", "DENY");
    next();
});

// csrf when one site forges a request to another one using the cookies
// confirm if request is really coming form our site!
// give unguessable secret on our site -usually "token" or "csrf-token"
// in any request that can do smth dangerout - aka post requests

// always use - makes you look like you know whats going on

// use csurf middleware - (after cookie session & body parse)
// update all forms - handover csrf variable to every ...

///////////// heroku - app
// gives yo online server, installs your server from github
//
// git remote add nickname-heroku http://git.heroku.com/blablablaba
// process.env has environment variables

// heroku listen port:      process.env.PORT
// local listen port:       8080 or whatever you like

// command line bash:
// heroku pg:psql - be in the heroku folder for this

// gotta tell heroku the secrets via the heroku website...

// restart heroku form website - restart all dynos -

data.heroku.com;

\x;
