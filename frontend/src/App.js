import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./Main";
import Calculator from "./Calculator";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Profile from "./Auth/Profile/Profile";
import PrivateRoute from "./Auth/PrivateRoute";
import { AuthProvider } from "./Auth/AuthContext";
import EmployeeLogin from './Auth/EmployeeLogin';
import EmployeeDashboard from './Employee/Dashboard'; 
import Layout from "./Layout";
import Pensioners from "./Pensioners";
import AboutRent from "./AboutRent";
import AboutUs from "./AboutUs";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/employee" element={<EmployeeLogin />} />
            <Route path="/employee/dashboard/*" element={<EmployeeDashboard />} />
            <Route path="/pensioners" element={<Pensioners />} />
            <Route path="/about-rent" element={<AboutRent />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
};

export default App;