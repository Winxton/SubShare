import React from "react";
import logo from "./logo.svg";

import {
  Button,
  Text,
  Box,
  Flex,
  Square,
  Input,
  Wrap,
  WrapItem,
  HStack,
  VStack,
} from "@chakra-ui/react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import { Heading } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";

import netflixImage from "../images/netflix.png";
import hboImage from "../images/hbo.png";

import disney from "../images/disney.png";
import spotify from "../images/spotify.png";

import youtubeImage from "../images/youtube.png";
import crunchyrollImage from "../images/crunchyroll.png";

import { Friend as FriendComponent } from "./Friend";
import { Friend } from "../models/Friend";
import { Subscription } from "../models/Subscription";
import { Group } from "../models/Group";

function NewGroup(props: { onClose: () => void }) {
  const [searchText, setSearchText] = React.useState<string>("");
  const [searchFriend, setSearchFriend] = React.useState<string>("");
  const [selectedSubscription, setSelectedSubscription] =
    React.useState<Subscription | null>(null);
  const [selectedFriends, setSelectedFriends] = React.useState<Friend[]>([]);

  const friends = [
    new Friend("winston", "https://bit.ly/sage-adebayo"),
    new Friend("nina", "https://bit.ly/dan-abramov"),
    new Friend("tommy", "https://bit.ly/code-beast"),
    new Friend("young", "https://bit.ly/sage-adebayo"),
  ];

  const subscriptions = [
    new Subscription("Netflix", netflixImage, 20),
    new Subscription("HBO", hboImage, 20),
    new Subscription("Disney", disney, 20),
    new Subscription("Spotify", spotify, 20),
    new Subscription("Youtube", youtubeImage, 20),
    new Subscription("Crunchy", crunchyrollImage, 20),
  ];

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(event.target.value);
  }
  function handleInputChangefriend(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchFriend(event.target.value);
  }
  const filteredSubscriptions = subscriptions.filter((subscription) => {
    return subscription.name.toLowerCase().includes(searchText.toLowerCase());
  });
  const filteredFriends = friends.filter((friend) => {
    return friend.name.toLowerCase().includes(searchFriend.toLowerCase());
  });

  function sendPostRequestToServer(group: Group) {
    // Define the URL of the server where you want to send the POST request
    const url = "http://localhost:4000/api/groups";

    // Create an object with the data you want to send in the request body
    const data = {
      subscription: group.subscription,
      friends: group.friends,
    };

    // Create the request configuration object
    const requestOptions = {
      method: "POST", // HTTP request method
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
        // You can also include additional headers here if needed
      },
      body: JSON.stringify(data), // Convert the data object to a JSON string
    };

    // Send the POST request using the fetch function
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the response body as JSON
      })
      .then((data) => {
        console.log("Response data:", data);
        // You can work with the response data here
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  function renderNewGroup() {
    return (
      <Box>
        <Heading size="lg">Create Group</Heading>
        <Heading size="md">Subscriptions</Heading>

        <Input
          placeholder="Search Subscriptions"
          size="sm"
          value={searchText}
          onChange={handleInputChange}
        />
        <Wrap>
          {filteredSubscriptions.map((subscription) => {
            const isSelected = selectedSubscription?.name === subscription.name;
            return (
              <WrapItem
                key={subscription.name}
                margin="5px"
                onClick={() => {
                  setSelectedSubscription(subscription);
                }}
                border={isSelected ? "1px solid blue" : "none"}
                borderRadius={"md"}
              >
                <Square size="150px" border="1px solid grey">
                  <Image src={subscription.image} alt={subscription.name} />
                </Square>
              </WrapItem>
            );
          })}
        </Wrap>

        <Heading size="md">Friends</Heading>
        <Input
          placeholder="Search Friends"
          size="sm"
          value={searchFriend}
          onChange={handleInputChangefriend}
        />
        <VStack>
          {filteredFriends.map((friend) => {
            const isSelected = selectedFriends.some(
              (selectedFriend) => selectedFriend.name === friend.name
            );

            return (
              <Flex
                width="100%"
                onClick={() => {
                  const newSelectedFriends = isSelected
                    ? selectedFriends.filter(
                        (selectedFriend) => selectedFriend.name !== friend.name
                      )
                    : [...selectedFriends, friend];
                  setSelectedFriends(newSelectedFriends);
                }}
              >
                <FriendComponent
                  name={friend.name}
                  isSelected={isSelected}
                  image={friend.image}
                  isMe={false}
                ></FriendComponent>
              </Flex>
            );
          })}
        </VStack>
      </Box>
    );
  }

  return (
    <Modal isOpen={true} onClose={props.onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Group</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{renderNewGroup()}</ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={props.onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              if (selectedSubscription && selectedFriends.length > 0) {
                const newGroup = new Group(
                  selectedSubscription,
                  selectedFriends
                );
                console.log(newGroup);
                setSelectedSubscription(null);
                setSelectedFriends([]);

                // TODO(tommy): Send an API Request to the server to create a new group
                sendPostRequestToServer(newGroup);
              } else {
                console.log("error");
              }
            }}
          >
            Create Group
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default NewGroup;
