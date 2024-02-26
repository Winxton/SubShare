import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Heading,
  Box,
  Image,
  VStack,
  Text,
  Divider,
  IconButton,
  Center,
  Spinner,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Friend } from "./Friend";
import { Group } from "../models/Group";
import { Session } from "@supabase/supabase-js";
import * as API from "../utils/Api";

export default function ViewGroup(props: { session: Session }) {
  const { groupId } = useParams();
  if (!groupId) {
    throw new Error("Must have groupId");
  }
  const navigate = useNavigate();
  const [selectGroup, setSelectGroup] = useState<Group | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const currentUserEmail = props.session.user?.email;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (groupId) {
          const group = await API.getGroup(groupId, props.session.access_token);
          setSelectGroup(group);
        }
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };

    fetchData();
  }, [groupId, props.session.access_token]);

  const isOwner = selectGroup?.friends.some(
    (friend) => friend.isowner && friend.email === currentUserEmail
  );
  const host = selectGroup?.friends.find((friend) => friend.isowner);

  const handlePaymentSubmit = () => {
    const email = currentUserEmail;
    setErrorMessage("");
    if (email && selectGroup) {
      API.settleUp(groupId, paymentAmount, email, props.session.access_token)
        .then(() => {
          console.log("Payment successful");
          onClose();
          // Update the local state to reflect the payment
          const updatedFriends = selectGroup.friends.map((member) => {
            if (member.email === email && member.balance) {
              return { ...member, balance: member.balance - paymentAmount };
            }
            return member;
          });
          setSelectGroup({ ...selectGroup, friends: updatedFriends });
        })
        .catch((error) => {
          console.error("Payment error:", error);
          setErrorMessage(error.message);
        });
    } else {
      console.error("Email is undefined");
      setErrorMessage("User email is undefined.");
    }
  };

  if (selectGroup === null) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  const totalCost = selectGroup.subscription.cost;

  // Calculate savedAmount dynamically
  const numberOfMembers = selectGroup?.friends.length ?? 0;
  const savedAmount = getSavedAmount(totalCost, numberOfMembers);

  const currentUser = selectGroup.friends.find(
    (member) => member.email === currentUserEmail
  );

  function getSavedAmount(totalCost: number | null, numberOfMembers: number) {
    if (totalCost !== null && numberOfMembers > 0) {
      // use subscription amount column
      const savedPerMember = totalCost - totalCost / numberOfMembers;
      return savedPerMember.toFixed(2);
    } else {
      return null;
    }
  }

  return (
    <Container maxW="3xl" /*bg={theme.colors.secondary[600]}*/>
      <IconButton
        left="16px"
        top="16px"
        aria-label="Go back"
        icon={<ArrowBackIcon />}
        onClick={() => {
          navigate(-1);
        }}
      />
      <Box
        className="Header"
        //bg={theme.colors.primary[500]}
        w="100%"
        p={4}
        color="black"
      >
        <Heading as="h1" size="lg" textAlign="center">
          {selectGroup.subscription.name} Group
        </Heading>
      </Box>

      <Box p={4}>
        {/* Shaded section with background color */}
        <Box /*bg="gray.200"*/ p={4} borderRadius="md">
          <Center mb={4}>
            <Image
              src={selectGroup.subscription.image}
              boxSize="100px"
              objectFit="contain"
              alt="Spotify Logo"
            />
          </Center>

          <Text textAlign="center">
            Total cost of the group is $
            <Text as="span" fontWeight="bold" color="black">
              {totalCost.toFixed(2)}
            </Text>
            <Text as="span" fontSize="xs">
              /month
            </Text>
          </Text>
          <Text textAlign="center">
            You are saving $
            <Text as="span" fontWeight="bold" color="green">
              {savedAmount}
            </Text>
            <Text as="span" fontSize="xs">
              /month
            </Text>
          </Text>
          {!isOwner && (
            <Text textAlign="center">
              You owe the Host $
              <Text as="span" fontWeight="bold" color="red">
                {currentUser?.balance}
              </Text>{" "}
              Total
            </Text>
          )}
        </Box>

        <VStack spacing={3} divider={<Divider borderColor="gray.200" />}>
          <Heading as="h2" size="lg" textAlign="left">
            Members
          </Heading>

          {selectGroup.friends.map((member) => (
            <Friend
              key={member.email}
              email={member.email}
              subscriptionCost={member.subscription_cost}
              isHost={member.isowner}
            />
          ))}
        </VStack>
      </Box>
      <Box display="flex" justifyContent="center" mt="4">
        {!isOwner && (
          <Button colorScheme="green" onClick={onOpen}>
            Settle
          </Button>
        )}
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        isCentered
        size="lg"
      >
        <ModalOverlay />
        <ModalContent borderRadius="lg" boxShadow="xl">
          <ModalHeader borderBottomWidth="1px" borderColor="gray.200">
            Settle Payment to Host
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={5}>
            <Text fontSize="lg" mb={4}>
              You owe{" "}
              <Text as="span" fontWeight="bold">
                ${currentUser?.balance}
              </Text>{" "}
              to{" "}
              <Text as="span" fontWeight="bold">
                {host?.email}
              </Text>{" "}
              for{" "}
              <Text as="span" fontWeight="bold">
                {selectGroup.subscription.name}
              </Text>
            </Text>
            <Input
              placeholder="Enter payment amount"
              value={paymentAmount || ""}
              onChange={(e) => setPaymentAmount(parseInt(e.target.value))}
              focusBorderColor="green.400"
              borderColor="gray.300"
              size="lg"
              mb={3}
            />
            {errorMessage && (
              <Text color="red.500" mt="2" fontSize="md">
                {errorMessage}
              </Text>
            )}
          </ModalBody>

          <ModalFooter borderTopWidth="1px" borderColor="gray.200">
            <Button
              colorScheme="green"
              mr={3}
              onClick={handlePaymentSubmit}
              size="md"
            >
              Submit Payment
            </Button>
            <Button variant="outline" colorScheme="red" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
