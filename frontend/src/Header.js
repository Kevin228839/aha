import {Center, Flex} from '@chakra-ui/react';
import {BiHomeAlt2} from 'react-icons/bi';
import {useNavigate} from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  return (
    <Flex bg='gray.300'>
      <Center mt='20px' mb='20px' ml='40px'>
        <BiHomeAlt2 cursor='pointer' size='2em' onClick={() => {
          navigate('/');
        }}/>
      </Center>
    </Flex>
  );
};

export default Header;
