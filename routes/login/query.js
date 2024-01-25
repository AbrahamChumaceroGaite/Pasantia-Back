const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

function getUser(email) {
    return {
        query: `SELECT * from User WHERE Gmail = ?`,
        value: [email]
    };
}

function comparePassword(contrasena, hash) {
    return bcrypt.compareSync(contrasena, hash);
}

function generateAuthToken(user) {
    const payload = {
        name: user.name,
        userId: user.id
    };

    const options = {
        expiresIn: '4h', 
    };

    const secretKey = 'Omp4Bko8zb'; 

    const token = jwt.sign(payload, secretKey, options);
    return token;
}

module.exports = {
    getUser,
    comparePassword,
    generateAuthToken
}