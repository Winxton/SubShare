import { Box, Image, Flex, Text } from "@chakra-ui/react";
export function Subscription(props: {
  cost: string;
  image: string;
  name: string;
  members: string;
}) {
  return (
    <Box>
      <Flex className="profile" margin="10px">
        <Image src={props.image} marginRight="10px" />
        <Box>
          <Text>{props.name} </Text>
          <Text>
            {props.cost}/month <Text as="span">{props.members} members</Text>
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
