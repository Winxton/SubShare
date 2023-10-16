import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Button,Text, Box, Flex, Square } from '@chakra-ui/react'
import { SimpleGrid } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'

import netflixImage from './images/netflix.png';
import hboImage from './images/hbo.png';

function App() {
  const subscriptions = [
    {
      name: 'Netflix',
      image: netflixImage
    },
    {
      name: 'HBO',
      image: hboImage
    }
  ]

  return (
    <div className="App">

      <Box>
        <Heading size='md'>Subscriptions</Heading>
        <Flex >
          {subscriptions.map((subscription) => (
            <Square margin="5px" size='150px' border="1px solid grey">
              <Image src={subscription.image} alt="netflix" />
            </Square>
          ))}
        </Flex>
      </Box>
    </div>
  );
}

export default App;
