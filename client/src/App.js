import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import NavBar from './components/NavBar';
import Home from './pages/Home';
import Messages from './pages/Messages';
import Friends from './pages/Friends';
import Login from './pages/Login';
import Register from './pages/Register';


function App() {
  return (
    <Router>
      <Container>
        <NavBar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/messages" element={<Messages />} />
          <Route exact path="/friends" element={<Friends />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
