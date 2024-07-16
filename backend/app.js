const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./controllers/authController');
const predictRoutes = require('./controllers/predictController');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/auth',authRoutes);
app.use('/predict',predictRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});