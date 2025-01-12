# Project_CRUD

This repository contains a full-stack CRUD application built with **Node.js** for the backend and **React.js** for the frontend. The application allows users to perform Create, Read, Update, and Delete operations on user data stored in a MongoDB database via API requests.


## Setup


### Clone the Repository
```bash
git clone <repository-url>
cd Project_CRUD
```

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the `.env` file:
   Create a `.env` file in the `backend` directory and add the following:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/project_crud
   JWT_SECRET=your_jwt_secret
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```
5. The backend will run on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
4. The frontend will run on `http://localhost:3000`
