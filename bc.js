const bcrypt = require("bcryptjs");

let { genSalt, hash, compare } = bcrypt;

const { promisify } = require("util");

genSalt = promisify(genSalt);
hash = promisify(hash);
compare = promisify(compare);

// DEMO DEMO DEMO
// genSalt()
//     .then((salt) => {
//         console.log("salt", salt);
//         // hash expects two arguments: a plain text password and a salt
//         return hash("examplePassword", salt);
//     })
//     .then((hashedPw) => {
//         console.log("hashedPW", hashedPw); // hashedPw is safe to be stored in our database
//         // compare expects two args, a plain text password and a hashedPw. it returns a boolean
//         return compare("examplePassword", hashedPw);
//     })
//     .then((matchValueOfCompare) => {
//         console.log("do the pws match??: ", matchValueOfCompare);
//     });

module.exports.compare = compare;

module.exports.hash = (plainTxtPw) =>
    genSalt().then((salt) => hash(plainTxtPw, salt));
