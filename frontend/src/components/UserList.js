import React, { useState } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]); // List of users
  const [token, setToken] = useState(''); // JWT token
  const [page, setPage] = useState(1); // Current page for pagination
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
  const [selectedUser, setSelectedUser] = useState(null); // User selected for viewing full profile

  // Fetch paginated users
  const fetchUsers = async (pageNumber = page) => {
    if (!token.trim()) {
      alert('Please enter a valid token.');
      setUsers([]); // Reset the user list if the token is empty
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/users?page=${pageNumber}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.data); // Update the user list
      setTotalPages(Math.ceil(response.data.total / 5)); // Calculate total pages
    } catch (error) {
      console.error('Error fetching users:', error.response ? error.response.data : error.message);
      alert(error.response?.data?.message || 'Failed to fetch users');
      setUsers([]); // Reset the user list if there's an error
    }
  };

  // Clear token and user list
  const clearToken = () => {
    setToken(''); // Reset the token
    setUsers([]); // Clear the user list
    setPage(1); // Reset pagination to the first page
    setTotalPages(1); // Reset total pages
  };

  // Delete a user by ID
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('User deleted successfully.');
      fetchUsers(); // Refresh the user list after deletion
    } catch (error) {
      console.error('Error deleting user:', error.response ? error.response.data : error.message);
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage); // Update the current page state
    fetchUsers(newPage); // Fetch users for the new page
  };

  // Handle view profile button click
  const viewProfile = (user) => {
    setSelectedUser(user); // Set the selected user for viewing
  };

  // Close the profile modal
  const closeModal = () => {
    setSelectedUser(null); // Clear the selected user
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">User List</h2>

      {/* JWT Token Input */}
      <div className="mb-4 d-flex">
        <input
          type="text"
          placeholder="Enter JWT Token"
          className="form-control me-2"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button
          onClick={() => fetchUsers(1)} // Fetch the first page when fetching users
          className="btn btn-primary me-2"
          disabled={!token.trim()}
        >
          Fetch Users
        </button>
        <button
          onClick={clearToken} // Clear the token and user list
          className="btn btn-secondary"
        >
          Clear
        </button>
      </div>

      {/* User List */}
      <ul className="list-group mb-4">
        {users.map((user) => (
          <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{user.name} {user.lastName}</strong> - {user.email}
              <br />
              <small><strong>User ID:</strong> {user._id}</small>
            </div>
            <div>
              <button
                onClick={() => viewProfile(user)}
                className="btn btn-info btn-sm me-2"
              >
                View Full Profile
              </button>
              <button
                onClick={() => deleteUser(user._id)}
                className="btn btn-danger btn-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          onClick={() => handlePageChange(page - 1)} // Go to the previous page
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          className="btn btn-secondary"
          onClick={() => handlePageChange(page + 1)} // Go to the next page
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {/* Profile Modal */}
      {selectedUser && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Last Name:</strong> {selectedUser.lastName}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Mobile:</strong> {selectedUser.mobile || 'N/A'}</p>
                <p><strong>User Image:</strong></p>
                {selectedUser.userImage ? (
                  <img
                    src={`http://localhost:5000/${selectedUser.userImage}`} // Adjust path if necessary
                    alt="User"
                    className="img-fluid rounded"
                  />
                ) : (
                  <p>No Image Available</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
