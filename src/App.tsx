import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Button } from '@chakra-ui/react'

function App() {
  return (
    <div className="App">
      <div className="bg-green-500">
          This div has a blue background.
        </div>

        <Button variant="outline">Button</Button>
    </div>
  );
}

export default App;
