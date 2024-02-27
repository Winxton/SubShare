import React, { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";

import {
  Button,
  FormControl,
  FormLabel,
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
import { RxGear } from "react-icons/rx";

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
import ImageUpload from "./ImageUpload";
import { updateSubscriptionCost } from "../utils/SubscriptionCostUtils";
import * as API from "../utils/Api";

type NewGroupProps = {
  onClose: () => void;
  session: Session | null;
  userEmail: string;
};

function NewGroup(props: NewGroupProps) {
  const toast = useToast();
  const [selectedSubscription, setSelectedSubscription] =
    React.useState<Subscription | null>(null);

  const user = new Friend(null, null, props.userEmail, true, 0, true);

  const [friends, setFriends] = React.useState<Friend[]>([user]);
  const [splitMode, setSplitMode] = useState<"equally" | "byAmount">("equally");
  const today = new Date();

  const subscriptions = [
    new Subscription("Netflix Premium", netflixImage, 22.99, today),
    new Subscription("HBO", hboImage, 15.99, today),
    new Subscription("Disney", disney, 13.99, today),
    new Subscription("Spotify Family", spotify, 16.99, today),
    new Subscription("Youtube Family", youtubeImage, 22.99, today),
    new Subscription("Crunchyroll", crunchyrollImage, 14.99, today),
  ];
  const [isCreatingGroup, setIsCreatingGroup] = React.useState<boolean>(false); // new state
  const [selectedTab, setSelectedTab] = React.useState<number>(0); // new state

  let pricePerMember = 0;

  if (splitMode === "equally" && selectedSubscription && friends.length > 0) {
    pricePerMember = parseFloat(
      (selectedSubscription.cost / friends.length).toFixed(2)
    );
  }
  useEffect(() => {
    const updatedFriends = updateSubscriptionCost(
      friends,
      splitMode,
      null,
      pricePerMember
    );
    setFriends(updatedFriends);
  }, [splitMode, pricePerMember]);

  // calculates the balance of the new subscription group
  let subscriptionBalance: number = selectedSubscription
    ? selectedSubscription.cost
    : 0;

  if (selectedSubscription) {
    if (splitMode === "byAmount") {
      // When splitMode is "byAmount", subtract each friend's subscription_cost from the total
      friends.forEach((friend) => {
        subscriptionBalance -= friend.subscription_cost;
      });

      subscriptionBalance = parseFloat(subscriptionBalance.toFixed(2));
    } else {
      subscriptionBalance = 0;
    }
  }

  function renderGroupDetails() {
    if (!selectedSubscription) {
      return;
    }

    return (
      <Flex mb="4" alignItems="flex-start">
        {/* Square with image upload */}
        <Square size="100px" borderRadius="md" mr="2">
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
                as={RxGear}
                width="50px"
                height="50px"
                color="gray.400"
                cursor="pointer"
              />
            )}
          </ImageUpload>
        </Square>

        {/* Subscription details */}
        <Flex direction="column">
          {/* Subscription name input */}
          <Input
            variant="flushed"
            value={selectedSubscription?.name}
            onChange={(e) => {
              setSelectedSubscription({
                ...selectedSubscription,
                name: e.target.value,
              } as Subscription);
            }}
            mb="2" // Add margin bottom for spacing
          />

          {/* Cost input */}
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
              mr="2" // Add margin right for spacing
            />
          </InputGroup>

          <div>
            <FormControl>
              <FormLabel marginTop="4" fontSize="sm">
                Billing Date
              </FormLabel>
            </FormControl>
            <Input
              type="date"
              id="start"
              name="billing_date"
              style={{ width: "100%", padding: "0.5rem" }}
              value={formatDate(selectedSubscription?.billing_date)}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value + "T00:00:00");

                setSelectedSubscription({
                  ...selectedSubscription,
                  billing_date: selectedDate,
                });
              }}
            />
          </div>
        </Flex>
      </Flex>
    );
  }
  // Helper function to format date as "yyyy-MM-dd"
  function formatDate(date: Date) {
    const isoString = date.toISOString();

    const formattedDate = isoString.split("T")[0];

    if (date instanceof Date && !isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } else {
      throw new Error(
        "date is either not an instance or not a valid time value"
      );
    }
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
                new Subscription("My Subscription", "", 0, today)
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
              <Icon as={RxGear} width="50px" height="50px" color="gray.400" />
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
            const newFriend = new Friend(null, null, email, true, 0, false);
            setFriends([...friends, newFriend]);
          }}
        />

        {friends.map((friend) => {
          const isUser = friend.email === props.userEmail;
          const isAmountEditable = splitMode === "byAmount"; // Determine if the amount is editable based on splitMode

          const onRemove = (email) => {
            if (!isUser) {
              const newFriends = friends.filter((f) => f.email !== email);
              setFriends(newFriends);
            }
          };

          return (
            <Flex key={friend.email}>
              <FriendComponent
                email={friend.email}
                isMe={isUser}
                onRemove={friend.isowner ? undefined : onRemove}
                isAmountEditable={isAmountEditable}
                subscriptionCost={friend.subscription_cost}
                handleSubscriptionCostChange={(email, amount) => {
                  // Find the friend with the matching email
                  const updatedFriends = updateSubscriptionCost(
                    friends,
                    splitMode,
                    email,
                    amount
                  );
                  // Update the state with the updated friends array
                  setFriends(updatedFriends);
                }}
                isHost={friend.isowner}
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
                  description: `The amount entered does not equal to ${selectedSubscription.name}'s subscription cost.`,
                  status: "error",
                  duration: 2000,
                  isClosable: true,
                });
                return;
              }

              setIsCreatingGroup(true); // set isCreatingGroup to true
              // If both conditions are met, proceed to create and send the API request
              const newGroup = new Group(selectedSubscription, friends, null);
              setSelectedSubscription(null);
              setFriends([]);
              API.createGroup(newGroup, props.session!.access_token).then(
                () => {
                  props.onClose();
                }
              );
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
