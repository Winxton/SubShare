
import { Flex, Text } from '@chakra-ui/react';

export function Friend(props: {
    name: string,
}) {
    return (
        <Flex>
            <Text>{props.name}</Text>
        </Flex>
    )
}