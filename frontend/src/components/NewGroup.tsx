import React, { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";

import {
  Button,
  Box,
  Square,
  Input,
  Wrap,
  WrapItem,
  Tabs,
  TabList,
  Tab,
  Flex,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import { GearIcon } from "@radix-ui/react-icons";

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
import ImageUpload from "./ImageUpload";

function NewGroup(props: { onClose: () => void; session: Session | null }) {
  const [selectedSubscription, setSelectedSubscription] =
    React.useState<Subscription | null>(null);
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const [splitMode, setSplitMode] = useState<"equally" | "byAmount">("equally");

  const subscriptions = [
    new Subscription("Netflix", netflixImage, 20),
    new Subscription("HBO", hboImage, 30),
    new Subscription("Disney", disney, 25),
    new Subscription("Spotify", spotify, 10),
    new Subscription("Youtube", youtubeImage, 12),
    new Subscription("Crunchy", crunchyrollImage, 7),
  ];
  const [isCreatingGroup, setIsCreatingGroup] = React.useState<boolean>(false); // new state
  const [selectedTab, setSelectedTab] = React.useState<number>(0); // new state
  const [user, setUser] = useState(null); // new state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from the server using the API
        const response = await fetch(`${API_URL}/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            access_token: props.session!.access_token,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const userData = await response.json();
        //using the auth user email we create a new Friend(group member) then add the new friend into the friend state
        const myself = new Friend(null, null, userData.user.email, true);
        setFriends([myself]);
        setUser(userData.user.email);
      } catch (error) {
        console.error("There was a problem fetching user data:", error);
      }
    };

    // Call the fetchUserData function when the component mounts
    fetchUserData();
  }, [props.session]); // Run this effect when the session prop changes

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

  function renderGroupDetails() {
    if (!selectedSubscription) {
      return;
    }

    return (
      <Flex mb="4" alignItems={"center"}>
        <Square size="100px" borderRadius={"md"}>
          <ImageUpload
            onImageUpload={(image) => {
              setSelectedSubscription({
                ...selectedSubscription,
                image: image as string,
              } as Subscription);
            }}
          >
            {selectedSubscription.image ? (
              <Image
                src={selectedSubscription.image}
                alt={selectedSubscription.name}
              />
            ) : (
              <Icon
                as={GearIcon}
                width="50px"
                height="50px"
                color="gray.400"
                cursor="pointer"
              />
            )}
          </ImageUpload>
        </Square>
        <Flex ml="2" direction={"column"}>
          <Input
            variant="flushed"
            value={selectedSubscription?.name}
            onChange={(e) => {
              setSelectedSubscription({
                ...selectedSubscription,
                name: e.target.value,
              } as Subscription);
            }}
          />

          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              color="gray.300"
              fontSize="1.2em"
              children="$"
            />
            <Input
              variant="flushed"
              value={`${selectedSubscription?.cost}`}
              onChange={(e) => {
                setSelectedSubscription({
                  ...selectedSubscription,
                  cost: parseInt(e.target.value),
                } as Subscription);
              }}
            />
          </InputGroup>
        </Flex>
      </Flex>
    );
  }

  function renderNewGroup() {
    return (
      <Box>
        {renderGroupDetails()}

        <Heading size="sm" mb="1">
          Select a Subscription
        </Heading>

        <Wrap>
          {/* List of known subscriptions */}
          {subscriptions.map((subscription) => {
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

          {/* Add a custom subscription */}
          <WrapItem
            margin="5px"
            onClick={() => {
              setSelectedSubscription(
                new Subscription("My Subscription", "", 0)
              );
            }}
            border={"none"}
            borderRadius={"md"}
          >
            <Square
              size="100px"
              border="1px solid lightgray"
              borderRadius={"md"}
            >
              <Icon as={GearIcon} width="50px" height="50px" color="gray.400" />
            </Square>
          </WrapItem>
        </Wrap>

        <Heading size="sm" mt="2" mb="1">
          Select Members
        </Heading>

        <AddFriend
          onAddFriend={(email) => {
            const newFriend = new Friend(null, null, email, null);
            setFriends([...friends, newFriend]);
          }}
        />

        {friends.map((friend) => {
          const isUser = friend.email === user;
          return (
            <Flex key={friend.email}>
              <FriendComponent
                email={friend.email}
                isMe={isUser}
                onRemove={(email) => {
                  // Check if it's the ser before removing
                  if (!isUser) {
                    const newFriends = friends.filter(
                      (friend) => friend.email !== email
                    );
                    setFriends(newFriends);
                  }
                }}
                splitMode={splitMode}
                subscriptionCost={selectedSubscription?.cost}
                friendCount={friends.length}
              ></FriendComponent>
            </Flex>
          );
        })}
        <Tabs
          mt="2"
          variant="soft-rounded"
          size="sm"
          index={selectedTab}
          onChange={setSelectedTab}
        >
          <TabList>
            <Tab onClick={() => setSplitMode("equally")}>Split Equally</Tab>
            <Tab onClick={() => setSplitMode("byAmount")}>By Amounts</Tab>
          </TabList>
        </Tabs>
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

              setIsCreatingGroup(true); // set isCreatingGroup to true

              // If both conditions are met, proceed to create and send the API request
              const newGroup = new Group(selectedSubscription, friends, null);
              setSelectedSubscription(null);
              setFriends([]);

              sendPostRequestToServer(newGroup);
            }}
            isLoading={isCreatingGroup} // set isLoading to isCreatingGroup
          >
            {isCreatingGroup ? "Creating Group..." : "Create Group"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default NewGroup;
