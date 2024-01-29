import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mug } from "react-kawaii";

import {
  Container,
  Box,
  Flex,
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
import useFetchUserData from "../utils/useFetchUserData";

import NewGroup from "./NewGroup";
import { Group } from "../models/Group";
import { getGravatarUrl } from "./Friend";
import { supabase } from "../App";
import * as API from "../utils/Api";
import { getSubscriptionCost } from "../utils/SubscriptionCostUtils";

export default function GroupList(props: { session: Session | null }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groups, setGroups] = useState<Group[]>([]);
  const [invitedSubscriptions, setInvitedSubscriptions] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const savings = "$14.90";
  const userData = useFetchUserData(props.session);
  const userEmail = userData?.user.email as string;
  const totalSubscriptionCost = getSubscriptionCost(groups, userEmail);

  const handleDeleteGroup = (groupToDelete) => {
    // Send a DELETE request to your API to delete the group
    const groupId = groupToDelete.id;

    if (!groupId) {
      console.error("Invalid groupId:", groupId);
      return;
    }

    API.deleteGroup(groupId).then(() => {
      // Remove the deleted group from the state or UI
      // (You might need to adjust this based on your application's state management)
      // For example, if using React state:
      setGroups((prevGroups) =>
        prevGroups.filter((group) => group !== groupToDelete)
      );
    });
  };

  //to do nina
  const handleDeclineInvitation = (groupToDecline) => {};
  const handleAcceptInvitation = (groupToAccept) => {
    // Send a PUT request to API to update the group status
    const groupId = groupToAccept.id;

    if (!groupId) {
      console.error("Invalid groupId:", groupId);
      return;
    }

    API.acceptInvite(groupId, props.session!.access_token)
      .then(() => {
        setInvitedSubscriptions((prevInvitedGroups) =>
          prevInvitedGroups.filter((group) => group !== groupToAccept)
        );
        refreshGroups();
      })
      .catch((error) => {
        console.error("Error accepting group invitation:", error);
      });
  };

  useEffect(() => {
    refreshGroups();
  }, [isOpen]);

  function refreshGroups() {
    const requestOptions = {
      headers: {
        access_token: props.session!.access_token,
      },
    };

    const p1 = API.getAcceptedGroups(requestOptions)
      .then((data) => {
        setGroups(data);
      })
      .catch((error) => {
        console.error("Error fetching accepted groups:", error);
      });

    const p2 = API.getInvitedGroups(requestOptions)
      .then((data) => {
        setInvitedSubscriptions(data);
      })
      .catch((error) => {
        console.error("Error fetching all groups:", error);
      });

    Promise.all([p1, p2]).then(() => {
      setLoading(false);
    });
  }

  if (loading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
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
        <Avatar
          key={userEmail}
          src={getGravatarUrl(userEmail, 300)}
          margin="10px"
        />
        <Box>
          <Text fontWeight="bold"> Total Subscriptions</Text>
          <Text>
            You owe{" "}
            <Text as="span" fontWeight="bold">
              {totalSubscriptionCost}
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

        {groups.length === 0 && (
          <Flex align="center">
            <Mug size={60} mood="sad" color="#E0E4E8" />
            <Text ml="2" fontSize="sm" color="gray.500">
              You have no groups yet
            </Text>
          </Flex>
        )}
        {groups.map((group) => (
          <Flex align="center" justify="space-between" key={group.id}>
            <Link to={`/view-group/${group.id}`} key={group.subscription.name}>
              <SubscriptionComponent
                image={group?.subscription?.image}
                cost={
                  //looks for the user's subscription cost
                  userEmail
                    ? group?.friends
                        .find((friend) => friend.email === userEmail)
                        ?.subscription_cost.toString() || "0.00"
                    : "0.00"
                }
                name={group?.subscription?.name}
                members={group?.friends}
              />
            </Link>
            <IconButton
              aria-label="delete group"
              icon={<DeleteIcon />}
              onClick={() => handleDeleteGroup(group)}
            />
          </Flex>
        ))}
        <Text fontWeight="bold">Invited Groups</Text>

        {invitedSubscriptions.map((invitedGroup) => (
          <Flex key={invitedGroup.subscription.name} justify="space-between">
            <Link to={`/view-group/${invitedGroup.id}`}>
              <SubscriptionComponent
                image={invitedGroup?.subscription?.image}
                cost={invitedGroup?.subscription?.cost.toString()}
                name={invitedGroup?.subscription?.name}
                members={invitedGroup?.friends}
              />
            </Link>
            <Flex>
              <Button
                colorScheme="green"
                onClick={() => handleAcceptInvitation(invitedGroup)}
                variant="ghost"
              >
                Accept
              </Button>
              <Button
                variant="ghost"
                colorScheme="red"
                onClick={() => handleDeclineInvitation(invitedGroup)}
              >
                Decline
              </Button>
            </Flex>
          </Flex>
        ))}
      </Stack>

      {isOpen && (
        <NewGroup
          onClose={onClose}
          session={props.session}
          userEmail={userEmail}
        />
      )}
    </Container>
  );
}
