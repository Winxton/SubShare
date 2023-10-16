import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Button,Text, Box, Flex, Square } from '@chakra-ui/react'
import { SimpleGrid } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'

import netflixImage from './images/netflix.png';
import hboImage from './images/hbo.png';

import disney from './images/disney.png'
import spotify from './images/spotify.png'

import youtubeImage from './images/youtube.png';
import crunchyrollImage from './images/crunchyroll.png';


function App() {
  const subscriptions = [
    {
      name: 'Netflix',
      image: netflixImage
    },
    {
      name: 'HBO',
      image: hboImage
    },
    {
      name: 'Disney',
      image: disney
    },
    {
      name: 'Spotify',
      image: spotify
    },
    { name: 'Youtube',
      image: youtubeImage
    },
    {
      name: 'Crunchy',
      image: crunchyrollImage
    },
    

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
