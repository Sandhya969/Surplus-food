import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import DonorDashboard from './pages/DonorDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import ReceiverDashboard from './pages/ReceiverDashboard';
import { getUser } from './api/auth';

function PrivateRoute({ children, role }) {
  const user = getUser();
  if(!user) return <Navigate to="/login" />;
  if(role && user.role !== role) return <Navigate to="/" />;
  return children;
}

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/donor" element={<PrivateRoute role="donor"><DonorDashboard/></PrivateRoute>}/>
        <Route path="/volunteer" element={<PrivateRoute role="volunteer"><VolunteerDashboard/></PrivateRoute>}/>
        <Route path="/receiver" element={<PrivateRoute role="receiver"><ReceiverDashboard/></PrivateRoute>}/>
        <Route path="/" element={<Navigate to="/login"/>}/>
      </Routes>
    </BrowserRouter>
  );
}
