import React from 'react';
import CreateUser from './components/CreateUser';
import UserList from './components/UserList';
import UpdateUser from './components/UpdateUser';
import GetToken from './components/GetToken';

function App() {
  return (
    <div>
      <h1>User CRUD Assignment ~ Dhruv Sood</h1>
      <CreateUser />
      <GetToken />
      <UserList />
      <UpdateUser />
    </div>
  );
}

export default App;
