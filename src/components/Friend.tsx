import { Flex, Text, Square } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useState } from "react";

export function Friend(props: { name: string }) {
  const [showCheckCircle, setShowCheckCircle] = useState(false);

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
