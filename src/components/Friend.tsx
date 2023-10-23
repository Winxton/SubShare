import { Flex, Text, Square } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useState } from "react";

export function Friend(props: { name: string image={member.image} isMe={member.isYou}}) {
  const [showCheckCircle, setShowCheckCircle] = useState(false);
  image={member.image} isMe={member.isYou}
  const selectName = () => {
    setShowCheckCircle(!showCheckCircle);
  };

  return (
    <Flex>
      <Square size="150px" border="1px solid grey" onClick={selectName}>
        <Text>{props.name}</Text>
      </Square>
      {showCheckCircle && <CheckCircleIcon />}
    </Flex>
  );
}
