import React, { useState } from 'react';
import axios from 'axios';

const UpdateUser = () => {
  const [userId, setUserId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    mobile: '',
    userImage: '',
  });
  const [token, setToken] = useState('');
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { name, lastName, email, mobile, userImage } = response.data.data;
      setFormData({ name, lastName, email, mobile, userImage });
      setIsUserLoaded(true);
    } catch (error) {
      console.error('Error fetching user:', error.response ? error.response.data : error.message);
      alert(error.response?.data?.message || 'Failed to fetch user');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error.response ? error.response.data : error.message);
      alert(error.response?.data?.message || 'Failed to update user');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Update User</h2>
      <div className="mb-4">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Enter User ID"
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Enter JWT Token"
          onChange={(e) => setToken(e.target.value)}
        />
        <button
          onClick={fetchUser}
          className="btn btn-primary mt-3 w-100"
        >
          Load User
        </button>
      </div>

      {isUserLoaded && (
        <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="form-control"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="mobile" className="form-label">Mobile</label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              className="form-control"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="userImage" className="form-label">User Image URL</label>
            <input
              type="text"
              id="userImage"
              name="userImage"
              className="form-control"
              value={formData.userImage}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Update User</button>
        </form>
      )}
    </div>
  );
};

export default UpdateUser;
