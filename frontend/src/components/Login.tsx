import { Button, Container, Input, Image, Box } from "@chakra-ui/react";
import loginImageURL from "../images/SubscriptionAppLogo.png";

export default function Login() {
  function loginWithOTP() {
    // TODO: Implement OTP functionality
  }

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

      <Input placeholder="Email" w="300px" mb={4} />
      <Box width="300px">
        <Button colorScheme="blue" onClick={loginWithOTP} w="100%">
          Login
        </Button>
      </Box>
    </Box>
  );
}
