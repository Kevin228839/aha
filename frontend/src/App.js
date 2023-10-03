import {Routes, Route, useNavigate} from 'react-router-dom';
import {useEffect, useReducer, useState} from 'react';
import {USER_INITIAL_STATE, UserReducer} from './userReducer';
import {UserContext} from './userContext';
import api from './api';
import Header from './Header';
import Landing from './Landing';
import SignUp from './SignUp';
import SignIn from './SignIn';
import ErrorPath from './ErrorPath';
import DashBoard from './Dashboard';
import Profile from './Profile';
import {Center, Spinner} from '@chakra-ui/react';

const App = () => {
  const [state, dispatch] = useReducer(UserReducer, USER_INITIAL_STATE);
  const [check, setCheck] = useState(false);
  const navigate = useNavigate();
  useEffect(()=> {
    const checkAutoAuth = async () => {
      let data = await api.checkAutoAuthentication();
      const status = data.status;
      data = await data.json();
      if (status === 200) {
        dispatch({type: 'UPDATE_AUTOLOGIN', payload: true});
        dispatch({type: 'UPDATE_USERINFO', payload: data.data});
        navigate('/dashboard');
      }
      setCheck(true);
    };
    checkAutoAuth();
  }, []);
  if (check === false) {
    return (
      <Center mt='100px'>
        <Spinner />
      </Center>
    );
  }
  return (
    <UserContext.Provider value={{userState: state, userDispatch: dispatch}}>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<ErrorPath />} />
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
