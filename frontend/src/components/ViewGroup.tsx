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
} from "@chakra-ui/react";
import { API_URL } from "../constants";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Friend } from "./Friend";
import { Subscription } from "../models/Subscription";
import { Group } from "../models/Group";
import { Session } from "@supabase/supabase-js";

export default function ViewGroup(props: { session: Session }) {
  const theme = useTheme();
  const { groupName } = useParams();
  const navigate = useNavigate();
  const [selectGroup, setSelectGroup] = useState<Group | null>(null);
  const savedAmount = "10";
  const owedAmount = "5";
  // Use the `groupName` as part of the group name

  useEffect(() => {
    fetch(`${API_URL}/groups?groupName=${groupName}`, {
      headers: { access_token: props.session.access_token },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((response) => {
        console.log("Server Response:", response); // used to see the response from server (inspect webpage)
        const { group } = response;
        if (group) {
          setSelectGroup(
            new Group(
              new Subscription(
                group.subscription.name,
                group.subscription.image,
                group.subscription.cost
              ),
              group.friends,
              group.id
            )
          );
        } else {
          // Handle the case where no matching group is found
          setSelectGroup(null);
        }
      });
  }, [groupName]);

  if (selectGroup === null) {
    return <div>No matching group found.</div>;
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

          <Text mt={2} textAlign="center">
            {/* You owe {selectGroup.members.find((member) => member.isMe)?.name || "me"}{" "} */}
            <Text as="span" fontWeight="bold">
              {owedAmount}
            </Text>
          </Text>

          <Text textAlign="center">
            <Text as="span" fontWeight="bold" color="green">
              {savedAmount}{" "}
            </Text>
            saved
          </Text>
        </Box>

        <VStack spacing={3} divider={<Divider borderColor="gray.200" />}>
          <Heading as="h2" size="lg" textAlign="left">
            Members
          </Heading>

          {selectGroup.friends.map((member) => (
            <Friend name={member.name} image={member.image} />
          ))}
        </VStack>
      </Box>
    </Container>
  );
}
