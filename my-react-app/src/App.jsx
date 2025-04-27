import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Welcome from './welcome';
import Login from './login';
import Admin from './admin';
import User from './user';
import Register from './register';
import Addclient from './addclient';
import Viewclient from './viewclient';
import Addinteraction from './addinteraction';
import Addproject from './addproject';
import Addissues from './addissues';
import Addinvoice from './addinvoice';
import Addtask from './addtask';
import Viewdetails from './viewdetails';
import Viewuser from './viewuser';
import Viewreport from './viewreport';
function App() {
  return (
    <Router>
      <div>

        <Routes>
          <Route path="/" element={<Welcome/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/user" element={<User/>} />
          <Route path="/admin" element={<Admin/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/addclient" element={<Addclient/>} />
          <Route path="/viewclient" element={<Viewclient/>} />
          <Route path="/addinteraction" element={<Addinteraction/>} />
          <Route path="/addproject" element={<Addproject/>} />
          <Route path="/addissue" element={<Addissues/>} />
          <Route path="/addinvoice" element={<Addinvoice/>} />
          <Route path="/viewdetails" element={<Viewdetails/>} />
          <Route path="/addtask" element={<Addtask/>} />
          <Route path="/viewuser" element={<Viewuser/>} />
          <Route path="/viewreport" element={<Viewreport/>} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
