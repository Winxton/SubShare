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
import useFetchUserData from "../utils/useFetchUserData";
import * as API from "../utils/Api";
import { Console } from "console";

export default function ViewGroup(props: { session: Session }) {
  const { groupId } = useParams();
  if (!groupId) {
    throw new Error("Must have groupId");
  }
  const navigate = useNavigate();
  const [selectGroup, setSelectGroup] = useState<Group | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paymentAmount, setPaymentAmount] = useState("");

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
    (friend) => friend.isowner && friend.email === props.session.user?.email
  );

  const handlePaymentSubmit = () => {
    API.settleUp(groupId, paymentAmount, props.session.user?.email);
    onClose(); // Close the modal after submission
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

  function getSavedAmount(totalCost: number | null, numberOfMembers: number) {
    if (totalCost !== null && numberOfMembers > 0) {
      const savedPerMember = totalCost - totalCost / numberOfMembers; //use subscription amount column
      return parseFloat(savedPerMember.toFixed(2));
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
              {totalCost}
            </Text>{" "}
            per month
          </Text>
          <Text textAlign="center">
            You are saving $
            <Text as="span" fontWeight="bold" color="green">
              {savedAmount}
            </Text>{" "}
            per month
          </Text>
        </Box>

        <VStack spacing={3} divider={<Divider borderColor="gray.200" />}>
          <Heading as="h2" size="lg" textAlign="left">
            Members
          </Heading>

          {selectGroup.friends.map((member) => (
            <Friend email={member.email} amount={member.balance} />
          ))}
        </VStack>
      </Box>
      <Box display="flex" justifyContent="center" mt="4">
        {isOwner ? (
          <Button colorScheme="blue">Host</Button>
        ) : (
          <Button colorScheme="green" onClick={onOpen}>
            Settle
          </Button>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Settle Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Enter payment amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(parseInt(e.target.value))}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handlePaymentSubmit}>
              Submit Payment
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
