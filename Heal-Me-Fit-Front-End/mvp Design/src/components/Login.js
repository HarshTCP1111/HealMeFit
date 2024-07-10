import React, { useState } from 'react';
import '../App.css'; // Adjust the path if necessary

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
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
        <div className="forgot-password">
          <a href="#">Forgot password?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
