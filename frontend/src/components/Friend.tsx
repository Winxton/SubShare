import { Flex, Text, Square, Image } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/react";
import md5 from "md5";

export function Friend(props: {
  email: string;
  isMe?: boolean; // Make isMe an optional property
  isSelected?: boolean; // Make isSelected an optional property
}) {
  // Gravatar URL construction
  const gravatarUrl = `https://www.gravatar.com/avatar/${md5(
    props.email
  )}?s=200&d=identicon`;

  return (
    <Flex
      align="center"
      alignItems={"center"}
      justifyContent="space-between" // Adjust alignment to place the checkmark to the right
      bgColor="white" // Set the background color of the box to white
      borderRadius="lg"
      textAlign={"center"}
      padding="2"
      width="100%"
    >
      <Flex alignItems={"center"}>
        <Avatar size="md" name={props.email} src={gravatarUrl} />
        <Text ml="2" color="gray.500">
          {props.email}
        </Text>
      </Flex>
      {props.isSelected && (
        <Square bg="green.500" borderRadius="full" p="2" ml="2">
          <CheckCircleIcon color="white" boxSize={4} />
        </Square>
      )}
    </Flex>
  );
}
