import {
  Flex,
  Text,
  Box,
  Input,
  IconButton,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/react";
import md5 from "md5";

export function Friend(props: {
  email: string;
  isMe?: boolean;
  isSelected?: boolean;
  onRemove?: (email: string) => void;
  splitMode?: string;
  splitCustomAmount: number;
  subscriptionCostPerMember?: number;
  handleCustomAmountChange?: (email: string, value: number) => void;
}) {
  // Gravatar URL construction
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
          </Flex>
        </GridItem>

        <GridItem colSpan={1}>
          {props.splitMode === "equally" && (
            <Flex justifyContent="flex-end">
              <Box
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                p="3"
                boxShadow="base"
              >
                <Text>$ {props.subscriptionCostPerMember}</Text>
              </Box>
            </Flex>
          )}

          {props.splitMode === "byAmount" && (
            <Flex alignItems="center">
              <Text>$ </Text>
              <Input
                minWidth="150px"
                type="number"
                placeholder="Custom Amount"
                value={props.splitCustomAmount || ""}
                onChange={(e) => {
                  props.handleCustomAmountChange!(
                    props.email,
                    parseFloat(e.target.value)
                  );
                }}
              />
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
