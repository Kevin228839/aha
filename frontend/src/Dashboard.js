import {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {UserContext} from './userContext';
import {Center, Spinner, SimpleGrid} from '@chakra-ui/react';
import api from './api';

const DashBoard = () => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const [userList, setUserList] = useState(null);
  const [userStatistics, setUserStatistics] = useState(null);
  useEffect(()=>{
    if (userContext.userState.autoLogin === false) {
      navigate('/');
    }
    const fetchData = async () => {
      let data1 = await api.getDashboardUserList();
      data1 = await data1.json();
      let data2 = await api.getDashboardUserStatistics();
      data2 = await data2.json();
      setUserList(data1.message);
      setUserStatistics(data2.message);
    };
    fetchData();
  }, []);

  if (userList === null || userStatistics === null) {
    return (
      <Center mt='100px'>
        <Spinner />
      </Center>
    );
  }
  return (
    <Center display='flex' flexDirection='column' mt='80px'>
      <SimpleGrid m='20px' columns='3' spacing='10'>
        <Center bg='blue.200' h='50px' w='300px'>
          Total number of users who have signed up.
        </Center>
        <Center bg='blue.200' h='50px' w='300px'>
          Total number of users with active sessions today.
        </Center>
        <Center bg='blue.200' h='50px' w='300px'>
          Average number of active session users in the last 7 days rolling.
        </Center>
        <Center bg='blue.200' h='50px' w='300px'>
          {userStatistics.total_sign_up_user}
        </Center>
        <Center bg='blue.200' h='50px' w='300px'>
          {userStatistics.today_active_user}
        </Center>
        <Center bg='blue.200' h='50px' w='300px'>
          {userStatistics.average_active_user}
        </Center>
      </SimpleGrid>
      <SimpleGrid m='20px' columns='5' spacing='10'>
        <Center bg='gray.100' h='50px' w='250px'>
          email
        </Center>
        <Center bg='gray.100' h='50px' w='250px'>
          Account type
        </Center>
        <Center bg='gray.100' h='50px' w='250px'>
          TS of user sign up
        </Center>
        <Center bg='gray.100' h='50px' w='250px'>
          Number of times logged in
        </Center>
        <Center bg='gray.100' h='50px' w='250px'>
          TS of the last user session
        </Center>
      </SimpleGrid>
      {
        userList.map((user, index) => {
          return (
            <SimpleGrid m='20px' key={index} columns='5' spacing='10'>
              <Center bg='gray.100' h='50px' w='250px'>
                {user.email}
              </Center>
              <Center bg='gray.100' h='50px' w='250px'>
                {user.type}
              </Center>
              <Center bg='gray.100' h='50px' w='250px'>
                {user.signup_ts}
              </Center>
              <Center bg='gray.100' h='50px' w='250px'>
                {user.login_times}
              </Center>
              <Center bg='gray.100' h='50px' w='250px'>
                {user.lastsession_ts}
              </Center>
            </SimpleGrid>
          );
        })
      }
    </Center>
  );
};

export default DashBoard;
