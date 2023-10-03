import {Button, Center, Flex, useToast} from '@chakra-ui/react';
import {BiHomeAlt2} from 'react-icons/bi';
import {useNavigate} from 'react-router-dom';
import {useContext} from 'react';
import {UserContext} from './userContext';
import api from './api';

const Header = () => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const toast = useToast();
  if (userContext.userState.autoLogin === false) {
    return (
      <Flex bg='gray.300'>
        <Center mt='20px' mb='20px' ml='40px'>
          <BiHomeAlt2 cursor='pointer' size='2em' onClick={() => {
            navigate('/');
          }}/>
        </Center>
      </Flex>
    );
  }
  return (
    <Flex justifyContent='space-between' bg='gray.300'>
      <Center mt='20px' mb='20px' ml='40px'>
        <BiHomeAlt2 cursor='pointer' size='2em' onClick={() => {
          navigate('/');
        }}/>
      </Center>
      <Center mt='20px' mb='20px' mr='40px'>
        <Button mr='10px' onClick={() => {
          navigate('/profile');
        }}>Profile</Button>
        <Button onClick={async () => {
          let data = await api.userSignOut();
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
              payload: false,
            });
            navigate('/');
          } else {
            toast({
              title: 'Fail',
              description: data.message,
              status: 'error',
              duration: 10000,
              isClosable: true,
            });
          }
        }}>Logout</Button>
      </Center>
    </Flex>
  );
};

export default Header;
