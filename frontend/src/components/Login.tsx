import {
  Button,
  Container,
  Input,
  Image,
  Box,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import loginImageURL from "../images/subshare-logo.webp";
import { useState } from "react";
import { supabase } from "../App";

const APP_URL = process.env.REACT_APP_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const loginWithOTP = async () => {
    setIsLoggingIn(true);
    console.log(APP_URL);

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
        resetError(); // Reset the error state when there is no error
      }
    } catch (error) {
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoBack = () => {
    setEmail("");
    setIsEmailSent(false);
    resetError(); // Reset the error state
  };

  // Function to reset the error state
  const resetError = () => {
    setError("");
  };

  const handleEmailChange = (e) => {
    // Reset the error state when the email input changes
    resetError();
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginWithOTP();
  };

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection={"column"}
      alignItems="center"
      justifyContent="center"
    >
      {!isEmailSent && (
        <Box textAlign={"center"}>
          <Text fontSize={"xl"} fontWeight={"bold"} mb="2">
            Log in to Subshare
          </Text>
          <Image
            src={loginImageURL}
            alt="Login Image"
            boxSize="300px"
            mb={2}
            borderRadius={"md"}
          />
        </Box>
      )}
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
        <form onSubmit={handleSubmit} style={{ width: "300px" }}>
          <Input
            placeholder="Email"
            onChange={handleEmailChange}
            value={email}
            w="100%"
            mb={4}
          />
          <Button
            type="submit"
            colorScheme="blue"
            w="100%"
            isLoading={isLoggingIn}
          >
            Login
          </Button>
        </form>
      )}

      <Box width="300px">
        {isEmailSent && (
          <Button colorScheme="blue" onClick={handleGoBack} w="100%">
            Go Back
          </Button>
        )}
      </Box>
    </Box>
  );
}
