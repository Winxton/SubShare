import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  useDisclosure,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

import { Session } from "@supabase/supabase-js";

import { Subscription as SubscriptionComponent } from "./Subscription";
import { Subscription } from "../models/Subscription";
import disney from "../images/disney.png";
import { API_URL } from "../constants";

import NewGroup from "./NewGroup";
import { Group } from "../models/Group";

import { supabase } from "../App";

export default function GroupList(props: { session: Session | null }) {
  const theme = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groups, setGroups] = useState<Group[]>([]);
  const [invitedSubscriptions, setInvitedSubscriptions] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const subscriptionCost = "$8.10";
  const savings = "$14.90";
  const profilePicture = "https://bit.ly/sage-adebayo";

  const handleDeleteGroup = (groupToDelete) => {
    // Send a DELETE request to your API to delete the group
    const groupId = groupToDelete.id;

    if (!groupId) {
      console.error("Invalid groupId:", groupId);
      return;
    }

    // Send a DELETE request to your API to delete the group
    fetch(`${API_URL}/groups/${groupId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Remove the deleted group from the state or UI
        // (You might need to adjust this based on your application's state management)
        // For example, if using React state:
        setGroups((prevGroups) =>
          prevGroups.filter((group) => group !== groupToDelete)
        );
      })
      .catch((error) => {
        console.error("Error deleting group:", error);
      });
  };

  useEffect(() => {
    const requestOptions = {
      headers: {
        access_token: props.session!.access_token,
      },
    };

    fetch(`${API_URL}/groups`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setGroups(
          data.map((groupData: any) => {
            return new Group(
              new Subscription(
                groupData.subscription.name,
                groupData.subscription.image,
                groupData.subscription.cost
              ),
              groupData.members,
              groupData.id
            );
          })
        );
        setLoading(false);
      });
  }, [isOpen]);

  useEffect(() => {
    const requestOptions = {
      headers: {
        access_token: props.session!.access_token,
      },
    };

    fetch(`${API_URL}/member-groups`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setInvitedSubscriptions(
          data.map((groupData: any) => {
            return new Group(
              new Subscription(
                groupData.subscription.name,
                groupData.subscription.image,
                groupData.subscription.cost
              ),
              groupData.members,
              groupData.id
            );
          })
        );
        setLoading(false);
      });
  }, [isOpen]);

  if (loading) {
    <Center height="100vh">
      <Spinner size="xl" />
    </Center>;
  }

  return (
    <Container maxW="3xl">
      <Box
        className="Header"
        w="100%"
        p={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading as="h1" size="md" textAlign="left">
          Groups
        </Heading>
        <Button
          size="sm"
          variant={"ghost"}
          onClick={() => {
            supabase.auth.signOut();
          }}
        >
          Sign Out
        </Button>
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
        borderRadius={"md"}
        padding="2"
      >
        <Flex align="center" justify="space-between">
          <Box>
            <Text fontWeight="bold">My Groups</Text>
          </Box>
          <Box>
            <Button colorScheme="blue" onClick={onOpen}>
              New Group
            </Button>
          </Box>
        </Flex>

        {groups.map((group) => (
          <Flex align="center" justify="space-between">
            <Link
              to={`/view-group/${group.subscription.name}`}
              key={group.subscription.name}
            >
              <SubscriptionComponent
                image={group?.subscription?.image}
                cost={group?.subscription?.cost.toString()}
                name={group?.subscription?.name}
                members={group?.friends?.length?.toString()}
              />
            </Link>
            <IconButton
              aria-label="delete group"
              icon={<DeleteIcon />}
              colorScheme="red"
              onClick={() => handleDeleteGroup(group)}
            />
          </Flex>
        ))}
        <Text fontWeight="bold">Invited Groups</Text>

        {invitedSubscriptions.map((invitedGroup) => (
          <Link
            to={`/view-group/${invitedGroup.subscription.name}`}
            key={invitedGroup.subscription.name}
          >
            <SubscriptionComponent
              image={invitedGroup?.subscription?.image}
              cost={invitedGroup?.subscription?.cost.toString()}
              name={invitedGroup?.subscription?.name}
              members={invitedGroup?.friends?.length?.toString()}
            />
          </Link>
        ))}
      </Stack>

      {isOpen && <NewGroup onClose={onClose} session={props.session} />}
    </Container>
  );
}
