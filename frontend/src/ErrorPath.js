import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const ErrorPath = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/');
  });
};

export default ErrorPath;
