import {Center, Button, Spinner} from '@chakra-ui/react';
import {useNavigate} from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import {UserContext} from './userContext';

const Landing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const userContext = useContext(UserContext);
  useEffect(()=>{
    if (userContext.userState.autoLogin === true) {
      navigate('/dashboard');
    }
    setLoading(false);
  }, []);
  if (loading === true) {
    return (
      <Center mt='100px'>
        <Spinner />
      </Center>
    );
  }
  return (
    <Center mt='100px'>
      <Button mr='10px' onClick={() => {
        navigate('/signin');
      }}>Sign In</Button>
      <Button ml='10px' onClick={() => {
        navigate('/signup');
      }}>Sign Up</Button>
    </Center>
  );
};

export default Landing;
