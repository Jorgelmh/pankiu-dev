import { Link } from 'react-router-dom'
import AnchorProps from './types'

const Anchor: React.FC<AnchorProps> = (props) => {
  return (
    <>
      <Link to={props.to}>{props.children}</Link>
    </>
  );
};

export default Anchor
