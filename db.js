const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/petition"
);

module.exports.createUser = (first, last, email, password) => {
    const q = `
    INSERT into users (first, last, email, password)
        values ($1, $2, $3, $4) RETURNING *`;

    const params = [first, last, email, password];
    ///
    return db.query(q, params);
};

module.exports.getSigners = () => {
    const q = `SELECT user_id FROM signatures`;
    return db.query(
        `
        SELECT first, last FROM users WHERE id IN (SELECT user_id FROM signatures)`
    );
};

module.exports.getSignersCount = () => {
    const q = `
    SELECT COUNT(*) FROM signatures`; // WHERE *
    return db.query(q);
};

module.exports.getSignatureByUserId = (id) => {
    const q = `
    SELECT signature FROM signatures WHERE user_id = $1`;
    const params = [id];
    return db.query(q, params);
};

module.exports.addSignature = (imageCode, id) => {
    const q = `
    INSERT INTO signatures (signature, user_id)
        values ($1, $2)
    `;
    const params = [imageCode, id];
    return db.query(q, params);
};

module.exports.getUserPw = (email) => {
    const q = `
    SELECT password, id FROM users WHERE email = $1`;

    const params = [email];

    return db.query(q, params);
};

module.exports.addUserProfileData = (age, city, url, user_id) => {
    const q = `
    INSERT INTO user_profiles (age, city, url, user_id)
        values($1, $2, $3, $4)`;
    const params = [age, city, url, user_id];
    return db.query(q, params);
};

module.exports.getSignersInfo = () => {
    // const q = `
    // SELECT users.first AS users_first, users.last AS users_last, user_profiles.city AS users_city
    // FROM users
    // JOIN user_profiles
    // ON singers.id = songs.singer_id;
    // `;
    const q = `
    SELECT users.first AS users_first, users.last AS users_last, user_profiles.city AS users_city, user_profiles.age AS users_age, user_profiles.url AS users_url
    FROM signatures
    JOIN users
    ON signatures.user_id = users.id
    LEFT JOIN user_profiles
    ON users.id = user_profiles.user_id
    `;
    //const params = [];
    return db.query(q);
};

module.exports.getSignersInfoByCity = (city) => {
    const q = `
    SELECT users.first AS users_first, users.last AS users_last, user_profiles.city AS users_city, user_profiles.age AS users_age, user_profiles.url AS users_url
    FROM user_profiles
    INNER JOIN signatures
    ON user_profiles.user_id = signatures.user_id
    JOIN users
    ON signatures.user_id = users.id
    WHERE LOWER(user_profiles.city) =LOWER($1)
    `;
    const params = [city];
    return db.query(q, params);
};

module.exports.getUsersProfileData = (user_id) => {
    const q = `
    SELECT users.id, users.first AS users_first, users.last AS users_last, users.email AS users_email, user_profiles.city AS users_city, user_profiles.age AS users_age, user_profiles.url AS users_url
    FROM users 
    LEFT JOIN user_profiles
    ON users.id = user_profiles.user_id
    WHERE users.id = $1
    `;
    const params = [user_id];
    return db.query(q, params);
};

module.exports.updateUsersDataNoPw = (
    users_id,
    users_first,
    users_last,
    users_email
) => {
    const q = `
    UPDATE users
    SET first = $2, last = $3, email = $4
    WHERE id = $1;
    `;
    const params = [users_id, users_first, users_last, users_email];
    return db.query(q, params);
};

module.exports.updateUsersPw = (user_id, hashedPw) => {
    const q = `
    UPDATE users
    SET password = $2
    WHERE id =$1`;
    const params = [user_id, hashedPw];
    return db.query(q, params);
};

module.exports.updateUsersProfile = (
    users_age,
    users_city,
    users_url,
    users_id
) => {
    const q = `
    INSERT INTO user_profiles (age, city, url, user_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id)
    DO UPDATE SET age = $1, city = $2, url = $3
    WHERE user_profiles.user_id = $4
    `;

    const params = [users_age, users_city, users_url, users_id];
    return db.query(q, params);
};
