import { Button, Container, Input, Image } from "@chakra-ui/react";
import loginImageURL from "../images/SubscriptionAppLogo.png";
// Your image URL

export default function Login() {
  function loginWithOTP() {
    // TODO: Implement OTP functionality
  }

  return (
    <Container maxW="3xl" centerContent>
      {/* Add your image using the Image component */}
      <Image src={loginImageURL} alt="Login Image" boxSize="300px" mb={4} />

      <Input placeholder="Email" w="300px" mb={4} />

      <Button colorScheme="blue" onClick={loginWithOTP}>
        Login
      </Button>
    </Container>
  );
}
