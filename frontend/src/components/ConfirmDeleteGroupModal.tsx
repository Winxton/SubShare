import { useState } from "react";

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

export default function ConfirmDeleteGroupModal(props: {
  groupName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Group {props.groupName}?</ModalHeader>
        <ModalCloseButton onClick={props.onClose} />
        <ModalBody>
          Are you sure you want to delete this group? This will cancel the
          subscription for all members of the group.
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={props.onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            isLoading={loading}
            onClick={async () => {
              setLoading(true);
              await props.onConfirm();
              setLoading(false);
              props.onClose();
            }}
            variant="outline"
          >
            Delete Group
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
