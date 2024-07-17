import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setToken}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5002/login', {username, password});
      setToken(response.data.access_token);
      history.push('/');
    } catch (error) {
      console.error('Error loggin in:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
        <div>
            <label>
                Username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </label>
        </div>
        <div>
            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
        </div>
        <button type="submit">Login</button>
    </form>
);
};

const DiabetesPredictor = ({ token }) => {
const [formData, setFormData] = useState({
    pregnancies: '',
    glucose: '',
    bloodPressure: '',
    skinThickness: '',
    insulin: '',
    bmi: '',
    diabetesPedigreeFunction: '',
    age: ''
});
const [result, setResult] = useState(null);

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value
    });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    const features = Object.values(formData).map(Number);
    try {
        const response = await axios.post('http://localhost:5002/predict', { features }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setResult(response.data);
    } catch (error) {
        console.error('Error making prediction:', error);
    }
};

return (
    <div>
        <h1>Diabetes Risk Predictor</h1>
        <form onSubmit={handleSubmit}>
            {Object.keys(formData).map((key) => (
                <div key={key}>
                    <label>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                        <input type="number" name={key} value={formData[key]} onChange={handleChange} required />
                    </label>
                </div>
            ))}
            <button type="submit">Predict</button>
        </form>
        {result && (
            <div>
                <h2>Prediction Result</h2>
                <p>Prediction: {result.prediction === 1 ? 'Diabetic' : 'Non-Diabetic'}</p>
                <p>Probability: {result.probability.map((prob, index) => (
                    <span key={index}>{prob.toFixed(2)} </span>
                ))}</p>
            </div>
        )}
    </div>
);
};

function App() {
const [token, setToken] = useState(localStorage.getItem('token'));

const setTokenAndStore = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
};

return (
    <Router>
        <Switch>
            <Route path="/login">
                <Login setToken={setTokenAndStore} />
            </Route>
            <Route path="/">
                {token ? <DiabetesPredictor token={token} /> : <Redirect to="/login" />}
            </Route>
        </Switch>
    </Router>
);
}

export default App;