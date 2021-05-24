import SignUpForm from "components/organisms/signupform";
import { Redirect } from "react-router-dom";
import TopBarSignup from "components/organisms/signup2"
import Text from "components/atoms/text";
import { Button } from "@progress/kendo-react-buttons";

const App: React.FC = () => {
  if (localStorage.getItem('token')){
    return <Redirect to='/profile' />
  }

  return (
    <>

      <div style={{display:'flex', justifyContent:'center', height:'34.25rem'}}>
        <SignUpForm/>
      </div>


    </>

  );
};

export default App;
