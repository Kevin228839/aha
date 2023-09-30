import {Center, Button} from '@chakra-ui/react';
import {useNavigate} from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  return (
    <Center mt='100px'>
      <Button onClick={() => {
        navigate('/signup');
      }}>Sign UP</Button>
    </Center>
  );
};

export default Landing;
