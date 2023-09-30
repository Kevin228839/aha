import {Routes, Route} from 'react-router-dom';
import Header from './Header';
import Landing from './Landing';
import SignUp from './SignUp';
import ErrorPath from './ErrorPath';

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<ErrorPath />} />
      </Routes>
    </>
  );
};

export default App;
