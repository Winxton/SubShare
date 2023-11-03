import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Heading,
  Box,
  Image,
  VStack,
  Text,
  useTheme,
  Divider,
  Avatar,
  Center,
} from "@chakra-ui/react";
import spotify from "../images/spotify.png";
import friend1 from "../images/friend1.jpg";
import friend2 from "../images/friend2.jpg";
import friend3 from "../images/friend3.jpg";
import friend4 from "../images/friend4.jpg";
import { Friend } from "./Friend";
import { Subscription } from "../models/Subscription";
import { Group } from "../models/Group";

export default function ViewGroup() {
  const theme = useTheme();
  const { groupName } = useParams();
  const [selectGroup, setSelectGroup] = useState<Group | null>(null);
  const savedAmount = "10";
  const owedAmount = "5";
  // Use the `groupName` as part of the group name

  useEffect(() => {
    console.log(groupName);
    fetch(`http://localhost:4000/api/view-group/?groupName=${groupName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((groupData) => {
        console.log(`filteredGroup ${groupData}`);
        if (groupData.length > 0) {
          // Assuming the server returns an array, but you can modify the structure as needed
          const firstGroup = groupData[0];
          setSelectGroup(
            new Group(
              new Subscription(
                firstGroup.subscription.name,
                firstGroup.subscription.image,
                firstGroup.subscription.cost
              ),
              firstGroup.friends
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
    <Container bg={theme.colors.secondary[600]}>
      <Box
        className="Header"
        bg={theme.colors.primary[500]}
        w="100%"
        p={4}
        color="white"
      >
        <Heading as="h1" size="1xl" textAlign="center">
          {selectGroup.subscription.name} Group
        </Heading>
      </Box>

      <Box p={4}>
        {/* Shaded section with background color */}
        <Box bg="gray.200" p={4} borderRadius="md">
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
