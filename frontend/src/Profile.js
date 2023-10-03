import {UserContext} from './userContext';
import {useContext, useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Center, Input,
  SimpleGrid, useToast, Spinner} from '@chakra-ui/react';
import api from './api';

const Profile = () => {
  const userContext = useContext(UserContext);
  const newName = useRef(null);
  const password = useRef(null);
  const newPassword = useRef(null);
  const newPasswordCheck = useRef(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  useEffect(() => {
    if (userContext.userState.autoLogin === false) {
      navigate('/');
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
    <Center flexDirection='column' mt='50px'>
      <SimpleGrid m='20px' rows='2' spacing='10'>
        <Center bg='blue.100' h='50px' w='400px'>
          Email: {userContext.userState.userInfo.email}
        </Center>
        <Center bg='blue.100' h='50px' w='400px'>
          Name: {userContext.userState.userInfo.name}
        </Center>
      </SimpleGrid>
      <Center>
        <Input ref={newName} mr='10px' placeholder='set new name'/>
        <Button w='150px' onClick={async () => {
          let data = await api.setNewName(newName.current.value);
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
              type: 'UPDATE_USERINFO',
              payload: data.data},
            );
          } else {
            if (data.message === 'The authentication token is invalid.') {
              window.location.reload();
              return;
            }
            toast({
              title: 'Fail',
              description: data.message,
              status: 'error',
              duration: 10000,
              isClosable: true,
            });
          }
        }}>Change Name</Button>
      </Center>
      <Center flexDirection='column' mt='100px'>
        <Input ref={password} mb='20px' placeholder='current password'/>
        <Input ref={newPassword} mb='20px' placeholder='new password'/>
        <Input
          ref={newPasswordCheck}
          mb='20px'
          placeholder='Re-enter new password'
        />
        <Button onClick={async () => {
          let data = await api.setNewPassword(
              password.current.value,
              newPassword.current.value,
              newPasswordCheck.current.value,
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
          } else {
            if (data.message === 'The authentication token is invalid.') {
              window.location.reload();
              return;
            }
            toast({
              title: 'Fail',
              description: data.message,
              status: 'error',
              duration: 10000,
              isClosable: true,
            });
          }
        }}>Change Password</Button>
      </Center>
    </Center>
  );
};

export default Profile;
