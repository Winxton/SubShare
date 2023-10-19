import {
  Container,
  Box,
  Flex,
  useTheme,
  Avatar,
  Heading,
  Text,
} from "@chakra-ui/react";

export default function GroupList() {
  const theme = useTheme();
  const subscriptionCost = "$8.10";
  const savings = "$14.90";
  const profilePicture = "https://bit.ly/sage-adebayo";
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
      <Flex className="profile" margin="10px">
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
          <Text> {savings} saved</Text>
        </Box>
      </Flex>
    </Container>
  );
}
