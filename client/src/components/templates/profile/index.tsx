import Header from "components/atoms/header";
import Profile from "components/organisms/profile";
import { Button } from "@progress/kendo-react-buttons";
import { Redirect } from "react-router-dom";


const App: React.FC = () => {
  if(!localStorage.getItem('token')){
    return <Redirect to='login'/>
  }

  return (
    <>
      <Profile />
    </>
  );
};

export default App;
