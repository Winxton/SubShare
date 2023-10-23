import {
  Container,
  Heading,
  Box,
  HStack,
  Image,
  VStack,
  Text,
  useTheme,
  Divider,
  Avatar,
  Center,
} from "@chakra-ui/react";
import spotify from '../images/spotify.png';
import friend1 from '../images/friend1.jpg';
import friend2 from '../images/friend2.jpg';
import friend3 from '../images/friend3.jpg';
import friend4 from '../images/friend4.jpg';
import { Friend } from "./Friend";

export default function ViewGroup() {
  const theme = useTheme();
  const group = {
    name: "Albert's Spotify Group",
    owedAmount: "$3.75",
    savedAmount: "$0.75",
    members: [
      { name: "Albert Snow", image: friend1, isOwner: true },
      { name: "Chrisa Jenkins", image: friend2 },
      { name: "Bobby Miller", image: friend3 },
      { name: "Christine", image: friend4 , isYou: true },
    ],
  };

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
          {group.name}
        </Heading>
      </Box>

      <Box p={4}>
        {/* Shaded section with background color */}
        <Box bg="gray.200" p={4} borderRadius="md">
          <Center mb={4}>
            <Image
              src={spotify}
              boxSize="100px"
              objectFit="contain"
              alt="Spotify Logo"
            />
          </Center>

          <Text mt={2} textAlign="center">
            You owe Albert{" "}
            <Text as="span" fontWeight="bold">
              {group.owedAmount}
            </Text>
          </Text>

          <Text textAlign="center">
            <Text as="span" fontWeight="bold" color="green">
              {group.savedAmount}{" "}
            </Text>
            saved
          </Text>
        </Box>

        <VStack spacing={3} divider={<Divider borderColor="gray.200" />}>
          <Heading as="h2" size="lg" textAlign="left">
            Members
          </Heading>

          {group.members.map((member) => (
  <Friend name={member.name} image={member.image} isMe={member.isYou} />
))}
        </VStack>
      </Box>
    </Container>
  );
}
