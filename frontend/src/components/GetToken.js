import React, { useState } from 'react';
import axios from 'axios';

const GetToken = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);


//   using axios to post request to get token
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/getToken', {
        email,
        password,
      });

      setToken(response.data.token);
      setShowToken(true);

      // Reset the form fields
      setEmail('');
      setPassword('');

      // Hide the token after 5 seconds
      setTimeout(() => {
        setShowToken(false);
      }, 5000);

      alert('Token retrieved successfully!!');
    } catch (error) {
      console.error('Error fetching token:(flag1)', error.response ? error.response.data : error.message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token);
    alert('Token copied to clipboard');
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Get JWT Token</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Get Token</button>
      </form>

      {showToken && (
        <div className="mt-4">
          <h5 className="text-success">JWT Token (Visible for 5 seconds)</h5>
          <textarea
            value={token}
            readOnly
            rows="3"
            className="form-control mb-2"
          />
          <button
            onClick={copyToClipboard}
            className="btn btn-success w-100"
          >
            Copy Token
          </button>
        </div>
      )}
    </div>
  );
};

export default GetToken;
