import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Heading,
  Box,
  Image,
  VStack,
  Text,
  useTheme,
  Divider,
  IconButton,
  Center,
  Spinner, // Import Spinner component from Chakra UI
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Friend } from "./Friend";
import { Group } from "../models/Group";
import { Session } from "@supabase/supabase-js";

import * as API from "../utils/Api";

export default function ViewGroup(props: { session: Session }) {
  const theme = useTheme();
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [selectGroup, setSelectGroup] = useState<Group | null>(null);
  const [totalCost, setTotalCost] = useState<number | null>(null);

  const [savedAmount, setSavedAmount] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (groupId) {
          const group = await API.getGroup(groupId, props.session.access_token);
          setSelectGroup(group);

          // Log the value of group.subscription.cost

          // Check if group.subscription.cost is a valid number
          const totalCost =
            typeof group.subscription.cost === "number"
              ? group.subscription.cost
              : null;

          setTotalCost(totalCost);

          // Calculate savedAmount dynamically
          const numberOfMembers = group.friends.length;

          if (totalCost !== null && numberOfMembers > 0) {
            const savedPerMember = totalCost - totalCost / numberOfMembers;

            const formattedSavedPerMember = parseFloat(
              savedPerMember.toFixed(2)
            );

            setSavedAmount(formattedSavedPerMember);
          } else {
            setSavedAmount(null);
          }
        }
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };

    fetchData();
  }, [groupId, props.session.access_token]);

  if (selectGroup === null) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Container maxW="3xl" /*bg={theme.colors.secondary[600]}*/>
      <IconButton
        left="16px"
        top="16px"
        aria-label="Go back"
        icon={<ArrowBackIcon />}
        onClick={() => {
          navigate(-1);
        }}
      />
      <Box
        className="Header"
        //bg={theme.colors.primary[500]}
        w="100%"
        p={4}
        color="black"
      >
        <Heading as="h1" size="lg" textAlign="center">
          {selectGroup.subscription.name} Group
        </Heading>
      </Box>

      <Box p={4}>
        {/* Shaded section with background color */}
        <Box /*bg="gray.200"*/ p={4} borderRadius="md">
          <Center mb={4}>
            <Image
              src={selectGroup.subscription.image}
              boxSize="100px"
              objectFit="contain"
              alt="Spotify Logo"
            />
          </Center>

          <Text textAlign="center">
            Total cost of the group is&nbsp;${" "}
            <Text as="span" fontWeight="bold" color="black">
              {totalCost}
            </Text>{" "}
            {/* Add a space here */}
            per month
          </Text>
          <Text textAlign="center">
            You are saving ${" "}
            <Text as="span" fontWeight="bold" color="green">
              {savedAmount}
            </Text>{" "}
            per month
          </Text>
        </Box>

        <VStack spacing={3} divider={<Divider borderColor="gray.200" />}>
          <Heading as="h2" size="lg" textAlign="left">
            Members
          </Heading>

          {selectGroup.friends.map((member) => (
            <Friend email={member.email} />
          ))}
        </VStack>
      </Box>
    </Container>
  );
}
