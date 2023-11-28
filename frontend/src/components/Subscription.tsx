import { Box, Image, Flex, Text, Avatar } from "@chakra-ui/react";
import { Friend } from "../models/Friend";
import { Friend as FriendComponent } from "./Friend";
import { getGravatarUrl } from "./Friend";
export function Subscription(props: {
  cost: string;
  image: string;
  name: string;
  members: Friend[];
}) {
  return (
    <Box>
      <Flex className="profile" margin="10px">
        <Image src={props.image} marginRight="10px" />
        <Box>
          <Text>{props.name} </Text>
          <Text>
            ${props.cost}/month *{" "}
            <Text as="span">{props.members.length} members</Text>
            <Box>
              {" "}
              {props.members.map((member) => (
                <Avatar padding="6px" src={getGravatarUrl(member.email, 75)} />
              ))}
            </Box>
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
