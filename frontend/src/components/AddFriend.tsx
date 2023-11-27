import React, { useState } from "react";
import { Input, Button, HStack, FormControl } from "@chakra-ui/react";

type AddFriendProps = {
  onAddFriend: (email: string) => void; // Define a prop for the submit action
};

const AddFriend: React.FC<AddFriendProps> = ({ onAddFriend }) => {
  const [email, setEmail] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    onAddFriend(email);
    setEmail(""); // Reset the input field after submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl isRequired>
        <HStack spacing={4}>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
          <Button type="submit">Add Friend</Button>
        </HStack>
      </FormControl>
    </form>
  );
};

export default AddFriend;
