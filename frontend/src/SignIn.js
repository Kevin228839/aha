import {
  Center, Input, Button,
  Spinner, useToast, Divider,
} from '@chakra-ui/react';
import {FcGoogle} from 'react-icons/fc';
import {useRef, useState, useContext} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {UserContext} from './userContext';
import {getGoogleOAuthURL} from './utils';
import api from './api';

const SignIn = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const toast = useToast();
  return (
    <Center display='flex' flexDirection='column' ml='100px'
      mr='100px' mt='100px'>
      <Input ref={emailRef} mb='20px' placeholder='email'/>
      <Input ref={passwordRef} mb='20px' placeholder='password' />
      {loading === false ?
      <Button onClick={async () => {
        setLoading(true);
        let data = await api.emailSignIn(
            emailRef.current.value,
            passwordRef.current.value,
        );
        const status = data.status;
        data = await data.json();
        if (status === 200) {
          toast({
            title: 'Success',
            description: data.message,
            status: 'success',
            duration: 10000,
            isClosable: true,
          });
          userContext.userDispatch({
            type: 'UPDATE_AUTOLOGIN',
            payload: true,
          });
          userContext.userDispatch({
            type: 'UPDATE_USERINFO',
            payload: data.data},
          );
          navigate('/dashboard');
        } else {
          toast({
            title: 'Fail',
            description: data.message,
            status: 'error',
            duration: 10000,
            isClosable: true,
          });
        }
        setLoading(false);
      }}>Sign In</Button>:
      <Spinner />}
      <Divider m='20px'/>
      <Link to={getGoogleOAuthURL()}>
        <Button color='BlackAlpha 100' leftIcon={<FcGoogle />}>
            Continue with Google
        </Button>
      </Link>
    </Center>
  );
};

export default SignIn;
