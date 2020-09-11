const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

module.exports.addSigner = (first, last, sig) => {
    const q = `
    INSERT into signatures (first, last, sig)
        values ($1, $2, $3)`;

    const params = [first, last, sig];
    ///
    return db.query(q, params);
};

module.exports.getCities = () => {
    db.getCities()
        .then((results) => {
            console.log("results ", results.rows);
        })
        .catch((e) => console.log(e));
    const q = `SELECT * FROM signatures`;
};
