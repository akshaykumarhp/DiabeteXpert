const expresss = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const router = expresss.Router();

// Mock data for users
const users = {
    user1: bcrypt.hashSync('password1',8),
    user2: bcrypt.hashSync('password2',8),
};

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!users[username] || !bcrypt.compareSync(password, users[username])) {
        return res.status(401).send({message: 'Invalid username or password'});
    }

    const token = jwt.sign({id:username}, authConfig.secret, {
        expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).send({accessToken: token});
});

module.exports = router;