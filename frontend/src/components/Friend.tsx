import { Flex, Text, Square, Image } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'

export function Friend(props: {
    name: string;
    image?: string; // Make image an optional property
    isMe?: boolean; // Make isMe an optional property
    isSelected?: boolean; // Make isSelected an optional property
}) {
    return (
        <Flex
        align="center"
        justifyContent="space-between" // Adjust alignment to place the checkmark to the right
        bgColor="white" // Set the background color of the box to white
        borderRadius="lg"
        padding="2"
        width="100%"
      >
        <Flex>
         {props.image && (
         <Avatar size='md' name={props.name} src={props.image} />
      )}
       <Text fontSize="lg" fontWeight="bold">
        {props.name}
      </Text>
      </Flex>
      {props.isSelected && (
        <Square bg="green.500" borderRadius="full" p="2" ml="2">
          <CheckCircleIcon color="white" boxSize={4} />
        </Square>
      )}
    </Flex>
  );
};
    

