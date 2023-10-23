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

export default function ViewGroup() {
  const theme = useTheme();
  const group = {
    name: "Albert's Spotify Group",
    owedAmount: "$3.75",
    savedAmount: "$0.75",
    members: [
      { name: "Albert Snow", profilePicture: "URL_HERE", isOwner: true },
      { name: "Chrisa Jenkins", profilePicture: "URL_HERE" },
      { name: "Bobby Miller", profilePicture: "URL_HERE" },
      { name: "Christine", profilePicture: "URL_HERE", isYou: true },
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
          <Text as="span" fontWeight="bold" color="green">{group.savedAmount} </Text>
          saved
        </Text>

      
      </Box>


      <VStack spacing={3} divider={<Divider borderColor="gray.200" />}>
      <Heading as="h2" size="lg" className="custom-heading">
         Members
      </Heading>

        {group.members.map((member) => (
          <HStack key={member.name} spacing={3} w="100%">
            <Avatar src={member.profilePicture} />
            <Text>
              {member.name} {member.isOwner && "(owner)"}
              {member.isYou && "(you)"}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  </Container>
    );
}
