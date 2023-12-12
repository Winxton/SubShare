import {
  Flex,
  Text,
  Square,
  Image,
  IconButton,
  Box,
  Input,
} from "@chakra-ui/react";
import { CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/react";
import md5 from "md5";
import { useState } from "react";

export function Friend(props: {
  email: string;
  isMe?: boolean;
  isSelected?: boolean;
  onRemove?: (email: string) => void;
  splitMode?: string;
  subscriptionCost?: number;
  friendCount?: number;
}) {
  // Gravatar URL construction
  const gravatarUrl = `https://www.gravatar.com/avatar/${md5(
    props.email
  )}?s=200&d=identicon`;
  const subscriptionCost = props.subscriptionCost ?? 0;
  const numberOfGroupMembers = props.friendCount || 1;
  const subscriptionCostPerMember = subscriptionCost
    ? (subscriptionCost / numberOfGroupMembers).toFixed(2)
    : null;
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const handleCustomAmountChange = (value: string) => {
    const parsedValue = parseFloat(value) || null;

    // Validate that the custom amount does not exceed the subscription amount
    if (parsedValue !== null) {
      if (parsedValue <= subscriptionCost) {
        setCustomAmount(parsedValue);
      } else {
        // If the entered amount exceeds the subscription amount,
        // set customAmount to the remaining balance
        const remainingBalance =
          subscriptionCost -
          (subscriptionCostPerMember !== null
            ? parseFloat(subscriptionCostPerMember)
            : 0);
        setCustomAmount(remainingBalance);
      }
    } else {
      setCustomAmount(null);
    }
  };
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
      {props.splitMode === "equally" && (
        <Text>{subscriptionCostPerMember}</Text>
      )}

      {props.splitMode === "byAmount" && (
        <Box>
          <Text>$</Text>
          <Input
            type="number"
            placeholder="Enter custom amount"
            value={customAmount !== null ? customAmount : ""}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
          />
        </Box>
      )}
      {props.onRemove && (
        <IconButton
          aria-label="Remove"
          icon={<CloseIcon />}
          size={"sm"}
          variant={"ghost"}
          color="lightgray"
          onClick={() => props.onRemove!(props.email)}
        />
      )}
    </Flex>
  );
}
export const getGravatarUrl = (email: string, size: number = 50) => {
  return `https://www.gravatar.com/avatar/${md5(email)}?s=${size}&d=identicon`;
};
