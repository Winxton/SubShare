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
} from "@chakra-ui/react";
import { Subscription } from "./Subscription";
import netflixImage from "../images/netflix.png";
import spotify from "../images/spotify.png";
import disney from "../images/disney.png";
export default function GroupList() {
  const theme = useTheme();
  const subscriptionCost = "$8.10";
  const savings = "$14.90";
  const profilePicture = "https://bit.ly/sage-adebayo";
  const subscriptions = [
    {
      name: "Netflix",
      image: netflixImage,
      cost: "$3.75",
      members: "3/5",
    },
    {
      name: "Spotify",
      image: spotify,
      cost: "$4.33",
      members: "2/6",
    },
  ];
  const friendSubscriptions = [
    {
      name: "Disney",
      image: disney,
      cost: "3.75",
      members: "3/6",
    },
  ];
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
          Groups
        </Heading>
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
      >
        <Text fontWeight="bold">My Groups</Text>
        {subscriptions.map((subscription) => (
          <Subscription
            image={subscription.image}
            cost={subscription.cost}
            name={subscription.name}
            members={subscription.members}
          />
        ))}
        <Text fontWeight="bold">Friend Groups</Text>
        {friendSubscriptions.map((subscription) => (
          <Subscription
            image={subscription.image}
            cost={subscription.cost}
            name={subscription.name}
            members={subscription.members}
          />
        ))}
      </Stack>
    </Container>
  );
}
