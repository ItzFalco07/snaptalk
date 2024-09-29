import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import './index.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

const App = () => {    
  const Navigate = useNavigate();
  const User = localStorage.getItem('User')
  const CheckAuth = () => {
    if(User) {
      Navigate('/home')
    } else {
      Navigate('/')
    }
  }

  useEffect(()=> {
    CheckAuth()
  }, [])

  return (
      <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
      </Routes>
  );
};

export default App;
