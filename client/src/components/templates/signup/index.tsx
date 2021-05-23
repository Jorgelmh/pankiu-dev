import SignUpForm from "components/organisms/signupform";
import TopBarSignup from "components/organisms/signup2"
import Text from "components/atoms/text";
import { Button } from "@progress/kendo-react-buttons";
import Botsignup from "components/organisms/signup2/2";
import SignupText from "components/organisms/signup2/3";

const App: React.FC = () => {
  return (
    <>
    <TopBarSignup/>
    <SignupText/>
    <div style={{display:'flex', justifyContent:'center', height:'360px'}}>
      <SignUpForm/>
      </div>
      <Botsignup/>
    </>

  );
};

export default App;
