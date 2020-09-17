const supertest = require("supertest");
const { app } = require("./index.js");
const cookieSession = require("cookie-session");

// examples from pete

// working
test("GET /public sends a 200 status code as a response", () => {
    return supertest(app)
        .get("/style.css")
        .then((res) => {
            // console.log('res.statusCode: ',res);
            expect(res.statusCode).toBe(200);
        });
});

test("GET logged in USR redirected to petition  when  attempt to go to LOGIN page", () => {
    cookieSession.mockSessionOnce({
        id: 5,
    });
    return supertest(app)
        .get("/login")
        .then((res) => {
            expect(res.statusCode).toBe(302);
            console.log("res.headers.location", res.headers.location);
            expect(res.headers.location).toBe("/petition");
        });
});

test("ex2: GET logged in USR redirected to petition  when  attempt to go to REGISTER page", () => {
    cookieSession.mockSessionOnce({
        id: 5,
    });
    return supertest(app)
        .get("/register")
        .then((res) => {
            expect(res.statusCode).toBe(302);
            console.log("res.headers.location", res.headers.location);
            expect(res.headers.location).toBe("/petition");
        });
});

test("logged in and not signed the petition - redirected to the petition page when go to thank you page / or the signers page", () => {
    cookieSession.mockSessionOnce({
        id: 5,
    });
    return supertest(app)
        .get("/thanks")
        .then((res) => {
            expect(res.statusCode).toBe(302);
            expect(res.headers.location).toBe("/petition");
        });
});

// failing
// test("GET /petition NO cookie rdr-> /register", () => {
//     cookieSession.mockSessionOnce({});
//     return supertest(app)
//         .get("/petition")
//         .then((res) => {
//             expect(res.statusCode).toBe(302);
//             expect(res.headers.location).toBe("/register");
//         });
// });
// test("POST /welcome works! ", () => {
//     return supertest(app)
//         .post("/welcome")
//         .then((res) => {
//             expect(res.statusCode).toBe(302);
//             expect(res.headers.location).toBe("/home");
//         });
// });

//failing
// test("GET /thanks sends 302 status as a response when no cookie session", () => {
//     cookieSession.mockSessionOnce({});
//     return supertest(app)
//         .get("/thanks")
//         .then((res) => {
//             expect(res.statusCode).toBe(302);
//             expect(res.headers.location).toBe("/home");
//         });
// });

// passing
test("GET /edit sends 200 status as a response if there is a cookie", () => {
    cookieSession.mockSessionOnce({
        id: true,
    });
    return supertest(app)
        .get("/edit")
        .then((res) => {
            expect(res.statusCode).toBe(200);
        });
});

// examples from notes

// test("Request to /home is successful", () => {
//     return supertest(app)
//         .get("/home")
//         .then((res) => {
//             expect(res.statusCode).toBe(200);
//             expect(res.headers["content-type"]).toContain("text/html");
//         });
// });

// test('Request to /home is successful', () => {
//     return supertest(app)
//         .get('/home')
//         .expect(200)
//         .expect('content-type', 'text/html')
//     ;
// });

// test("POST request is successful", () => {
//     return supertest(app)
//         .post("/")
//         .send("text=hello&color=magenta")
//         .then((res) => {
//             expect(res.statusCode).toBe(200);
//             expect(res.headers["content-type"]).toContain("text/html");
//             expect(res.text).toContain("<title>hello</title>");
//             expect(res.text).toContain('style="color:magenta;"');
//         });
// });
