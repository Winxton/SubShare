import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Box, Button } from '@chakra-ui/react';

import NewGroup from './NewGroup';
import ViewGroup from './ViewGroup';
import GroupList from './GroupList';

const Home = () => {
  return <h2>Home Page</h2>;
};


function App() {
  return (
    <Router>
        <Box mb="5">
          <Button><Link to="/">My Groups</Link></Button>
          <Button ml="2"><Link to="/new-group">New Group</Link></Button>
          <Button ml="2"><Link to="/view-group">View a Group</Link></Button>
        </Box>

        <Routes>
          <Route path="/" Component={GroupList} />
          <Route path="/new-group" Component={NewGroup} />
          <Route path="/view-group" Component={ViewGroup} />
        </Routes>
    </Router>
  );

  return <NewGroup />;
}

export default App;
