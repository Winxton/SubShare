import {
  Container,
  Box,
  Flex,
  useTheme,
  Avatar,
  Heading,
  Text,
  Stack,
  StackDivider,
  Button,
  useDisclosure
} from "@chakra-ui/react";

import { Subscription as SubscriptionComponent } from "./Subscription";
import { Subscription } from "../models/Subscription";
import netflixImage from "../images/netflix.png";
import spotify from "../images/spotify.png";
import disney from "../images/disney.png";
import NewGroup from './NewGroup'
import React,{ useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Group } from "../models/Group";



export default function GroupList() {
  const theme = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const subscriptionCost = "$8.10";
  const savings = "$14.90";
  const profilePicture = "https://bit.ly/sage-adebayo";
  
  
  useEffect(() => {
    // TODO(Nina) Fetch the list of groups from the backend.
    //https://localhost:4000/api/groups
    
    fetch("http://localhost:4000/api/groups")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data)
      setGroups(data.map((groupData: any) => {
        return new Group(
          
          new Subscription(groupData.subscription.name,netflixImage, groupData.subscription.cost),
          groupData.members
        );
      }));
      setLoading(false);
    })

  



  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  const friendSubscriptions = [
    {
      name: "Disney",
      image: disney,
      cost: "3.75",
      members: "3/6",
    },
  ];
  console.log(groups)
  return (
    <Container maxW='3xl'>
      <Box
        className="Header"
        w="100%"
        p={4}
      >
        <Heading as="h1" size="md" textAlign="left">
          Groups
        </Heading>
      </Box>
      <Flex className="Profile" margin="10px">
        <Avatar src={profilePicture} marginRight="10px" />
        <Box>
          <Text fontWeight="bold"> Total Subscriptions</Text>
          <Text>
            You owe{" "}
            <Text as="span" fontWeight="bold">
              {subscriptionCost}
            </Text>
            /month
          </Text>
          <Text fontWeight="bold" color="green">
            {savings}
            <Text as="span" fontSize="xs" color="black" fontWeight="thin">
              {" "}
              Saved
            </Text>
          </Text>
        </Box>
      </Flex>
      <Stack
        className="MyGroup"
        direction={"column"}
        bg="white"
        divider={<StackDivider borderColor="gray.200" />}
        spacing={4}
        align="stretch"
        borderRadius={'md'}
        padding="2"
      >
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontWeight="bold">My Groups</Text>
        </Box>
        <Box>
          <Button colorScheme="blue" onClick={onOpen}>New Group</Button>
        </Box>
      </Flex>
      
      {groups.map((group) => (
        
          <Link to={`/view-group/${group.subscription.name}`} key={group.subscription.name}>
            <SubscriptionComponent
              image={group?.subscription?.image}
              cost={group?.subscription?.cost.toString()}
              name={group?.subscription?.name}
              members={group?.friends?.length?.toString()}
            />
          </Link>
        ))}
        <Text fontWeight="bold">Friend Groups</Text>
        {friendSubscriptions.map((subscription) => (
          <Link to={`/view-group/${subscription.name}`} key={subscription.name}>
            <SubscriptionComponent
              image={subscription.image}
              cost={subscription.cost}
              name={subscription.name}
              members={subscription.members}
            />
          </Link>
        ))}
      </Stack>


      {isOpen && <NewGroup onClose={onClose}/>}

    </Container>
  );
}
