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
  IconButton,
} from "@chakra-ui/react";

import ConfirmDeleteGroupModal from "./ConfirmDeleteGroupModal";
import { DeleteIcon } from "@chakra-ui/icons";
import { Session } from "@supabase/supabase-js";

import { Subscription as SubscriptionComponent } from "./Subscription";
import useFetchUserData from "../utils/useFetchUserData";

import NewGroup from "./NewGroup";
import { Group } from "../models/Group";
import { getGravatarUrl } from "./Friend";
import { supabase } from "../App";
import * as API from "../utils/Api";
import {
  getSubscriptionCost,
  calculateSavings,
} from "../utils/SubscriptionCostUtils";

export default function GroupList(props: { session: Session | null }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const userData = useFetchUserData(props.session);
  const userEmail = userData?.user.email as string;
  const totalSubscriptionCost = getSubscriptionCost(groups, userEmail);
  const savings = calculateSavings(groups, userEmail);

  // The group to delete, in order to show the confirmation modal
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
  const [inactiveSubscriptions, setInactiveSubscriptions] = useState<Group[]>(
    []
  );

  useEffect(() => {
    refreshGroups();
  }, [isOpen]);

  async function handleDeleteGroup() {
    //typescript checks
    if (!groupToDelete) {
      console.error("Invalid groupToDelete:", groupToDelete);
      return;
    }

    const groupId = groupToDelete.id;

    if (!groupId) {
      console.error("Invalid groupId:", groupId);
      return;
    }
    // Send a PUT request to your API to soft delete the group
    await API.disbandGroup(groupId, props.session!.access_token);
    refreshGroups();

    setGroups((prevGroups) =>
      prevGroups.filter((group) => group !== groupToDelete)
    );
  }

  function refreshGroups() {
    const requestOptions = {
      headers: {
        access_token: props.session!.access_token,
      },
    };

    const p1 = API.getGroups(requestOptions, true)
      .then((data) => {
        setGroups(data);
      })
      .catch((error) => {
        console.error("Error fetching accepted groups:", error);
      });
    const p2 = API.getGroups(requestOptions, false)
      .then((data) => {
        setInactiveSubscriptions(data);
      })
      .catch((error) => {
        console.error("Error fetching all groups:", error);
      });

    Promise.all([p1, p2]).then(() => {
      setLoading(false);
    });
  }

  function findSubscriptionCostByEmail(group: Group, userEmail: string) {
    const friend = group.friends.find((friend) => friend.email === userEmail);
    return friend?.subscription_cost.toFixed(2);
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
          <Text fontWeight="bold">Total Subscriptions</Text>

          <Text>
            You owe{" "}
            <Text as="span" fontWeight="bold">
              ${totalSubscriptionCost.toFixed(2)}
            </Text>
            <Text as="span" fontSize="xs">
              /month
            </Text>
          </Text>

          <Text>
            <Text as="span" fontSize="xs" color="black" fontWeight="thin">
              {" "}
              You are saving $
            </Text>
            <Text as="span" fontWeight="bold" color="green">
              {savings.toFixed(2)}
            </Text>
            <Text as="span" fontSize="xs" fontWeight="thin">
              /month
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
            <Text fontWeight="bold">My Active Groups</Text>
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
                myCost={findSubscriptionCostByEmail(group, userEmail)}
                name={group?.subscription?.name}
                members={group?.friends}
              />
            </Link>
            <IconButton
              aria-label="delete group"
              icon={<DeleteIcon />}
              onClick={() => setGroupToDelete(group)}
            />
          </Flex>
        ))}

        {inactiveSubscriptions.length > 0 && (
          <>
            <Text fontWeight="bold">Inactive Groups</Text>
            {inactiveSubscriptions.map((invitedGroup) => (
              <Flex
                key={invitedGroup.subscription.name}
                justify="space-between"
              >
                <Box opacity={0.7}>
                  <SubscriptionComponent
                    image={invitedGroup?.subscription?.image}
                    myCost={invitedGroup?.subscription?.cost.toFixed(2)}
                    name={invitedGroup?.subscription?.name}
                    members={invitedGroup?.friends}
                  />
                </Box>
              </Flex>
            ))}
          </>
        )}
      </Stack>

      {isOpen && (
        <NewGroup
          onClose={onClose}
          session={props.session}
          userEmail={userEmail}
        />
      )}
      <ConfirmDeleteGroupModal
        groupName={groupToDelete?.subscription.name ?? ""}
        isOpen={groupToDelete !== null}
        onClose={() => {
          setGroupToDelete(null);
        }}
        onConfirm={handleDeleteGroup}
      />
    </Container>
  );
}
