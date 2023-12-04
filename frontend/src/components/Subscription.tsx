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
  const numberOfMembers = props.members.length;
  const costPerMember = parseFloat(
    (parseFloat(props.cost) / numberOfMembers).toFixed(2)
  );
  return (
    <Box>
      <Flex className="profile" margin="10px">
        <Image src={props.image} marginRight="10px" />
        <Box>
          <Text>{props.name} </Text>
          <Text>
            ${costPerMember}/month *{" "}
            <Text as="span">{numberOfMembers} members</Text>
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
