import { Flex, Text, Square, Image } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

export function Friend(props: {
    name: string;
    image?: string; // Make image an optional property
    isMe?: boolean; // Make isMe an optional property
    isSelected?: boolean; // Make isSelected an optional property
}) {
    return (
        <Flex alignItems="start" justifyContent="flex-start" bgColor={'white'} borderRadius="lg" padding="2" width={'100%'}>
            {props.image && <Image borderRadius="full" src={props.image} alt={props.name} boxSize="50px" mr={2} />}
            <Text>{props.name}</Text>
            {props.isSelected && <CheckCircleIcon />}
        </Flex>
    );
    }
