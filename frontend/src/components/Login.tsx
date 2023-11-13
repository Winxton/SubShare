import { Button, Container, Input } from "@chakra-ui/react";
import { useState } from "react";
import { supabase } from "./Main";
import { API_URL } from "../constants";

export default function Login() {
  const [email, setEmail] = useState("");
  const loginWithOTP = async (event) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: true,
        emailRedirectTo: API_URL,
      },
    });
    console.log(data);
    console.log(error);

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for the login link!");
    }
  };

  // TODO:(nina) Add the logo here
  return (
    <Container maxW="3xl">
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button colorScheme="blue" onClick={loginWithOTP}>
        Login
      </Button>
    </Container>
  );
}
