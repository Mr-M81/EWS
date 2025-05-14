import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import './LoginPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();

    // Prepare the payload
    const payload = {
      email,
      password,
    };

    try {
      const response = await axios.post('http://localhost:8081/teachers/login', payload);
      if (response.status === 200) {
        // Store the token in localStorage (assuming the backend returns a token)
        const token = response.data.token; // Adjust based on your backend response
        localStorage.setItem('token', token); // Store token for authentication

        // Redirect to the dashboard page
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again!');
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: 'url(/)' }}>
      <div className="login-card">
        <div className='sideImg'>
          <img src ='client/public/image.png'></img>
           <h1>Early Warning System</h1>
        </div>
        <h2>Login Now</h2>
        <p>Hi, welcome back 👋</p>

        {error && <p className="error-message">{error}</p>}

        <div className="login-options">
          <button className="google-login">
            <FaGoogle className="icon" />
            Sign in with Google
          </button>

          <span className="or">or</span>

          <input
            type="email"
            className="input-field"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="input-field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="forgot-password">
            <a href="#">Forgot password? Contact admin</a>
          </div>

          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>

      <div className="login-right"></div>
    </div>
  );
};

export default LoginPage;