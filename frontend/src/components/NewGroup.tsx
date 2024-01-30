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
  Text,
  useToast,
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
import { subscriptionCosts } from "../utils/SubscriptionCostUtils";

type NewGroupProps = {
  onClose: () => void;
  session: Session | null;
  userEmail: string;
};

function NewGroup(props: NewGroupProps) {
  const toast = useToast();
  const [selectedSubscription, setSelectedSubscription] =
    React.useState<Subscription | null>(null);

  const user = props.userEmail
    ? [new Friend(null, null, props.userEmail, true, 0, true)]
    : [];

  const [friends, setFriends] = React.useState<Friend[]>(user);
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

  if (splitMode === "equally" && selectedSubscription && friends.length > 0) {
    const pricePerMember = selectedSubscription.cost / friends.length;
    const updatedFriends = friends.map((friend) => ({
      ...friend,
      subscription_cost: pricePerMember,
    }));
    if (
      !friends.every((friend) => friend.subscription_cost === pricePerMember)
    ) {
      setFriends(updatedFriends);
    }
  }

  // calculates the balance of the new subscription group
  let subscriptionBalance: number = selectedSubscription
    ? selectedSubscription.cost
    : 0;

  if (selectedSubscription) {
    friends.forEach((friend) => {
      subscriptionBalance -= friend.subscription_cost;
    });
  }

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
                  cost: parseInt(e.target.value) || 0,
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
        <Heading size="sm" mt="2" mb="1">
          Select Members
        </Heading>

        <AddFriend
          onAddFriend={(email) => {
            const newFriend = new Friend(null, null, email, false, 0, false);
            setFriends([...friends, newFriend]);
          }}
        />

        {friends.map((friend) => {
          const isUser = friend.email === props.userEmail;
          const isAmountEditable = splitMode === "byAmount"; // Determine if the amount is editable based on splitMode
          return (
            <Flex key={friend.email}>
              <FriendComponent
                email={friend.email}
                isMe={isUser}
                onRemove={(email) => {
                  if (!isUser) {
                    const newFriends = friends.filter((f) => f.email !== email);
                    setFriends(newFriends);
                  }
                }}
                isAmountEditable={isAmountEditable}
                subscriptionCost={friend.subscription_cost}
                handleSubscriptionCostChange={(email, amount) => {
                  // Find the friend with the matching email
                  const updatedFriends = friends.map((friend) => {
                    if (friend.email === email) {
                      // Update the subscription_cost for the matched friend
                      return { ...friend, subscription_cost: amount };
                    }
                    return friend;
                  });

                  // Update the state with the updated friends array
                  setFriends(updatedFriends);
                }}
              ></FriendComponent>
            </Flex>
          );
        })}

        <Flex
          margin="50px"
          border={
            subscriptionBalance !== 0 ? "2px solid red" : "2px solid green"
          }
          p={3}
          borderRadius="md"
          justifyContent="space-around"
        >
          <Text>Balance Remaining</Text>
          <Text ml={2} color={subscriptionBalance !== 0 ? "red" : "green"}>
            $ {subscriptionBalance}
          </Text>
        </Flex>
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
              if (subscriptionBalance !== 0) {
                toast({
                  title: "Error",
                  description:
                    "The amount entered exceeds the remaining balance.",
                  status: "error",
                  duration: 2000,
                  isClosable: true,
                });
                return;
              }

              setIsCreatingGroup(true); // set isCreatingGroup to true

              // If both conditions are met, proceed to create and send the API request
              const newGroup = new Group(selectedSubscription, friends, null);

              sendPostRequestToServer(newGroup);

              setSelectedSubscription(null);
              setFriends([]);
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
