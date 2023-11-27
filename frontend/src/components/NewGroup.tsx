import React from "react";
import logo from "./logo.svg";
import { Session } from "@supabase/supabase-js";

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
import AddFriend from "./AddFriend";

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
import { API_URL } from "../constants";

function NewGroup(props: { onClose: () => void; session: Session | null }) {
  const [searchText, setSearchText] = React.useState<string>("");
  const [selectedSubscription, setSelectedSubscription] =
    React.useState<Subscription | null>(null);
  const [friends, setFriends] = React.useState<Friend[]>([]);

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

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    return subscription.name.toLowerCase().includes(searchText.toLowerCase());
  });

  function sendPostRequestToServer(group: Group) {
    // Define the URL of the server where you want to send the POST request
    const url = `${API_URL}/groups`;

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
        access_token: props.session!.access_token,
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
        // Close the modal after successful response
        props.onClose();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  function renderNewGroup() {
    return (
      <Box>
        <Heading size="md" mb="1">
          Subscriptions
        </Heading>

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
                border={isSelected ? "1px solid #08a4a7" : "none"}
                borderRadius={"md"}
              >
                <Square
                  size="100px"
                  border="1px solid lightgray"
                  borderRadius={"md"}
                >
                  <Image src={subscription.image} alt={subscription.name} />
                </Square>
              </WrapItem>
            );
          })}
        </Wrap>

        <Heading size="md" mt="2" mb="1">
          Friends
        </Heading>

        <AddFriend
          onAddFriend={(email) => {
            const newFriend = new Friend(null, null, email);
            setFriends([...friends, newFriend]);
          }}
        />
        <VStack>
          {friends.map((friend) => {
            return (
              <FriendComponent
                email={friend.email}
                isMe={false}
                onRemove={(email) => {
                  const newFriends = friends.filter(
                    (friend) => friend.email !== email
                  );
                  setFriends(newFriends);
                }}
              ></FriendComponent>
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
            colorScheme="blue"
            onClick={() => {
              if (!selectedSubscription) {
                console.log("Error: Please select a subscription");
                return;
              }

              if (friends.length === 0) {
                console.log("Error: Please select at least one friend");
                return;
              }

              // If both conditions are met, proceed to create and send the API request
              const newGroup = new Group(selectedSubscription, friends, null);
              // console.log(newGroup);
              setSelectedSubscription(null);
              setFriends([]);

              sendPostRequestToServer(newGroup);
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
