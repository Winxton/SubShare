
import { Button, Container, Input } from '@chakra-ui/react'


export default function Login() {

    function loginWithOTP() {
        // TODO(tommy): This should send an OTP to the user's email, and then redirect to the main page.
    }    

    // TODO:(nina) Add the logo here
    return (
        <Container maxW="3xl">
            <Input placeholder="Email" />
            <Button colorScheme="blue">Login</Button>
        </Container>
    )
}