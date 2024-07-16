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
}