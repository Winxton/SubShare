import { Button, Container, Input, Image } from "@chakra-ui/react";

// Your image URL
const loginImageURL =
  "https://media.discordapp.net/attachments/1163688273521152062/1173708850256433152/DALLE_Cartoon_Subscription.png?ex=6564f08c&is=65527b8c&hm=7c2c67d1e7c888feb1d09c6d384629d55f0d98d27a111854043fba698ea23827&=&width=627&height=627";

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
