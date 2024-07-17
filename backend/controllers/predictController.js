const express = require('express');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const { spawn } = require('child_process');
const path = require('path');

const router = express.Router();

router.post('/', (req, res) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    if (!token) {
        console.error('No token provided');
        return res.status(401).send({ message: 'No token provided' });
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            console.error('Failed to authenticate token:', err);
            return res.status(500).send({ message: 'Failed to authenticate token' });
        }

        const { features } = req.body;
        if (!features || !Array.isArray(features)) {
            console.error('Invalid input features:', req.body);
            return res.status(400).send({ message: 'Invalid input features' });
        }

        const scriptPath = path.join(__dirname, 'predict.py');
        const process = spawn('python3', [scriptPath, JSON.stringify(features)]);

        process.stdout.on('data', (data) => {
            try {
                const result = JSON.parse(data.toString());
                res.status(200).send(result);
            } catch (parseError) {
                console.error('Error parsing prediction result:', parseError);
                res.status(500).send({ message: 'Error parsing prediction result' });
            }
        });

        process.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            res.status(500).send({ message: 'Prediction failed' });
        });

        process.on('error', (error) => {
            console.error('Error spawning process:', error);
            res.status(500).send({ message: 'Error spawning process' });
        });
    });
});

module.exports = router;