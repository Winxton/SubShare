import { Box, Image, Flex, Text, Avatar, Square } from "@chakra-ui/react";
import { Friend } from "../models/Friend";
import { Friend as FriendComponent } from "./Friend";
import { getGravatarUrl } from "./Friend";

export function Subscription(props: {
  cost: string;
  image: string;
  name: string;
  members: Friend[];
}) {
  const numberOfMembers = props.members.length;
  const costPerMember = parseFloat(
    (parseFloat(props.cost) / numberOfMembers).toFixed(2)
  );
  return (
    <Box>
      <Flex className="profile" marginRight="10px" alignItems="center">
        <Square size="100px" borderRadius={"md"}>
          <Image src={props.image} />
        </Square>

        <Box marginLeft={"10px"}>
          <Text fontWeight={"medium"}>{props.name} </Text>
          <Box>
            <Text>${costPerMember}/month · </Text>
            <Text as="span">{numberOfMembers} members</Text>
            <Box>
              {" "}
              {props.members.map((member) => (
                <Avatar
                  key={member.email}
                  padding="6px"
                  src={getGravatarUrl(member.email, 75)}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
