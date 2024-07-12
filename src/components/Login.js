// src/Login.js
import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import '../App.css'; // Adjust the path if necessary

const clientId = '802675541969-cvfgqu3d33noqjbja89cs766mcvhjavj.apps.googleusercontent.com'; // Replace with your Google Client ID

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    // Redirect to the other project/page
    window.location.href = 'http://localhost:3001'; // URL of your other React app
  };

  const onSuccess = (response) => {
    console.log('Login Success:', response);
    // Redirect to the other project/page
    window.location.href = 'http://localhost:3001'; // URL of your other React app
  };

  const onFailure = (response) => {
    console.log('Login Failed:', response);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="login-container">
        <div className="login-box">
          <h2>Log in</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input 
                type="text" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              <label>Email</label>
            </div>
            <div className="input-box">
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <label>Password</label>
            </div>
            <div className="input-box">
              <input type="submit" value="Log in" />
            </div>
          </form>
          <div className="separator">OR</div>
          <GoogleLogin
            onSuccess={onSuccess}
            onError={onFailure}
          />
          <div className="forgot-password">
            <a href="#">Forgot password?</a>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
