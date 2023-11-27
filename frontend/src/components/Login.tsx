import { Button, Container, Input, Image, Box, Text, Alert, AlertIcon } from "@chakra-ui/react";
import loginImageURL from "../images/SubscriptionAppLogo.png";
import { useState } from "react";
import { supabase } from "../App";
import { APP_URL } from "../constants";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");

  const loginWithOTP = async () => {
    try {
     const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: true,
        emailRedirectTo: APP_URL,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setIsEmailSent(true);
    }
   } catch (error) {
    
   }
  };

  const handleGoBack = () => {
    setEmail("");
    setIsEmailSent(false);
    setError("");
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
      {!isEmailSent && (
      <Image src={loginImageURL} alt="Login Image" boxSize="300px" mb={4} />)}

    <Box width="300px" mb={4}></Box>
      {error && (
        <Alert width="300px" status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {isEmailSent ? (
        <Text mb={4}>
          Sent email to {email}. Check your email for the login link!
        </Text>
    ) : (
      <Input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        w="300px"
        mb={4}
      />
    )}
    
      <Box width="300px">
        {isEmailSent ? (
        <Button colorScheme="blue" onClick={handleGoBack} w="100%">
          Go Back
        </Button>
      ) : (
        <Button colorScheme="blue" onClick={loginWithOTP} w="100%">
          Login
        </Button>
      )}
    </Box>
  </Box>
 );
}
