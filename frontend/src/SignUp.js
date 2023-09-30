import {Center, Input, Button, Spinner, useToast} from '@chakra-ui/react';
import {useRef, useState} from 'react';
import api from './api';


const SignUp = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordCheckRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState(null);
  const toast = useToast();
  if (verificationEmail === null) {
    return (
      <Center display='flex' flexDirection='column' ml='100px'
        mr='100px' mt='100px'>
        <Input ref={emailRef} mb='20px' placeholder='email'/>
        <Input ref={passwordRef} mb='20px' placeholder='password' />
        <Input ref={passwordCheckRef} mb='20px' placeholder='check password' />
        {loading === false ?
      <Button onClick={async () => {
        setLoading(true);
        let data = await api.emailSignUP(
            emailRef.current.value,
            passwordRef.current.value,
            passwordCheckRef.current.value,
        );
        const status = data.status;
        data = await data.json();
        if (status === 200) {
          toast({
            title: 'Account created.',
            description: data.message,
            status: 'success',
            duration: 10000,
            isClosable: true,
          });
          setVerificationEmail(emailRef.current.value);
        } else {
          toast({
            title: 'Failed to create account. Try again.',
            description: data.message,
            status: 'error',
            duration: 10000,
            isClosable: true,
          });
        }
        setLoading(false);
      }}>Sign Up</Button>:
      <Spinner />}
      </Center>
    );
  } else {
    return (
      <Center display='flex' flexDirection='column' ml='100px'
        mr='100px' mt='100px'>
        <Button onClick={async ()=>{
          let data = await api.emailVerificationResend(verificationEmail);
          const status = data.status;
          data = await data.json();
          if (status === 200) {
            toast({
              title: 'Email resent.',
              description: data.message,
              status: 'success',
              duration: 10000,
              isClosable: true,
            });
          }
        }}>Resend Email</Button>
      </Center>
    );
  }
};

export default SignUp;
