import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Box, Button } from '@chakra-ui/react';

import NewGroup from './components/NewGroup';
import ViewGroup from './components/ViewGroup';
import GroupList from './components/GroupList';

const Home = () => {
  return <h2>Home Page</h2>;
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GroupList />} />
        <Route path="/view-group/:groupName" element={<ViewGroup />} />
      </Routes>
    </Router>
  );
}

export default App;
