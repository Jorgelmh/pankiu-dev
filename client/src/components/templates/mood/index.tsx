import MoodLayout from "components/organisms/mood";
import { Redirect } from "react-router-dom"

const App: React.FC = () => {

  /* Fetch token */
  const token = localStorage.getItem('token')

  /* Check whether there's a session token */
  if(!token)
    return <Redirect to='/login' />
  
  if('rate' in JSON.parse(atob(token.split('.')[1])))
    return <Redirect to='/profile' />
    
  return (
    <>
      <MoodLayout />
    </>
  );
};

export default App;
