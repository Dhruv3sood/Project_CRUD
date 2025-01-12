import React, { useState, useRef } from 'react';
import axios from 'axios';

// create user empty field acc to schema
const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
  });
  const [file, setFile] = useState(null); // For the user image file
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const fileInputRef = useRef(); // Ref for resetting the file input field

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set the selected file
  };

//   using regex to validate email and mobile number
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10}$/;

    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    if (!mobileRegex.test(formData.mobile)) {
      alert('Please enter a valid 10-digit mobile number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before proceeding
  if (!validateForm()) {
    return; // Stop form submission if validation fails
  }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => formDataToSend.append(key, formData[key]));
      if (file) {
        formDataToSend.append('userImage', file); // Attach the image file
      }
    //   used axios for http request on localhost server
      const response = await axios.post('http://localhost:5000/api/users', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('User created successfully!!');
      setToken(response.data.token);
      setShowToken(true);

      // Reset the form fields and file input
      setFormData({
        name: '',
        lastName: '',
        email: '',
        mobile: '',
        password: '',
      });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset the file input field
      }

      setTimeout(() => {
        setShowToken(false); // Hiding token after 5 seconds
      }, 5000);
    } catch (error) {
      console.error('Error creating user: (flag User)', error.response ? error.response.data : error.message);
      alert('Failed to create user');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token);
    alert('Token copied!!');
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Create User</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="form-control"
            placeholder="Enter Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="mobile" className="form-label">Mobile</label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            className="form-control"
            placeholder="Enter Mobile"
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="userImage" className="form-label">User Image</label>
          <input
            type="file"
            id="userImage"
            className="form-control"
            onChange={handleFileChange}
            ref={fileInputRef} // Attach ref to the file input field
            // reference to the file input field
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Create User</button>
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
          {/* accessiblity copy button */}
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

export default CreateUser;
