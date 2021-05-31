import Notification from "components/organisms/notification"
import { Redirect } from "react-router-dom"
 
const App: React.FC = () => {

  /*
  if(!localStorage.getItem('token'))
    return <Redirect to='/login' />
    */
  return <>
  <Notification/>

  </>;
};

export default App;
