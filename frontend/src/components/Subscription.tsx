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
        <Square size="100px" border="1px solid lightgray" borderRadius={"md"}>
          <Image src={props.image} />
        </Square>

        <Box marginLeft={"10px"}>
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
