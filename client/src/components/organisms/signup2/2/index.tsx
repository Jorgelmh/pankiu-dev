import { Button } from "@progress/kendo-react-buttons"
import Text from "components/atoms/text"

const Botsignup: React.FC = () => {
  return (
    <div>
  <div style={{display:'flex', justifyContent:'center', margin:'1rem auto'}}>
<Text>Or Signup with</Text>
</div>
<div style={{margin:'2rem 1rem 0px 1rem',display:'flex', justifyContent:'center'}}>
<Button icon='facebook-box social' style={{marginRight:'1rem'}}/>
<Button icon='google-box social'/>
</div>
<div>
<a style={{display:'flex', justifyContent:'center',margin:'2rem auto'}} href="#">Forgot your password?</a>
</div>
</div>
  )}
  export default Botsignup
