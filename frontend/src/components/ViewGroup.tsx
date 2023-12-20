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
  const savedAmount = "10";
  const owedAmount = "5";

  useEffect(() => {
    if (groupId) {
      API.getGroup(groupId, props.session.access_token).then((group) => {
        setSelectGroup(group);
      });
    }
  }, [groupId]);

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
            <Friend email={member.email} />
          ))}
        </VStack>
      </Box>
    </Container>
  );
}
