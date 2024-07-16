const express = require('express');
const jwt = require('jsonwebtoken');
const authConfig = require('./config/auth');
const { spawn } = require('child_process');
const path = require('path');

const router = express.Router();

 router.post('/', (req, res) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    if (!token) {
        return res.status(401).send({message: 'No token provided'});
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            return res.status(500).send({message: 'Failed to authenticate token'});
        }

        const {features} = req.body;
        const scriptPath = path.join(__dirname, 'predict.py');
        const process = spawn('python3', [scriptPath, JSON.stringify(features)]);

        process.stdout.on('data', (data) => {
            const result = JSON.parse(data.toString());
            res.status(200).send(result);
        });

        process.stderr.on('data', (data) => {
            console.error('stderr: ${data}');
            res.status(500).send({message: 'Prediction failed'});
        });
    });
 });

 module.exports = router;