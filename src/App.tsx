import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Button, Text, Box, Flex, Square, Input, Wrap, WrapItem } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';

import netflixImage from './images/netflix.png';
import hboImage from './images/hbo.png';

import disney from './images/disney.png';
import spotify from './images/spotify.png';

import youtubeImage from './images/youtube.png';
import crunchyrollImage from './images/crunchyroll.png';

function App() {
  const [searchText, setSearchText] = React.useState<string>('');

  const subscriptions = [
    {
      name: 'Netflix',
      image: netflixImage,
    },
    {
      name: 'HBO',
      image: hboImage,
    },
    {
      name: 'Disney',
      image: disney,
    },
    {
      name: 'Spotify',
      image: spotify,
    },
    {
      name: 'Youtube',
      image: youtubeImage,
    },
    {
      name: 'Crunchy',
      image: crunchyrollImage,
    },
  ];

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(event.target.value);
  }

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    return subscription.name.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <div className="App">
      <Box>
        <Heading size="lg">Create Group</Heading>
        <Heading size="md">Subscriptions</Heading>

        <Input placeholder="Search Subscriptions" size="sm" value={searchText} onChange={handleInputChange} />
        <Wrap>
          {filteredSubscriptions.map((subscription) => (
            <WrapItem key={subscription.name} margin="5px">
              <Square size="150px" border="1px solid grey">
                <Image src={subscription.image} alt={subscription.name} />
              </Square>
            </WrapItem>
          ))}
        </Wrap>
      </Box>
    </div>
  );
}

export default App;
