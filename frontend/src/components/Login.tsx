import { Button, Container, Input, Image, Box } from "@chakra-ui/react";
import loginImageURL from "../images/SubscriptionAppLogo.png";
import { useState } from "react";
import { supabase } from "./Main";
import { APP_URL } from "../constants";

export default function Login() {
  const [email, setEmail] = useState("");
  const loginWithOTP = async (event) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: true,
        emailRedirectTo: APP_URL,
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
    <Box
      height="100vh"
      display="flex"
      flexDirection={"column"}
      alignItems="center"
      justifyContent="center"
    >
      {/* Add your image using the Image component */}
      <Image src={loginImageURL} alt="Login Image" boxSize="300px" mb={4} />

      <Input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        w="300px"
        mb={4}
      />
      <Box width="300px">
        <Button colorScheme="blue" onClick={loginWithOTP} w="100%">
          Login
        </Button>
      </Box>
    </Box>
  );
}
