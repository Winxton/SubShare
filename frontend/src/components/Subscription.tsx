import { Box, Image, Flex, Text, Avatar, Square } from "@chakra-ui/react";
import { Friend } from "../models/Friend";
import { getGravatarUrl } from "./Friend";

export function Subscription(props: {
  myCost: string | undefined;
  image: string;
  name: string;
  members: Friend[];
}) {
  const numberOfMembers = props.members.length;

  return (
    <Box>
      <Flex className="profile" marginRight="10px" alignItems="center">
        <Square size="100px" borderRadius={"md"}>
          <Image src={props.image} />
        </Square>

        <Box marginLeft={"10px"}>
          <Text fontWeight={"medium"}>{props.name} </Text>
          <Box>
            <Flex>
              <Text fontSize={"sm"}>${props.myCost}/month</Text>
              <Text ml="1" mr="1" fontWeight={"bold"}>
                ·
              </Text>
              <Text fontSize={"sm"} as="span">
                {numberOfMembers} members
              </Text>
            </Flex>
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
