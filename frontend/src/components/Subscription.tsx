import { Box, Image, Flex, Text } from "@chakra-ui/react";
import { Friend } from "../models/Friend";
export function Subscription(props: {
  cost: string;
  image: string;
  name: string;
  members: Friend[];
}) {
  console.log("Members prop:", props.members);
  return (
    <Box>
      <Flex className="profile" margin="10px">
        <Image src={props.image} marginRight="10px" />
        <Box>
          <Text>{props.name} </Text>
          <Text>
            {props.cost}/month{" "}
            <Text as="span">{props.members.length} members</Text>
            {props.members.map((member, index) => (
              <Box key={index} marginTop="2">
                <Text>Email: {member.email}</Text>
              </Box>
            ))}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
