import {
  Flex,
  Text,
  Box,
  Input,
  IconButton,
  Grid,
  GridItem,
  Icon,
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import md5 from "md5";

import { CloseIcon } from "@chakra-ui/icons";
import { PiCrownBold } from "react-icons/pi";

export function Friend(props: {
  email: string;
  isMe?: boolean;
  onRemove?: (email: string) => void;
  isAmountEditable?: boolean;
  subscriptionCost?: number;
  isHost?: boolean;
  handleSubscriptionCostChange?: (email: string, value: number) => void;
}) {
  const gravatarUrl = `https://www.gravatar.com/avatar/${md5(
    props.email
  )}?s=200&d=identicon`;

  return (
    <Box
      bgColor="white"
      borderRadius="lg"
      textAlign="center"
      margin="20px"
      width="100%"
    >
      <Grid
        templateColumns="repeat(3, 1fr)"
        gap={4}
        p={4}
        alignItems="center"
        justify-content="right"
        minWidth="500px"
      >
        <GridItem colSpan={1} minWidth="270px" marginLeft="-20px">
          <Flex alignItems="center">
            <Avatar size="md" name={props.email} src={gravatarUrl} />

            <Text ml="2" color="gray.500">
              {props.email}
            </Text>
            {props.isHost && (
              <Icon
                ml={2}
                as={PiCrownBold}
                width="20px"
                height="20px"
                color="yellow.400"
              />
            )}
          </Flex>
        </GridItem>

        <GridItem colSpan={1}>
          {props.isAmountEditable ? (
            <Flex alignItems="center">
              <Text>$ </Text>
              <Input
                minWidth="150px"
                type="number"
                placeholder={props.subscriptionCost?.toFixed(2) || ""}
                onBlur={(e) => {
                  props.handleSubscriptionCostChange!(
                    props.email,
                    parseFloat(e.target.value) || props.subscriptionCost || 0
                  );
                }}
              />
            </Flex>
          ) : (
            <Flex minW="150px" justifyContent="flex-end" align="center">
              <Box borderWidth="1px" borderRadius="lg" p="2" bg="gray.100">
                <Text color="gray.700">
                  $ {props.subscriptionCost?.toFixed(2)}
                </Text>
              </Box>
              <Text ml="1" fontSize={"small"}>
                / month
              </Text>
            </Flex>
          )}
        </GridItem>

        <GridItem colSpan={1} maxWidth="50px">
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
        </GridItem>
      </Grid>
    </Box>
  );
}
export const getGravatarUrl = (email: string, size: number = 50) => {
  return `https://www.gravatar.com/avatar/${md5(email)}?s=${size}&d=identicon`;
};
