import LoginForm from 'components/organisms/loginform'
import { Redirect } from "react-router-dom";


const App: React.FC = () => {
  if (localStorage.getItem('token')){
    return <Redirect to='/profile' />
  }
  return (
    <>
      <LoginForm/>
    </>

  );
};

export default App;
