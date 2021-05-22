import SignUpForm from "components/organisms/signupform";
import TopBarSignup from "components/organisms/signup2"
import Text from "components/atoms/text";
import { Button } from "@progress/kendo-react-buttons";

const App: React.FC = () => {
  return (
    <>
    <TopBarSignup/>
    <div style={{display:'flex', justifyContent:'center', height:'360px'}}>
      <SignUpForm/>
      </div>
      <div style={{display:'flex', justifyContent:'center', margin:'1rem auto'}}>
      <Text>Or</Text>
      </div>
      <div style={{margin:'2rem auto',display:'flex', justifyContent:'center'}}>
      <Button>Login</Button>
      </div>
      <div>
      <a style={{display:'flex', justifyContent:'center',margin:'2rem auto'}} href="#">Forgot your password?</a>
      </div>
    </>

  );
};

export default App;
