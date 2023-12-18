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
import { useDispatch, useSelector } from "react-redux";
import { setCustomAmount } from "../store/subscriptionSlice";
import { RootState } from "../store/store";

export function Friend(props: {
  email: string;
  isMe?: boolean;
  isSelected?: boolean;
  onRemove?: (email: string) => void;
  splitMode?: string;
  splitCustomAmount: number | null;
  subscriptionCost?: number;
  friendCount?: number;
  handleCustomAmountChange?: (email: string, value: number) => void;
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

  const customAmounts = useSelector(
    (state: RootState) => state.subscription.customAmounts
  );

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
          <Flex>
            <Text>$</Text>
            <Input
              type="number"
              placeholder="Enter custom amount"
              value={props.splitCustomAmount || 0}
              onChange={(e) => {
                const parsedValue = parseFloat(e.target.value) || null;
                if (parsedValue) {
                  props.handleCustomAmountChange!(props.email, parsedValue);
                }
              }}
            />
          </Flex>
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
