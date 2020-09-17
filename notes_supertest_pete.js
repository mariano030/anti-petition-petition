//const { TestScheduler } = require("jest");
const supertest = require("supertest");
const cookieSession = require("cookie-session"); // references __mocks__
const csurf = require("csurf"); // same here checks __mocks__ folder

const app = express();
exports.app = app;

//is the same as:

const app = exports.app = express();

// edabit.com - challenges with tests

// in test
// test() first argument is description, 2nd arg is the test function
// supertest returns us a promsise

// test will also run index.js and we will have to stop it manually
// we can specify in index.js
// with this condition the test will not run the server on our specified port as well
if (require.main == module) {
    app.listen(3000, () => console.log("~~~~~ petition running on 3000 ~~~~~~"))
}


//in index.test.js
test("GET / welcome sends a 200 status code as a response" () => {
    return supertest(app).get("/welcome").then(res => {
        console.log(res.statusCode);
    expect(res.statusCode == 200)})  // we can use the .get .post methods here
}

test("POST /welcome works!", () => {
    return supertest(app).post("/welcome").then(res => {
        expect (res.statusCode).toBe(302);
        expect (res.headers.location).toBe("/hom")
    })
})


test("GET / home send 302 status as a pesponse if no cookie session", () => {
    cookieSession.mockSessionOnce({}); // giving an empty session object
    return superstest(app).get("/home").then(res =>
        expect(res.statusCode).toBe(302));
});


test("GET /home sends 200 status aas a response if ther is a cookie", () =>
cookieSession.mockSessionOnce({
    submitted: true,
    //id: 4
});

return supertest(app).get("/home").then(res => {
    expect(res.statusCode).toBe(200);
})))